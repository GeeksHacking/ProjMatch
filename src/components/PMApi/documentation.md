# PMApi Wrapper  

Api calls are repetative and long, hence I have siplified it to help readability and ease of calling api  

***

# General Usage
To use the API wrapper you need to import it first  
  

```javascript
import api from PATH
```
where path is the path to the component.  
After you would need to declare it giving it the authorisation token for auth0  
like so:
```javascript
let api=new PMApi(AUTH_TOKEN)
```
## Usage In Page
First, import the api as shown above, and then declare a global variable as follows

```jsx
let api;
```

then in the top of page itself  
```jsx
export default function Page{

    (declarations)

    useEffect(() => {
        const authToken = sessionStorage.token
        if (authToken === null)
            return console.error("Authorisation Token returned Null.");
        if (authToken === undefined) {
            console.error("Authorisation Token returned Undefined.");
        } else {
            api = new PMApi(authToken);
        }
    }, []);

    ...
}
```
To call the api, you can use `.then()` to receive and use the data like so:
```jsx
    api.getPosts({email:"johnDoe@example.com"}).then(function (data){
        // do things with data
    })
```  
Hence the entire code would look like so
```jsx
import PMApi from "@/components/PMApi/PMApi";

...

let api;

export default function Page{

    // declarations

    useEffect(() => {
        const authToken = sessionStorage.token
        if (authToken === null)
            return console.error("Authorisation Token returned Null.");
        if (authToken === undefined) {
            console.error("Authorisation Token returned Undefined.");
        } else {
            api = new PMApi(authToken);
        }
        // example api call
        api.getPosts({email:"johnDoe@example.com"}).then(function (data){
            setUser(data)
        })
    }, []);
    
    // call the api anywhere

    ...
}
```
***
# Endpoints  
In general endpoints will return `-1` if it fails
## Posts

## Get Posts
```jsx
async getPosts(options:object = false) -> Object
```  

### Parameters:  

- options:  
  the filters for the api call  
  e.g `{email:"johndoe@example.com"}`  

### Outputs:  
Outputs the data portion of the api call which should be in the format below
```json
{
    "filters": "filters given",
    "page": "current page",
    "posts": ["array with more post objects"],
    "postsPerPage": "max posts sent in this req",
    "totalPosts": "total amount of posts"
}
```
**however outputs -1 if fails**  

Post object:
```json 
{
    "id": "String of project id",​
    "contact": "String of contact link",
    "creatorUserID": "String of creator's uID",
    "description": "String of description text",
    "images": "Array of Strings containing links to each image",
    "isArchived": "null if is not archived",
    "projectName": "String of project name",
    "ratings": "Integer of ratings from 0-5",
    "tags": "Array of strings of where each string is a tag",
    "technologies": "Array of strings of where each string is a technology"
}
```




### Update Posts
```jsx
async updatePost(postId : String, updatedProj : Object) -> int
```

#### Parameters:  

- postId:  
  >the Id of the post you want to update  
  e.g `{email:"johndoe@example.com"}` 

- updatedProj:  
  >the entire project that has been updated  

#### Outputs:  
`0`   if request sent successfully  
`-1`  if request did not send successfully




### Create Posts
```jsx
async createPost(projName : String, projDesc : String, projMakerId : String, projContact : String, projTags : <Array> String, projTech : <Array>String, projImg : <Array>String) -> Object
```

#### Parameters:  

- projName: String  
  Name of the project  

- projDesc: String  
  Description of the project  

- projMakerId: String  
  uId of the creator of project  

- projContact: String  
  link to contact the person by

- projTags : <Array> String  
  link to contact the person by
    
    

#### Outputs:  
Outputs the data portion of the api call which should be in the format below
```json
{
    "status": "String success or faliure",
    "insertedProjectWithID": "String of Uid of project"
}
```


### Delete Post
```jsx
async deletePosts(postId:String) -> Int
```

#### Parameters:  

- postId: String  
  Id of post want to delete  

    

#### Outputs:  
returns  
`0` is successfully deleted and   
`-1` if failed

***
## Users

### Get Users
```jsx
async getUsers(options: Object) -> Object
```

#### Parameters:  

- options: Object  
  the filters for the api call  
  e.g `{email:"johndoe@example.com"}`  

    

#### Outputs:  
returns  
Object is successfully deleted and   
`-1` if failed  
Object returned:  
**(TODO)**  


### Update User
```jsx
async updateUser(userId: String, updatedUser: Object) -> int
```

#### Parameters:  

- userId:  
  >the Id of the user you want to update  
  e.g `{email:"johndoe@example.com"}` 

- updatedUser:  
  >the entire user that has been updated  

#### Outputs:  
`0`   if request sent successfully  
`-1`  if request did not send successfully



### Create User
```jsx
async createUser(userNick, userName, userEmail) -> Object
```

#### Parameters:  

- userNick: String  
  Username of user

- userName: String  
  Actual name of user  

- userEmail: String  
  Email of user  


#### Outputs:  
(TODO!!)

### Create Image Urls
```jsx
async createImgUrl(images:<Array>???) -> <Array>String
```
#### Parameters
- images: <Array>???  
  ????

#### Output
Array of String each containing the URL for the corresponding image



***
## Email

### Send Email
```jsx
async sendEmail(email:Object) -> Int
```

#### Parameters:  

- email: Object  
  Object contaning 2 items: `subject` and `content` which are the respective subject and content for email that is sent to us

#### Outputs:  
`0` if successful
`-1` if unsuccessful 