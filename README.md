# Murals

Mural exploration web app.

Note that a URI environment variable will need to be provided in order to access the database.

## Install & Run

From the root directory.

* Install: `yarn install`

**Note:** Environment variable `URI` is necessary to connect to the database.

### Development

* Run development server: `yarn run start`

* All updates to frontend will compile automatically while running the server

### Production

* Push to master branch, Heroku will deploy automatically

If for any reason you'd need to run a production server locally:

* Build static files: `yarn build`

* `yarn run server`

### Testing

* `yarn test`

**Note:** Must connect to `testmondmurals` collection in the database, to prevent any accidental damage to the "production" collection. This is already enforced before any tests are executed.
