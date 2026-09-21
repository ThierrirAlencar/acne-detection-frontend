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

function notifyAuthStateChanged() {
    window.dispatchEvent(new Event(AUTH_STATE_CHANGED_EVENT));
}

export function getAuthenticatedUser(): AuthenticatedUser | null {
    const storedUser = localStorage.getItem("auth_user");

    if (!storedUser) return null;

    try {
        const user = JSON.parse(storedUser) as AuthenticatedUser;
        const token = localStorage.getItem(`auth_user_token-${user.id}`);

        return token ? user : null;
    } catch {
        return null;
    }
}

export function logoutUser() {
    const storedUser = localStorage.getItem("auth_user");

    if (storedUser) {
        try {
            const user = JSON.parse(storedUser) as AuthenticatedUser;
            localStorage.removeItem(`auth_user_token-${user.id}`);
        } catch {
            // Ignore malformed local authentication data.
        }
    }

    localStorage.removeItem("auth_user");
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

    const key = `auth_user_token-${response.data.user.id}`;
    localStorage.setItem(key, response.data.token);
    localStorage.setItem("auth_user", JSON.stringify(response.data.user));
    notifyAuthStateChanged();

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