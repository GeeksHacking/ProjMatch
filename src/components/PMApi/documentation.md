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
let api;

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
    }, []);getPosts

    ...
}
```
***
# Endpoints
In general endpoints will return -1 if it fails and the requested data or 0 if pass
## Get Posts
> `async getPosts(options:object = false) -> Object`  

### Parameters:  

- options:  
  the filters for the api call  
  e.g `{email:"johndoe@example.com"}`  

### Outputs:  
Outputs the data portion of the api call which should be in the format below
```json
(TODO)
```
## Update Posts
> `async getPosts(options:object = false) -> Object`  

### Parameters:  

- options:  
  the filters for the api call  
  e.g `{email:"johndoe@example.com"}`  

### Outputs:  
Outputs the data portion of the api call which should be in the format below
```json
(TODO)
```



