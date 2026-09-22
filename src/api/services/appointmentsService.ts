import { api } from "../axios";
import { getAuthenticatedUser } from "./authService";

export interface AppointmentsResponse {
    created_at:Date,
    deleted_at?: Date | null,
    updated_at?:Date | null,
    id: number,
    user_id: number
}

export async function handleGetAppointments():Promise<AppointmentsResponse[]>{
    const authToken = localStorage.getItem("auth_user_token");
    const response = await api.get<AppointmentsResponse[]>("/appointments/",{
        headers:{
            Authorization:`Bearer ${authToken}` 
        }
    });
    

    if(response.status!=200){
        throw new Error(response.status + "  " + response.statusText)
    }
    return response.data
}