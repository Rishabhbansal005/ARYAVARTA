import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (!groqKey && !geminiKey) {
      return NextResponse.json(
        { error: "Neither Groq nor Gemini API keys are configured." },
        { status: 500 }
      );
    }

    const systemPromptText = `You are the Āryāvarta Cultural Guide (संस्कृति मार्गदर्शक) for a premier Indian heritage platform.
You are universally welcoming, inclusive, and celebrate the civilizational, artistic, and historical genius of Bharat (architecture, classical ragas, dance traditions, monuments, and rural crafts).

STRICT OUTPUT FORMAT RULES:
Do NOT output long unstructured walls of text. Always structure your answer into these 4 clean, crisp sections:

### 🌟 Essence
[1-2 clear, evocative sentences capturing the philosophical and cultural heart of the topic]

### 🏛️ Heritage Highlights
- **Context & Origin**: [Dynasty, era, or geographical source]
- **Artistic / Scientific Mastery**: [Specific technique, architectural feature, or musical swara]
- **Living Tradition**: [How it continues to live today in Indian culture]

### 💡 Fascinating Takeaway
[One memorable, wow-factor fact]

### 🔍 Explore Further
- [First engaging follow-up question for the user to explore]
- [Second engaging follow-up question]
- [Third engaging follow-up question]

Keep the tone scholarly, engaging, and well-organized. Total length under 220 words.`;

    // 1. Try Groq first
    if (groqKey) {
      const groqModels = ["openai/gpt-oss-120b", "qwen/qwen3.8-27b", "openai/gpt-oss-20b"];
      for (const model of groqModels) {
        try {
          const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${groqKey}`,
              "Content-Type": "application/json",
              "User-Agent": "Aryavarta/1.0"
            },
            body: JSON.stringify({
              model: model,
              messages: [
                { role: "system", content: systemPromptText },
                ...messages
              ],
              temperature: 0.6,
              max_tokens: 600
            })
          });

          if (groqRes.ok) {
            const data = await groqRes.json();
            const reply = data.choices?.[0]?.message?.content;
            if (reply) {
              return NextResponse.json({ reply, modelUsed: `Groq (${model})` });
            }
          }
        } catch (e) {
          console.warn(`Groq ${model} attempt failed:`, e);
        }
      }
    }

    // 2. Fallback to Google Gemini
    if (geminiKey) {
      const geminiModels = ["gemini-flash-lite-latest", "gemini-flash-latest", "gemini-3-flash-preview"];
      for (const gModel of geminiModels) {
        try {
          const contents = messages.map((m: { role: string; content: string }) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }]
          }));

          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${gModel}:generateContent?key=${geminiKey}`;
          const gRes = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: systemPromptText }] },
              contents: contents,
              generationConfig: { temperature: 0.6, maxOutputTokens: 600 }
            })
          });

          if (gRes.ok) {
            const gData = await gRes.json();
            const reply = gData.candidates?.[0]?.content?.parts?.[0]?.text;
            if (reply) {
              return NextResponse.json({ reply, modelUsed: `Google Gemini (${gModel})` });
            }
          }
        } catch (ge) {
          console.warn(`Gemini ${gModel} attempt failed:`, ge);
        }
      }
    }

    return NextResponse.json(
      { error: "Could not retrieve response from AI providers" },
      { status: 502 }
    );

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
