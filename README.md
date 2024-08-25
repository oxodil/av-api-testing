# Alpha Vantage API Testing

This project is designed to run API tests for the [Alpha Vantage API](https://www.alphavantage.co/documentation/#) using Mocha and generate test reports with Mochawesome. It includes a GitHub Actions workflow to automate testing in a production environment.

## GitHub Actions Workflow

The workflow (`.github/workflows/github-run-api-mochawesome.yml`) triggers tests, verifies if the report is created, and uploads the results as an artifact.

### Triggering the Workflow

1. Go to the Actions tab in GitHub.
2. Select "Run tests prod mochawesome".
3. Provide the `ALPHA_VANTAGE_API_KEY` when prompted.

## Project Setup

### Dependencies

- **`@types/chai`**: Type definitions for Chai
- **`@types/mocha`**: Type definitions for Mocha
- **`@types/supertest`**: Type definitions for Supertest
- **`chai`**: Assertion library
- **`mocha`**: Test framework
- **`env-cmd`**: Environment variable management
- **`mochawesome`**: Test reporter
- **`supertest`**: HTTP assertions
- **`ts-node`**: TypeScript execution

### Scripts

- **`test:env-prod`**: Runs tests in the production environment with Mocha.
- **`test:prod-store-logs`**: Runs tests in production and stores logs to `prod-report.log`.

### Environment Configuration

The project is configured to support multiple environments as defined in the `.env-cmdrc` file. Currently, only the production environment is valid.

## Example: Local Run

To run the tests locally with environment variables:

```bash
ALPHA_VANTAGE_API_KEY="YOUR_ALPHA_VANTAGE_KEY" FRED_API_KEY="YOUR_FRED_KEY" npm run test:env-prod
```

To run selected tests execute:

```bash
ALPHA_VANTAGE_API_KEY="YOUR_ALPHA_VANTAGE_KEY" FRED_API_KEY="YOUR_FRED_KEY" npm run test:env-prod:selected "AV-TC-002"
```

## API Key Sources

- **Alpha Vantage API Key**: Obtain your API key from [Alpha Vantage](https://www.alphavantage.co/support/#api-key).
- **FRED API Key**: Obtain your API key from [FRED](https://fred.stlouisfed.org/docs/api/api_key.html). Note that this key is stored as a GitHub secret and is not needed for local runs.
