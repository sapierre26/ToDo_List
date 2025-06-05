const API_BASE =
  import.meta.env.MODE === "development"
    ? "http://localhost:8000"
    : "https://<your-backend>.azurewebsites.net"; // replace with your deployed backend domain

export default API_BASE;