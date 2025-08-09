// client/src/api/apiClient.js

import axios from "axios";
import { auth } from "../firebase-config.js"; // Adjust this path to your firebase config file

// Create a new Axios instance with a custom configuration
const apiClient = axios.create({
  // Set the baseURL to the API endpoint you configured in Render's environment variables
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

// VERY IMPORTANT: Use an interceptor to automatically add the auth token to every request
apiClient.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.authtoken = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
