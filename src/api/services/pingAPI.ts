import { api } from "../axios";

export async function pingAPI(): Promise<boolean> {
    try {
        const response = await api.get("/ping", { timeout: 5000 });
        return response.status >= 200 && response.status < 300;
    } catch {
        return false;
    }
}