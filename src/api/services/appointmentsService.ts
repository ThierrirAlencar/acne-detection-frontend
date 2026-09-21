import { getAuthenticatedUser } from "./authService"

interface appointmentsResponse {
    created_at:Date,
    deleted_at?: Date | null,
    id: number,
    updated_at?:Date | null,
    user_id: number
}

export async function handleGetAppointments():Promise<appointmentsResponse[]>{
    
}