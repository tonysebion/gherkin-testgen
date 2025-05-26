// stepDefWriter.js
// Responsible for generating/updating step definition files for each feature.
// Receives output file paths from the generator; does not construct them itself.
// Uses helpers from fileIO.js and pathUtils.js.
// Deviation: Contains inline template strings for step definitions; consider moving to a template utility for easier editing.

import { ensureDir, writeFileSafe, readFileSafe, fileExists } from './fileIO.js';
import { getGeneratedFilePath } from './pathUtils.js';
import path from 'path';

function writeStepDefinitions(stepDefPath, steps, baseName, featureName, uniqueGiven, resolveStepKeyword) {
  try {
    ensureDir(path.dirname(stepDefPath));
    let content = `import { Given, When, Then } from '@cucumber/cucumber';\n\n`;
    content += `// Step definitions for ${featureName || baseName}\n`;
    content += `// Generated from feature file\n\n`;
    const processedSteps = new Set();
    steps.forEach((step, idx) => {
      const resolvedKeyword = resolveStepKeyword(steps, idx);
      let stepText = step.cucumberExpression;
      let params = step.params && step.params.length > 0 ? step.params.join(', ') : '';
      if (resolvedKeyword === 'Given' && uniqueGiven) {
        stepText = `I am on the page for ${baseName}`;
        params = '';
      }
      const stepKey = `${resolvedKeyword}:${stepText}`;
      if (processedSteps.has(stepKey)) return;
      processedSteps.add(stepKey);
      content += `${resolvedKeyword}('${stepText}', async function (${params}) {\n`;
      content += `  // TODO: Implement step - ${step.text}\n`;
      if (resolvedKeyword === 'Given' || resolvedKeyword === 'When') {
        content += `  // This step should set up state or perform an action\n`;
        content += `  return 'pending';\n`;
      } else {
        content += `  // This step should verify the expected outcome\n`;
        content += `  // Add assertions here\n`;
      }
      content += `});\n\n`;
    });
    writeFileSafe(stepDefPath, content);
    console.log(`✓ Created step definition: ${stepDefPath}`);
  } catch (error) {
    console.error(`✗ Error creating step definitions:`, error.message);
  }
}

function updateStepDefinitions(stepDefPath, steps, baseName, featureName, uniqueGiven, resolveStepKeyword) {
  try {
    ensureDir(path.dirname(stepDefPath));
    if (!fileExists(stepDefPath)) {
      let initialContent = `import { Given, When, Then } from '@cucumber/cucumber';\n\n`;
      initialContent += `// Step definitions for ${featureName || baseName}\n`;
      initialContent += `// Generated from feature file\n\n`;
      writeFileSafe(stepDefPath, initialContent);
    }
    let content = readFileSafe(stepDefPath);
    let updated = false;
    const processedSteps = new Set();
    steps.forEach((step, idx) => {
      const resolvedKeyword = resolveStepKeyword(steps, idx);
      let stepText = step.cucumberExpression;
      let params = step.params && step.params.length > 0 ? step.params.join(', ') : '';
      if (resolvedKeyword === 'Given' && uniqueGiven) {
        stepText = `I am on the page for ${baseName}`;
        params = '';
      }
      const stepKey = `${resolvedKeyword}:${stepText}`;
      if (processedSteps.has(stepKey)) return;
      processedSteps.add(stepKey);
      const stepPattern = `${resolvedKeyword}('${stepText}'`;
      if (!content.includes(stepPattern)) {
        content += `\n${resolvedKeyword}('${stepText}', async function (${params}) {\n`;
        content += `  // TODO: Implement step - ${step.text}\n`;
        if (resolvedKeyword === 'Given' || resolvedKeyword === 'When') {
          content += `  // This step should set up state or perform an action\n`;
          content += `  return 'pending';\n`;
        } else {
          content += `  // This step should verify the expected outcome\n`;
          content += `  // Add assertions here\n`;
        }
        content += `});\n`;
        updated = true;
      }
    });
    if (updated) {
      writeFileSafe(stepDefPath, content);
      console.log(`✓ Updated step definition: ${stepDefPath}`);
    } else {
      console.log(`✓ Step definition already up to date: ${stepDefPath}`);
    }
  } catch (error) {
    console.error(`✗ Error updating step definitions:`, error.message);
  }
}

export { writeStepDefinitions, updateStepDefinitions };