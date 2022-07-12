## Getting started

1. Install Deno: https://deno.land/manual/getting_started/installation
2. Populate the .env file with help of the example env file
3. Run the server with the following command: `deno task start`

### Can install REST Client to send HTTP request and view the response in Visual Studio Code

 - Open `run.http`
 - Click to api `get data` => get data & pagination users list
 - Click to api `New User` => Create new user 
   -  Create new User with parameters
   -  Validation params.
   -  Check Email exist.
   -  Check Age > 18 years old

#### Or using Postman to test the API. 

## Authorizing requests data securely
1. Login with username: `username` & password: `password ` to get `access token`
2. Put access token to header `Authorization` for each request to server.
