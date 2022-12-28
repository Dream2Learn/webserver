# Dream2Learn website backend

Root directory is the backend project. Preprocessed frontend components can be found in `./pages`.

## Setup

A `.env` file must be created in the root directory of this repository with the following parameters:
```
JWT_SECRET=

MONGO_URL=
FROM_EMAIL=
SENDGRID_API_KEY=
SESSION_SECRET=

run-init=true
run-script=true
```

## NPM scripts

A `:dev` suffix indicates a script for development, and `:public` for production. By default, the server will be hosted on port 3000, which can be specified via the `PORT` environment variable.

Script | Description
-|-
`build-frontend-hot:dev` | Builds the frontend apps in `./pages/` and rebuilds them when their source code changes.
`build-frontend:dev`<br />`build-frontend:public` | Builds the frontend apps in `./pages/` once.
`server:dev`<br />`server:public` | Starts the backend server. If `:dev`, the server will restart when its source code changes.
`start:dev`<br />`start:public` | Builds the frontend apps in `./pages/` and then starts the server. If `:dev`, the frontend apps and the server will update when their respective source code changes.
`install-subdir-deps` | Installs the dependencies of the frontend apps in `./pages/`.
`babel` | Transpiles server code using Babel to be compatible with older NodeJS versions.
`heroku-postbuild` | Automatically called when deploying to Heroku. Runs `install-subdir-deps` and then `build-frontend:public`.

## Transpilation considerations

DreamHost's web hosting, which recommends to run NodeJS programs using [Passenger](https://help.dreamhost.com/hc/en-us/articles/216635318-Enabling-Passenger-for-Node-js), creates some limitations:
* The entrypoint file, which must be renamed to `app.js`, must not be an ES module
* “The version of Passenger running on DreamHost servers does not currently function with Node.js versions 14+”

Babel can transpile the server code to be compatible with NodeJS v13.14.0, which handles the two issues above, except
* Top-level `await` is not converted (wrap in an async function instead)
* [Synthetic default imports](https://www.typescriptlang.org/tsconfig#allowSyntheticDefaultImports) are not converted correctly
* EJS template files cannot be transpiled (avoid features above ES10/ES2019 in templates)