# Murals

Mural exploration web app.

Note that a URI environment variable will need to be provided in order to access the database.

## Install & Run

From the root directory.

* Install: `yarn install`

### Development

* Run development server: `yarn run start`

* All updates to client/* will compile automatically while running the server

### Production

* Build static files: `cd client && yarn run build`

* Push to master branch, Heroku will deploy automatically

If for any reason you'd need to run a production server locally:

* Build static files, then return to root directory

* `yarn run server`
