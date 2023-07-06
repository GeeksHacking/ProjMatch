#PMApi Wrapper  
Api calls are repetative and long, hence I have siplified it to help readability and ease of calling api  

---

#General Usage
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
        const authToken = localStorage.getItem("authorisation_token");
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
Hence the entire code would look like so
```jsx
import PMApi from "@/components/PMApi/PMApi";

...

let api;

export default function Page{

    # declarations

    useEffect(() => {
        const authToken = localStorage.getItem("authorisation_token");
        if (authToken === null)
            return console.error("Authorisation Token returned Null.");
        if (authToken === undefined) {
            console.error("Authorisation Token returned Undefined.");
        } else {
            api = new PMApi(authToken);
        }
    }, []);getPosts
    
    # call the api anywhere

    ...
}
```
***
# Endpoints

## Posts
In general endpoints will return -1 if it fails and the requested data or 0 if pass
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
    filters: filters given
    ​
    page: current page
    ​
    posts: array with more post objects
        Post{
            id: String of project id
​​​
            contact: String of contact link
            ​​​
            creatorUserID: String of creator's uID
            ​​​
            description: String of description text
            ​​​
            images: Array of Strings containing links to each image
            ​​​
            isArchived: null if is archived
            ​​​
            projectName: String of project name
            ​​​
            ratings: Integer of ratings from 0-5
            ​​​
            tags: Array of strings of where each string is a tag
            ​​​
            technologies: Array of strings of where each string is a technology
        }
    ​
    postsPerPage: max posts sent in this req
    ​
    totalPosts: total amount of posts
}
```
**however outputs -1 if fails**





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
  >e.g:
```
        {
            id: String of project id
​​​
            contact: String of contact link
            ​​​
            creatorUserID: String of creator's uID
            ​​​
            description: String of description text
            ​​​
            images: Array of Strings containing links to each image
            ​​​
            isArchived: null if is archived
            ​​​
            projectName: String of project name
            ​​​
            ratings: Integer of ratings from 0-5
            ​​​
            tags: Array of strings of where each string is a tag
            ​​​
            technologies: Array of strings of where each string is a technology
        }
```

#### Outputs:  
0   if request sent successfully  
-1  if request did not send successfully




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
    status: String success or faliure
    insertedProjectWithID: String of Uid of project
}
```

