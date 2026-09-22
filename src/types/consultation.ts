export type ConsultationStatus = "completado" | "processando" | "erro";
export type ConsultationSeverity = "leve" | "moderada" | "grave";
export type Consultation = {
        id: number;
        date: string;
        status: ConsultationStatus;
        severity: ConsultationSeverity | null;
        gags: number | null;
        lesions: number | null;
        title: string;
        image: string | null;
        imagebase64:string | null;
};