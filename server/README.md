# ProjMatch BackEnd API
Documentation on how to use the ProjMatch Backend API. If anything does not work as intended or a strange error has occured, please let me know

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