import axios from "axios";

const apiKey = process.env.NEXT_PUBLIC_ERST_API_KEY;
const apiUrl = "https://calm-bear-54de635d94.strapiapp.com/api";

const axiosClient = axios.create({
  baseURL: apiUrl,
  headers: {
    Authorization: `Bearer ${apiKey}`,
  },
});

export default axiosClient;
