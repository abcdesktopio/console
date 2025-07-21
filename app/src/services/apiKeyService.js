import { PREFIX } from "./prefix";

export const checkApiKey = async () => {
  const response = await fetch(`${PREFIX}/API/manager/healtz`, {
    method: 'GET',
    headers: {
      'X-API-KEY': localStorage.getItem('apiKey'),
    },
  });

  if (!response.ok) {
      const errorJSON = await response.json();
      throw new Error(`${response.status} - ${errorJSON.message}`);
  }

  const responseJSON = await response.json();
  return responseJSON;
};