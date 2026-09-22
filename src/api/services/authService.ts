import { api } from "../axios";

export interface RegisterBody {
    username: string;
    email: string;
    password: string;
}

export interface LoginBody {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: {
        email: string;
        id: number;
        username: string;
    };
}

export type AuthenticatedUser = LoginResponse["user"];

export const AUTH_STATE_CHANGED_EVENT = "auth-state-changed";
const AUTH_TOKEN_STORAGE_KEY = "auth_user_token";

function notifyAuthStateChanged() {
    window.dispatchEvent(new Event(AUTH_STATE_CHANGED_EVENT));
}

export function getAuthenticatedUser(): AuthenticatedUser | null {
    const storedUser = localStorage.getItem("auth_user");
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

    if (!storedUser || !token) return null;

    try {
        return JSON.parse(storedUser) as AuthenticatedUser;
    } catch {
        return null;
    }
}

export function logoutUser() {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    localStorage.removeItem("auth_user");
    api.defaults.headers.common['Authorization'] = undefined
    alert("usuário deslogado!")
    notifyAuthStateChanged();
}

export async function loginService(body: LoginBody): Promise<LoginResponse> {
    const form = new URLSearchParams({
        email: body.email,
        password: body.password,
    });

    console.log(form)

    const response = await api.post<LoginResponse>("/users/login", body, {
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.status !== 200) {
        throw new Error("Requisição não retornou o esperado");
    }

    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, response.data.token);
    localStorage.setItem("auth_user", JSON.stringify(response.data.user));
    notifyAuthStateChanged();

    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
    return response.data;
}

export async function registerUserService(body: RegisterBody): Promise<boolean> {
    const response = await api.post("/users/", body, {
        headers: {
            "Content-Type": "application/json",
        },
    });

    return response.status === 201;
}