// fileIO.js
// Centralizes all file and directory operations (read, write, exists, ensureDir, etc).
// No config, path, or domain logic here—only generic file I/O.
// No deviations from pure utility structure.

// scripts/lib/fileIO.js
import fs from 'fs';
import path from 'path';

/**
 * Ensure a directory exists, creating it recursively if needed.
 * @param {string} dirPath
 */
export function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Check if a file exists.
 * @param {string} filePath
 * @returns {boolean}
 */
export function fileExists(filePath) {
  return fs.existsSync(filePath);
}

/**
 * Check if a path is a directory.
 * @param {string} filePath
 * @returns {boolean}
 */
export function isDirectory(filePath) {
  try {
    return fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory();
  } catch {
    return false;
  }
}

/**
 * Write file content, ensuring parent directory exists.
 * @param {string} filePath
 * @param {string} content
 */
export function writeFileSafe(filePath, content) {
  if (isDirectory(filePath)) {
    throw new Error(`Cannot write file: ${filePath} is a directory`);
  }
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
}

/**
 * Read file content if file exists, else return empty string.
 * @param {string} filePath
 * @returns {string}
 */
export function readFileSafe(filePath) {
  if (isDirectory(filePath)) {
    throw new Error(`Cannot read file: ${filePath} is a directory`);
  }
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
}
