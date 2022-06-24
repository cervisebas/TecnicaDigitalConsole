type tipical = {
    ok?: boolean;
    cause?: string;
    datas?: any;
};

type StudentsData = {
    id: string;
    dni: string;
    curse: string;
};


type TimesAccept = {
    hour: number;
    minMinutes: number;
    maxMinutes: number;
    result: string;
};

export type {
    tipical,
    StudentsData,
    TimesAccept
};