#!/usr/bin/env node
// gherkin-testgen main CLI entrypoint
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { generateTests } from '../lib/testGenerator.js';
import chokidar from 'chokidar';
import path from 'path';
import fs from 'fs';

const argv = yargs(hideBin(process.argv))
  .option('watch', { type: 'boolean', default: false, describe: 'Watch for .feature changes' })
  .option('file', { type: 'string', describe: 'Generate for a single .feature file' })
  .option('dir', { type: 'string', default: './features', describe: 'Features directory to watch' })
  .option('pw', { type: 'string', default: './tests', describe: 'Path for generated Playwright tests' })
  .option('sd', { type: 'string', default: './step_definitions', describe: 'Path for generated step definition files' })
  .option('app', { type: 'string', default: 'http://localhost:3000', describe: 'Base URL for the app' })
  .help()
  .argv;

// Create config object from CLI parameters
function createConfigFromCLI(argv) {
  return {
    baseUrl: argv.app,
    featurePath: argv.dir,
    step_definitionsPath: argv.sd,
    testsPath: argv.pw,
  };
}

function getFeaturesDir(cliDir) {
  // Always use the CLI --dir parameter, resolved from the current working directory
  const resolvedDir = path.isAbsolute(cliDir) ? cliDir : path.resolve(process.cwd(), cliDir);
  console.log(`Using CLI --dir: ${cliDir} -> ${resolvedDir}`);
  return resolvedDir;
}

// Create config object
const config = createConfigFromCLI(argv);

async function runGenerateTests(featureFile) {
  if (path.extname(featureFile) !== '.feature') return;
  console.log(`Detected change: ${featureFile}`);
  try {
    await generateTests({ featureFile, generateBoth: true, config });
  } catch (err) {
    console.error(`Error generating tests for ${featureFile}:`, err);
  }
}

if (argv.watch) {
  const featuresDir = getFeaturesDir(argv.dir);
  console.log('Watch mode enabled:');
  console.log('  Features directory:', featuresDir);
  console.log('  Directory exists:', fs.existsSync(featuresDir));
  console.log('  CLI arguments:', { dir: argv.dir, pw: argv.pw, sd: argv.sd, app: argv.app });
  console.log('  Config object:', config);
  
  // Watch both the directory and specific pattern
  const watchPaths = [
    featuresDir,
    path.join(featuresDir, '**/*.feature')
  ];
  
  console.log('  Watch paths:', watchPaths);
  
  const watcher = chokidar.watch(watchPaths, {
    persistent: true,
    ignoreInitial: false, // Process existing files on startup
    awaitWriteFinish: {
      stabilityThreshold: 100,
      pollInterval: 100
    },
    depth: undefined, // Watch all subdirectories, no limit
  });
  
  watcher.on('add', (filePath) => {
    console.log(`File added: ${filePath}`);
    runGenerateTests(filePath);
  });
  
  watcher.on('change', (filePath) => {
    console.log(`File changed: ${filePath}`);
    runGenerateTests(filePath);
  });
  
  watcher.on('error', (error) => {
    console.error('Watcher error:', error);
  });
  
  watcher.on('ready', () => {
    console.log('✓ File watcher is ready and monitoring for changes...');
  });
  
  console.log('Watching for .feature file changes in', featuresDir);
} else if (argv.file) {
  runGenerateTests(argv.file);
} else {
  yargs.showHelp();
}
