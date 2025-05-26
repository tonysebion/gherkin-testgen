// gherkinParser.js
// Responsible for parsing Gherkin feature files and extracting steps/scenarios.
// Only imports fileIO.js for file reading. No path or config logic here.
// If you need to map feature files to output files, use pathUtils.js in the caller.
// Also provides parameter name generation for step definitions.
// Deviation: Parameter name generation is here, but could be moved to a dedicated paramUtils.js if logic grows.

import { readFileSafe } from './fileIO.js';

// Gherkin step keyword resolution and value extraction utilities
export function resolveStepKeyword(steps, currentIndex) {
  const step = steps[currentIndex];
  if (["Given", "When", "Then"].includes(step.keyword)) {
    return step.keyword;
  }
  if (["And", "But"].includes(step.keyword)) {
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (["Given", "When", "Then"].includes(steps[i].keyword)) {
        return steps[i].keyword;
      }
    }
    return "Given";
  }
  return step.keyword;
}

export function extractStepValues(stepText) {
  const matches = stepText.match(/"([^"]*)"/g);
  return matches ? matches.map(s => s.slice(1, -1)) : [];
}

export function parseGherkin(featureFile, parameterPatterns, generateParameterNames) {
  try {
    const gherkin = readFileSafe(featureFile);
    const lines = gherkin.split('\n');
    const steps = [];
    const scenarios = [];
    let featureName = '';
    let currentScenario = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const featureMatch = line.match(/^Feature:\s*(.+)$/);
      if (featureMatch) {
        featureName = featureMatch[1].trim();
        continue;
      }
      const scenarioMatch = line.match(/^Scenario:\s*(.+)$/);
      if (scenarioMatch) {
        currentScenario = {
          name: scenarioMatch[1].trim(),
          steps: [],
          line: i
        };
        scenarios.push(currentScenario);
        continue;
      }
      const stepMatch = line.match(/^\s*(Given|When|Then|And|But)\s+(.+)$/);
      if (stepMatch && currentScenario) {
        const stepText = stepMatch[2].trim();
        let cucumberExpression = stepText.replace(/"[^"]*"/g, '{string}');
        const allParams = [...cucumberExpression.matchAll(/\{(string|int|float|word)\}/g)];
        const paramCount = allParams.length;
        const params = generateParameterNames(stepText, paramCount, parameterPatterns);
        const step = {
          keyword: stepMatch[1],
          text: stepText,
          cucumberExpression,
          params,
          paramCount,
          scenarioIndex: scenarios.length - 1,
          line: i
        };
        steps.push(step);
        currentScenario.steps.push(step);
      }
    }
    return { steps, scenarios, featureName };
  } catch (error) {
    console.error(`Error parsing Gherkin file ${featureFile}:`, error.message);
    process.exit(1);
  }
}

/**
 * Parse scenario names from existing Playwright test file content.
 * @param {string} content
 * @returns {string[]}
 */
export function getExistingScenarioNames(content) {
  const scenarioNames = [];
  const testBlockRegex = /test\(['"]([\s\S]*?)['"],/g;
  let match;
  while ((match = testBlockRegex.exec(content)) !== null) {
    scenarioNames.push(match[1]);
  }
  return scenarioNames;
}

/**
 * Check if a scenario already exists in the file by name (using parsed names, not regex).
 * @param {string} content
 * @param {string} scenarioName
 * @returns {boolean}
 */
export function scenarioExists(content, scenarioName) {
  const existingNames = getExistingScenarioNames(content);
  return existingNames.includes(scenarioName);
}

/**
 * Extract user code blocks for scenarios from file content.
 * @param {string} content
 * @returns {Object}
 */
export function extractUserCodeBlocks(content) {
  const userBlocks = {};
  const blockRegex = /\/\/ USER-CODE-START:(.+?)\n([\s\S]*?)\/\/ USER-CODE-END:\1/g;
  let match;
  while ((match = blockRegex.exec(content)) !== null) {
    userBlocks[match[1]] = match[2];
  }
  return userBlocks;
}

/**
 * Escape special characters for use in a regular expression.
 * @param {string} string - The string to escape.
 * @returns {string} The escaped string.
 */
export function escapeRegExp(string) {
  // Escape regex special characters and also single/double quotes for safe regex construction
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/['"]/g, '\\$&');
}

/**
 * Generate unique parameter names for step definitions based on patterns.
 * @param {string} stepText
 * @param {number} paramCount
 * @param {Array} parameterPatterns
 * @returns {string[]}
 */
export function generateParameterNames(stepText, paramCount, parameterPatterns) {
  const params = [];
  for (let i = 0; i < paramCount; i++) {
    let paramName = `param${i + 1}`;
    for (const pattern of parameterPatterns) {
      if (pattern.match.test(stepText) && !params.includes(pattern.name)) {
        paramName = pattern.name;
        break;
      }
    }
    // Ensure uniqueness
    let uniqueName = paramName;
    let counter = 1;
    while (params.includes(uniqueName)) {
      uniqueName = `${paramName}${counter}`;
      counter++;
    }
    params.push(uniqueName);
  }
  return params;
}