# Cultural Content Verification Registry (TODO_VERIFY.md)

This document tracks all festival entries, media assets, culinary recipes, and ritual interactions requiring human cultural authority verification before final production release.

---

## 1. Imagery Verification Status

| Festival ID | Tradition | Image Status | Notes for Human Reviewer |
| :--- | :--- | :--- | :--- |
| `makar-sankranti` | `harvest-seasonal` | **VERIFIED** | Authentic colorful kite flying during Uttarayan on Ahmedabad/Jaipur rooftops. |
| `eid-ul-fitr` | `islamic` | **VERIFIED** | Authentic congregational Eid prayer gathering at historic Jama Masjid Delhi with minarets. |
| `holi` | `hindu` | **VERIFIED** | Authentic herbal dry gulal play in ancient North Indian courtyard setting. |
| `diwali` | `hindu` | **VERIFIED** | Authentic handcrafted terracotta oil diyas burning with pure cotton wicks on temple porch. |
| `republic-day` | `civic-national` | **VERIFIED** | Official Kartavya Path New Delhi ceremonial parade with National Tricolor flags. |
| `guru-nanak-jayanti` | `sikh` | **VERIFIED** | Golden Temple (Sri Harmandir Sahib) Amritsar illuminated during Gurpurab Prakash Utsav. |
| `christmas` | `christian` | **VERIFIED** | Historic Goan church illuminated during festive Christmas midnight celebration. |
| `buddha-purnima` | `buddhist` | **VERIFIED** | Monks in robes with lotus flower offerings under Bodhi tree at Bodh Gaya. |
| `hornbill-festival` | `tribal-regional` | **PENDING REVIEW** (`verified: false`) | Curated photograph of Northeast Naga traditional regalia requires signed attribution from Nagaland State Tourism or Kisama Heritage Council. |

---

## 2. Interaction & Ritual Authenticity Guardrails

- **Zero-Tolerance for Generic Rituals**:
  - Non-Hindu festivals (e.g. Eid ul-Fitr, Republic Day, Christmas) **never** render Diya lighting or Gulal throwing widgets.
  - Islamic festivals strictly utilize authentic lunar observation (`night-sky-crescent` Hilal sighting) and culinary recipes (`prepare-dish` Sheer Khurma).
  - Civic-National observances strictly utilize the ceremonial Preamble & flag unfurling (`flag-hoisting`).
  - Harvest & bonfire festivals (Lohri) strictly feature `bonfire-offering` with the historical oral folklore chant *"Aadar aye, dilather jaye"*.

---

## 3. Pending Community Contributions (Moderation Queue)

Any contributions submitted via the **"How My Family Celebrates"** community module are stored locally in the user's browser with `verified: false` and displayed with a `[⏳ Pending Cultural Moderation]` banner. They are not broadcast publicly until verified by an accredited cultural historian or community elder.

---

## 4. History Atlas: Archaeological Artifacts & Chronological Debates Registry

Every historical turning point in the History Atlas is cross-referenced with primary epigraphic records, ASI excavation reports, and academic consensus. Where scholarly consensus is divided, dates and attributions are marked as `certainty: "debated"` with explicit transparent caveats in the UI:

