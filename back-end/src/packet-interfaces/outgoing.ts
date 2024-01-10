export interface freeHours {
    ids: number[]
    dates: Date[]
}

export interface EmailOptions {
    to: string;
    subject: string;
    text: string;
}

export interface AvailableHour {
    startTime: string;
    endTime: string;
}

export interface ServiceListItem {
    description: string;
    category: string;
    price: string;
}

export interface Recipients {
    Email: string;
}

export interface Body {
    ContentType: string;
    Content: string;
}

export interface Content {
    Body: Body[];
    From: string;
    Subject: string;
}

export interface Email {
    Recipients: Recipients[];
    Content: Content;
}