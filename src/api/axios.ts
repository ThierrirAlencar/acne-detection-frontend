import type { AxiosInstance } from "axios";
import axios from "axios";


export const api: AxiosInstance = axios.create({
    baseURL:"https://boss-skirt-scheme.ngrok-free.dev",//"http://127.0.0.1:5676",
    timeout:90000,
    headers:{
        "ngrok-skip-browser-warning": "true"
    }
})