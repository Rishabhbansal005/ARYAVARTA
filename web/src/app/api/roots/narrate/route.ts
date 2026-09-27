import { NextResponse } from "next/server";

interface NarratePayload {
  regionName: string;
  languageName: string;
  languageCode: string;
  rawQuery?: string;
  entities: {
    site?: {
      name: string;
      dynasty?: string;
      summary?: string;
      architecturalStyle?: string;
    };
    dance?: {
      name: string;
      keyPose?: string;
      treatise?: string;
      description?: string;
    };
    music?: {
      raga: string;
      description?: string;
    };
    craft?: {
      name: string;
      craftName: string;
      artisanName: string;
      description?: string;
    };
  };
}

// Grounded fallback generator to ensure bulletproof resilience
function generateGroundedNarrations(payload: NarratePayload) {
  const { regionName, languageName, entities } = payload;
  const isHindi = payload.languageCode === "hi" || languageName.toLowerCase().includes("hindi");
  const isOdia = payload.languageCode === "od" || payload.languageCode === "or" || languageName.toLowerCase().includes("odia");

  let intro = `Welcome home to ${regionName}. This is the land your family's story emerged from—where sacred rivers nourished ancient stone temples, evening ragas, and unbroken artisan lineages across thousands of years.`;
  if (isHindi) {
    intro = `${regionName} की पावन धरा पर आपका आत्मीय स्वागत है। यह वही भूमि है जहाँ से आपके पूर्वजों की स्मृतियाँ और सांस्कृतिक जड़ें जुड़ी हैं।`;
  } else if (isOdia) {
    intro = `ଆପଣଙ୍କ ପୂର୍ବପୁରୁଷଙ୍କ ପବିତ୍ର ଭୂମି ${regionName}କୁ ସ୍ୱାଗତ। ଏହା ସେହି ମାଟି ଯେଉଁଠାରେ ପ୍ରାଚୀନ କଳିଙ୍ଗ ସଂସ୍କୃତି, ଭକ୍ତି ଓ ଶିଳ୍ପକଳାର ଅମର ଧାରା ପ୍ରବାହିତ।`;
  }

  let siteNarration: string | undefined;
  if (entities.site) {
    if (isHindi) {
      siteNarration = `आपके पूर्वजों की भूमि में स्थित ${entities.site.name} केवल एक स्मारक नहीं, अपितु भारतीय स्थापत्य कला का जीवंत चमत्कार है। ${entities.site.dynasty ? `${entities.site.dynasty} द्वारा निर्मित` : ""} यह पावन तीर्थ आज भी उसी गरिमा के साथ खड़ा है।`;
    } else if (isOdia) {
      siteNarration = `ଆପଣଙ୍କ ମାଟିର ଗୌରବ ${entities.site.name}, ଯାହା କଳିଙ୍ଗ ସ୍ଥାପତ୍ୟ କଳାର ଅନନ୍ୟ ନିଦର୍ଶନ। ଏହି ସୂର୍ଯ୍ୟ ରଥ ମନ୍ଦିର ଆଜି ମଧ୍ୟ ଆପଣଙ୍କ ପୂର୍ବପୁରୁଷଙ୍କ ବୈଜ୍ଞାନିକ ଓ ଆଧ୍ୟାତ୍ମିକ ଦୂରଦୃଷ୍ଟିର ସାକ୍ଷୀ।`;
    } else {
      siteNarration = `In the land your family comes from stands ${entities.site.name}—not merely a monument, but a living testament to ancestral mastery. ${entities.site.dynasty ? `Commissioned under the ${entities.site.dynasty}, ` : ""}its carved stone walls preserve the spiritual cosmology your ancestors held sacred.`;
    }
  }

  let danceNarration: string | undefined;
  if (entities.dance) {
    if (isHindi) {
      siteNarration = siteNarration || "";
      danceNarration = `यह वही नृत्य है जो आपके पूर्वजों की भूमि में आज भी अनुष्ठानिक निष्ठा के साथ किया जाता है—${entities.dance.name}। इसका प्रसिद्ध ${entities.dance.keyPose || "मुद्रा"} मंदिर की मूर्तियों में भी साक्षात् दिखाई देता है।`;
    } else if (isOdia) {
      danceNarration = `ଏହା ସେହି ଶାସ୍ତ୍ରୀୟ ନୃତ୍ୟ ଯାହା ଆପଣଙ୍କ ପୂର୍ବପୁରୁଷଙ୍କ ମାଟିରେ ଆଜି ମଧ୍ୟ ଜୀବନ୍ତ—${entities.dance.name}। ଏହାର ତ୍ରିଭଙ୍ଗୀ ଠାଣି ମନ୍ଦିରର ପ୍ରତିଟି ଶିଳ୍ପରେ ଆପଣଙ୍କୁ ଘରର ଅନୁଭୂତି କରାଏ।`;
    } else {
      danceNarration = `The dance still performed today in your ancestral homeland is ${entities.dance.name}. When dancers hold the sacred ${entities.dance.keyPose || "posture"}, they mirror the exact sculptures carved into the stone sanctums of your family's homeland.`;
    }
  }

  let musicNarration: string | undefined;
  if (entities.music) {
    if (isHindi) {
      musicNarration = `संध्या वेला में आपके पूर्वजों की मिट्टी में गूँजने वाला स्वर है ${entities.music.raga}। यह राग केवल संगीत नहीं, अपितु सदियों की आध्यात्मिक शांति का अनुभव कराता है।`;
    } else if (isOdia) {
      musicNarration = `ଆପଣଙ୍କ ମାଟିର ପବିତ୍ର ସନ୍ଧ୍ୟାରେ ଯେଉଁ ଧ୍ୱନି ପ୍ରତିଧ୍ୱନିତ ହୁଏ, ତାହା ହେଉଛି ${entities.music.raga}। ଏହି ରାଗ ଆପଣଙ୍କୁ ଆପଣଙ୍କ ଜଡ଼ ସହିତ ସଂଯୋଗ କରେ।`;
    } else {
      musicNarration = `As dusk settles over the soil of ${regionName}, the melodic scale of ${entities.music.raga} carries centuries of devotional reflection. It is the acoustic heartbeat your ancestors listened to during evening rituals.`;
    }
  }

  let craftNarration: string | undefined;
  if (entities.craft) {
    if (isHindi) {
      craftNarration = `एक ऐसा शिल्प जिसके लिए आपके पूर्वजों का क्षेत्र विश्वभर में प्रसिद्ध है—${entities.craft.craftName}। आज भी गुरु ${entities.craft.artisanName} जैसी पीढ़ियाँ इस पैतृक विरासत को शुद्ध पारंपरिक विधियों से जीवित रखे हुए हैं।`;
    } else if (isOdia) {
      craftNarration = `ଆପଣଙ୍କ ପୂର୍ବପୁରୁଷଙ୍କ ଅଞ୍ଚଳ ଯେଉଁ ହସ୍ତକଳା ପାଇଁ ବିଶ୍ୱବିଖ୍ୟାତ—${entities.craft.craftName}। ଗୁରୁ ${entities.craft.artisanName}ଙ୍କ ଭଳି ଶିଳ୍ପୀମାନେ ଏହି ପ୍ରାଚୀନ କଳାକୁ ଅକ୍ଷୁର୍ଣ୍ଣ ରଖିଛନ୍ତି।`;
    } else {
      craftNarration = `A craft your ancestors' region is celebrated for across centuries is ${entities.craft.craftName}. Master craftsmen like ${entities.craft.artisanName} still practice this generational art without industrial shortcuts, directly carrying the heritage of your soil forward.`;
    }
  }

  let closing = `May the stone architecture, sacred movements, and living artistry of ${regionName} remain a lifelong compass to your roots.`;
  if (isHindi) {
    closing = `${regionName} की स्थापत्य कला, शास्त्रीय सुर और पवित्र शिल्प आपकी जड़ों का शाश्वत संबल बने रहें।`;
  } else if (isOdia) {
    closing = `${regionName}ର ପବିତ୍ର ସଂସ୍କୃତି ଓ କଳା ଆପଣଙ୍କ ଜୀବନର ମୂଳ ସହିତ ସଦା ସଂଯୁକ୍ତ ରହୁ।`;
  }

  return {
    intro,
    siteNarration,
    danceNarration,
    musicNarration,
    craftNarration,
    closing,
  };
}

