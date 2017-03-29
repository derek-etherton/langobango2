---
layout: default
---

# LangoBango: API Documentation

## Users API


### Create a new User

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
- response: 400
	- Body contains validation errors
- response: 409
	- Failed to insert user into database

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
	  - scores: (dictionary) the users' scores, with languages as keys and scores as values
	  - email: (string) the email of the user
	  - salt : (string)
      - salted hash: (string)
- response: 500
	- database lookup failed
 
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
	- cookie.username: (string) username
    - body: the authenticated user
      - _id: (string) the user id      
	  - username: (string) the username of the user
	  - scores: (dictionary) the users' scores, with languages as keys and scores as values
	  - email: (string) the email of the user
	  - salt : (string)
      - salted hash: (string)
- response: 500
	- database lookup failed

``` 
$ curl -X POST 
       -H "Content-Type: 'application/json'" 
       -d '{"username":"testuser", "password":"password"}'
       http://www.langobango.me/api/signin/
```


### Sign Out

- description: Signs out this session's user
- request: 'GET /api/signout/'
- response: 200
    - content-type: `application/json`
- response: 500
	- failed to destroy user session

```
$ curl http://www.langobango.me/api/signout/
```
  
###  Update user score

- description: Insert a score for a specific language into the given users' scores
- request: 'PATCH /api/users/:username/scores/'
	- body: object
		- language: the language to insert the score into
		- score: the score the user achieved
- response: 200
    - content-type: `application/json`
    - body: object
      - _id: (string) the image id
- response: 403
    - unauthorized access
- response: 404
	- user does not exist
- response: 500
	- database lookup failed

``` 
$ curl -X PATCH
		-H "Content-Type: 'application/json'" 
		-d '{"language": "English", "score" : "100"}'
		http://www.langobango.me/api/users/testuser/scores/
```

### Get a phrase set given locale

- description: retrieve a phrase set given locale
- request: 'GET /api/phrases/:locale/'
- response: 200
    - content-type: `application/json`
    - body: string array of phrases
 
``` 
$ curl http://www.langobango.me/api/phrases/en/
``` 

### Translate a phrase

- description: translates the given phrase
- request: 'GET /api/translate/:phrase/'
- response: 200
    - content-type: `application/json`
    - body: (string) translated phrase to English 
 
``` 
$ curl http://www.langobango.me/api/translate/Bonjour/
``` 