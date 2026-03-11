import { PREFIX } from "../utils/constraints";

// Function to check if the stored API key is valid by pinging the backend.
// Calls /API/manager/healtz endpoint with the API key in the header.
// - Returns JSON response if valid
// - Throws Error with appropriate message if invalid/unreachable
export const checkPermitRequest = async () => {
  // Make API request to backend healthcheck endpoint
  const response = await fetch(`${PREFIX}/API/manager/healtz`, {
    method: 'GET',
    headers: {
      'X-API-KEY': localStorage.getItem('apiKey'), // fetch key from localStorage
    },
  });

  // If backend responds with non-OK status
  if (!response.ok) {
    if (response.status === 502) {
      // Special case: gateway unreachable
      throw new Error("502 - API Service is unreachable, Bad gateway");
    }
    // Otherwise, parse JSON error body for a more useful message
    const errorJSON = await response.json();
    throw new Error(`${response.status} - ${errorJSON.message}`);
  }

  // If OK, parse response as JSON and return
  const responseJSON = await response.json();
  return responseJSON;
};
