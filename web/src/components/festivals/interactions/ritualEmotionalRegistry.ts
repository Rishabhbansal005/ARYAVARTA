import { RitualEmotionalLayer } from "@/types";

/**
 * Registry of authentic, research-backed emotional and cultural meaning layers
 * for festival interactive ritual widgets.
 * Follows the no-fabrication standard: historical, ritual, and philosophical reasons
 * derived from Natya Shastra, seasonal astronomy, Vedic/Islamic/Sikh/Constitutional heritage.
 */
export const RITUAL_EMOTIONAL_REGISTRY: Record<string, Record<string, RitualEmotionalLayer>> = {
  "makar-sankranti": {
    "bonfire-offering": {
      personalPrompt: {
        question: "What are you hoping this harvest season brings to your home and loved ones?",
        options: [
          "Warmth & good health through winter",
          "Abundance & a bountiful harvest",
          "Courage to overcome cold or trying times",
          "New beginnings and blessings for the family"
        ],
        placeholder: "Or write your own harvest hope or prayer..."
      },
      culturalMeaning:
        "In Punjab and northern agrarian communities, the Lohri bonfire marks the culmination of the winter solstice and the ripening of the winter rabi crops. Agni (sacred fire) acts as a divine conveyor: by tossing sesame seeds (til), jaggery (gur), and popped grains into the flames with the ancient chant 'Aadar aye, dilather jaye', families symbolically burn away winter's scarcity and pray for solar warmth (Uttarayan) to nourish the earth.",
      completionEcho: {
        template:
          "Your hope for \"{input}\" joins the rising flames — carrying your family's prayers into the winter night just as generations have done around the Lohri fire.",
        fallback:
          "Your offering joins the sacred flames — heralding the return of solar warmth and the promise of a bountiful rabi harvest."
      },
      ambientSound: {
        type: "fire",
        label: "Lohri Bonfire Crackle & Embers"
      },
      outwardConnection: {
        craftName: "Punjabi Rewri & Sugarcane Gur Artisans",
        artisanNote:
          "The traditional sesame brittle (rewri) and organic sugarcane jaggery offered into Lohri fires are crafted in generational rural kilns across Punjab and Haryana.",
        targetTab: "bazaar"
      }
    },
    "prepare-dish": {
      personalPrompt: {
        question: "When you share traditional winter sweets like Til-Gud, what feeling does it stir most?",
        options: [
          "Nostalgia for grandmother's warming recipes",
          "Gratitude for the farmers harvesting sugarcane",
          "Sweetness in family speech ('God god bola')",
          "Comfort of seasonal spices and sesame"
        ],
        placeholder: "Or share a personal winter food memory..."
      },
      culturalMeaning:
        "According to Ayurvedic shastra, sesame seeds generate internal thermal warmth needed during the peak of winter, while sugarcane jaggery provides sustained iron and energy. The Maharashtrian proverb 'Til-gul ghya, god god bola' (take sesame-jaggery, speak sweetly) reminds communities that seasonal food is a medium for mending strained relations and nurturing harmony.",
      completionEcho: {
        template:
          "As the Til-Gud laddoos take golden shape, your reflection on \"{input}\" sweetens the offering — honoring the wisdom of seasonal food.",
        fallback:
          "The sweet sesame offering is complete — nourishing body and heart with the age-old winter benediction of sweetness and health."
      },
      ambientSound: {
        type: "hearth",
        label: "Winter Hearth Roasting Simmer"
      },
      outwardConnection: {
        craftName: "Clay Pottery & Hand-Cast Brass Cookware",
        artisanNote:
          "Traditional Sankranti sesame sweets are roasted in heavy hand-beaten brass kadhais preserved by hereditary thathera metalsmiths.",
        targetTab: "bazaar"
      }
    }
  },

  "eid-ul-fitr": {
    "night-sky-crescent": {
      personalPrompt: {
        question: "Who are you looking forward to celebrating with, or what blessing are you holding in your heart?",
        options: [
          "Peace, forbearance & inner tranquility",
          "Joyful reunions with distant family",
          "Deep compassion for those facing hardship",
          "Gratitude for 30 days of spiritual discipline"
        ],
        placeholder: "Or write a personal Eid prayer or reflection..."
      },
      culturalMeaning:
        "In the Islamic lunar (Hijri) calendar, months are determined by astronomical observation of the new moon. Sighting the delicate crescent (Hilal) at twilight on the 29th or 30th evening of Ramadan marks the advent of 1st Shawwal. This visual confirmation transitions believers from the sacred discipline of daylight fasting to communal gratitude, underscored by Zakat al-Fitr — ensuring every neighbor rejoices in the feast with dignity.",
      completionEcho: {
        template:
          "As the Shawwal crescent shines in the twilight sky, your gratitude for \"{input}\" joins millions of greetings of 'Eid Mubarak' echoing across courtyards.",
        fallback:
          "The delicate Hilal illuminates the horizon — heralding peace, forgiveness, and the warmth of community after thirty days of devotion."
      },
      ambientSound: {
        type: "night-wind",
        label: "Twilight Sky & Evening Breeze"
      },
      outwardConnection: {
        craftName: "Traditional Ittar Perfumery & Zardozi Weaving",
        artisanNote:
          "The pure rose and khus ittar worn for Eid prayers and the intricate silver-wire Zardozi embroidery on festive kurtas are preserved by master craft families in Awadh and Old Delhi.",
        targetTab: "bazaar"
      }
    },
    "prepare-dish": {
      personalPrompt: {
        question: "What makes traditional Sheer Khurma special to your family celebrations?",
        options: [
          "Welcoming neighbors of all faiths into our home",
          "The slow, patient aroma of dates and saffron",
          "Remembering elders who passed down the recipe",
          "Sharing sweet bowls with children receiving Eidi"
        ],
        placeholder: "Or describe a cherished Eid morning tradition..."
      },
      culturalMeaning:
        "In Persian, 'Sheer' translates to milk and 'Khurma' to dry dates. Slow-cooked together with fine roasted vermicelli, chironji nuts, and green cardamom, this royal Mughlai preparation symbolizes patience, sweetness, and hospitality. In historic cities like Lucknow, Hyderabad, and Delhi, pots of Sheer Khurma are traditionally carried across streets to neighbors of every faith.",
      completionEcho: {
        template:
          "As the Sheer Khurma slow-simmers into golden richness, your memory of \"{input}\" infuses the feast with authentic hospitable grace.",
        fallback:
          "The festive Sheer Khurma is prepared with love — carrying forward the cherished spirit of shared Eid hospitality."
      },
      ambientSound: {
        type: "hearth",
        label: "Slow Milk Simmer & Cardamom Fragrance"
      },
      outwardConnection: {
        craftName: "Hand-Engraved Brass Degchi & Serving Trays",
        artisanNote:
          "Classic Eid feasts are served in tin-lined hand-hammered brass vessels crafted by generational artisans of Moradabad.",
        targetTab: "bazaar"
      }
    }
  },

  "diwali": {
    "light-diya": {
      personalPrompt: {
        question: "What darkness, fear, or burden are you hoping to illuminate and leave behind this Deepavali?",
        options: [
          "Anxiety, doubt & quiet exhaustion",
          "Distances between loved ones",
          "Lingering resentments or old grievances",
          "Uncertainty about future pathways"
        ],
        placeholder: "Or write a personal intention to kindle into light..."
      },
      culturalMeaning:
        "The terracotta lamp (Mitti ka Diya) is fashioned from sacred earth and fueled with mustard or sesame oil, symbolizing the transient physical vessel enlivened by the immortal soul (Atman). Lit on the darkest Amavasya (new moon) night of Kartika month, the steady flame represents Tamaso Ma Jyotir Gamaya ('Lead us from darkness unto light') — the eternal triumph of inner wisdom and righteousness over ignorance.",
      completionEcho: {
        template:
          "Your intention to dispel \"{input}\" now burns brightly in the sacred clay lamp — adding your flame to the unbroken row of Deepavali lights across Bharat.",
        fallback:
          "The sacred flame kindles the darkness — an enduring reminder that light triumphs over shadows and wisdom over despair."
      },
      ambientSound: {
        type: "temple-bell",
        label: "Sacred Deepotsav Bell & Quiet Flame"
      },
      outwardConnection: {
        craftName: "Terracotta Diya Pottery (Kumbhakar Artisans)",
        artisanNote:
          "The earthen lamps that illuminate Diwali are hand-thrown on wooden wheels by traditional Kumbhakar potter guilds across Varanasi, Rajasthan, and Bengal.",
        targetTab: "bazaar"
      }
    },
    "craft-a-rangoli": {
      personalPrompt: {
        question: "What intention or blessing would you like to bestow upon everyone who crosses your threshold?",
        options: [
          "Peace, sweetness & gracious hospitality",
          "Abundance and the blessings of Lakshmi",
          "Harmony with nature and all tiny creatures",
          "Protection from negative thoughts"
        ],
        placeholder: "Or write your own threshold welcome intention..."
      },
      culturalMeaning:
        "Drawn at dawn at the entrance of homes, Kolam and Rangoli patterns use ground rice flour rather than chemical powder as an ancient act of Bhuta Yajna — feeding ants, birds, and tiny creatures as a daily gesture of ecological harmony. The 4-fold reflective symmetry embodies the four cardinal directions and the cosmic order of the mandala, inviting prosperity and sacred grace before anyone steps inside.",
      completionEcho: {
        template:
          "Your intention of \"{input}\" is woven into this symmetrical mandala — a timeless threshold blessing of beauty, generosity, and welcome.",
        fallback:
          "The sacred geometry is complete at your threshold — inviting Lakshmi's grace and welcoming all who enter with harmony."
      },
      ambientSound: {
        type: "temple-bell",
        label: "Dawn Temple Chimes & Morning Breeze"
      },
      outwardConnection: {
        craftName: "Natural Rice Flour & Mineral Ochre Pigments",
        artisanNote:
          "Traditional threshold art uses natural rice powder and red earth (Kavi) sourced directly from indigenous mineral and agricultural traditions.",
        targetTab: "bazaar"
      }
    },
    "prepare-dish": {
      personalPrompt: {
        question: "When sweet delicacies are exchanged during Diwali, what meaning do they carry for you?",
        options: [
          "Expressing affection words cannot say",
          "Sharing festive wealth with staff and workers",
          "Remembering festivities from childhood",
          "Inviting divine sweetness into the house"
        ],
        placeholder: "Or share a Diwali sweet memory..."
      },
      culturalMeaning:
        "In Indian cultural philosophy, sweet offerings (Mithai) symbolize Prasad — a sanctified medium where pure ingredients like milk, mawa, silver foil (vark), and nuts represent auspiciousness and social communion. Exchanging sweets erases differences and seals the new commercial and spiritual year (Vikram Samvat) with good fortune.",
      completionEcho: {
        template:
          "As the festive sweets are prepared, your thought on \"{input}\" infuses the confection with genuine gratitude and festive warmth.",
        fallback:
          "The Diwali confection is prepared with pure devotion — ready to be shared with family, neighbors, and friends."
      },
      ambientSound: {
        type: "hearth",
        label: "Festive Kitchen Sweet Simmer"
      },
      outwardConnection: {
        craftName: "Hand-Hammered Silver Leaf & Brass Thalis",
        artisanNote:
          "Artisanal silver leaf (vark) and hand-etched brass sweet platters are crafted by specialized hereditary guilds in Old Delhi and Jaipur.",
        targetTab: "bazaar"
      }
    }
  },

  "republic-day": {
    "flag-hoisting": {
      personalPrompt: {
        question: "What does being Indian and upholding constitutional values mean to you today?",
        options: [
          "Justice, liberty & equal dignity for every citizen",
          "Pride in our extraordinary linguistic & cultural diversity",
          "Freedom of conscience, learning & creative voice",
          "A personal duty towards building a compassionate society"
        ],
        placeholder: "Or write what the Indian Republic means to you..."
      },
      culturalMeaning:
        "The National Tricolor (Tiranga) embodies the foundational values of the Indian Republic: Saffron for courage and selfless sacrifice; White for truth, purity, and peace; and Green for fertility, growth, and commitment to the soil. At its heart sits the 24-spoked Ashoka Chakra in navy blue, derived from the Sarnath Lion Capital of Emperor Ashoka, representing the eternal wheel of Dharma and progressive motion without stagnation.",
      completionEcho: {
        template:
          "As the Tiranga unfurls against the sky, your commitment to \"{input}\" joins the sovereign chorus of 'We, the People of India'.",
        fallback:
          "The Tricolor flutters with dignity in the morning breeze — an enduring symbol of liberty, equality, and the sovereign spirit of our republic."
      },
      ambientSound: {
        type: "ceremonial",
        label: "Dignified Ceremonial Brass & Wind Swell"
      },
      outwardConnection: {
        craftName: "Khadi Handloom Weaving (Dharwad Tradition)",
        artisanNote:
          "Official Bureau of Indian Standards Tiranga flags are hand-spun and hand-woven exclusively from pure Khadi cotton in certified Karnataka weavers' societies.",
        targetTab: "bazaar"
      }
    }
  },

  "holi": {
    "splash-colors": {
      personalPrompt: {
        question: "What joyful relationship or friendship are you wishing to renew this Phalguna spring?",
        options: [
          "Mending misunderstandings and starting anew",
          "Spontaneous childhood laughter with friends",
          "Deepening bonds across different communities",
          "Welcoming newcomers into our circle"
        ],
        placeholder: "Or write a person or relationship you wish to celebrate..."
      },
      culturalMeaning:
        "Holi marks the farewell to winter and the blossoming of spring. Historically, the colored powders (Gulal) were medicinal and preventive, ground from forest blossoms like Palash (Butea monosperma), sandalwood, and wild turmeric to protect the skin during seasonal transitions. Tossing colors indiscriminately erases social hierarchies, age divides, and grievances in an egalitarian sea of joy.",
      completionEcho: {
        template:
          "Your celebration of \"{input}\" bursts into vibrant color — dissolving barriers just as traditional Gulal brings every heart into equal communion.",
        fallback:
          "The vibrant Gulal fills the air — washing away winter's gloom with the laughter and egalitarian warmth of spring."
      },
      ambientSound: {
        type: "water",
        label: "Spring Breeze & Gentle Water Splashes"
      },
      outwardConnection: {
        craftName: "Forest Botanical Pigments & Organic Gulal",
        artisanNote:
          "Traditional Palash flower petals and dried beetroot are collected by forest tribal cooperatives in central India to prepare pure organic gulal.",
        targetTab: "bazaar"
      }
    },
    "prepare-dish": {
      personalPrompt: {
        question: "What makes traditional Mawa Gujiya an essential part of your Holi memories?",
        options: [
          "Folding crisp pastry pockets alongside mothers & aunts",
          "The rich aroma of cardamom, mawa & grated coconut",
          "Offering sweet hospitality to color-drenched guests",
          "The rare festival luxury of slow-fried sweets"
        ],
        placeholder: "Or share a cherished Holi culinary memory..."
      },
      culturalMeaning:
        "The crescent-shaped Gujiya (or Karanji) is a celebration of the spring harvest of fresh wheat flour (maida) and dairy richness (mawa/khoya). Infused with crushed green cardamom, dried coconut, and melon seeds, these crisp pastries provide instant restorative energy to dancers and singers exhausted from hours of spirited revelry.",
      completionEcho: {
        template:
          "As the crisp Gujiya is filled and crimped, your memory of \"{input}\" seals the recipe with heartfelt festive warmth.",
        fallback:
          "The golden Gujiya is prepared with care — a sweet reward awaiting friends and families playing Holi."
      },
      ambientSound: {
        type: "hearth",
        label: "Gentle Ghee Frying Sizzle"
      },
      outwardConnection: {
        craftName: "Hand-Carved Wooden Gujiya Molds",
        artisanNote:
          "Intricate geometric pastry molds used for crimping festive gujiyas are hand-chiseled from seasoned sheesham wood by artisans of Saharanpur.",
        targetTab: "bazaar"
      }
    }
  },

  "guru-nanak-jayanti": {
    "prepare-dish": {
      personalPrompt: {
        question: "What core value of Guru Nanak Dev Ji's teachings resonates most with you?",
        options: [
          "Vand Chhako (Sharing with the needy)",
          "Kirat Karo (Honest, ethical labor)",
          "Naam Japna (Remembrance of the Divine)",
          "Sarbat da Bhala (Welfare of all humanity)"
        ],
        placeholder: "Or write a personal Gurpurab reflection..."
      },
      culturalMeaning:
        "Kada Prasad, prepared from equal measures of coarse wheat flour, pure desi ghee, and sugar syrup in sacred iron cauldrons (Karahi), embodies the foundational Sikh canon of Langar. Distributed to all without regard to caste, creed, gender, or wealth, receiving this warm sanctified offering with cupped hands represents absolute humility and universal human equality.",
      completionEcho: {
        template:
          "As the sanctified Kada Prasad is prepared with reverence, your contemplation of \"{input}\" echoes the timeless call of universal brotherhood.",
        fallback:
          "The sacred Prasad is prepared with devotion — a blessed reminder of equality, selfless service, and humility."
      },
      ambientSound: {
        type: "hearth",
        label: "Simmering Iron Cauldron Reverence"
      },
      outwardConnection: {
        craftName: "Hand-Beaten Iron Karahis & Sarbloh Utensils",
        artisanNote:
          "Traditional sacred cauldrons and utensils (Sarbloh) for Gurdwara langars are forged from pure iron by metalsmiths of Punjab.",
        targetTab: "bazaar"
      }
    },
    "light-diya": {
      personalPrompt: {
        question: "As the Golden Temple illuminates for Gurpurab, what light do you hope to awaken?",
        options: [
          "Compassion in everyday actions",
          "Wisdom to see divinity in everyone",
          "Courage to stand up for justice",
          "Inner contentment and peace"
        ],
        placeholder: "Or write a reflection for the Gurpurab Deepmala..."
      },
      culturalMeaning:
        "The lighting of terracotta lamps around the sacred Sarovar during Gurpurab commemorates the birth of Guru Nanak Dev Ji in 1469 as a spiritual illumination dispelling darkness: 'Satgur Nanak Pargateya, Miti Dhund Jag Channan Hoya' (With Guru Nanak's advent, the mist cleared and light filled the universe).",
      completionEcho: {
        template:
          "Your intention for \"{input}\" glows upon the sacred waters — reflecting the universal message of peace and oneness.",
        fallback:
          "The sacred lamps illuminate the evening — reflecting the timeless light of Guru Nanak's divine wisdom across the waters."
      },
      ambientSound: {
        type: "temple-bell",
        label: "Evening Sarovar Serenity & Soft Gongs"
      }
    }
  },

  "buddha-purnima": {
    "prepare-dish": {
      personalPrompt: {
        question: "What pathway of the Buddha's Noble Eightfold Path guides you most today?",
        options: [
          "Right Mindfulness (Sati) in each breath",
          "Right Speech (Samma Vaca) without malice",
          "Right Action (Samma Kammanta) with compassion",
          "Right Livelihood (Samma Ajiva) causing no harm"
        ],
        placeholder: "Or write a personal contemplation on peace..."
      },
      culturalMeaning:
        "On Buddha Purnima, sweet milk rice porridge (Kheer) is prepared in memory of Sujata, the village maiden who offered bowls of sweet milk kheer to Prince Siddhartha when he was emaciated from severe asceticism. This nourishment gave him the physical strength to sit beneath the Bodhi tree at Bodh Gaya and attain supreme Enlightenment (Nirvana).",
      completionEcho: {
        template:
          "Your contemplation of \"{input}\" joins this serene offering — honoring the Middle Path of compassionate balance.",
        fallback:
          "The sacred Kheer offering is complete — a timeless tribute to Sujata's compassion and the Buddha's attainment of supreme peace."
      },
      ambientSound: {
        type: "temple-bell",
        label: "Meditative Singing Bowl Resonance"
      },
      outwardConnection: {
        craftName: "Himalayan Hand-Hammered Singing Bowls",
        artisanNote:
          "Meditative bell-metal singing bowls used in Buddhist contemplation are hand-hammered from seven sacred metals by artisans of Ladakh and Sikkim.",
        targetTab: "bazaar"
      }
    }
  },

  "christmas": {
    "prepare-dish": {
      personalPrompt: {
        question: "What blessing of the Christmas season brings the deepest joy to your hearth?",
        options: [
          "Peace on earth and goodwill to all",
          "Generosity and giving without expecting return",
          "Warmth of family gathered around the table",
          "Hope for a gentle, forgiving new year"
        ],
        placeholder: "Or share a personal Christmas hope or memory..."
      },
      culturalMeaning:
        "In Indian Christian heritage — from the Syrian Christians of Kerala to the Anglo-Indian and Goan communities — festive baking is a community labor. Dried fruits soaked in spiced grape nectar for months are folded into rich dark cakes, symbolizing patience, abundance, and the warmth of sharing with neighbors of every background.",
      completionEcho: {
        template:
          "Your reflection on \"{input}\" infuses the festive confection — carrying the enduring Christmas message of goodwill to all.",
        fallback:
          "The festive Christmas confection is baked with love — ready to bring cheer and warmth to family and friends."
      },
      ambientSound: {
        type: "ceremonial",
        label: "Subtle Choral Organ & Candlelight Aura"
      },
      outwardConnection: {
        craftName: "Traditional Goan Hand-Blown Glass Baubles",
        artisanNote:
          "Festive nativity ornaments and glass lanterns are shaped by heritage glassblowers and brass metalworkers in western coastal communities.",
        targetTab: "bazaar"
      }
    }
  }
};

