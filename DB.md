# Database Documentation

## Active Mural

An 'Active Mural' is a mural that is shown to the client on the map.  These are in the `murals` collection.

Each Mural object follows the ![GeoJSON format](https://geojson.org/) with a few required fields in `properties`.

```json
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [73.6, 48.2]
  },
  "properties": {
    "title": "My Mural",
    "desc": "My description",
    "artist": "My name, maybe contact info",
    "email": "Submitter@email.net",
    "images": ["https://image.com/myImage"],
    "id": "............."
  }
}
```

* `properties`: (Object):
  * `title`: (String) Title of mural.
  * `desc`: (String) Description of mural.
  * `artist`: (String) Name of artist & contact info.
  * `email`: (String) Email of submitter.
  * `images`: (Array) String(s) of image URLs to display when viewing a mural on the client side.4028347-2834729-2384
  * `id`: (String) Mural ID.

## Pending Mural

Pending murals are submitted through the client site. These are found in the `pending` collection.

Each Pending Mural object follows the ![GeoJSON format](https://geojson.org/) with a few required fields in `properties`.

```json
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [73.6, 48.2]
  },
  "properties": {
    "title": "My Mural",
    "desc": "My description",
    "artist": "My name, maybe contact info",
    "email": "Submitter@email.net",
    "images": ["https://image.com/myImage"],
    "id": ".............",
    "uploader": "........",
    "reject": false,
    "notes": "yadda yadda yadda"
  }
}
```

* `properties`: (Object):
  * `title`: (String) Title of mural.
  * `desc`: (String) Description of mural.
  * `artist`: (String) Name of artist & contact info.
  * `email`: (String) Email of submitter.
  * `images`: (Array) String(s) of image URLs to display when viewing a mural on the client side.
  * `id`: (String) Pending Mural ID.
  * `uploader`: (String) Uploader username.
  * `reject`: (Boolean) Rejected status. (Pending Mural)
  * `notes`: (String) Administrator notes. (Pending Mural)

## User

Registered user JSON:

```json
{
  "username": "joe",
  "salt": "c9974d1eef5c9623cd10807f79c23eec5915ec",
  "hash": "$2b$09$Yv9xAOABY5gSGg/f.bj2M.7BE.CiVcC6KeA7FT9exFJa0d12eh03S",
  "perm": "user",
  "name": "Joe Joe"
}
```

* `username`: (String) Username.
* `password`: (String) Hashed password.
* `perm`: (String) Permision, either `"user"`, `"admin"`. Defaults to `"user"`.
* `name`: (String) User's name.
