import axios from "axios";

export const authApi = axios.create({
  baseURL: "https://asia-southeast2-iotera-vending.cloudfunctions.net",
  headers: { "Content-Type": "application/json" },
});

export const deviceApi = axios.create({
  baseURL: "https://api-serverless.iotera.io",
  headers: { "Content-Type": "application/json" },
});