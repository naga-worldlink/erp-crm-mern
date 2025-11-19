import axios from "axios";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";

const jar = new CookieJar();
const client = wrapper(axios.create({ baseURL: "http://localhost:8888", jar }));

export const login = async () => {
  const res = await client.post("/api/login", {
    email: "admin@demo.com",
    password: "admin123",
  });

  console.log("Logged in as:", res.data.result.email);
  return client; // return axios client with cookies
};
