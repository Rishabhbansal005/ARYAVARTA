# 🏛️ Āryāvarta (आर्यावर्त)
### *Next-Generation Multimodal AI Platform for Indian Cultural Heritage, Classical Arts & 3D Spatial Preservation*

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL_3D-orange?style=for-the-badge&logo=threedotjs)](https://threejs.org/)
[![MediaPipe](https://img.shields.io/badge/MediaPipe-Vision_AI-brightgreen?style=for-the-badge&logo=google)](https://developers.google.com/mediapipe)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

---

## 🌟 Executive Overview
**Āryāvarta** is an immersive digital cultural heritage platform designed to document, preserve, celebrate, and educate people on India's living cultural traditions. Developed for the **Smart India Hackathon (SIH)**, Āryāvarta bridges centuries-old treatises (such as Bharata Muni's *Natya Shastra*, the *Abhinaya Darpana*, and the *Sangita Ratnakara*) with cutting-edge **Computer Vision, Spatial 3D WebGL, and Multimodal Artificial Intelligence**.

---

## ✨ Core Pillars & Features

### 1. 🛕 Heritage 3D Explorer & Sacred Monuments
- **Interactive Spatial 3D Exploration**: Explore canonical Indian architectural masterpieces in real-time 3D.
- **Offline GLB Rendering**: Dedicated Three.js WebGL renderer capable of loading high-polygon photogrammetric models locally (`/models/tajmahal.glb`, `/models/ellora_caves.glb`) without external cloud dependencies.
- **Curated Hotspot Annotations**: Architectural, sculptural, and historical callouts pinned directly in 3D coordinate space.
- **Multilingual Audio Guides**: Cultural narratives synthesized using Sarvam AI's Indian language TTS models.

### 2. 💃 Nritya: AI Classical Dance Mirror & Vision Classifier
- **Real-Time 3D Biomechanical Pose Estimation**: Uses Google MediaPipe Vision to track 33 skeletal joints and hand landmarks directly in the browser via webcam.
- **Natya Shastra Kinematic Engine**: Mathematical angular scoring calibrated against ancient shastric canons across India's 8 Sangeet Natak Akademi classical traditions:
  - **Odissi**: Tribhanga (Griva head tilt, Vaksha torso shift, Kati hip deflection, Kunchita Pada footwork).
  - **Bharatanatyam**: Aramandi (Ayata Mandalam diamond knee turnout, erect spine, Natyarambha horizontal arms).
  - **Kathak**: Upright Samapada posture, overhead Urdhva Hasta arches, Tatkar foot positioning.
  - **Kathakali**: Deep martial Mandala squat, wide knee abduction, flared Vaksha chest.
  - **Kuchipudi, Mohiniyattam, Manipuri, and Sattriya**.
- **Hastha Mudra Recognition**: Real-time geometric tracking of classical mudras (such as *Alapadma* lotus gesture and *Aradhapataka* half-flag).
- **Procrustes 3D Shape Alignment**: Normalized Frobenius disparity metric comparing live user silhouettes to canonical temple sculptures.
- **Multimodal Dance Vision Classifier**: Neural vision recognition powered by Google Gemini that accurately identifies both Classical dances and celebrated Indian Folk dances (**Bhangra, Garba, Ghoomar, Lavani, Bihu, Chhau, Yakshagana, etc.**).

### 3. 🎵 Sangeet: Vedic Microtonal Swaras & Raga Matrix
- **Live Saptak Synthesizer**: Web Audio API oscillator synthesizing the 7 foundational swaras (*Sa, Re, Ga, Ma, Pa, Dha, Ni*) with exact harmonic mathematical frequency ratios derived from ancient Indian tuning (Root: Madhya Sa @ 240 Hz).
- **72 Melakarta Scheme & Master Classical Scales**: Complete interactive catalog of classical Indian ragas with Ascending (*Arohana*) and Descending (*Avarohana*) audio playback, emotional moods (*Rasa*), and circadian performance times (*Prahar*).

### 4. 📜 History Atlas & Verified Dynastic Timeline
- **1MB Curated Scholarly Corpus**: Detailed documentation covering ancient, medieval, and modern Indian history with **517+ verified citations**.
- **Interactive Dynastic Visualizer**: Explore the Maurya, Gupta, Chola, Vijayanagara, and Mughal dynasties with geographic mapping and primary source references.

### 5. 🛍️ Artisan Bazaar & Cultural Economy
- **Authentic Craft Heritage**: Connect directly with traditional Indian artisans preserving GI-tagged crafts (Bidriware, Madhubani, Pashmina, Channapatna toys, Kanchipuram silk).

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling & Design System** | Tailwind CSS, Lucide Icons, Custom Gold Glassmorphism |
| **3D Graphics & Spatial** | Three.js, GLTFLoader, OrbitControls, WebGL, Mapbox GL |
| **Vision & Pose AI** | Google MediaPipe Pose & Hands, Canvas 2D Kinematics |
| **Generative Vision AI** | Google Gemini Multimodal Vision API (`gemini-flash-lite`, `gemini-3-flash`) |
| **Audio & Speech AI** | Web Audio API harmonic synthesis, Sarvam AI Bulbul TTS |
| **Backend & Microservices** | Next.js Serverless API Routes, Python FastAPI AI Gateway |
| **Database & Auth** | Supabase (PostgreSQL), Prisma / Direct Pooler |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn** / **pnpm**
- **Python**: v3.10+ (optional, for standalone `ai_gateway`)

### 1. Clone the Repository
```bash
git clone https://github.com/Rishabhbansal005/ARYAVARTA.git
cd ARYAVARTA/web
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env.local` file inside the `web` directory:
```bash
cp .env.example .env.local
```
Fill in your API credentials:
```env
# Google Gemini Multimodal AI
GEMINI_API_KEY=your_gemini_api_key

# Mapbox Token
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token

# Groq LLM API Key
GROQ_API_KEY=your_groq_api_key

# Sarvam AI TTS
SARVAM_API_KEY=your_sarvam_api_key

# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to experience the platform.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 📂 Project Architecture

```
ARYAVARTA/
├── ai_gateway/                  # Standalone FastAPI Python Microservice
│   ├── app.py                   # Raga neural classifier & kinematics
│   ├── models/                  # Keras trained models
│   └── sample_audio/            # Acoustic reference clips
├── data/                        # Cultural Datasets & Shastric Archives
│   ├── history_corpus.json      # 1MB verified historical timeline (517+ citations)
│   ├── ragas_unified.json       # 72 Melakarta & classical raga scales
│   ├── festivals_unified.json   # Pan-India cultural festival calendar
│   └── crafts_artisans.json     # GI-tagged handicraft database
└── web/                         # Primary Next.js Web Application
    ├── public/
    │   └── models/              # Offline 3D GLB Models (Taj Mahal, Ellora Caves)
    └── src/
        ├── app/                 # Next.js App Router Pages & API Endpoints
        │   ├── api/dance/       # Dance evaluate & vision classify routes
        │   ├── api/chat/        # Cultural chatbot API
        │   └── page.tsx         # Main application hub
        ├── components/
        │   ├── heritage/        # Three.js 3D Monument Viewer & Hotspots
        │   ├── nritya/          # MediaPipe Camera Mirror & Kinematic Evaluator
        │   ├── sangeet/         # Microtonal Swara Synthesizer & Ragas
        │   └── atlas/           # Historical Timeline & Dynasty Atlas
        └── lib/                 # Web Audio, MediaPipe & Vector Math Utilities
```

---

## 🏆 Smart India Hackathon (SIH) Note
Āryāvarta was architected to present a working, multi-dimensional prototype addressing digital heritage preservation, experiential education, and cultural tourism empowerment.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
