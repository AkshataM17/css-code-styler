// app/api/style-code/route.js
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
          content: `You are an expert frontend developer specializing in responsive design and cross-browser compatibility. When given HTML code:
1. Create modern, responsive CSS that works across all screen sizes and devices
2. Use mobile-first approach with appropriate breakpoints
3. Ensure cross-browser compatibility
4. Implement smooth transitions for interactive elements
5. Use relative units (rem, em, vh, vw) instead of fixed pixels where appropriate
6. Include necessary media queries for different screen sizes
7. Add any necessary vendor prefixes for broader browser support
8. Response should start with <style> and end with </style>
9. Do not include any explanation or markdown formatting - just the CSS code`
        },
        {
          role: "user",
          content: `Style this HTML code to be responsive and cross-browser compatible: ${code}`
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