# NPX Usage Guide

This guide focuses on using gherkin-testgen directly with npx without installation.

## One-time Usage

For quick, one-off test generation:

```bash
npx gherkin-testgen --pw .\tests --sd .\step_definitions --app http://localhost:3001 --file .\features\feedback\01-basic.feature
```

This will:
1. Download and run gherkin-testgen without installing it
2. Generate Playwright tests and Cucumber step definitions
3. Place them in the specified output directories

## Using from GitHub

You can run the tool directly from GitHub, which gives you access to the latest code before it's published to npm:

```bash
# Use the latest version from the main branch
npx github:tonysebion/gherkin-testgen --pw .\tests --sd .\step_definitions --app http://localhost:3001 --file .\features\feedback\01-basic.feature
```

Benefits of using from GitHub:
- Always get the latest fixes and features
- Try out experimental branches
- Use versions that haven't been published to npm yet

## Common Use Cases

### Generate tests for a specific feature file

```bash
npx gherkin-testgen --pw .\tests --sd .\step_definitions --app http://localhost:3001 --file .\features\feedback\01-basic.feature
```

### Generate tests for another feature file

```bash
npx gherkin-testgen --pw .\tests --sd .\step_definitions --app http://localhost:3001 --file .\features\feedback\02-low-rating.feature
```

### Watch a directory for changes

```bash
npx gherkin-testgen --watch --pw .\tests --sd .\step_definitions --app http://localhost:3001 --dir .\features
```

### Customize output paths

```bash
npx gherkin-testgen --file ./features/login.feature --pw ./e2e-tests --sd ./cucumber-steps
```

### Set the base URL for your application

```bash
npx gherkin-testgen --file ./features/login.feature --app https://myapp.com
```

## Using in CI/CD Pipelines

gherkin-testgen works great in CI/CD pipelines:

```yaml
# GitHub Actions example
- name: Generate tests from features
  run: npx gherkin-testgen --dir ./features --pw ./tests --sd ./step-definitions
```

```bash
# GitLab CI example
generate_tests:
  script:
    - npx gherkin-testgen --dir ./features --pw ./tests --sd ./step-definitions
```

## Version Pinning

If you need a specific version:

```bash
# Pin to a specific npm version
npx gherkin-testgen@1.0.0 --file .\features\login.feature

# Pin to a specific GitHub branch, tag or commit
npx github:tonysebion/gherkin-testgen#main --file .\features\login.feature
npx github:tonysebion/gherkin-testgen#v1.0.0 --file .\features\login.feature
npx github:tonysebion/gherkin-testgen#a1b2c3d --file .\features\login.feature
```

## Troubleshooting

If you encounter any issues:

1. Try running with Node.js 14 or newer
2. Check your file paths and make sure they exist
3. For Windows users, ensure paths use proper slashes
4. When using GitHub version, make sure you have internet access

For more details, see the [main README](../README.md).
