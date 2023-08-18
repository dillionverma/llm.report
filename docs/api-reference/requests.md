1. Endpoint and HTTP Method:

   - Endpoint: `/api/v1/requests`
   - HTTP Method: `GET`

2. Query Parameters:

   - `user_id` (optional, string): The ID of the user.
   - `search` (optional, string): The search query to filter requests.
   - `sortBy` (optional, string): The field to sort requests by. Possible values are `id`, `createdAt`, `updatedAt`, `ip`, `url`, `method`, `status`, and `cached`.
   - `sortOrder` (optional, string): The order to sort requests. Possible values are `asc` (ascending) and `desc` (descending).
   - `pageSize` (optional, number): The number of requests to return per page.
   - `pageNumber` (optional, number): The page number of requests to return.
   - `filter` (optional, string): Additional filtering parameters in JSON format.

3. Request Headers:

   - `Authorization` (required, string): LLM REPORT API key.

4. Response:

   - Status: 200 OK - The request was successful.
   - JSON Body:
     - `requests` (array of objects): An array of request objects.
       - `id` (string): The ID of the request.
       - `createdAt` (string): The timestamp when the request was created.
       - `updatedAt` (string): The timestamp when the request was last updated.
       - `ip` (string): The IP address of the request.
       - `url` (string): The URL of the request.
       - `method` (string): The HTTP method used in the request.
       - `status` (string): The status code of the request.
       - `cached` (boolean): Indicates if the request was cached.
       - `streamed` (boolean): Indicates if the response was streamed.
       - `user_id` (string): The ID of the user associated with the request.
       - `completion` (string): The completion response of the request.
       - `model` (string): The model used for the request.
       - `openai_id` (string): The ID of the request in the OpenAI system.
       - `prompt_tokens` (number): The number of tokens in the prompt.
       - `completion_tokens` (number): The number of tokens in the completion.
       - `request_body` (string): The request body.
       - `response_body` (string): The response body.
       - `streamed_response_body` (string): The streamed response body.
       - `cost` (number): The cost of the request calculation.
     - `totalCount` (number): The total count of requests matching the query parameters.

5. Error Responses:
   - Status: 401 Unauthorized - The user is not logged in or the provided API key is invalid.
     - JSON Body: `{ error: "You must be logged in or provide an API key." }` or `{ error: "Invalid API key." }`
   - Status: 405 Method Not Allowed - The HTTP method used is not allowed for this endpoint.
     - JSON Body: `{ error: "Method not allowed" }`
