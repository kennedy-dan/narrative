export default async function handler(req, res) {
  const { maslow, archetype, context, brand, tone } = req.body;
  const prompt = `Tell the story of a person shaped by ${context}, whose life is driven by ${maslow} needs. Their journey follows the \"${archetype}\" archetype.${brand ? ' This story should be relevant for the brand: ' + brand + '.' : ''}${tone ? ' Use a tone that is ' + tone + '.' : ''}\n\nPlease return a short story (3–6 sentences) that serves as a brand narrative. It should inspire or guide the creation of images or video creatives for marketing purposes on TV, social media, or any other digital channels. Keep it concise, emotionally resonant, visually suggestive, and include a \"Suggested Visual:\" line at the end.`;

  const completion = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.GPT_MODEL || "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await completion.json();
  console.log("Story generation response:", data);
  const fullText = data.choices[0].message.content;
const match = fullText.match(/(?:\*\*)?Suggested Visual:(?:\*\*)?\s*(.*)/i);
const story = fullText.replace(/(?:\*\*)?Suggested Visual:(?:\*\*)?.*/i, "").trim();
const visualCue = match ? match[1].trim() : "";
  console.log("Extracted story:", story);
  console.log("Extracted visual cue:", visualCue);

  // ✅ Your response stays the same but now always works
  res.status(200).json({
    story,
    visualCue,
  });
}