| Event ID | Period / Year | Ruling Authority Cited | Epigraphic / Primary Source | Certainty Status & Review Notes |
| :--- | :--- | :--- | :--- | :--- |
| `indus-dholavira-2500-bce` | c. 2500 BCE | Mature Harappan | ASI Excavation Reports (R.S. Bisht, 2015), UNESCO Inscription | **Established**: Reservoir stonework, signpost, and rainwater catchment verified. |
| `rigveda-saraswati-1500-bce` | c. 1500 BCE | Early Vedic (Sapta Sindhu) | Rigveda Samhita (Padapatha / Ghanapatha oral recensions) | **Debated**: Mainstream comparative linguistics places composition c. 1500–1200 BCE; internal astronomical references argued by Indian astronomers point to earlier millennia. |
| `buddha-parinirvana-483-bce` | 483 BCE | Malla Republic / Haryanka | Digha Nikaya (Mahaparinibbana Sutta), Cantonese Dotted Record | **Widely-Accepted**: Alternative 'short chronology' (c. 400 BCE) proposed by Heinz Bechert noted in UI. |
| `chandragupta-founds-maurya-322-bce` | 322 BCE | Maurya Empire | Kautilya's Arthashastra, Megasthenes' Indica fragments | **Established**: Pataliputra archaeological pillared hall at Kumrahar matches Greek accounts. |
| `ashokan-edicts-257-bce` | 257 BCE | Maurya Empire | Sarnath Pillar Lion Capital, Rock Edict XIII (Shahbazgarhi) | **Established**: Direct deciphered Brahmi/Kharosthi epigraphy; national emblem verified. |
| `chandragupta-ii-vikramaditya-380-ce` | 380 CE | Gupta Empire | Mehrauli Iron Pillar Sanskrit Inscription of King Chandra | **Established**: Metallurgical analyses confirm phosphorus-rich corrosion resistance. |
| `nalanda-mahavihara-founding-427-ce` | 427 CE | Gupta Empire (Kumaragupta I) | Xuanzang Si-Yu-Ki, ASI Excavation seals of Kumaragupta I | **Established**: Inscriptions prove Kumaragupta I (Shakaditya) initial endowment. |
| `rajaraja-chola-brihadisvara-1010-ce` | 1010 CE | Imperial Chola Empire | South Indian Inscriptions (SII Vol. II) on temple plinth | **Established**: Consecration year 1010 CE explicitly carved on granite base. |
| `shivaji-coronation-raigad-1674-ce` | 1674 CE | Maratha Empire | Sabhasad Bakhar (1697), Gaga Bhatt coronation rituals | **Established**: Jyeshtha Shuddha Trayodashi (6 June 1674) verified by contemporary English and Marathi records. |
| `indian-rebellion-1857-ce` | 1857 CE | Anti-Colonial Revolutionary Coalition | National Archives of India 1857 Mutiny Records | **Established**: 10 May Meerut outbreak to Bahadur Shah Zafar proclamation verified. |
| `constitution-adoption-1950-ce` | 26 Jan 1950 | Republic of India | Calligraphed Original Constitution in Parliament Library | **Established**: Original signatures of 284 Constituent Assembly members on 24 Jan 1950. |
| `isro-chandrayaan-3-2023-ce` | 23 Aug 2023 | Republic of India (ISRO) | ISRO Official Telemetry & Science Review / Nature Journal | **Established**: Vikram lander telemetry and Pragyan rover LIBS spectroscope confirmed. |

---

## 5. Nritya Studio: Mudra & Classical Dance Calibration Registry

### A. Hastha Mudra Kinematic Implementation Status
Under Natya Shastra and Abhinaya Darpana canons, mudra evaluation requires 21-point hand joint geometric verification. To prevent false approximations, only documented mudras are live-evaluated:

| Mudra Name | Dance Association | Kinematic Formula Status | Verification Notes |
| :--- | :--- | :--- | :--- |
| **Alapadma** (अलपद्म) | Odissi, Bharatanatyam | **CALIBRATED & LIVE** | Five-finger radial spread angle $\ge 0.45 \times \text{palmWidth}$ and DIP joint curvature verified. |
| **Aradhapataka** (अर्धपताक) | Odissi, Kuchipudi | **CALIBRATED & LIVE** | Index and middle finger parallel extension ($\le 0.28 \times \text{palmWidth}$) with tucked thumb base verified. |
| **Tripataka** (त्रिपताक) | Bharatanatyam | *Pending Calibration* | Ring finger 90° bend angular threshold logged for calibration. |
| **Hamsasya** (हंसास्य) | Kathak | *Pending Calibration* | Forefinger and thumb tip contact circle geometry awaiting 3D capture. |
| **Mudrakhya** (मुद्राख्य) | Kathakali | *Pending Calibration* | Deep index-thumb ring with extended ring and little fingers logged. |
| **Kapittha** (कपित्थ) | Kuchipudi | *Pending Calibration* | Thumb pressed over bent index finger awaiting laboratory capture. |

### B. "Identify This Dance" Classifier Confidence Guardrails
The neural dance classifier evaluates the 8 classical dances recognized by the Sangeet Natak Akademi.
- **Strict Uncertainty Rule**: Any classification with confidence $< 60\%$ is flagged with an explicit `isUncertain: true` banner in the UI to prevent presenting low-confidence computer vision guesses as factual.


