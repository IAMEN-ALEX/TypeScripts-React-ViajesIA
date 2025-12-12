import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { query } from '@/lib/db';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export async function POST(req: Request) {
    try {
        const { question } = await req.json();

        // Fetch all trips and notes to provide context
        const trips: any = await query('SELECT * FROM trips');
        const notes: any = await query('SELECT * FROM notes');

        // Structure data for context
        const context = {
            trips,
            notes
        };

        const systemPrompt = `
        Eres un asistente de viajes útil para la aplicación "Viajando con la IA".
        
        Aquí están los datos de viaje actuales del usuario:
        ${JSON.stringify(context, null, 2)}
        
        IMPORTANTE: 
        - Responde a las preguntas del usuario basándote en los datos proporcionados
        - NO menciones IDs de notas, viajes ni ningún identificador técnico
        - Presenta la información de forma natural y conversacional
        - Si mencionas notas o planes, hazlo como si fueran parte de una conversación natural
        - Si la respuesta no está en los datos, dilo amablemente
        - Sé conciso, amigable y responde siempre en español
        `;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: question
                }
            ],
            model: "llama-3.1-8b-instant",
        });

        const answer = completion.choices[0]?.message?.content || "Lo siento, no pude obtener una respuesta.";

        return NextResponse.json({ answer });
    } catch (error: any) {
        console.error('Groq API Error:', error);
        return NextResponse.json({ answer: `Error: ${error.message}` }, { status: 500 });
    }
}
