/**
 * Gherkin-TestGen - Generate Playwright tests and Cucumber step definitions from Gherkin feature files
 * 
 * This file is the main entry point for programmatic usage of gherkin-testgen.
 * For CLI usage, see scripts/bin/gherkin-testgen.js
 */

import { generateTests } from './scripts/lib/testGenerator.js';
import { parseGherkin } from './scripts/lib/gherkinParser.js';
import { getGeneratedFilePath } from './scripts/lib/pathUtils.js';

/**
 * Generate Playwright tests and Cucumber step definitions from a Gherkin feature file
 * @param {Object} options - Options for test generation
 * @param {string} options.featureFile - Path to the Gherkin feature file
 * @param {boolean} [options.generatePlaywrightOnly=false] - Generate only Playwright tests
 * @param {boolean} [options.generateStepDefinitionOnly=false] - Generate only step definitions
 * @param {boolean} [options.generateBoth=true] - Generate both Playwright tests and step definitions
 * @param {boolean} [options.uniqueGiven=false] - Use a unique "Given" step for each feature
 * @param {boolean} [options.debugMode=false] - Enable debug logging
 * @param {boolean} [options.forceUpdate=false] - Force update of existing files
 * @param {Object} options.config - Configuration object
 * @param {string} options.config.baseUrl - Base URL for the application
 * @param {string} options.config.featurePath - Path to the features directory
 * @param {string} options.config.testsPath - Path for generated Playwright tests
 * @param {string} options.config.step_definitionsPath - Path for generated step definitions
 * @returns {Promise<void>}
 */
export async function generateTestsFromFeatureFile(options) {
  return generateTests(options);
}

export {
  parseGherkin,
  getGeneratedFilePath
};

export default {
  generateTests: generateTestsFromFeatureFile,
  parseGherkin,
  getGeneratedFilePath
};
