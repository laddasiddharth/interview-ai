import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages, questionTitle, questionDescription } = await req.json();

    const systemMessage: OpenAI.Chat.ChatCompletionMessageParam = {
      role: 'system',
      content: `You are an expert technical interviewer for a coding interview.
Problem: ${questionTitle}
Description: ${questionDescription}

Rules:
- Act as a supportive but challenging interviewer.
- Ask follow-up questions about their approach, time/space complexity, or edge cases.
- Do not give away the full solution. Guide the candidate.
- Keep responses concise (1-3 sentences maximum).
- If they are ready, encourage them to write the code.`,
    };

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: 150,
    });

    const reply = response.choices[0]?.message?.content || "Could you clarify that?";
    
    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}