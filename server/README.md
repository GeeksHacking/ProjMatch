# ProjMatch BackEnd API
Documentation on how to use the ProjMatch Backend API. If anything does not work as intended or a strange error has occured, please let me know

## API Authentication
- In order to send requests to the API, you will need to have an access token. This can be generated from the Auth0 Dashboard.
    - Do create an Auth0 Account, and send your email to me
### Generating a M2M Access Token
- When in a Development Environemt testing the API (you shouldn't need to), send a **POST Request** to `https://projmatch.au.auth0.com/oauth/token`
    - client_id, client_secret and audience is the same used in the _.env_ file
- Then, when sending the GET/POST/PUT/DELETE Requests, paste the Access Token as a _Bearer Token_ in the Request Header
#### Sample JSON POST Body
```json
{
    "client_id": "",
    "client_secret": "",
    "audience": "",
    "grant_type": "client_credentials"
}
```

### Getting Past Authentication
To get more information about how to get the unique access token for the user and to use Auth0 for user authentication, visit [https://auth0.com/blog/ultimate-guide-nextjs-authentication-auth0/](https://auth0.com/blog/ultimate-guide-nextjs-authentication-auth0/).
- In other words, import getAccessToken, withApiAuthRequired from '@auth0/nextjs-auth0', then use the getAccessToken to get the access token before adding it into the header of the API Request, and making the request


## Get User Details
### User Information Types
1. username -- **Required for User Creation**
2. rlName -- **Required for User Creation**
3. regEmail -- **Required for User Creation**
4. regPhone -- **Required for User Creation**
5. dateCreated -- Auto-Generated on Creation
6. userDat _(Needs to be set by the user in profile settings later on)_  
    1. rating _(Cannot be edited by user)_
    2. skills
    3. connectedAccounts
    4. createdProjects
    5. aboutMe
    6. location
### API Requests
Use `(domain)/api/v1/users` to communicate with the User API
- Additional query can be appended to the URL to get certain information _(only applicable for GET requests)_
- Information is required in the API Request body
#### GET Request
- A **GET Request** responds with a maximum of 1000 users. Use the _page_ query to display the next 1000 users
- If there is an error, the API will return with an error code 500. Handle the error as necessary
- The body is not required when running a GET Request

| Filter | Query String |
| --- | --- |
| Username | user |
| Email | email |
| Phone Number | ph |

Example of Filter Request: `(domain)/api/v1/users?user=helloworld`

For GET Requests, you can also specify the **page number** and **number of shown users per page**
- To do this, just add another Query String behind

#### POST Request
- A **POST Request** allows you to create new user  

**Creation of a New User**
1. To create a new user, 4 arguments are needed in the body of the API Request  
    1. username
    2. rlName
    3. regEmail
    4. regPhone
    - Regarding _regEmail_ and _regPhone_, it is NOT COMPULSORY to have both. One of the fields can be set to an empty string. However, do ensure that one of the fields have data.
2. Send the POST Request to the API
3. If there is an error, the API will return with an Error Code 500. Handle the error as necessary  

**Example of a body of the POST Request**  
```json
{
   "username": "someUsername",
    "pw": "abc123",
    "rlName": "John Doe",
    "regEmail": "email@email.com",
    "regPhone": "+65000000"
}
```

#### PUT Request
- A **PUT Request** allows you to update the user information of a specific user

**Updating a User's Information**
1. To update a user's information, 2 arguments are required in the body of the API Request  
    1. id (This refers to the ID of the User, NOT the user's username)
    2. update
        - The update object should contain the fields that you want to change
        - The naming convention of the fields should follow the _User Information Types_
2. Send the PUT Request to the API
3. If there is an error, the API will return with an Error Code 500. Handle the error as necessary

**Example of a body of the PUT Request**  
```json
{
    "id": "64187ab0d6a4b0713becd1a0",
    "update": {
        "username": "this_is_a_new_username",
        "regEmail": "newEmail@email.com"
    }
}
```

#### DELETE Request
- A **DELETE Request** allows you to delete a user's profile
- **ENSURE THAT A USER HAS DOUBLE-CONFIRMED BEFORE SENDING A DELETE REQUEST.** A DELETE Request is irreversable
- To delete the user, only the user id is required in the body of the API Request

**Example of a body of the PUT Request**  
```json
{
    "id": "64187ab0d6a4b0713becd1a0"
}
```

## Get Post Details

### User Information Types
All fields are compulsory when creating a post

1. projectName
2. description
3. creatorUserID
4. rating _(Not needed when creating a project, defaults to 0.0. Should never be updated by user)_
5. tags
6. technologies
7. images
8. isArchived _(Not needed when creating a project)_

### API Requests
- The GET/POST/PUT/DELETE Requests works the same as the ones for the Users API
    - However, do note that some of the field names are different. Refer to User Information Types to see the different field names used in the Posts API
- For **PUT and DELETE Requests**, they have the same requirement as the Users API, where you need the ID and things to update in a update object and just the ID respectively
- Do reach out if you need help with making an API Request to get Posts

## Image API
The Image API works differently from the Posts and Users API as it uses the Amazon S3 Database as compared to the MongoDB Database the other APIs use
### API Requests

#### GET Request
- A **GET Request** allows you to get images to a certain project
    - A **GET Request** will return all the imageURLs located in a certain project

**API Request Fields**
- What each field requires is pretty self-explainatory, but do let me know if you have any queries
1. projectName
2. creatorUserID _(This is NOT the ID of the Project!!)_

#### POST Request
- A **POST Request** allows you to add images to a certain project
- To send a **POST Request**, instead of adding things into the Body of the API Request, you have to specify that it is 'form-data'.
    - Once the **POST Request** has been sent, the API will respond you with an array of imageURLs, which contains the URL where you can find the image in S3.
    - When loading the image in front-end, adding the _href_ as the imageURL should work fine.

**API Request Fields**
- What each field requires is pretty self-explainatory, but do let me know if you have any queries
1. images
2. projectName
3. creatorUserID _(This is NOT the ID of the Project!!)_

#### DELETE Request
- A **DELETE Request** allows you to some (or all) of the images related to a certain project
- **ENSURE THAT A USER HAS DOUBLE-CONFIRMED BEFORE SENDING A DELETE REQUEST.** A DELETE Request is irreversable
- To delete images, the projectName, creatorUserID, and list of image names are required

**Example of a body of the PUT Request**  
```json
{
    "projectName": "projmatch",
    "creatorUserID": "",
    "imageName": ["c62c830b-ca58-4855-9ff4-d0c3ee7b1a21.png"]
}
```