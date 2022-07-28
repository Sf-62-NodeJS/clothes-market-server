# clothes-market-server

clothes-market project server REST application

## Contents

- [Maintainers](#maintainers)
- [Usage](#usage)
- [Updating](#updating)
- [Development](#development)

## Maintainers

The **clothes-market-server** is maintained by:
+ team: Sf-62-NodeJS

## Development
**Before you begin make sure that you have installed next programs: NodeJS(v16.13.0), git, MongoDB**

1. To start developing locally, clone the project:
    ```bash
    git clone https://github.com/Sf-62-NodeJS/clothes-market-server.git
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Run the application
    ```bash
    npm run start:dev
    ```

3. Navigate to `localhost:5000`

### NPM scripts

Name              | Responsibility
----------------- | --------------------------------------------
`start`           | Used locally to run the application.
`start:dev`       | Used locally to run and develop the application. It runs the simple server locally.
`start:prod`      | Used to run the application in production mode
`test`            | Runs the full test suite: unit tests, coverage, eslint
`lint`            | Runs eslint on codebase.
`lint:fix`        | Runs eslint on codebase and fix errors.
`docker:compose`  | Builds docker image and runs container

To see a complete list of `npm` scripts, use:

```bash
npm run
```

To check which dependencies are outdated, run:

```bash
npm outdated
```