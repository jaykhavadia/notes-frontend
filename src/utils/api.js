import axios from "axios";

const API_BASE = "http://localhost:5000/api"; // adjust if different

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});
