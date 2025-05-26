// testGenerator.js
// Main orchestrator: loads config, parses features, and calls test/step writers.
// All output file paths are generated using pathUtils.js.
// No file or path logic outside orchestration and parameter name generation.
// Deviation: Imports generateParameterNames from gherkinParser.js, which is a minor cross-domain dependency.

// scripts/lib/testGenerator.js
import { fileURLToPath } from 'url';
import path from 'path';
import { parameterPatterns, getFieldSelector } from './testGenConfig.js';
import { parseGherkin, resolveStepKeyword, generateParameterNames } from './gherkinParser.js';
import { writeStepDefinitions, updateStepDefinitions } from './stepDefWriter.js';
import { writePlaywrightTest, updatePlaywrightTest } from './playwrightTestWriter.js';
import { readFileSafe, fileExists } from './fileIO.js';
import { getGeneratedFilePath } from './pathUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateTests({
  featureFile,
  uniqueGiven,
  generatePlaywrightOnly,
  generateStepDefinitionOnly,
  generateBoth,
  debugMode,
  forceUpdate,
  config // Accept config object directly instead of configPath
}) {
  // Use provided config object
  const baseUrl = config.baseUrl;

  const { steps, scenarios, featureName } = parseGherkin(featureFile, parameterPatterns, generateParameterNames);
  const baseName = path.basename(featureFile, '.feature');
  const testPath = getGeneratedFilePath({ featureFile, type: 'test', config });
  const stepDefPath = getGeneratedFilePath({ featureFile, type: 'step', config });

  if (generateStepDefinitionOnly || generateBoth) {
    if (fileExists(stepDefPath)) {
      updateStepDefinitions(stepDefPath, steps, baseName, featureName, uniqueGiven, resolveStepKeyword);
    } else {
      writeStepDefinitions(stepDefPath, steps, baseName, featureName, uniqueGiven, resolveStepKeyword);
    }
  }

  if (generatePlaywrightOnly || generateBoth) {
    if (fileExists(testPath)) {
      updatePlaywrightTest({
        testPath,
        steps,
        scenarios,
        featureName,
        baseName,
        baseUrl
      });
    } else {
      writePlaywrightTest({
        testPath,
        steps,
        scenarios,
        featureName,
        baseName,
        baseUrl
      });
    }
  }
}
