# Contributing to Gherkin-TestGen

Thank you for considering contributing to Gherkin-TestGen! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to abide by a respectful and inclusive code of conduct. Please be considerate of other contributors and users.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue on GitHub with the following information:

- A clear, descriptive title
- Steps to reproduce the bug
- Expected behavior
- Actual behavior
- Any relevant logs or screenshots
- Your environment (OS, Node.js version, etc.)

### Suggesting Enhancements

For feature requests or enhancements:

- Use a clear, descriptive title
- Provide a detailed description of the suggested enhancement
- Explain why this enhancement would be useful
- Include any relevant examples or mockups

### Pull Requests

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Add or update tests as needed
5. Ensure all tests pass
6. Commit your changes with clear, descriptive commit messages
7. Push to your branch
8. Submit a pull request

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/gherkin-testgen.git
   cd gherkin-testgen
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run tests:
   ```bash
   npm test
   ```

## Project Structure

```
gherkin-testgen/
├── scripts/
│   ├── bin/                 # CLI entry point
│   └── lib/                 # Core functionality
├── examples/                # Example feature files and outputs
├── tests/                   # Test files
└── features/                # Feature files for testing
```

## Code Style

- Use ES modules (import/export)
- Follow consistent naming conventions
- Write clear comments and documentation
- Keep functions small and focused on a single responsibility

## Testing

- Add tests for new features or bug fixes
- Ensure all tests pass before submitting a pull request
- Both unit tests and integration tests are encouraged

## Documentation

- Update the README.md with any necessary changes
- Add or update JSDoc comments for functions and methods
- Document any new CLI options or configuration parameters

## License

By contributing to this project, you agree that your contributions will be licensed under the project's [MIT License](./LICENSE).