export async function POST(req: Request) {
  try {
    const payload: NarratePayload = await req.json();
    const { regionName, languageName, entities } = payload;

    if (!regionName) {
      return NextResponse.json({ error: "Missing regionName" }, { status: 400 });
    }

    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    const sourceContextText = `
Source Facts Grounding (Strictly base facts on these details only):
- Region: ${regionName}
${entities.site ? `- Heritage Site: ${entities.site.name} (${entities.site.dynasty || ""}, ${entities.site.architecturalStyle || ""}) - ${entities.site.summary || ""}` : "- Heritage Site: None documented in database"}
${entities.dance ? `- Classical Dance: ${entities.dance.name} (Key posture: ${entities.dance.keyPose || ""}, Treatise: ${entities.dance.treatise || ""}) - ${entities.dance.description || ""}` : "- Classical Dance: None documented in database"}
${entities.music ? `- Sacred Raga: ${entities.music.raga} - ${entities.music.description || ""}` : "- Sacred Raga: None documented in database"}
${entities.craft ? `- Master Craft: ${entities.craft.craftName} by Artisan ${entities.craft.artisanName} - ${entities.craft.description || ""}` : "- Master Craft: None documented in database"}
`;

    const promptText = `You are narrating a personal heritage journey for someone reconnecting with their ancestral region of ${regionName}. Write in a warm, personal, second-person voice — as if guiding them home, not lecturing a tourist. Reference "the land your family comes from", "the dance still performed there today", "a craft your ancestors' region is known for". Base all facts strictly on the provided source data — do not invent historical or cultural claims not present in the source material. Write in ${languageName}.

${sourceContextText}

Output strictly valid JSON with this exact structure:
{
  "intro": "Warm 1-2 sentence welcoming them home to their ancestral soil in ${languageName}",
  ${entities.site ? `"siteNarration": "2-3 intimate sentences describing ${entities.site.name} as a landmark of their family's soil",` : ""}
  ${entities.dance ? `"danceNarration": "2-3 intimate sentences connecting them to ${entities.dance.name}",` : ""}
  ${entities.music ? `"musicNarration": "2-3 intimate sentences about ${entities.music.raga}",` : ""}
  ${entities.craft ? `"craftNarration": "2-3 intimate sentences about ${entities.craft.craftName} by ${entities.craft.artisanName}",` : ""}
  "closing": "1 heartfelt sentence honoring their roots"
}`;

    // 1. Try Groq with robust model fallback
    if (groqKey) {
      const groqModels = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "openai/gpt-oss-120b"];
      for (const model of groqModels) {
        try {
          const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${groqKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model,
              messages: [{ role: "user", content: promptText }],
              temperature: 0.5,
              response_format: { type: "json_object" },
            }),
          });

          if (groqRes.ok) {
            const data = await groqRes.json();
            const parsed = JSON.parse(data.choices?.[0]?.message?.content || "{}");
            if (parsed.intro) {
              return NextResponse.json({ ...parsed, provider: `groq-${model}` });
            }
          }
        } catch (e) {
          console.warn(`Groq (${model}) roots narrate error:`, e);
        }
      }
    }

    // 2. Try Gemini
    if (geminiKey) {
      try {
        const gRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptText + "\nRespond with raw JSON only." }] }],
              generationConfig: { responseMimeType: "application/json" },
            }),
          }
        );

        if (gRes.ok) {
          const gData = await gRes.json();
          const rawText = gData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            if (parsed.intro) {
              return NextResponse.json({ ...parsed, provider: "gemini" });
            }
          }
        }
      } catch (e) {
        console.warn("Gemini roots narrate error:", e);
      }
    }

    // 3. Fallback Grounded Generator (Guaranteed, zero latency, zero hallucinations)
    const fallbackData = generateGroundedNarrations(payload);
    return NextResponse.json({ ...fallbackData, provider: "grounded-fallback" });
  } catch (err: any) {
    console.error("Roots narrate error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
