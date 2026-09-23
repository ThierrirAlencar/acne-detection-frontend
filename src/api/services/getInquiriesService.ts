import type { Consultation, ConsultationSeverity } from "@/types/consultation";
import { api } from "../axios";
import { isAfter, isBefore, isEqual } from 'date-fns';

export type InquiryResponse = {
    id: number;
    created_at: string;
    created_atm?: string;
    inquiry_status: string;
    image_url: string | null;
    gags_score:number | null;
    lesions_count:number | null;
    severity:ConsultationSeverity | null;
    result_base64:string | null;
    original_base64:string | null
    result_text?: string | null;
    result_json?: string | null;
    region_counts?: Record<string, number> | null;
    appointment_id?: number;
};

type PaginatedInquiryResponse = {
    items?: InquiryResponse[];
    data?: InquiryResponse[];
    inquiries?: InquiryResponse[];
    total?: number;
    count?: number;
    page?: number;
    take?: number;
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
    lastInquirie:Date,
    page:number,
    take:number,
    total:number,
    hasNextPage:boolean
    inquiries: InquiryResponse[]
}

export interface GetAllInquiriesOptions {
    page?: number;
    take?: number;
    appointmentId?: number;
}

export async function getAllInquiries(options: GetAllInquiriesOptions = {}): Promise<getInquiriesData> {
    const authToken = localStorage.getItem("auth_user_token");
    const page = options.page ?? 1;
    const take = options.take ?? 4;
    const response = await api.get<InquiryResponse[] | PaginatedInquiryResponse>("/inquiries/",{
        params: {
            page,
            take,
            ...(options.appointmentId === undefined ? {} : { appointment_id: options.appointmentId })
        },
        headers:{
            Authorization:`Bearer ${authToken}`
        }
    });

    const responseData = response.data;
    const inquiries = Array.isArray(responseData)
        ? responseData
        : responseData.items ?? responseData.data ?? responseData.inquiries ?? [];
    const total = Array.isArray(responseData)
        ? inquiries.length
        : responseData.total ?? responseData.count ?? inquiries.length;

    var gags_score = 0
    var finished_inquiries = 0;
    var last_analisis = new Date("18-01-1800");
    const consultation_list = inquiries.map((inquiry) => ({
            id: inquiry.id,
            date: inquiry.created_at ?? inquiry.created_atm ?? "",
            status: mapStatus(inquiry.inquiry_status),
            severity: inquiry.severity,
            gags: inquiry.gags_score,
            lesions: inquiry.lesions_count,
            title: "Avaliação facial",
            image: inquiry.original_base64
                ? inquiry.original_base64.startsWith("data:")
                    ? inquiry.original_base64
                    : `data:image/jpeg;base64,${inquiry.original_base64}`
                : null,
            imagebase64:inquiry.original_base64
    }));

    consultation_list.forEach(e=>{
        if(e.gags) gags_score+=e.gags
        if(e.status == "completado") finished_inquiries ++ 
        if(isAfter(e.date, last_analisis)) last_analisis = new Date(e.date)
    })

    return {
        averageGAGSScore:consultation_list.length ? Math.floor(gags_score/consultation_list.length) : 0,
        inquiriesAmount:consultation_list.length,
        inquiriesFinished:finished_inquiries,
        inquiriesList:consultation_list,
        lastInquirie:last_analisis,
        page,
        take,
        total,
        hasNextPage: page * take < total,
        inquiries
    }
}