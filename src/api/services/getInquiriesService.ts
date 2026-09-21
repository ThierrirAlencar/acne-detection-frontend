import type { Consultation, ConsultationSeverity } from "@/types/consultation";
import { api } from "../axios";
import { isAfter, isBefore, isEqual } from 'date-fns';

type InquiryResponse = {
    id: number;
    created_at: string;
    created_atm: string;
    inquiry_status: string;
    image_url: string | null;
    gags_score:number | null;
    lesions_count:number | null;
    severity:ConsultationSeverity | null;
};

function mapStatus(status: string): Consultation["status"] {
    switch (status.toLowerCase()) {
        case "completado":
        case "completed":
            return "completado";
        case "processando":
        case "processing":
            return "processando";
        default:
            return "erro";
    }
}

export interface getInquiriesData {
    inquiriesList:Consultation[],
    averageGAGSScore:number,
    inquiriesAmount:number,
    inquiriesFinished:number,
    lastInquirie:Date
}

export async function getAllInquiries(): Promise<getInquiriesData> {
    const response = await api.get<InquiryResponse[]>("/inquiries");

    var gags_score = 0
    var finished_inquiries = 0;
    var last_analisis = new Date("18-01-1800");
    const consultation_list = response.data.map((inquiry) => ({
            id: inquiry.id,
            date: inquiry.created_at ?? inquiry.created_atm ?? "",
            status: mapStatus(inquiry.inquiry_status),
            severity: inquiry.severity,
            gags: inquiry.gags_score,
            lesions: inquiry.lesions_count,
            title: "Avaliação facial",
            image: inquiry.image_url ?? null
    }));

    consultation_list.forEach(e=>{
        if(e.gags) gags_score+=e.gags
        if(e.status == "completado") finished_inquiries ++ 
        if(isAfter(e.date, last_analisis)) last_analisis = new Date(e.date)
    })

    return {
        averageGAGSScore:Math.floor(gags_score/consultation_list.length),
        inquiriesAmount:consultation_list.length,
        inquiriesFinished:finished_inquiries,
        inquiriesList:consultation_list,
        lastInquirie:last_analisis
    }
}