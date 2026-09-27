"use client";

import React, { createContext, useContext, useState } from "react";

export type LanguageCode =
  | "en"
  | "hi"
  | "sa"
  | "ta"
  | "te"
  | "bn"
  | "mr"
  | "gu"
  | "kn"
  | "ml"
  | "od"
  | "or"
  | "pa";

export interface LanguageMeta {
  code: LanguageCode;
  name: string;
  englishName: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: "en", name: "English", englishName: "English" },
  { code: "hi", name: "हिन्दी", englishName: "Hindi" },
  { code: "sa", name: "संस्कृतम्", englishName: "Sanskrit" },
  { code: "ta", name: "தமிழ்", englishName: "Tamil" },
  { code: "te", name: "తెలుగు", englishName: "Telugu" },
  { code: "bn", name: "বাংলা", englishName: "Bengali" },
  { code: "mr", name: "मराठी", englishName: "Marathi" },
  { code: "gu", name: "ગુજરાતી", englishName: "Gujarati" },
  { code: "kn", name: "ಕನ್ನಡ", englishName: "Kannada" },
  { code: "ml", name: "മലയാളം", englishName: "Malayalam" },
  { code: "od", name: "ଓଡ଼ିଆ", englishName: "Odia" },
  { code: "pa", name: "ਪੰਜਾਬੀ", englishName: "Punjabi" },
];

export interface Translations {
  brandTitle: string;
  brandTagline: string;
  navDiscover: string;
  navMap: string;
  navMonuments: string;
  navHistory: string;
  navFestivals: string;
  navSangeet: string;
  navNritya: string;
  navBazaar: string;
  tanpuraOn: string;
  tanpuraOff: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroCta: string;
  askAiGuide: string;
  listenNarration: string;
  pauseNarration: string;
  playRaga: string;
  playingMelody: string;
  viewMonument: string;
  allEras: string;
  ancient: string;
  classical: string;
  medieval: string;
  colonial: string;
  modern: string;
  addToBag: string;
  certifiedGiTag: string;
  stateExplorerPrompt: string;
}

