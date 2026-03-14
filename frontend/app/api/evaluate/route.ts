import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { code, messages, questionTitle, questionDescription } = await req.json();

    const prompt = `You are evaluating a candidate's performance in a coding interview.
Problem: ${questionTitle}
Description: ${questionDescription}

Candidate's Code:
\`\`\`
${code}
\`\`\`

Candidate's Chat History:
${messages.map((m: any) => `${m.role}: ${m.content}`).join('\n')}

Evaluate the candidate out of 10 for:
1. clarity: How well they communicated their approach
2. quality: How clean, bug-free, and correct their code is
3. complexity: How optimal the solution is in time/space

Also, compute an "overall" score (0-100) and a short "feedback" message. Determine a "nextDifficulty" (either 'easy', 'medium', or 'hard').

Respond ONLY with a JSON object matching this schema:
{
  "clarity": number (1-10),
  "quality": number (1-10),
  "complexity": number (1-10),
  "overall": number (0-100),
  "feedback": "string",
  "nextDifficulty": "easy" | "medium" | "hard"
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(response.choices[0]?.message?.content || "{}");
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Evaluation API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}