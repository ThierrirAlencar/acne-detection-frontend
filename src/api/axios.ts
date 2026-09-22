import type { AxiosInstance } from "axios";
import axios from "axios";


export const api: AxiosInstance = axios.create({
    baseURL:"https://boss-skirt-scheme.ngrok-free.dev",
    timeout:90000
})