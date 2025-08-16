// pages/api/visual.js
export default async function handler(req, res) {
  const { visualCue, enhancements, type } = req.body;

  const enhancementText = enhancements.length
    ? `Make sure to: ${enhancements.join(", ")}.`
    : "";

const prompt =
  type === "image"
    ? `Turn this visual idea into a short, high-quality, culturally rich image generation prompt under 1000 characters: ${visualCue}. ${enhancementText}`
    : `Write a cinematic video script based on this scene: ${visualCue}. ${enhancementText}`;

  console.log(prompt)
  try {
    // Step 1: Use GPT to make the final image prompt
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
    const output = data.choices[0].message.content.trim();
    console.log("Generated output:", output);
    let imageUrl = null;

    // Step 2: If type is image, call OpenAI Images API
    console.log("Type of visual:", type);
    if (type === "image") {
      const imageResponse = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          n: 1, // Or "dall-e-3"
          prompt: output,
          size: "1024x1024",
        }),
      });

      const imageData = await imageResponse.json();
      console.log(imageData)
      imageUrl = imageData.data?.[0]?.url || null;
    }

    res.status(200).json({ output, imageUrl });
  } catch (error) {
    console.error("Error generating visual:", error);
    res.status(500).json({ error: "Failed to generate visual" });
  }
}
