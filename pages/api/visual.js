// pages/api/visual.js
export default async function handler(req, res) {
  const { visualCue, enhancements, type } = req.body;

  const enhancementText = enhancements.length
    ? `Make sure to: ${enhancements.join(", ")}.`
    : "";

  const prompt =
    type === "image"
      ? `Create a detailed, high-quality image generation prompt (under 1000 characters) for: ${visualCue}. ${enhancementText} Focus on photorealistic details, proper lighting, composition, and cultural authenticity.`
      : `Write a cinematic video script based on this scene: ${visualCue}. ${enhancementText}`;

  console.log(prompt);
  
  try {
    // Step 1: Use GPT to enhance the prompt
    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.GPT_MODEL || "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert at creating detailed, high-quality image generation prompts that result in photorealistic, culturally authentic images with excellent composition and lighting."
          },
          { 
            role: "user", 
            content: prompt 
          }
        ],
        temperature: 0.7, // Add some creativity but maintain consistency
      }),
    });

    const data = await completion.json();
    const enhancedPrompt = data.choices[0].message.content.trim();
    console.log("Enhanced prompt:", enhancedPrompt);
    
    let imageUrl = null;

    // Step 2: If type is image, call OpenAI Images API with DALL-E 3
    if (type === "image") {
      const imageResponse = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "dall-e-3", // Use DALL-E 3 for higher quality
          prompt: enhancedPrompt,
          size: "1024x1024", // or "1792x1024" for landscape, "1024x1792" for portrait
          quality: "hd", // Use HD quality
          style: "natural", // or "vivid" for more dramatic colors
          n: 1,
        }),
      });

      const imageData = await imageResponse.json();
      console.log("Image API response:", imageData);
      
      if (imageData.error) {
        console.error("Image generation error:", imageData.error);
        return res.status(500).json({ error: imageData.error.message });
      }
      
      imageUrl = imageData.data?.[0]?.url || null;
    }

    res.status(200).json({ 
      output: enhancedPrompt, 
      imageUrl,
      originalPrompt: visualCue // Include original for debugging
    });
    
  } catch (error) {
    console.error("Error generating visual:", error);
    res.status(500).json({ 
      error: "Failed to generate visual",
      details: error.message 
    });
  }
}