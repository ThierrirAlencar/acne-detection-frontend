import type { ConsultationSeverity } from "@/types/consultation";
import { api } from "../axios";

export interface TextDescriptionBody {
    inquiry_id: number;
    detection: {
        gags_score: number;
        gags_severity: ConsultationSeverity;
        region_counts: Record<string, number>;
    };

}
interface TextDescriptionResponse {
    result_text: string;

}

export async function handleTextDescription(body: TextDescriptionBody) {
    const authToken = localStorage.getItem("auth_user_token");
    const response = await api.post<TextDescriptionResponse>("/models/description/generate", body, {
        headers:{
            Authorization:`Bearer ${authToken}`
        }
    });

    return response.data
}