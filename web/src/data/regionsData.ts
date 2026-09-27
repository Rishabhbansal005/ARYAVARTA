export interface RegionCulturalData {
  id: string;
  name: string;
  nativeName: string;
  aliases: string[];
  zone: "North" | "South" | "East" | "West" | "Central" | "Northeast";
  coverage: "rich" | "in_development";
  historicalNames?: string[];
  capital?: string;
  signatureTraditions?: string[];
}

export const ALL_INDIAN_REGIONS: RegionCulturalData[] = [
  {
    id: "odisha",
    name: "Odisha",
    nativeName: "ଓଡ଼ିଶା",
    aliases: [
      "odisha",
      "orissa",
      "orisa",
      "odisa",
      "kalinga",
      "utkal",
      "utkala",
      "puri",
      "bhubaneswar",
      "cuttack",
      "sambalpur",
      "konark"
    ],
    historicalNames: ["Kalinga", "Utkala", "Udra"],
    zone: "East",
    coverage: "rich",
    capital: "Bhubaneswar",
    signatureTraditions: ["Odissi Classical Dance", "Konark Sun Temple", "Pattachitra Palm Leaf Art", "Ratha Yatra"]
  },
  {
    id: "west-bengal",
    name: "West Bengal",
    nativeName: "বাংলা",
    aliases: [
      "bengal",
      "west bengal",
      "bangla",
      "bengali",
      "kolkata",
      "calcutta",
      "paschim banga",
      "bishnupur",
      "santiniketan",
      "darjeeling",
      "hooghly"
    ],
    historicalNames: ["Vanga", "Gauda", "Pundravardhana"],
    zone: "East",
    coverage: "rich",
    capital: "Kolkata",
    signatureTraditions: ["Durga Puja", "Bishnupur Terracotta Temples", "Kantha Embroidery", "Gaudiya Nritya"]
  },
  {
    id: "tamil-nadu",
    name: "Tamil Nadu",
    nativeName: "தமிழ்நாடு",
    aliases: [
      "tamil nadu",
      "tamil",
      "tamilnadu",
      "madras",
      "tamizh",
      "chennai",
      "chola",
      "pandya",
      "pallava",
      "thanjavur",
      "madurai",
      "kanchipuram",
      "rameswaram"
    ],
    historicalNames: ["Tamilakam", "Chola Mandalam", "Pandya Nadu"],
    zone: "South",
    coverage: "rich",
    capital: "Chennai",
    signatureTraditions: ["Bharatanatyam", "Brihadisvara Temple", "Kanchipuram Silk", "Carnatic Music"]
  },
  {
    id: "karnataka",
    name: "Karnataka",
    nativeName: "ಕರ್ನಾಟಕ",
    aliases: [
      "karnataka",
      "karnatak",
      "mysore",
      "mysuru",
      "bengaluru",
      "bangalore",
      "kannada",
      "vijayanagara",
      "hampi",
      "canara",
      "belur",
      "halebidu"
    ],
    historicalNames: ["Carnatic", "Vijayanagara Empire", "Mysore Kingdom"],
    zone: "South",
    coverage: "rich",
    capital: "Bengaluru",
    signatureTraditions: ["Yakshagana", "Hampi Virupaksha Temple", "Bidriware Inlay", "Channapatna Toys"]
  },
  {
    id: "maharashtra",
    name: "Maharashtra",
    nativeName: "महाराष्ट्र",
    aliases: [
      "maharashtra",
      "marathi",
      "bombay",
      "mumbai",
      "pune",
      "vidarbha",
      "marathwada",
      "konkan",
      "raigad",
      "ellora",
      "ajanta"
    ],
    historicalNames: ["Dandakaranya", "Maratha Swarajya"],
    zone: "West",
    coverage: "rich",
    capital: "Mumbai",
    signatureTraditions: ["Ajanta & Ellora Kailasa", "Lavani Dance", "Warli Art", "Ganesh Chaturthi"]
  },
  {
    id: "rajasthan",
    name: "Rajasthan",
    nativeName: "राजस्थान",
    aliases: [
      "rajasthan",
      "marwar",
      "mewar",
      "rajputana",
      "jaipur",
      "jodhpur",
      "udaipur",
      "chittor",
      "chittorgarh",
      "shekhawati",
      "bikaner",
      "thar",
      "rajasthani"
    ],
    historicalNames: ["Rajputana", "Matsya", "Gurjaratra"],
    zone: "North",
    coverage: "rich",
    capital: "Jaipur",
    signatureTraditions: ["Ghoomar Dance", "Amer & Mehrangarh Forts", "Blue Pottery", "Manganiyar Sangeet"]
  },
  {
    id: "uttar-pradesh",
    name: "Uttar Pradesh",
    nativeName: "उत्तर प्रदेश",
    aliases: [
      "uttar pradesh",
      "up",
      "awadh",
      "oudh",
      "varanasi",
      "kashi",
      "banaras",
      "benares",
      "lucknow",
      "ayodhya",
      "mathura",
      "vrindavan",
      "braj",
      "agra",
      "prayagraj",
      "allahabad"
    ],
    historicalNames: ["Kosala", "Kashi", "Braj Bhoomi", "Awadh"],
    zone: "North",
    coverage: "rich",
    capital: "Lucknow",
    signatureTraditions: ["Kathak Dance", "Kashi Vishwanath & Ganga Ghats", "Banarasi Silk", "Awadhi Lore"]
  },
  {
    id: "kerala",
    name: "Kerala",
    nativeName: "കേരളം",
    aliases: [
      "kerala",
      "malabar",
      "travancore",
      "cochin",
      "kochi",
      "thiruvananthapuram",
      "trivandrum",
      "malayalam",
      "malayali",
      "keralam",
      "wayanad"
    ],
    historicalNames: ["Chera Kingdom", "Venad", "Malabar"],
    zone: "South",
    coverage: "rich",
    capital: "Thiruvananthapuram",
    signatureTraditions: ["Kathakali", "Koodiyattam", "Sree Padmanabhaswamy", "Aranmula Metal Mirror"]
  },
  {
    id: "gujarat",
    name: "Gujarat",
    nativeName: "ગુજરાત",
    aliases: [
      "gujarat",
      "gujrat",
      "saurashtra",
      "kutch",
      "kathiawar",
      "ahmedabad",
      "surat",
      "vadodara",
      "baroda",
      "dwarka",
      "somnath",
      "lothal"
    ],
    historicalNames: ["Anarta", "Surashtra", "Lata"],
    zone: "West",
    coverage: "rich",
    capital: "Gandhinagar",
    signatureTraditions: ["Garba & Dandiya", "Modhera Sun Temple", "Patan Patola", "Rann of Kutch Art"]
  },
  {
    id: "punjab",
    name: "Punjab",
    nativeName: "ਪੰਜਾਬ",
    aliases: [
      "punjab",
      "panjab",
      "punjabi",
      "amritsar",
      "malwa",
      "majha",
      "doaba",
      "jalandhar",
      "ludhiana",
      "patiala"
    ],
    historicalNames: ["Panchanada", "Sapta Sindhu"],
    zone: "North",
    coverage: "rich",
    capital: "Chandigarh",
    signatureTraditions: ["Bhangra & Giddha", "Golden Temple (Sri Harmandir Sahib)", "Phulkari Embroidery", "Baisakhi"]
  },
  {
    id: "assam",
    name: "Assam",
    nativeName: "অসম",
    aliases: [
      "assam",
      "asom",
      "axom",
      "kamarupa",
      "ahom",
      "guwahati",
      "brahmaputra",
      "assamese",
      "majuli",
      "sivasagar"
    ],
    historicalNames: ["Pragjyotisha", "Kamarupa", "Ahom Kingdom"],
    zone: "Northeast",
    coverage: "rich",
    capital: "Dispur",
    signatureTraditions: ["Sattriya Classical Dance", "Bihu Festival", "Kamakhya Temple", "Golden Muga Silk"]
  },
  {
    id: "madhya-pradesh",
    name: "Madhya Pradesh",
    nativeName: "मध्य प्रदेश",
    aliases: [
      "madhya pradesh",
      "mp",
      "malwa",
      "bundelkhand",
      "gwalior",
      "bhopal",
      "indore",
      "ujjain",
      "khajuraho",
      "sanchi"
    ],
    historicalNames: ["Avanti", "Malwa", "Chedi"],
    zone: "Central",
    coverage: "rich",
    capital: "Bhopal",
    signatureTraditions: ["Khajuraho Temples", "Sanchi Stupa", "Chanderi Weaving", "Gond Tribal Art"]
  },
  // In-Development Regional Entries (Gracefully Handled)
  {
    id: "bihar",
    name: "Bihar",
    nativeName: "बिहार",
    aliases: ["bihar", "magadh", "magadha", "mithila", "bhojpur", "patna", "nalanda", "rajgir", "vaishali", "bodhgaya", "bihari"],
    historicalNames: ["Magadha", "Mithila", "Anga"],
    zone: "East",
    coverage: "in_development",
    capital: "Patna",
    signatureTraditions: ["Madhubani Painting", "Nalanda Mahavihara", "Chhath Puja", "Bhojpuri Folk"]
  },
  {
    id: "andhra-pradesh",
    name: "Andhra Pradesh",
    nativeName: "ఆంధ్రప్రదేశ్",
    aliases: ["andhra pradesh", "andhra", "seemandhra", "rayalaseema", "vijayawada", "visakhapatnam", "tirupati", "amaravati", "telugu"],
    historicalNames: ["Andhra Bhritya", "Satavahana"],
    zone: "South",
    coverage: "in_development",
    capital: "Amaravati",
    signatureTraditions: ["Kuchipudi Classical Dance", "Tirumala Tirupati", "Kalamkari Art", "Lepakshi Architecture"]
  },
  {
    id: "telangana",
    name: "Telangana",
    nativeName: "తెలంగాణ",
    aliases: ["telangana", "hyderabad", "nizam", "warangal", "golconda", "secunderabad", "kakatiya"],
    historicalNames: ["Kakatiya Realm", "Trilinga Desa"],
    zone: "South",
    coverage: "in_development",
    capital: "Hyderabad",
    signatureTraditions: ["Perini Sivatandavam", "Ramappa Temple", "Pochampally Ikat", "Bathukamma"]
  },
  {
    id: "kashmir",
    name: "Jammu & Kashmir",
    nativeName: "जम्मू और कश्मीर",
    aliases: ["kashmir", "jammu", "jammu and kashmir", "j&k", "srinagar", "kashmiri", "ladakh"],
    historicalNames: ["Sharada Peeth", "Kashyapa Mir"],
    zone: "North",
    coverage: "in_development",
    capital: "Srinagar / Jammu",
    signatureTraditions: ["Sufiana Kalam", "Pashmina Shawl Weaving", "Martand Sun Temple", "Paper Mâché"]
  },
  {
    id: "himachal-pradesh",
    name: "Himachal Pradesh",
    nativeName: "हिमाचल प्रदेश",
    aliases: ["himachal pradesh", "himachal", "kangra", "kullu", "manali", "shimla", "chamba", "pahari"],
    historicalNames: ["Dev Bhumi", "Trigarta"],
    zone: "North",
    coverage: "in_development",
    capital: "Shimla",
    signatureTraditions: ["Kangra Miniature Painting", "Nati Folk Dance", "Kullu Dussehra", "Pahari Architecture"]
  },
  {
    id: "uttarakhand",
    name: "Uttarakhand",
    nativeName: "उत्तराखंड",
    aliases: ["uttarakhand", "uttaranchal", "garhwal", "kumaon", "dehradun", "haridwar", "rishikesh", "kedarnath", "badrinath"],
    historicalNames: ["Kedarkhand", "Manaskhand", "Devbhoomi"],
    zone: "North",
    coverage: "in_development",
    capital: "Dehradun",
    signatureTraditions: ["Ganga Aarti at Haridwar", "Aipan Folk Art", "Char Dham Himalayan Shrines", "Jhora Dance"]
  },
  {
    id: "goa",
    name: "Goa",
    nativeName: "गोंय",
    aliases: ["goa", "konkan", "panaji", "panjim", "margao", "goan"],
    historicalNames: ["Gomantak", "Govapuri"],
    zone: "West",
    coverage: "in_development",
    capital: "Panaji",
    signatureTraditions: ["Shigmo Festival", "Fugdi Dance", "Basilica of Bom Jesus", "Azulejos Ceramic Tiles"]
  },
  {
    id: "jharkhand",
    name: "Jharkhand",
    nativeName: "झारखंड",
    aliases: ["jharkhand", "chotanagpur", "ranchi", "santhal", "jamshedpur", "deoghar"],
    historicalNames: ["Chhota Nagpur", "Kukra"],
    zone: "East",
    coverage: "in_development",
    capital: "Ranchi",
    signatureTraditions: ["Sohrai & Khovar Painting", "Sarhul Festival", "Baidyanath Temple", "Jhumair Dance"]
  },
  {
    id: "chhattisgarh",
    name: "Chhattisgarh",
    nativeName: "छत्तीसगढ़",
    aliases: ["chhattisgarh", "chattisgarh", "bastar", "raipur", "bilaspur", "dantewada"],
    historicalNames: ["Dakshina Kosala"],
    zone: "Central",
    coverage: "in_development",
    capital: "Raipur",
    signatureTraditions: ["Bastar Dhokra Bell Metal", "Panthi Dance", "Bastar Dussehra", "Sirpur Temples"]
  },
  {
    id: "haryana",
    name: "Haryana",
    nativeName: "हरियाणा",
    aliases: ["haryana", "kurukshetra", "panipat", "rohtak", "gurugram", "gurgaon"],
    historicalNames: ["Kurukshetra", "Brahmavarta"],
    zone: "North",
    coverage: "in_development",
    capital: "Chandigarh",
    signatureTraditions: ["Gita Jayanti", "Phag Dance", "Surajkund Crafts Mela", "Swang Folk Theatre"]
  },
  {
    id: "delhi",
    name: "Delhi",
    nativeName: "दिल्ली",
    aliases: ["delhi", "new delhi", "dilli", "ncr", "indraprastha", "shahjahanabad"],
    historicalNames: ["Indraprastha", "Dillika", "Shahjahanabad"],
    zone: "North",
    coverage: "in_development",
    capital: "New Delhi",
    signatureTraditions: ["Qutub Complex & Iron Pillar", "Red Fort", "Humayun's Tomb", "Sufi Qawwali at Nizamuddin"]
  },
  {
    id: "northeast-states",
    name: "Northeastern States (Meghalaya, Manipur, Mizoram, Nagaland, Tripura, Sikkim, Arunachal)",
    nativeName: "पूर्वोत्तर भारत",
    aliases: [
      "meghalaya",
      "manipur",
      "mizoram",
      "nagaland",
      "tripura",
      "sikkim",
      "arunachal pradesh",
      "arunachal",
      "shillong",
      "imphal",
      "kohima",
      "gangtok",
      "aizawl",
      "agartala",
      "northeast",
      "seven sisters"
    ],
    zone: "Northeast",
    coverage: "in_development",
    capital: "Regional Cultural Hubs",
    signatureTraditions: ["Manipuri Classical Dance", "Living Root Bridges", "Hornbill Festival", "Thangka Painting"]
  }
];
