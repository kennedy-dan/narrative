import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const { visualCue, videoStyle } = req.body;

  const prompt = videoStyle === "cinematic"
    ? `Write a cinematic shot-by-shot video script for: ${visualCue}. Include EXT./INT. tags, camera angles, product shots, and emotional tone.`
    : `Write a short, voiceover-first video script for social media base'  on: ${visualCue}. Focus on emotion, youth culture, and simplicity for fast digital formats.`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a video scriptwriter for branded content." },
        { role: "user", content: prompt }
      ],
      model: "gpt-4o"
    });

    const story = completion.choices[0].message.content;
    res.status(200).json({ story });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ error: 'Failed to generate video script.' });
  }
}