# Cypress E2E scaffold

## Install (inside your Angular app folder)
npm i -D cypress @testing-library/cypress start-server-and-test

## Add scripts to package.json
{
  "scripts": {
    "e2e": "start-server-and-test start http://localhost:4200 \"cypress run --e2e\"",
    "e2e:open": "cypress open --e2e",
    "e2e:headed": "cypress run --e2e --browser chrome"
  }
}

## Run
npm run start     # terminal 1
npm run e2e:open  # terminal 2 (or: npm run e2e)