const DICTIONARY: Record<string, Translations> = {
  en: {
    brandTitle: "ĀRYĀVARTA",
    brandTagline: "HERITAGE OF BHARAT",
    navDiscover: "Discover",
    navMap: "Bharat Map",
    navMonuments: "Monuments 3D",
    navHistory: "History Atlas",
    navFestivals: "Festivals",
    navSangeet: "Sangeet Studio",
    navNritya: "Nritya Studio",
    navBazaar: "Bazaar",
    tanpuraOn: "Tanpura: On",
    tanpuraOff: "Tanpura: Off",
    heroHeadline: "Experience the Living Heritage of Bharat",
    heroSubheadline: "Immerse yourself in 5,000 years of temple architecture, microtonal ragas, sacred dances, and artisan lineages.",
    heroCta: "Explore 3D Monuments",
    askAiGuide: "Ask Cultural Guide",
    listenNarration: "Listen Audio",
    pauseNarration: "Pause Audio",
    playRaga: "Play Raga Scale",
    playingMelody: "Playing Scale...",
    viewMonument: "Explore 3D Monument",
    allEras: "All Eras",
    ancient: "Ancient",
    classical: "Classical",
    medieval: "Medieval",
    colonial: "Colonial",
    modern: "Modern",
    addToBag: "Add to Bag",
    certifiedGiTag: "GI Tag Certified",
    stateExplorerPrompt: "Select any state to explore its living cultural heritage",
  },
  hi: {
    brandTitle: "आर्यावर्त",
    brandTagline: "भारत की शाश्वत धरोहर",
    navDiscover: "अन्वेषण",
    navMap: "भारत दर्शन",
    navMonuments: "स्थापत्य 3D",
    navHistory: "इतिहास गाथा",
    navFestivals: "त्योहार",
    navSangeet: "संगीत स्टूडियो",
    navNritya: "नृत्य स्टूडियो",
    navBazaar: "शिल्प हाट",
    tanpuraOn: "तानपूरा: चालू",
    tanpuraOff: "तानपूरा: बंद",
    heroHeadline: "भारत की सजीव सांस्कृतिक धरोहर का अनुभव करें",
    heroSubheadline: "५,००० वर्षों के दिव्य मंदिर स्थापत्य, राग संगीत, शास्त्रीय नृत्य और पारम्परिक हस्तशिल्प में लीन हों।",
    heroCta: "3D स्थापत्य देखें",
    askAiGuide: "सांस्कृतिक मार्गदर्शक से पूछें",
    listenNarration: "कथा सुनें",
    pauseNarration: "रोकें",
    playRaga: "राग आरोह-अवरोह सुनें",
    playingMelody: "स्वर वादन हो रहा है...",
    viewMonument: "3D मंदिर देखें",
    allEras: "सभी युग",
    ancient: "प्राचीन काल",
    classical: "स्वर्ण काल",
    medieval: "मध्यकाल",
    colonial: "औपनिवेशिक",
    modern: "आधुनिक",
    addToBag: "झोली में जोड़ें",
    certifiedGiTag: "जी.आई. टैग प्रमाणित",
    stateExplorerPrompt: "किसी भी राज्य को चुनकर उसकी सांस्कृतिक धरोहर जानें",
  },
  sa: {
    brandTitle: "आर्यावर्तम्",
    brandTagline: "भारतस्य शाश्वती संस्कृतिः",
    navDiscover: "अन्वेषणम्",
    navMap: "राज्य दर्शनम्",
    navMonuments: "स्थापत्यम् 3D",
    navHistory: "इतिहासः",
    navFestivals: "उत्सवाः",
    navSangeet: "सङ्गीतम्",
    navNritya: "नृत्यम्",
    navBazaar: "आपणः",
    tanpuraOn: "तानपुरा: सञ्चालितम्",
    tanpuraOff: "तानपुरा: विरमितम्",
    heroHeadline: "भारतस्य जीवन्तपरम्परायाः साक्षात्कुरुत",
    heroSubheadline: "पञ्चसहस्रवर्षाणां मन्दिरशिल्पं, सूक्ष्मस्वराः, शास्त्रीयनृत्यं तथा हस्तशिल्पपरम्परा साक्षात्कुरुत।",
    heroCta: "3D मन्दिराणि पश्यन्तु",
    askAiGuide: "विद्वांसं पृच्छतु",
    listenNarration: "कथां शृणोतु",
    pauseNarration: "विरम्यताम्",
    playRaga: "रागस्वरान् वादयतु",
    playingMelody: "स्वरवादनं प्रचलति...",
    viewMonument: "3D स्थापत्यं प्रविशतु",
    allEras: "सर्वे युगाः",
    ancient: "वैदिक-पुरातनकालः",
    classical: "शास्त्रीयकालः",
    medieval: "मध्ययुगः",
    colonial: "आङ्गलकालः",
    modern: "आधुनिकभारतम्",
    addToBag: "स्यूते योजयतु",
    certifiedGiTag: "प्रमाणितहस्तशिल्पम्",
    stateExplorerPrompt: "राज्यं चित्वा तस्य सांस्कृतिकवैभवं पश्यन्तु",
  },
  ta: {
    brandTitle: "ஆர்யாவர்த்தா",
    brandTagline: "பாரதத்தின் பாரம்பரியம்",
    navDiscover: "கண்டறியவும்",
    navMap: "பாரத வரைபடம்",
    navMonuments: "கோயில்கள் 3D",
    navHistory: "வரலாறு",
    navFestivals: "திருவிழாக்கள்",
    navSangeet: "சங்கீத கூடம்",
    navNritya: "நாட்டிய கூடம்",
    navBazaar: "கைவினை அங்காடி",
    tanpuraOn: "தம்பூரா: ஆன்",
    tanpuraOff: "தம்பூரா: ஆஃப்",
    heroHeadline: "பாரதத்தின் உயிருள்ள பாரம்பரியத்தை அனுபவியுங்கள்",
    heroSubheadline: "5,000 ஆண்டுகால கோயில் கட்டிடக்கலை, ராகங்கள், நாட்டியம் மற்றும் கைவினைஞர்களின் பெருமைகளை உணருங்கள்.",
    heroCta: "3D கோயில்களை காண்க",
    askAiGuide: "கலாச்சார வழிகாட்டியிடம் கேளுங்கள்",
    listenNarration: "குரல் வழியே கேளுங்கள்",
    pauseNarration: "நிறுத்துக",
    playRaga: "ராக ஸ்வரங்களை இசைக்க",
    playingMelody: "ராகம் ஒலிக்கிறது...",
    viewMonument: "3D கோயிலை காண்க",
    allEras: "அனைத்து யுகங்கள்",
    ancient: "பண்டைய காலம்",
    classical: "செம்மொழி காலம்",
    medieval: "இடைக்காலம்",
    colonial: "ஆதிக்க காலம்",
    modern: "நவீன காலம்",
    addToBag: "பையில் சேர்க்கவும்",
    certifiedGiTag: "ஜி.ஐ. சான்றளிக்கப்பட்டது",
    stateExplorerPrompt: "பாரம்பரியத்தை அறிய மாநிலத்தை தேர்ந்தெடுக்கவும்",
  },
  te: {
    brandTitle: "ఆర్యావర్త",
    brandTagline: "భారతీయ సజీవ సంస్కృతి",
    navDiscover: "అన్వేషణ",
    navMap: "భారత దర్శిని",
    navMonuments: "శిల్పకళ 3D",
    navHistory: "చరిత్ర",
    navFestivals: "పండుగలు",
    navSangeet: "సంగీత వేదిక",
    navNritya: "నృత్య వేదిక",
    navBazaar: "శిల్ప విపణి",
    tanpuraOn: "తంబుర: ఆన్",
    tanpuraOff: "తంబుర: ఆఫ్",
    heroHeadline: "భారతదేశ సజీవ వైభవాన్ని అనుభవించండి",
    heroSubheadline: "5,000 ఏళ్ల ఆలయ వాస్తుశిల్పం, రాగ సంగీతం, శాస్త్రీయ నృత్యం మరియు హస్తకళల వైభవం.",
    heroCta: "3D ఆలయాలు వీక్షించండి",
    askAiGuide: "సాంస్కృతిక మార్గదర్శిని అడగండి",
    listenNarration: "వివరాలు వినండి",
    pauseNarration: "ఆపండి",
    playRaga: "రాగ స్వరాలు వినండి",
    playingMelody: "స్వరాలు పలికిస్తున్నాయి...",
    viewMonument: "3D ఆలయం చూడండి",
    allEras: "అన్ని యుగాలు",
    ancient: "ప్రాచీన యుగం",
    classical: "స్వర్ణ యుగం",
    medieval: "మధ్య యుగం",
    colonial: "వలస కాలం",
    modern: "ఆధునిక యుగం",
    addToBag: "సంచిలో చేర్చండి",
    certifiedGiTag: "జి.ఐ. ట్యాగ్ గుర్తింపు",
    stateExplorerPrompt: "సంస్కృతిని తెలుసుకోవడానికి రాష్ట్రాన్ని ఎంచుకోండి",
  },
  bn: {
    brandTitle: "আর্যাবর্ত",
    brandTagline: "ভারতের শাশ্বত ঐতিহ্য",
    navDiscover: "অন্বেষণ",
    navMap: "ভারত দর্শন",
    navMonuments: "স্থাপত্য 3D",
    navHistory: "ইতিহাস কথা",
    navFestivals: "উৎসব",
    navSangeet: "সঙ্গীত স্টুডিও",
    navNritya: "নৃত্য স্টুডিও",
    navBazaar: "শিল্প হাট",
    tanpuraOn: "তানপুরা: চালু",
    tanpuraOff: "তানপুরা: বন্ধ",
    heroHeadline: "ভারতের জীবন্ত সংস্কৃতির অভিজ্ঞতা নিন",
    heroSubheadline: "৫,০০০ বছরের মন্দির স্থাপত্য, শাস্ত্রীয় রাগ, নৃত্য এবং কারুশিল্পের ঐতিহ্য প্রত্যক্ষ করুন।",
    heroCta: "3D স্থাপত্য দেখুন",
    askAiGuide: "সাংস্কৃতিক গাইডকে জিজ্ঞাসা করুন",
    listenNarration: "বিবরণ শুনুন",
    pauseNarration: "থামান",
    playRaga: "রাগ স্বর শুনুন",
    playingMelody: "সুর বাজছে...",
    viewMonument: "3D মন্দির দেখুন",
    allEras: "সকল যুগ",
    ancient: "প্রাচীন যুগ",
    classical: "স্বর্ণ যুগ",
    medieval: "মধ্যযুগ",
    colonial: "ঔপনিবেশিক",
    modern: "আধুনিক",
    addToBag: "ব্যাগে যোগ করুন",
    certifiedGiTag: "জি.আই. ট্যাগ প্রত্যয়িত",
    stateExplorerPrompt: "ঐতিহ্য জানতে রাজ্য নির্বাচন করুন",
  },
  mr: {
    brandTitle: "आर्यावर्त",
    brandTagline: "भारताचा शाश्वत वारसा",
    navDiscover: "शोध",
    navMap: "भारत दर्शन",
    navMonuments: "वास्तुकला 3D",
    navHistory: "इतिहास गाथा",
    navFestivals: "उत्सव",
    navSangeet: "संगीत दालन",
    navNritya: "नृत्य दालन",
    navBazaar: "शिल्प बाजार",
    tanpuraOn: "तानपुरा: सुरू",
    tanpuraOff: "तानपुरा: बंद",
    heroHeadline: "भारताच्या सजीव सांस्कृतिक वारशाचा अनुभव घ्या",
    heroSubheadline: "५,००० वर्षांचे मंदिर स्थापत्य, राग संगीत, शास्त्रीय नृत्य आणि पारंपारिक हस्तकला अनुभवा.",
    heroCta: "3D मंदिरे पहा",
    askAiGuide: "सांस्कृतिक मार्गदर्शकाला विचारा",
    listenNarration: "माहिती ऐका",
    pauseNarration: "थांबवा",
    playRaga: "राग स्वर ऐका",
    playingMelody: "सूर वाजत आहेत...",
    viewMonument: "3D मंदिर पहा",
    allEras: "सर्व युग",
    ancient: "प्राचीन काळ",
    classical: "सुवर्ण काळ",
    medieval: "मध्ययुग",
    colonial: "ब्रिटिश काळ",
    modern: "आधुनिक",
    addToBag: "पिशवीत टाका",
    certifiedGiTag: "जी.आय. टॅग प्रमाणित",
    stateExplorerPrompt: "संस्कृती जाणून घेण्यासाठी राज्य निवडा",
  },
  gu: {
    brandTitle: "આર્યાવર્ત",
    brandTagline: "ભારતનો શાશ્વત વારસો",
    navDiscover: "અન્વેષણ",
    navMap: "ભારત દર્શન",
    navMonuments: "સ્થાપત્ય 3D",
    navHistory: "ઇતિહાસ ગાથા",
    navFestivals: "તહેવારો",
    navSangeet: "સંગીત સ્ટુડિયો",
    navNritya: "નૃત્ય સ્ટુડિયો",
    navBazaar: "શિલ્પ હાટ",
    tanpuraOn: "તાનપુરો: ચાલુ",
    tanpuraOff: "તાનપુરો: બંધ",
    heroHeadline: "ભારતના જીવંત સાંસ્કૃતિક વારસાનો અનુભવ કરો",
    heroSubheadline: "૫,૦૦૦ વર્ષનું મંદિર સ્થાપત્ય, રાગ સંગીત, શાસ્ત્રીય નૃત્ય અને પરંપરાગત હસ્તકળા માણો.",
    heroCta: "3D સ્થાપત્ય જુઓ",
    askAiGuide: "સાંસ્કૃતિક માર્ગદર્શકને પૂછો",
    listenNarration: "વાર્તા સાંભળો",
    pauseNarration: "અટકાવો",
    playRaga: "રાગ સ્વર સાંભળો",
    playingMelody: "સૂર વાગી રહ્યા છે...",
    viewMonument: "3D મંદિર જુઓ",
    allEras: "તમામ યુગો",
    ancient: "પ્રાચીન કાળ",
    classical: "સુવર્ણ કાળ",
    medieval: "મધ્યકાળ",
    colonial: "અંગ્રેજી શાસન",
    modern: "આધુનિક",
    addToBag: "થેલીમાં ઉમેરો",
    certifiedGiTag: "જી.આઈ. ટેગ પ્રમાણિત",
    stateExplorerPrompt: "સંસ્કૃતિ જાણવા માટે રાજ્ય પસંદ કરો",
  },
  kn: {
    brandTitle: "ಆರ್ಯಾವರ್ತ",
    brandTagline: "ಭಾರತದ ಶಾಶ್ವತ ಪರಂಪರೆ",
    navDiscover: "ಅನ್ವೇಷಣೆ",
    navMap: "ಭಾರತ ದರ್ಶನ",
    navMonuments: "ಶಿಲ್ಪಕಲೆ 3D",
    navHistory: "ಇತಿಹಾಸ",
    navFestivals: "ಹಬ್ಬಗಳು",
    navSangeet: "ಸಂಗೀತ ಶಾಲೆ",
    navNritya: "ನೃತ್ಯ ಶಾಲೆ",
    navBazaar: "ಕರಕುಶಲ ಮಾರುಕಟ್ಟೆ",
    tanpuraOn: "ತಂಬೂರಿ: ಆನ್",
    tanpuraOff: "ತಂಬೂರಿ: ಆಫ್",
    heroHeadline: "ಭಾರತದ ಜೀವಂತ ಪರಂಪರೆಯನ್ನು ಅನುಭವಿಸಿ",
    heroSubheadline: "೫,೦೦೦ ವರ್ಷಗಳ ದೇವಾಲಯ ವಾಸ್ತುಶಿಲ್ಪ, ರಾಗ ಸಂಗೀತ, ಶಾಸ್ತ್ರೀಯ ನೃತ್ಯ ಮತ್ತು ಕರಕುಶಲ ವೈಭವ.",
    heroCta: "3D ಸ್ಮಾರಕ ವೀಕ್ಷಿಸಿ",
    askAiGuide: "ಸಾಂಸ್ಕೃತಿಕ ಮಾರ್ಗದರ್ಶಿಗೆ ಕೇಳಿ",
    listenNarration: "ವಿವರಣೆ ಆಲಿಸಿ",
    pauseNarration: "ನಿಲ್ಲಿಸಿ",
    playRaga: "ರಾಗ ಸ್ವರ ಆಲಿಸಿ",
    playingMelody: "ಸ್ವರ ಮೊಳಗುತ್ತಿದೆ...",
    viewMonument: "3D ದೇವಾಲಯ ವೀಕ್ಷಿಸಿ",
    allEras: "ಎಲ್ಲಾ ಯುಗಗಳು",
    ancient: "ಪ್ರಾಚೀನ ಯುಗ",
    classical: "ಸುವರ್ಣ ಯುಗ",
    medieval: "ಮಧ್ಯಕಾಲೀನ",
    colonial: "ವಸಾಹತುಶಾಹಿ",
    modern: "ಆಧುನಿಕ",
    addToBag: "ಚೀಲಕ್ಕೆ ಸೇರಿಸಿ",
    certifiedGiTag: "ಜಿ.ಐ. ಟ್ಯಾಗ್ ಮಾನ್ಯತೆ",
    stateExplorerPrompt: "ಸಂಸ್ಕೃತಿ ತಿಳಿಯಲು ರಾಜ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
  },
  ml: {
    brandTitle: "ആര്യാവർത്തം",
    brandTagline: "ഭാരതത്തിന്റെ സനാതന പൈതൃകം",
    navDiscover: "അന്വേഷണം",
    navMap: "ഭാരത ദർശനം",
    navMonuments: "ശില്പകല 3D",
    navHistory: "ചരിത്രം",
    navFestivals: "ഉത്സവങ്ങൾ",
    navSangeet: "സംഗീത ശാല",
    navNritya: "നൃത്ത ശാല",
    navBazaar: "കരകൗശല വിപണി",
    tanpuraOn: "തമ്പുരു: ഓൺ",
    tanpuraOff: "തമ്പുരു: ഓഫ്",
    heroHeadline: "ഭാരതത്തിന്റെ സജീവ പൈതൃകം അനുഭവിക്കൂ",
    heroSubheadline: "5,000 വർഷത്തെ ക്ഷേത്ര വാസ്തുവിദ്യ, രാഗങ്ങൾ, ശാസ്ത്രീയ നൃത്തം, പരമ്പരാഗത കരകൗശലങ്ങൾ.",
    heroCta: "3D ക്ഷേത്രങ്ങൾ കാണുക",
    askAiGuide: "സാംസ്കാരിക മാർഗ്ഗദർശിയോട് ചോദിക്കുക",
    listenNarration: "വിവരണം കേൾക്കുക",
    pauseNarration: "നിർത്തുക",
    playRaga: "രാഗ സ്വരം കേൾക്കുക",
    playingMelody: "സ്വരം ഒഴുകുന്നു...",
    viewMonument: "3D ക്ഷേത്രം കാണുക",
    allEras: "എല്ലാ യുഗങ്ങളും",
    ancient: "പ്രാചീന യുഗം",
    classical: "സുവർണ്ണ യുഗം",
    medieval: "മധ്യകാലം",
    colonial: "കൊളോണിയൽ",
    modern: "ആധുനികം",
    addToBag: "സഞ്ചിയിൽ ചേർക്കുക",
    certifiedGiTag: "ജി.ഐ. ടാഗ് സാക്ഷ്യപ്പെടുത്തിയത്",
    stateExplorerPrompt: "പൈതൃകം അറിയാൻ സംസ്ഥാനം തിരഞ്ഞെടുക്കുക",
  },
  od: {
    brandTitle: "ଆର୍ଯ୍ୟାବର୍ତ୍ତ",
    brandTagline: "ଭାରତର ଐତିହ୍ୟ ଓ ସଂସ୍କୃତି",
    navDiscover: "ଅନ୍ୱେଷଣ",
    navMap: "ଭାରତ ଦର୍ଶନ",
    navMonuments: "ସ୍ଥାପତ୍ୟ 3D",
    navHistory: "ଇତିହାସ",
    navFestivals: "ପର୍ବପର୍ବାଣି",
    navSangeet: "ସଙ୍ଗୀତ ଷ୍ଟୁଡିଓ",
    navNritya: "ନୃତ୍ୟ ଷ୍ଟୁଡିଓ",
    navBazaar: "ହାଟ",
    tanpuraOn: "ତାନପୁରା: ଚାଲୁ",
    tanpuraOff: "ତାନପୁରା: ବନ୍ଦ",
    heroHeadline: "ଭାରତର ଜୀବନ୍ତ ସଂସ୍କୃତିକୁ ଅନୁଭବ କରନ୍ତୁ",
    heroSubheadline: "୫,୦୦୦ ବର୍ଷର କଳିଙ୍ଗ ମନ୍ଦିର ଶିଳ୍ପ, ଶାସ୍ତ୍ରୀୟ ରାଗ, ଓଡ଼ିଶୀ ନୃତ୍ୟ ଏବଂ ପଟ୍ଟଚିତ୍ର ପରମ୍ପରାକୁ ଅନୁଭବ କରନ୍ତୁ।",
    heroCta: "3D ମନ୍ଦିର ଦେଖନ୍ତୁ",
    askAiGuide: "ସାଂସ୍କୃତିକ ଗାଇଡଙ୍କୁ ପଚାରନ୍ତୁ",
    listenNarration: "ବିବରଣୀ ଶୁଣନ୍ତୁ",
    pauseNarration: "ବନ୍ଦ କରନ୍ତୁ",
    playRaga: "ରାଗ ସ୍ୱର ବଜାନ୍ତୁ",
    playingMelody: "ରାଗ ବାଜୁଅଛି...",
    viewMonument: "3D ମନ୍ଦିର ପ୍ରବେଶ କରନ୍ତୁ",
    allEras: "ସମସ୍ତ ଯୁଗ",
    ancient: "ପ୍ରାଚୀନ କାଳ",
    classical: "ଶାସ୍ତ୍ରୀୟ ଯୁଗ",
    medieval: "ମଧ୍ୟଯୁଗ",
    colonial: "ଔପନିବେଶିକ",
    modern: "ଆଧୁନିକ",
    addToBag: "କିଣନ୍ତୁ",
    certifiedGiTag: "ଜି.ଆଇ. ପ୍ରମାଣିତ",
    stateExplorerPrompt: "ସଂସ୍କୃତି ଜାଣିବା ପାଇଁ ରାଜ୍ୟ ଚୟନ କରନ୍ତୁ",
  },
  pa: {
    brandTitle: "ਆਰਿਆਵਰਤ",
    brandTagline: "ਭਾਰਤ ਦੀ ਸ਼ਾਨਦਾਰ ਵਿਰਾਸਤ",
    navDiscover: "ਖੋਜ",
    navMap: "ਭਾਰਤ ਦਰਸ਼ਨ",
    navMonuments: "ਸਥਾਪਤ 3D",
    navHistory: "ਇਤਿਹਾਸ ਗਾਥਾ",
    navFestivals: "ਤਿਉਹਾਰ",
    navSangeet: "ਸੰਗੀਤ ਸਟੂਡੀਓ",
    navNritya: "ਨ੍ਰਿਤ ਸਟੂਡੀਓ",
    navBazaar: "ਸ਼ਿਲਪ ਹਾਟ",
    tanpuraOn: "ਤਾਨਪੁਰਾ: ਚਾਲੂ",
    tanpuraOff: "ਤਾਨਪੁਰਾ: ਬੰਦ",
    heroHeadline: "ਭਾਰਤ ਦੀ ਜੀਵੰਤ ਸੱਭਿਆਚਾਰਕ ਵਿਰਾਸਤ ਦਾ ਅਨੁਭਵ ਕਰੋ",
    heroSubheadline: "੫,੦੦੦ ਸਾਲਾਂ ਦੇ ਮੰਦਿਰ ਨਿਰਮਾਣ, ਸ਼ਾਸਤਰੀ ਰਾਗ, ਲੋਕ ਨਾਚ ਅਤੇ ਰਵਾਇਤੀ ਦਸਤਕਾਰੀ ਵਿੱਚ ਲੀਨ ਹੋਵੋ।",
    heroCta: "3D ਮੰਦਿਰ ਦੇਖੋ",
    askAiGuide: "ਸੱਭਿਆਚਾਰਕ ਗਾਈਡ ਤੋਂ ਪੁੱਛੋ",
    listenNarration: "ਕਥਾ ਸੁਣੋ",
    pauseNarration: "ਰੋਕੋ",
    playRaga: "ਰਾਗ ਸੁਰ ਸੁਣੋ",
    playingMelody: "ਸੁਰ ਗੂੰਜ ਰਹੇ ਹਨ...",
    viewMonument: "3D ਮੰਦਿਰ ਦੇਖੋ",
    allEras: "ਸਾਰੇ ਯੁੱਗ",
    ancient: "ਪ੍ਰਾਚੀਨ ਕਾਲ",
    classical: "ਸੁਨਹਿਰੀ ਕਾਲ",
    medieval: "ਮੱਧ ਕਾਲ",
    colonial: "ਬਸਤੀਵਾਦੀ ਦੌਰ",
    modern: "ਆਧੁਨਿਕ",
    addToBag: "ਝੋਲੇ ਵਿੱਚ ਪਾਓ",
    certifiedGiTag: "ਜੀ.ਆਈ. ਟੈਗ ਪ੍ਰਮਾਣਿਤ",
    stateExplorerPrompt: "ਸੱਭਿਆਚਾਰ ਜਾਣਨ ਲਈ ਰਾਜ ਚੁਣੋ",
  },
};

// Alias 'or' to 'od' for backward compatibility
DICTIONARY.or = DICTIONARY.od;

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: Translations;
  languages: LanguageMeta[];
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: DICTIONARY.en,
  languages: SUPPORTED_LANGUAGES,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<LanguageCode>("en");

  const effectiveLangKey = language === "or" ? "od" : language;
  const t = DICTIONARY[effectiveLangKey] || DICTIONARY.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
