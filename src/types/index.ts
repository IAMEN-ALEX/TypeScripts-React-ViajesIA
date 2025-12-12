// Global TypeScript type definitions

export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
}

export interface Trip {
    id: number;
    destination: string;
    start_date: string;
    end_date: string;
}

export interface Note {
    id: number;
    trip_id: number;
    content: string;
}

export interface TripWithNotes extends Trip {
    notes: Note[];
}

export interface AIResponse {
    answer: string;
}

export interface APIError {
    error: string;
    details?: string;
}