/**
 * Universal fallback generator for festivals or interactions without explicit registry entries.
 */
export function getRitualEmotionalLayer(
  festivalId: string,
  actionComponent: string,
  data?: any
): RitualEmotionalLayer {
  const fest = RITUAL_EMOTIONAL_REGISTRY[festivalId];
  if (fest && fest[actionComponent]) {
    return fest[actionComponent];
  }

  // Sensible, respectful heuristics based on the actionComponent
  switch (actionComponent) {
    case "bonfire-offering":
      return {
        personalPrompt: {
          question: "What are you hoping this harvest celebration brings into your life?",
          options: ["Warmth & vitality", "Abundance & prosperity", "Courage for cold days", "Harmony with community"],
          placeholder: "Or write your personal harvest intention..."
        },
        culturalMeaning:
          "Sacred fire rituals across Bharat honor Agni as the divine purifier and sustainer, consuming offerings to bestow solar warmth and fertility upon fields and families.",
        completionEcho: {
          template: "Your intention for \"{input}\" joins the sacred flames in reverence for nature's seasonal cycle.",
          fallback: "Your offering joins the sacred flames in celebration of harvest and communal life."
        },
        ambientSound: { type: "fire", label: "Crackling Sacred Fire" },
        outwardConnection: {
          craftName: "Clay Pottery & Terracotta Utensils",
          artisanNote: "Handcrafted earthen vessels used in sacred fire offerings are shaped on traditional potters' wheels.",
          targetTab: "bazaar"
        }
      };

    case "night-sky-crescent":
      return {
        personalPrompt: {
          question: "As the new moon appears, what intention or prayer are you wishing to cultivate?",
          options: ["Peace and reconciliation", "Patience and steadfastness", "Generosity towards neighbors", "Gratitude for loved ones"],
          placeholder: "Or write your personal celestial reflection..."
        },
        culturalMeaning:
          "In lunar traditions, sighting the crescent moon marks the transition between seasons and sacred periods, calling communities together in gratitude and charity.",
        completionEcho: {
          template: "As the crescent illuminates the twilight, your thought on \"{input}\" joins the timeless chorus of festive blessings.",
          fallback: "The delicate crescent shines above — marking the dawn of a new season of peace and celebration."
        },
        ambientSound: { type: "night-wind", label: "Evening Horizon Wind" },
        outwardConnection: {
          craftName: "Traditional Brass Lanterns & Lamps",
          artisanNote: "Perforated brass lamps casting delicate lunar shadows are crafted by master metal-chasers.",
          targetTab: "bazaar"
        }
      };

    case "light-diya":
      return {
        personalPrompt: {
          question: "What darkness or hesitation are you hoping to transform into light?",
          options: ["Self-doubt & worry", "Distance from loved ones", "Fatigue and stress", "Past regrets"],
          placeholder: "Or write an intention to illuminate..."
        },
        culturalMeaning:
          "The oil lamp symbolizes the soul awakening within the clay of mortality. Kindling the flame affirms that light always overcomes darkness.",
        completionEcho: {
          template: "Your intention to illuminate \"{input}\" burns brightly — adding your warmth to the collective light.",
          fallback: "The sacred flame kindles the darkness — an eternal reminder that light triumphs over shadows."
        },
        ambientSound: { type: "temple-bell", label: "Temple Bell & Flame Aura" },
        outwardConnection: {
          craftName: "Terracotta Diya Pottery",
          artisanNote: "Handmade earthen diyas are crafted by generational potter communities across Bharat.",
          targetTab: "bazaar"
        }
      };

    case "flag-hoisting":
      return {
        personalPrompt: {
          question: "What constitutional value or democratic promise matters most to you today?",
          options: ["Justice & equal opportunity", "Unity in our diversity", "Liberty of thought & expression", "Duty to our fellow citizens"],
          placeholder: "Or write your personal pledge..."
        },
        culturalMeaning:
          "The National Flag represents the collective sovereignty, courage, and shared destiny of the citizens of the Republic of India.",
        completionEcho: {
          template: "As the Tiranga flies high, your dedication to \"{input}\" honours the sovereign spirit of our republic.",
          fallback: "The Tricolor unfurls with dignity — a proud celebration of sovereign freedom and constitutional unity."
        },
        ambientSound: { type: "ceremonial", label: "Ceremonial Fanfare Swell" },
        outwardConnection: {
          craftName: "Khadi Handloom Weaving",
          artisanNote: "Official National Flags are hand-spun and hand-woven exclusively from pure Khadi cotton.",
          targetTab: "bazaar"
        }
      };

    case "craft-a-rangoli":
      return {
        personalPrompt: {
          question: "What welcoming intention would you like to place upon your threshold?",
          options: ["Kindness & hospitality", "Peace and positive vibes", "Auspicious blessings", "Harmony with nature"],
          placeholder: "Or write your threshold intention..."
        },
        culturalMeaning:
          "Threshold mandalas mark the boundary between the outer world and the sacred home, blessing all who enter with harmony and joy.",
        completionEcho: {
          template: "Your intention of \"{input}\" is inscribed into this threshold mandala, radiating welcome to all.",
          fallback: "The sacred geometry is complete at your threshold — inviting blessings and beauty into the home."
        },
        ambientSound: { type: "temple-bell", label: "Temple Chime Ambience" }
      };

    case "splash-colors":
      return {
        personalPrompt: {
          question: "What joyful feeling or friendship are you wishing to celebrate?",
          options: ["Mending past differences", "Childhood carefree joy", "Unity and equality", "Welcoming spring blossoms"],
          placeholder: "Or write your personal spring wish..."
        },
        culturalMeaning:
          "Spring color festivals celebrate the renewal of life and the egalitarian union of all hearts without barrier or distinction.",
        completionEcho: {
          template: "Your joy of \"{input}\" bursts into vibrant color, uniting all in shared celebration.",
          fallback: "The vibrant colors fill the air — dissolving differences with the laughter and warmth of spring."
        },
        ambientSound: { type: "water", label: "Spring Splash Rhythm" }
      };

    case "prepare-dish":
    default:
      return {
        personalPrompt: {
          question: "What festive food memory or feeling brings you the most comfort?",
          options: ["Family gathered around the table", "The aroma of seasonal spices", "Gratitude for nature's bounty", "Sharing meals with neighbors"],
          placeholder: "Or share a culinary memory..."
        },
        culturalMeaning:
          "Festival cuisine in Bharat is a sacred offering of hospitality and seasonal nutrition, connecting generations through shared taste.",
        completionEcho: {
          template: "Your memory of \"{input}\" sweetens the preparation — honoring the kitchen as a sacred hearth of community.",
          fallback: "The culinary offering is prepared with devotion — carrying the hospitality that unites festive kitchens."
        },
        ambientSound: { type: "hearth", label: "Kitchen Hearth Simmer" }
      };
  }
}
