import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req) {
  try {
    const { code } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert frontend developer. When given HTML code, respond only with the CSS code needed to style it beautifully. Do not include any explanation or markdown formatting. Start the response with <style> and end with </style>."
        },
        {
          role: "user",
          content: `Style this HTML code: ${code}`
        }
      ],
    });

    const styleContent = completion.choices[0].message.content;
    
    // Combine the original HTML with the styled CSS
    const styledCode = `
      ${styleContent}
      ${code}
    `;

    return NextResponse.json({ 
      styledCode,
      cssOnly: styleContent
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Error processing your request' }, { status: 500 });
  }
}