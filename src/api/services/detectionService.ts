import { api } from "../axios";


export interface ModelDetectionResponse {
    appointment_id:number,
    created_at:Date,
    gags_score:number,
    id:number,
    inquiry_status: string,
    lesions_count:number,
    result_image_url:string,
    severity:string,
    result_text:string,
    result_json_url:string
}

export async function handleModelDetection(body:{appointment_id:number; image:File}){
    const authToken = localStorage.getItem("auth_user_token");
    const formData = new FormData();
    formData.append("appointment_id", String(body.appointment_id));
    formData.append("image", body.image);

    const response = await api.post<ModelDetectionResponse>("/models/detection/classificate", formData, {
        headers:{
            Authorization:`Bearer ${authToken}`
        }
    });

    return response.data
}