# Database Documentation

## Active Mural

An 'Active Mural' is a mural that is shown to the client on the map.  These are in the `murals` collection.

Each Mural object follows the ![GeoJSON format](https://geojson.org/) with a few required `properties` (and optional ones).

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
    "images": ["https://image.com/myImage"]
  }
}
```

* `title`: (String) Title of mural. REQUIRED.
* `desc`: (String) Description of mural. REQUIRED.
* `artist`: (String) Name of artist & contact info.
* `email`: (String) Email of submitter. REQUIRED.
* `images`: (Array) String(s) of image URLs to display when viewing a mural on the client side.

## Pending Mural

Pending murals are submitted through the client site. These are found in the `pending` collection.

The following JSON format is used:

```json
{
	"title": "My Mural",
	"desc": "My description",
	"artist": "Artist name, contact info",
	"email": "Submitter@email.net",
	"images": ["https://image.com/myImage"],
	"reject": false,
	"notes": "admin notes"
}
```

* `title`: (String) Title of mural. REQUIRED.
* `desc`: (String) Description of mural. REQUIRED.
* `artist`: (String) Name of artist & contact info.
* `email`: (String) Email of submitter. REQUIRED.
* `images`: (Array) String(s) of image URLs to display when viewing a mural on the client side.
* `reject`: (Boolean) Rejected status.
* `notes`: (String) Administrator notes.

## Logs

A log entry follows a fairly simple JSON format:
```json
{
	"date": "YYYY-MM-DDTHH:mm:ss.sssZ",
	"msg": "admin approved mural 123456"
}
```

* `date`: (String) ISO 8601 time of log event.
* `msg`: (String) Log message.
