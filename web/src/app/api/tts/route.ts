import { NextResponse } from "next/server";

// Comprehensive mapping of app language codes to Sarvam AI supported codes
function mapToSarvamLang(lang: string): string {
  const l = (lang || "").toLowerCase().trim();
  if (l === "en" || l === "en-in") return "en-IN";
  if (l === "hi" || l === "hi-in") return "hi-IN";
  if (l === "sa" || l === "sa-in") return "hi-IN"; // Bulbul handles Sanskrit phonetics flawlessly via Devanagari hi-IN
  if (l === "ta" || l === "ta-in") return "ta-IN"; // Tamil
  if (l === "te" || l === "te-in") return "te-IN"; // Telugu
  if (l === "bn" || l === "bn-in") return "bn-IN"; // Bengali
  if (l === "mr" || l === "mr-in") return "mr-IN"; // Marathi
  if (l === "gu" || l === "gu-in") return "gu-IN"; // Gujarati
  if (l === "kn" || l === "kn-in") return "kn-IN"; // Kannada
  if (l === "ml" || l === "ml-in") return "ml-IN"; // Malayalam
  if (l === "od" || l === "or" || l === "od-in" || l === "or-in") return "od-IN"; // Odia
  if (l === "pa" || l === "pa-in") return "pa-IN"; // Punjabi
  return "hi-IN"; // Default
}

export async function POST(req: Request) {
  try {
    const { text, lang = "hi", speaker = "aditya" } = await req.json();

    const apiKey = process.env.SARVAM_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Sarvam AI API key is not configured in .env.local" },
        { status: 500 }
      );
    }

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing text to synthesize" }, { status: 400 });
    }

    // Limit text chunk size to fit Sarvam AI payload limits (max 1000 chars for Bulbul v3)
    const cleanText = text.slice(0, 950).replace(/[*#_`]/g, "").trim();
    const targetLang = mapToSarvamLang(lang);

    let textToSynthesize = cleanText;

    // If target language is an Indian regional language and text contains Latin/English letters,
    // translate first into the authentic regional script using Sarvam Mayura Translate API
    if (targetLang !== "en-IN" && /[a-zA-Z]{3,}/.test(cleanText)) {
      try {
        const transRes = await fetch("https://api.sarvam.ai/translate", {
          method: "POST",
          headers: {
            "api-subscription-key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input: cleanText,
            source_language_code: "en-IN",
            target_language_code: targetLang,
            mode: "formal",
            model: "mayura:v1",
          }),
        });

        if (transRes.ok) {
          const transData = await transRes.json();
          if (transData.translated_text && transData.translated_text.trim().length > 0) {
            textToSynthesize = transData.translated_text.trim();
          }
        } else {
          const errText = await transRes.text();
          console.warn("Sarvam translate non-ok status:", transRes.status, errText);
        }
      } catch (transErr) {
        console.warn("Sarvam translate network exception, proceeding with cleanText:", transErr);
      }
    }

// Helper to split text into complete sentences that each fit under Sarvam Bulbul v3's 500-char limit
function chunkIntoSentences(text: string, maxLen: number = 440): string[] {
  if (!text || text.length <= maxLen) return [text];
  // Match sentences ending in . ! ? । | or newlines
  const sentences = text.match(/[^.!?।|\n]+[.!?।|\n]+|[^.!?।|\n]+$/g) || [text];
  const chunks: string[] = [];
  let current = "";

  for (const s of sentences) {
    const trimmed = s.trim();
    if (!trimmed) continue;
    if ((current + " " + trimmed).trim().length <= maxLen) {
      current = (current + " " + trimmed).trim();
    } else {
      if (current) chunks.push(current);
      if (trimmed.length <= maxLen) {
        current = trimmed;
      } else {
        // Fallback word split if a single sentence is longer than maxLen
        const words = trimmed.split(" ");
        current = "";
        for (const w of words) {
          if ((current + " " + w).trim().length <= maxLen) {
            current = (current + " " + w).trim();
          } else {
            if (current) chunks.push(current);
            current = w;
          }
        }
      }
    }
  }
  if (current) chunks.push(current);
  return chunks.length > 0 ? chunks : [text.slice(0, maxLen)];
}

    // Split text into chunks that satisfy Sarvam's strict <= 500 characters per element rule
    const inputChunks = chunkIntoSentences(textToSynthesize, 440).slice(0, 3); // Max 3 chunks for cohesive narration

    // Synthesize authentic regional speech using Sarvam Bulbul v3
    const response = await fetch("https://api.sarvam.ai/text-to-speech", {
      method: "POST",
      headers: {
        "api-subscription-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: inputChunks,
        target_language_code: targetLang,
        speaker: speaker || "aditya",
        model: "bulbul:v3",
        speech_sample_rate: 22050,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.warn("Sarvam AI TTS Error:", errBody);
      return NextResponse.json({ error: "Sarvam TTS generation failed", details: errBody }, { status: 502 });
    }

    const data = await response.json();
    const base64Audio = data.audios?.[0];

    if (!base64Audio) {
      return NextResponse.json({ error: "No audio generated" }, { status: 502 });
    }

    return NextResponse.json({
      audioBase64: base64Audio,
      contentType: "audio/wav",
      translatedText: textToSynthesize,
      originalText: cleanText,
      targetLang,
      speaker: speaker || "aditya",
      model: "bulbul:v3"
    });

  } catch (error) {
    console.error("TTS API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

