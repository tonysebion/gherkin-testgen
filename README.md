# Gherkin-TestGen

Generate Playwright tests and Cucumber step definitions from Gherkin feature files.

## Quick Start

```bash
# Generate tests from a feature file with a single command (no installation needed)
npx gherkin-testgen --file .\features\feedback\01-basic.feature --pw .\tests --sd .\step_definitions --app http://localhost:3001

# Watch for changes in your features directory
npx gherkin-testgen --watch --dir .\features --pw .\tests --sd .\step_definitions --app http://localhost:3001
```

## Features

- Automatically generate Playwright test files from Gherkin feature files
- Generate Cucumber step definitions with proper parameter handling
- Watch mode for real-time updates as you modify your feature files
- Preserves user-modified code blocks during regeneration
- Cross-platform path handling
- Smart parameter name detection
- Configurable output paths

## Usage

### Using npx (Recommended)

You can run gherkin-testgen directly with npx without installing it:

```bash
# Generate tests from a single feature file
npx gherkin-testgen --pw .\tests --sd .\step_definitions --app http://localhost:3001 --file .\features\feedback\01-basic.feature

# Generate tests for another feature file
npx gherkin-testgen --pw .\tests --sd .\step_definitions --app http://localhost:3001 --file .\features\feedback\02-low-rating.feature

# Watch a directory for changes
npx gherkin-testgen --watch --pw .\tests --sd .\step_definitions --app http://localhost:3001 --dir .\features
```

### Installation (Optional)

If you prefer, you can install the tool:

```bash
# Install globally
npm install -g gherkin-testgen

# Or as a dev dependency in your project
npm install --save-dev gherkin-testgen
```

Then use it directly:

```bash
gherkin-testgen --pw .\tests --sd .\step_definitions --app http://localhost:3001 --file .\features\feedback\01-basic.feature
```

### CLI Options

| Option | Description | Default |
|--------|-------------|---------|
| `--watch` | Watch for feature file changes | `false` |
| `--file` | Generate for a single feature file | - |
| `--dir` | Features directory to watch | `./features` |
| `--pw` | Output path for Playwright tests | `./tests` |
| `--sd` | Output path for step definitions | `./step_definitions` |
| `--app` | Base URL for the application | `http://localhost:3000` |

## Generated Files

### Playwright Tests

For each feature file, a corresponding Playwright test file is generated with:

- Test blocks for each scenario
- Page navigation to the specified base URL
- Placeholder code for interactions and assertions
- User-code blocks that are preserved during regeneration

### Step Definitions

For each feature file, a corresponding step definition file is generated with:

- Step implementations using Cucumber syntax
- Parameter extraction based on Gherkin expressions
- Smart parameter naming based on common patterns
- Placeholder implementation with 'pending' status

## User Code Blocks

The generated Playwright tests include special comment blocks:

```javascript
// USER-CODE-START:Scenario Name
// Your custom code here
// USER-CODE-END:Scenario Name
```

Any code inside these blocks will be preserved when the tests are regenerated, allowing you to add custom implementation while still being able to regenerate tests when your feature files change.

## Examples

See the [examples directory](./examples) for sample feature files and the resulting test files.

## License

MIT

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.
