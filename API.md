---
layout: default
---

# LangoBango: API Documentation

## Users API

### Create

- description: create a new user
- request: `PUT /api/users/`
    - content-type: `application/json`
    - body: object
      - username: (string) the username of the user
      - password: (string) the password of the user
      - email: (string) the email of the user
- response: 200
    - content-type: `application/json`
    - body: object
      - _id: (string) the user id

``` 
$ curl -X PUT 
       -H "Content-Type: 'application/json'" 
       -d '{"username":"testuser", "password":"password", "email": "test@gmail.com"}'
       http://www.langobango.me/api/users/
```


### Read user data

- description: retrieve a specific user's data, by username
- request: 'GET /api/users/:username/'
- response: 200
    - content-type: `application/json`
    - body: the requested user
      - username: (string) the username of the user
	  - email: (string) the email of the user
	  - scores: (dictionary) the users' scores, with languages as keys and scores as values
      - salted hash: (string)
- response: 404
	- username does not exist
 
``` 
$ curl http://www.langobango.me/api/users/testuser/
``` 


### Sign In
- description: Sign in a user
- request: `POST /api/signin/`
    - content-type: `application/json`
    - body: object
      - username: (string) the username of the user
      - password: (string) the password of the user
- response: 200
    - content-type: `application/json`
	- Set-Cookie header, with serialized username
    - body: the authenticated user
      - _id: (string) the user id
      - username: (string) the username of the user
      - salted hash: (string)

``` 
$ curl -X POST 
       -H "Content-Type: 'application/json'" 
       -d '{"username":"derek", "password":"password"}'
       http://www.langobango.me/api/signin/
```


### Sign Out
- description: Signs out this session's user
- request: 'GET /api/signout/'
- response: 200
    - content-type: `application/json`
 
``` 
$ curl http://www.langobango.me/api/signout/
``` 
  
###  Update

- description: Insert a file into an existing image object
- request: 'PATCH /api/images/:_id/'
- upload.single('file')
- response: 200
    - content-type: `application/json`
    - body: object
      - _id: (string) the image id
- response: 404
    - Image ID does not exist

``` 
$ curl -X PATCH
		-H "Content-Type: 'image/jpeg'" 
		-d '((raw file data))'
		https://localhost:3000/api/users/admin/images/1bc1OiOq2ict77FF/
``` 