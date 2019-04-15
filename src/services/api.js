import axios from "axios";

const api = axios.create({
  baseURL: "https://alex-box-backend.herokuapp.com/"
});

export default api;
