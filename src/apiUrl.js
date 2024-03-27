const RENDER_API_URL = "https://academix-backend-srnd.onrender.com";
const API_URL =
  process.env.NODE_ENV === "production"
    ? RENDER_API_URL
    : "http://localhost:3001";
module.exports = API_URL;
