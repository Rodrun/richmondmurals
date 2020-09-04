# API Documentation

* Mountpoint: `/api/*`

* Accepts: `application/json`

* Returns: `application/json`

# Pending Murals List

## GET `/api/pending/<type>`

Get a list of pending murals.

### Authorization:

Local.

### Request Parameters:

**Path Parameters:**

* `type`: (String) Either `artist` or `viewer`.

### Responses:

**HTTP Status 200:**

Pending Murals list returned.

```json
{
	"length": 1,
	"list": [
		{
			"title": "My Mural",
			"desc": "My description",
			"artist": "Artist name, contact info",
			"email": "Submitter@email.net",
			"images": [{
				"id": "cloudinary_public_id",
				"url": "https://image.com/myImage"
			}],
			"reject": false,
			"notes": "admin notes"
		}
	]
}
```

* `length`: (Integer) Length of response list.
* `list`: (Array) List of ![Pending Mural objects.](https://github.com/Rodrun/richmondmurals/blob/master/DB.md#pending-mural)

**HTTP Status 400:**

Bad request.

**HTTP Status 500:**

```json
{
	"error": "..."
}
```

* `msg`: (String) Error message from database API.

---

## GET `/api/pending/<type>/<id>`

Get an individual pending mural.

### Authorization:

Local.

### Responses:

Pending Mural object is returned.

Refer to ![Pending Mural objects.](https://github.com/Rodrun/richmondmurals/blob/master/DB.md#pending-mural)

---

## POST `/api/pending/<type>/<id>`

Upload a pending mural to the list.

### Authorization:

Local.

### Request Parameters:

**Path Parameters:**

* `type`: (String) Either `artist` or `viewer`.
* `id`: (String) Pending Mural object ID.

### Request Body:

![Pending Mural object.](https://github.com/Rodrun/richmondmurals/blob/master/DB.md#pending-mural)

Note that `reject` and `notes` fields are not required, they will be added if they are missing. Fields that are not described in the Pending Mural schema will not be saved into the database.

### Responses:

**HTTP Status 201:**

Pending mural created.

**HTTP Status 400:**

Bad request; invalid Pending Mural object.

---

## PUT `/api/pending/<type>/<id>`

Update pending mural object.

### Authorization:

Local. Only the uploader or an admin.

### Request Parameters:

**Path Parameters:**

* `type`: (String) Either `artist` or `viewer`.
* `id`: (String) Pending Mural object ID.

### Responses:

**HTTP Status 200:**

Pending mural modified.

**HTTP Status 400:**

Bad request; invalid Pending Mural object.

**HTTP Status 403:**

User is not uploader or not an admin.

---

# Active Murals List

## GET `/api/list`

Get the list of active murals.

### Responses:

**HTTP Status 200:**

```json
{
	"murals": [ ... ]
}
```

* `murals`: (Array) List of ![Active Mural objects.](https://github.com/Rodrun/richmondmurals/blob/master/DB.md#active-mural)

---

## GET `/api/list/<id>`

Get an individual Active Mural.

### Responses:

**HTTP Status 200:**

Returns the requested Active Mural object.

Refer to ![Active Mural objects.](https://github.com/Rodrun/richmondmurals/blob/master/DB.md#active-mural)

**HTTP Status 400:**

Bad request.

**HTTP status 500:**

Database error.

---

## PUT `/api/list/<id>`

Update mural data.

### Path Parameters:

* `id`: (String) Active Mural object ID.

### Request Body:

![Active Mural object.](https://github.com/Rodrun/richmondmurals/blob/master/DB.md#active-mural)

## Responses:

**HTTP Status 200:**

Successfully updated. Returns newly updated Active Mural object.

**HTTP Status 400:**

Bad Request; Invalid Active Mural object.

**HTTP Status 404:**

Mural with `id` not found.

---
