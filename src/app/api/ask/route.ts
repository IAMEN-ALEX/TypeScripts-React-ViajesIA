import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { query } from '@/lib/db';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(req: Request) {
    try {
        const { question } = await req.json();

        if (!process.env.GOOGLE_API_KEY) {
            return NextResponse.json({ answer: 'API Key not configured. Please add GOOGLE_API_KEY to .env.local' });
        }

        // Fetch all trips and notes to provide context
        const trips: any = await query('SELECT * FROM trips');
        const notes: any = await query('SELECT * FROM notes');

        // Structure data for context
        const context = {
            trips,
            notes
        };

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-001' });

        const prompt = `
        Eres un asistente de viajes útil para la aplicación "Viajando con la IA".
        
        Aquí están los datos de viaje actuales del usuario:
        ${JSON.stringify(context, null, 2)}
        
        Pregunta del usuario: ${question}
        
        Responde basándote en los datos proporcionados. Si la respuesta no está en los datos, dilo amablemente. Sé conciso, amigable y responde siempre en español.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ answer: text });
    } catch (error) {
        console.error('AI Error:', error);
        return NextResponse.json({ answer: `Error: ${error instanceof Error ? error.message : String(error)}` }, { status: 500 });
    }
}
