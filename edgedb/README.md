# edgedb

## Installation

1. Install dependencies `yarn install`
2. Initialize project `edgedb init`
3. Copy `.env.example` as `.env` and set the `EDGEDB_DSN`
4. Build the builder `yarn edgedb:gen`
5. Build the interfaces `yarn edgedb:gen:interfaces`
6. Create users `yarn edgedb:seed`

## Run jest tests

`yarn test`

## Run edgedb tests

In the [queries/test](./src/queries/test/) directory we have EdgeQL scripts with assertions acting like tests.

You can run those by calling `edgedb query --file $path` from the workspace root folder.

Example:

`edgedb query --file ./src/queries/test/taskStatus.edgeql`

When there is no error, the test passed. Don't expect any 'passed' message in a green color.
