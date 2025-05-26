// pathUtils.js
// Centralizes all path calculations for generated files (test, step definition, etc).
// Handles cross-platform path resolution with config objects passed directly.

import path from 'path';

/**
 * Get the output path for a generated file (test or step definition) based on feature file.
 * @param {Object} opts
 * @param {string} opts.featureFile - Absolute path to the feature file
 * @param {string} opts.type - 'test' | 'step'
 * @param {Object} opts.config - Config object with paths
 * @returns {string} Output file path
 */
export function getGeneratedFilePath({ featureFile, type, config }) {
  const featurePath = config.featurePath;
  const testsPath = config.testsPath;
  const step_definitionsPath = config.step_definitionsPath;
  
  // Always resolve relative to the user's project root (process.cwd())
  const absFeatureFile = path.isAbsolute(featureFile) ? featureFile : path.resolve(process.cwd(), featureFile);
  
  // Config paths should always be treated as relative to project root, even if they start with '/'
  const normalizedFeaturePath = featurePath.startsWith('/') ? featurePath.slice(1) : featurePath;
  const absFeatureRoot = path.resolve(process.cwd(), normalizedFeaturePath);
  
  // Project root is the parent of the features directory
  const projectRoot = path.dirname(absFeatureRoot);
  
  // Get the relative path inside the features directory
  let relPath = path.relative(absFeatureRoot, absFeatureFile);
  
  // If relPath is empty, '.', or equals the basename, use just the basename
  if (relPath === '' || relPath === '.' || relPath === path.basename(absFeatureFile)) {
    relPath = path.basename(absFeatureFile);
  }
  
  // Extract subdirectory from relative path
  let subDir = relPath === path.basename(absFeatureFile) ? '' : path.dirname(relPath);
  
  let dir, base, ext;
  if (type === 'test') {
    // Normalize testsPath the same way we normalized featurePath
    const normalizedTestsPath = testsPath.startsWith('/') ? testsPath.slice(1) : testsPath;
    dir = path.join(projectRoot, normalizedTestsPath, subDir);
    base = path.basename(absFeatureFile, '.feature');
    ext = '.spec.ts';
  } else if (type === 'step') {
    // Normalize step_definitionsPath the same way we normalized featurePath
    const normalizedStepDefsPath = step_definitionsPath.startsWith('/') ? step_definitionsPath.slice(1) : step_definitionsPath;
    dir = path.join(projectRoot, normalizedStepDefsPath, subDir);
    base = path.basename(absFeatureFile, '.feature');
    ext = '.steps.ts';
  } else {
    throw new Error('Unknown type for getGeneratedFilePath');
  }
  
  const finalPath = path.normalize(path.join(dir, `${base}${ext}`));
  return finalPath;
}
