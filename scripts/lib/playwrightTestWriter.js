// playwrightTestWriter.js
// Responsible for generating Playwright test files from parsed scenarios.
// Receives output file paths from the generator; does not construct them itself.
// Uses helpers from fileIO.js, testGenConfig.js, gherkinParser.js, and pathUtils.js.
// Deviation: Contains inline template strings for test files; consider moving to a template utility for easier editing.

import { ensureDir, writeFileSafe, readFileSafe, fileExists } from './fileIO.js';
import { getFieldSelector } from './testGenConfig.js';
import {
  getExistingScenarioNames,
  scenarioExists,
  extractUserCodeBlocks,
  escapeRegExp,
  resolveStepKeyword,
  extractStepValues
} from './gherkinParser.js';
import { getGeneratedFilePath } from './pathUtils.js';

// --- SCENARIO UTILITIES ---
// (all scenario utility function definitions removed; now imported from scenarioUtils.js)

// Internal: Generate Playwright test code for a single scenario, preserving user code if present
function generateScenarioTestCode(scenario, baseUrl, userCode) {
  let scenarioContent = `test('${scenario.name}', async ({ page }) => {\n`;
  scenarioContent += `  // AUTO-GENERATED: Update the path if needed\n`;
  scenarioContent += `  await page.goto('${baseUrl}');\n\n`;
  scenario.steps.forEach((step, idx) => {
    const resolvedKeyword = resolveStepKeyword(scenario.steps, idx);
    const paramValues = extractStepValues(step.text);
    if (resolvedKeyword === 'Given' || resolvedKeyword === 'When') {
      if (paramValues.length && step.params && step.params.length) {
        for (let i = 0; i < paramValues.length; i++) {
          const paramName = step.params[i] || `param${i + 1}`;
          const selector = getFieldSelector(paramName);
          if (selector.startsWith('select')) {
            scenarioContent += `  await page.selectOption('${selector}', '${paramValues[i]}');\n`;
          } else if (selector.startsWith('textarea')) {
            scenarioContent += `  await page.fill('${selector}', '${paramValues[i]}');\n`;
          } else if (selector.startsWith('input')) {
            scenarioContent += `  await page.fill('${selector}', '${paramValues[i]}');\n`;
          } else {
            scenarioContent += `  // TODO: Fill/select for ${paramName}\n`;
          }
        }
      } else if (/check the box/i.test(step.text)) {
        scenarioContent += `  // TODO: Check the appropriate box\n`;
      } else if (/click/i.test(step.text) || /submit/i.test(step.text)) {
        scenarioContent += `  await page.click('button[type=\"submit\"]');\n`;
      } else {
        scenarioContent += `  // TODO: Set up initial state or perform action\n`;
      }
    } else if (resolvedKeyword === 'Then') {
      scenarioContent += `  // TODO: Verify the expected outcome (add correct selector)\n`;
      scenarioContent += `  // Example: await expect(page.locator('YOUR_SELECTOR')).toBeVisible();\n`;
    }
    scenarioContent += `\n`;
  });
  // Insert user code block if present
  if (userCode) {
    scenarioContent += `  // USER-CODE-START:${scenario.name}\n`;
    scenarioContent += userCode.replace(/\n$/, '').split('\n').map(line => '  ' + line).join('\n') + '\n';
    scenarioContent += `  // USER-CODE-END:${scenario.name}\n`;
  } else {
    scenarioContent += `  // USER-CODE-START:${scenario.name}\n  // (your custom code here)\n  // USER-CODE-END:${scenario.name}\n`;
  }
  scenarioContent += `});\n\n`;
  return scenarioContent;
}

// Internal: Build the full Playwright test file content from all scenarios.
function buildPlaywrightTestFile(scenarios, baseUrl, featureName, baseName, userBlocks) {
  let content = `import { test, expect } from '@playwright/test';\n\n`;
  content += `// Playwright tests for ${featureName || baseName}\n`;
  content += `// Generated from feature file\n\n`;
  scenarios.forEach((scenario) => {
    const userCode = userBlocks ? userBlocks[scenario.name] : undefined;
    content += generateScenarioTestCode(scenario, baseUrl, userCode);
  });
  return content;
}

export function writePlaywrightTest({ testPath, steps, scenarios, featureName, baseName, baseUrl }) {
  try {
    const content = buildPlaywrightTestFile(scenarios, baseUrl, featureName, baseName, {});
    writeFileSafe(testPath, content);
    console.log(`✓ Generated Playwright test: ${testPath}`);
  } catch (error) {
    console.error(`✗ Error generating Playwright test:`, error.message);
  }
}

export function updatePlaywrightTest({ testPath, steps, scenarios, featureName, baseName, baseUrl }) {
  try {
    let content = '';
    let userBlocks = {};
    if (fileExists(testPath)) {
      content = readFileSafe(testPath);
      userBlocks = extractUserCodeBlocks(content);
    } else {
      // If file doesn't exist, just call writePlaywrightTest
      return writePlaywrightTest({ testPath, steps, scenarios, featureName, baseName, baseUrl });
    }
    let updated = false;
    const existingNames = getExistingScenarioNames(content);
    scenarios.forEach((scenario) => {
      if (!existingNames.includes(scenario.name)) {
        // Append new scenario, preserving user code for others
        content += `\n` + generateScenarioTestCode(scenario, baseUrl, undefined);
        updated = true;
      }
    });
    // If scenarios were removed from the feature, we do not delete them from the test file (non-destructive)
    if (updated) {
      writeFileSafe(testPath, content);
      console.log(`✓ Updated Playwright test: ${testPath}`);
    } else {
      console.log(`✓ Playwright test already up to date: ${testPath}`);
    }
  } catch (error) {
    console.error(`✗ Error updating Playwright test:`, error.message);
  }
}

// In your main usage, use getGeneratedFilePath({ featureFile, type: 'test', __dirname }) to get the test file path instead of duplicating path logic.