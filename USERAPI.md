# User API

* Mountpoint: `/user/*`, `/login`

* Accepts: `application/json`

* Returns: `application/json`

---

## POST `/login`

Log in. **Note:** that this is not in the /user/ mountpoint.

### Request Body:

```json
{
	"username": "joe",
	"password": "123456"
}
```

* `username`: (String) Username.
* `password`: (String) Password.

### Responses:

**HTTP Status 200:**

User successfully logged in.

**HTTP Status 401:**

Failed to authenticate.

---

## POST `/user/register`

### Request Body:

```json
{
    "username": "joe",
    "password": "131131"
}
```

* `username`: (String) Username. Does not allow whitespace.
* `password`: (String) Password. Does not currently enforce any policies; recommended at least 10 characters in length.

Note: Users are given perm of `user` always on registration.

### Responses:

**HTTP Status 302:**

User registered. Redirects to /login.

**HTTP Status 500:**

Unable to register; user exists.

---

## GET `/user`

Get list of users

### Authentication:

Local. `admin` perm only.

### Response Body:

```json
{
    "users": [ ... ]
}
```

* `users`: (Array) List of (modified) User objects. 

### Responses:

**HTTP Status 200:**

Success.

**HTTP Status 500:**

Unable to retrieve user list.

**HTTP Status 403**

User requesting does not have `admin` perm.

---

## DELETE `/user/<username>`

### Authentication:

Local. `admin` perm; `user` perm requires that the user itself is making the request.

### Responses:

**HTTP Status 200:**

User deleted.

**HTTP Status 403:**

User is not owner of account or does not have `admin` perm.
