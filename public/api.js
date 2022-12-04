/* URL to API */
const API_URL = "/api";

/* Subclass of Error for representing HTTP errors returned from the API.
   Exposes a status (the HTTP response status code) and message (a user-facing message). */
export class HTTPError extends Error {
    /* status is the HTTP status, message is a user-facing error message. */
    constructor(status, message) {
        /* Call the Error constructor with the given message. */
        super(message);
        this.status = status;
    }
}


/* Make an API request.
   - method is the HTTP method.
   - path is the URI. It must begin with a /. API_URL will be prepended.
   - body (optional) is the request body as a JS object that can be converted to JSON.

   The API is assumed to return JSON. If the response status is 200, the response body (as a JS object) is returned.
   If the response has any other status, an HTTPError is thrown, with its status set to the response status and its
   message set to value of the "error" property of the response, which we assume is a user-facing error message. */
const apiRequest = async (method, path, body = null) => {
    // initialize path and res
    let url = `${API_URL}${path}`;
    let res = null;
  
    // if GET is called, don't include body for the API request
    if (!body) {
      res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } else {
      // otherwise, include body for the API request
      res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: body
      });
    }
    
    // if response status is 200, body is returned
    if (res.status === 404 || res.status === 400 ) {
        let json = await res.json();
        // otherwise, throw an error
        throw new HTTPError(res.status, json.error);
    } else {
        let json = await res.json();
        return json;
    }
}

/* Expose the apiRequest function in the console */
window.apiRequest = apiRequest;

export default apiRequest;