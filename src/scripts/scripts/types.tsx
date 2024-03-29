type tipical = {
    ok?: boolean;
    cause?: string;
    datas?: any;
};

type StudentsData = {
    id: string;
    dni: string;
    curse: string;
    hour: string;
    date: string;
};


type TimesAccept = {
    hour: number;
    minMinutes: number;
    maxMinutes: number;
    result: string;
};

type AssistList = {
    curse: string;
    hour: string;
    date: string;
    list: StudentsData[];
};

type AssistTurnsList = {
    date: string;
    turn: string;
    listIds: string[];
};

export type {
    tipical,
    StudentsData,
    TimesAccept,
    AssistList,
    AssistTurnsList
};