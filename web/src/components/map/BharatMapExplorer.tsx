"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import {
  MapPin,
  Landmark,
  Sparkles,
  Music,
  ShoppingBag,
  Info,
  Globe,
  Languages,
  Utensils,
  ChevronRight,
  Search,
  Bot,
  Volume2,
  VolumeX
} from "lucide-react";
import { audioManager } from "@/lib/audioManager";
import { useLanguage, SUPPORTED_LANGUAGES } from "@/context/LanguageContext";

// Dynamically import the IndiaMap component with SSR disabled
const IndiaMap = dynamic(() => import("@aryanjsx/indiamap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] flex items-center justify-center text-[#D4AF37]">
      <div className="flex flex-col items-center gap-3">
        <Sparkles className="w-8 h-8 animate-spin text-[#D4AF37]" />
        <span className="font-serif text-sm">Rendering Sacred Geometry of Bharat...</span>
      </div>
    </div>
  ),
});

export interface StateCulturalProfile {
  code: string;
  name: string;
  capital: string;
  region: string;
  languages: string[];
  danceForms: string[];
  monuments: string[];
  festivals: string[];
  handicrafts: string[];
  cuisine: string[];
  description: string;
  spiritualSignificance: string;
}

export const STATES_CULTURE_REGISTRY: Record<string, StateCulturalProfile> = {
  RJ: {
    code: "RJ",
    name: "Rajasthan",
    capital: "Jaipur",
    region: "North India",
    languages: ["Hindi", "Rajasthani", "Marwari"],
    danceForms: ["Ghoomar", "Kalbelia", "Bhavai", "Chari"],
    monuments: ["Amer Fort", "Hawa Mahal", "Mehrangarh Fort", "Chittorgarh Fort"],
    festivals: ["Pushkar Camel Fair", "Desert Festival", "Teej", "Gangaur"],
    handicrafts: ["Blue Pottery", "Block Printing (Bagru/Sanganer)", "Kathputli", "Kundan Jewelry"],
    cuisine: ["Dal Baati Churma", "Gatte ki Sabzi", "Ker Sangri", "Laal Maas", "Ghevar"],
    description: "The Land of Kings, renowned for majestic desert citadels, vibrant textiles, Rajput valor, and living royal architecture.",
    spiritualSignificance: "Home to the sacred Brahma Temple at Pushkar, Dilwara Jain Temples at Mount Abu, and Nathdwara Shrinathji."
  },
  OR: {
    code: "OR",
    name: "Odisha",
    capital: "Bhubaneswar",
    region: "East India",
    languages: ["Odia", "Sanskrit"],
    danceForms: ["Odissi (Classical)", "Chhau", "Gotipua", "Sambalpuri"],
    monuments: ["Konark Sun Temple", "Jagannath Temple Puri", "Lingaraja Temple", "Udayagiri & Khandagiri Caves"],
    festivals: ["Ratha Yatra", "Konark Dance Festival", "Raja Parba", "Chandan Yatra"],
    handicrafts: ["Pattachitra Scroll Painting", "Silver Filigree (Tarakasi)", "Pipili Applique", "Sambalpuri Ikat"],
    cuisine: ["Chhena Poda", "Dalma", "Pakhala Bhata", "Khaja", "Rasagola"],
    description: "Cradle of Kalinga architecture, the divine cosmic chariot at Konark, sacred Jagannath Puri culture, and ancient Buddhist rock monasteries.",
    spiritualSignificance: "One of the Char Dham sacred pilgrimage sites (Puri), ancient Kalinga peace turning point of Emperor Ashoka at Dhauli."
  },
  TN: {
    code: "TN",
    name: "Tamil Nadu",
    capital: "Chennai",
    region: "South India",
    languages: ["Tamil"],
    danceForms: ["Bharatanatyam (Classical)", "Karagattam", "Kavadi Aattam", "Kummi"],
    monuments: ["Brihadisvara Temple (Thanjavur)", "Meenakshi Amman Temple (Madurai)", "Shore Temple (Mamallapuram)", "Rameswaram"],
    festivals: ["Pongal", "Natyanjali Dance Festival", "Karthigai Deepam", "Chithirai Festival"],
    handicrafts: ["Kanchipuram Silk Sarees", "Tanjore Paintings", "Swamimalai Bronze Idols", "Thammampatti Wood Carving"],
    cuisine: ["Chettinad Curry", "Idli Sambhar", "Filter Coffee", "Pongal", "Kothu Parotta"],
    description: "Heartland of Dravidian temple architecture, millennia of classical Tamil Sangam literature, and soaring stone gopurams reaching the heavens.",
    spiritualSignificance: "Rameswaram Jyotirlinga, Pancha Bhoota Sthalam (cosmic elements), and the divine Nataraja shrine at Chidambaram."
  },
  KA: {
    code: "KA",
    name: "Karnataka",
    capital: "Bengaluru",
    region: "South India",
    languages: ["Kannada"],
    danceForms: ["Yakshagana", "Dollu Kunitha", "Kamsale", "Suggi Kunitha"],
    monuments: ["Hampi (Vijayanagara)", "Chennakeshava Temple (Belur)", "Hoysaleswara Temple (Halebidu)", "Mysore Palace"],
    festivals: ["Mysuru Dasara", "Hampi Utsav", "Ugadi", "Kambala"],
    handicrafts: ["Mysore Silk", "Channapatna Wooden Toys", "Bidriware Metalwork", "Mysore Sandalwood Carving"],
    cuisine: ["Bisi Bele Bath", "Mysore Pak", "Dosa", "Ragi Mudde", "Coorg Pandi Curry"],
    description: "The realm of Vijayanagara, Hoysala, and Chalukya empires, famed for soapstone temple carvings, stone chariots, and UNESCO world wonders.",
    spiritualSignificance: "Adi Shankaracharya's first Peetham at Sringeri, Shravanabelagola Gommateshwara, and Murudeshwar."
  },
  MH: {
    code: "MH",
    name: "Maharashtra",
    capital: "Mumbai",
    region: "West India",
    languages: ["Marathi"],
    danceForms: ["Lavani", "Koli Dance", "Gondhal", "Dhangari Gaja"],
    monuments: ["Ajanta & Ellora Caves", "Kailasa Monolithic Temple", "Raigad Fort", "Gateway of India", "Shaniwar Wada"],
    festivals: ["Ganesh Chaturthi", "Gudi Padwa", "Ellora-Ajanta Festival", "Shivaji Maharaj Jayanti"],
    handicrafts: ["Paithani Sarees", "Kolhapuri Chappals", "Warli Tribal Art", "Sawantwadi Lacquerware"],
    cuisine: ["Puran Poli", "Misal Pav", "Vada Pav", "Modak", "Pithla Bhakri"],
    description: "Seat of Chhatrapati Shivaji Maharaj's Maratha Empire, Ajanta's celestial Buddhist frescoes, and Ellora's mountain-carved Kailasa marvel.",
    spiritualSignificance: "Trimbakeshwar, Bhimashankar, and Grishneshwar Jyotirlingas; Lord Vitthal of Pandharpur; and Shirdi Sai Baba."
  },
  UP: {
    code: "UP",
    name: "Uttar Pradesh",
    capital: "Lucknow",
    region: "North India",
    languages: ["Hindi", "Awadhi", "Bhojpuri", "Braj Bhasha", "Urdu"],
    danceForms: ["Kathak (Classical)", "Raslila", "Ramlila", "Charkula"],
    monuments: ["Kashi Vishwanath Temple (Varanasi)", "Taj Mahal", "Fatehpur Sikri", "Sarnath Dhamek Stupa"],
    festivals: ["Kumbh Mela (Prayagraj)", "Dev Deepawali (Varanasi)", "Braj Holi (Mathura/Vrindavan)", "Diwali (Ayodhya)"],
    handicrafts: ["Banarasi Silk Sarees", "Lucknowi Chikankari Embroidery", "Moradabad Brassware", "Bhadohi Carpets"],
    cuisine: ["Awadhi Biryani", "Galouti Kebab", "Banarasi Paan", "Bedmi Poori", "Makhan Malai"],
    description: "The spiritual heartland of Bharat, birthplace of Lord Rama (Ayodhya) and Lord Krishna (Mathura), and the eternal ancient river ghats of Kashi.",
    spiritualSignificance: "Kashi (Varanasi), the oldest living city on Earth, Prayagraj Triveni Sangam, and Buddha's first sermon at Sarnath."
  },
  KL: {
    code: "KL",
    name: "Kerala",
    capital: "Thiruvananthapuram",
    region: "South India",
    languages: ["Malayalam"],
    danceForms: ["Kathakali (Classical)", "Mohiniyattam (Classical)", "Theyyam", "Koodiyattam"],
    monuments: ["Padmanabhaswamy Temple", "Bekal Fort", "Jewish Synagogue Kochi", "Mattancherry Palace"],
    festivals: ["Onam", "Vishu", "Thrissur Pooram", "Nehru Trophy Boat Race"],
    handicrafts: ["Aranmula Kannadi (Metal Mirror)", "Kathakali Masks", "Coir Products", "Kasavu Handloom Sarees"],
    cuisine: ["Sadhya", "Appam with Stew", "Kerala Puttu", "Fish Moilee", "Parippu Curry"],
    description: "God's Own Country, sanctuary of the sacred Sanskrit temple theatre Koodiyattam, fierce ritual trance dances of Theyyam, and Ayurvedic science.",
    spiritualSignificance: "Sree Padmanabhaswamy (richest Vishnu shrine), Sabarimala Ayyappa, and birth soil of Adi Shankaracharya at Kalady."
  },
  GJ: {
    code: "GJ",
    name: "Gujarat",
    capital: "Gandhinagar",
    region: "West India",
    languages: ["Gujarati"],
    danceForms: ["Garba", "Dandiya Raas", "Tippani", "Bhavai"],
    monuments: ["Somnath Temple", "Dwarkadhish Temple", "Rani ki Vav (Patan)", "Sun Temple (Modhera)"],
    festivals: ["Navratri (9 Nights of Garba)", "Rann Utsav", "International Kite Festival (Uttarayan)", "Janmashtami"],
    handicrafts: ["Bandhani (Tie-and-Dye)", "Patan Patola", "Rogan Art", "Kutch Mirror Embroidery"],
    cuisine: ["Dhokla", "Khandvi", "Gujarati Thali", "Undhiyu", "Thepla"],
    description: "Ancient Indus port of Lothal, Krishna's golden realm of Dwarka, Modhera's astronomical Sun Temple, and the White Desert of Kutch.",
    spiritualSignificance: "First Jyotirlinga at Somnath, Dwarka Char Dham, and Jain temples of Palitana on Shatrunjaya hill."
  },
  WB: {
    code: "WB",
    name: "West Bengal",
    capital: "Kolkata",
    region: "East India",
    languages: ["Bengali"],
    danceForms: ["Gaudiya Nritya", "Purulia Chhau", "Baul Dance", "Brita Dance"],
    monuments: ["Victoria Memorial", "Bishnupur Terracotta Temples", "Dakshineswar Kali Temple", "Hazarduari Palace"],
    festivals: ["Durga Puja (UNESCO Heritage)", "Poush Mela", "Ganga Sagar Mela", "Kali Puja"],
    handicrafts: ["Bishnupur Terracotta Pottery", "Kantha Embroidery", "Sholapith Craft", "Baluchari Sarees"],
    cuisine: ["Macher Jhol", "Rosogolla", "Sandesh", "Mishti Doi", "Kosha Mangsho"],
    description: "Cultural and philosophical epicenter of Renaissance India, birthplace of Rabindranath Tagore, Swami Vivekananda, and Bishnupur brick temples.",
    spiritualSignificance: "Dakshineswar and Kalighat Shakti Peethas, Ramakrishna Paramahamsa's Belur Math, and Mayapur ISKCON headquarters."
  },
  MP: {
    code: "MP",
    name: "Madhya Pradesh",
    capital: "Bhopal",
    region: "Central India",
    languages: ["Hindi", "Bundeli", "Malwi"],
    danceForms: ["Matki", "Gaur Dance", "Grida", "Saila"],
    monuments: ["Khajuraho Group of Temples", "Sanchi Stupa", "Bhimbetka Rock Shelters", "Gwalior Fort"],
    festivals: ["Khajuraho Dance Festival", "Tansen Music Festival (Gwalior)", "Lokrang", "Bhagoria Haat"],
    handicrafts: ["Chanderi Sarees", "Maheshwari Sarees", "Gond Tribal Paintings", "Dhokra Brasswork"],
    cuisine: ["Dal Bafla", "Bhopali Gosht Korma", "Poha Jalebi", "Bhutte Ka Kees"],
    description: "Heart of Bharat, home to prehistoric Stone Age art at Bhimbetka, Ashoka's Great Stupa at Sanchi, and the sculptured poetry of Khajuraho.",
    spiritualSignificance: "Mahakaleshwar Jyotirlinga at Ujjain, Omkareshwar Jyotirlinga on the Narmada River, and holy Chitrakoot."
  },
  PB: {
    code: "PB",
    name: "Punjab",
    capital: "Chandigarh",
    region: "North India",
    languages: ["Punjabi"],
    danceForms: ["Bhangra", "Giddha", "Jhumar", "Kikli"],
    monuments: ["Golden Temple (Sri Harmandir Sahib)", "Jallianwala Bagh", "Qila Mubarak (Bathinda)"],
    festivals: ["Baisakhi", "Lohri", "Hola Mohalla", "Gurupurab"],
    handicrafts: ["Phulkari Embroidery", "Punjabi Jutti", "Wood Inlay Work", "Durries"],
    cuisine: ["Makki di Roti & Sarson da Saag", "Butter Chicken", "Amritsari Kulcha", "Lassi"],
    description: "The land of five rivers, sacred sanctuary of the Golden Temple, immortal traditions of Seva, and exuberant Bhangra rhythms.",
    spiritualSignificance: "Sri Harmandir Sahib (Golden Temple), holy Takhts of Sikhism, and soil of the ten Sikh Gurus."
  },
  AS: {
    code: "AS",
    name: "Assam",
    capital: "Dispur",
    region: "Northeast India",
    languages: ["Assamese", "Bodo"],
    danceForms: ["Sattriya (Classical)", "Bihu Dance", "Bagurumba", "Jhumur"],
    monuments: ["Kamakhya Temple", "Rang Ghar (Sivasagar)", "Talatal Ghar", "Majuli Island Sattras"],
    festivals: ["Rongali Bihu", "Ambubachi Mela", "Majuli Raas Utsav", "Brahmaputra Festival"],
    handicrafts: ["Muga Golden Silk", "Assam Cane & Bamboo Crafts", "Bell Metal Craft", "Jaapi (Bamboo Hats)"],
    cuisine: ["Masor Tenga", "Khaar", "Duck Curry with Ash Gourd", "Pitha", "Assam Tea"],
    description: "The golden land of Brahmaputra, Saint Srimanta Sankardev's Sattriya classical dance, sacred Tantric Kamakhya Peeth, and Muga silk.",
    spiritualSignificance: "Kamakhya Shakti Peeth, world's largest river island Majuli (cradle of Vaishnavite Neo-Bhakti philosophy)."
  },
  // ── Remaining 16 States ────────────────────────────────────────────────────
  AP: {
    code: "AP",
    name: "Andhra Pradesh",
    capital: "Amaravati",
    region: "South India",
    languages: ["Telugu"],
    danceForms: ["Kuchipudi (Classical)", "Vilasini Natyam", "Veeranatyam", "Burrakatha"],
    monuments: ["Tirumala Tirupati Temple", "Lepakshi Nandi", "Undavalli Cave Temples", "Amaravati Stupa"],
    festivals: ["Ugadi", "Brahmotsavam (Tirupati)", "Sankranti", "Vijayadasami"],
    handicrafts: ["Kalamkari", "Kondapalli Toys", "Etikoppaka Lacquerware", "Srikalahasti Kalamkari"],
    cuisine: ["Pesarattu", "Gongura Mutton", "Punugulu", "Bobbatlu", "Pulihora"],
    description: "Land of the Telugu people, birthplace of Kuchipudi classical dance, Amaravati Buddhist art, and the world's most-visited pilgrimage at Tirupati.",
    spiritualSignificance: "Tirumala Venkateswara (richest temple on earth), Mallikarjuna Jyotirlinga at Srisailam, and Kanaka Durga at Vijayawada."
  },
  AR: {
    code: "AR",
    name: "Arunachal Pradesh",
    capital: "Itanagar",
    region: "Northeast India",
    languages: ["Nyishi", "Bengali", "Hindi", "Adi"],
    danceForms: ["Ponung (Adi)", "Wancho War Dance", "Aji Lamu", "Rekham Pada"],
    monuments: ["Tawang Monastery", "Ita Fort (Itanagar)", "Dirang Dzong", "Bhismaknagar Fort"],
    festivals: ["Losar", "Mopin", "Dree", "Solung"],
    handicrafts: ["Thangka Paintings", "Woven Shawls (Adi)", "Bamboo Craft", "Cane Furniture"],
    cuisine: ["Thukpa", "Pika Pila", "Apong (Rice Beer)", "Bamboo Shoot Curry"],
    description: "The Land of the Rising Sun, home to 26 major tribes, ancient Tawang Monastery (largest in India), and pristine Himalayan biodiversity.",
    spiritualSignificance: "Tawang Monastery — second largest Buddhist monastery in the world, birthplace of 6th Dalai Lama."
  },
  BR: {
    code: "BR",
    name: "Bihar",
    capital: "Patna",
    region: "East India",
    languages: ["Hindi", "Maithili", "Bhojpuri"],
    danceForms: ["Jat-Jatin", "Jhijhiya", "Bidesia", "Karma Dance"],
    monuments: ["Nalanda Mahavihara", "Mahabodhi Temple (Bodh Gaya)", "Vikramshila", "Kesaria Stupa"],
    festivals: ["Chhath Puja", "Sonepur Mela", "Sama-Chakeva", "Teej"],
    handicrafts: ["Madhubani (Mithila) Painting", "Sikki Grass Work", "Manjusha Art", "Sujani Embroidery"],
    cuisine: ["Litti Chokha", "Sattu Paratha", "Khaja", "Thekua", "Dalpuri"],
    description: "Birthplace of Buddhism and Jainism, seat of the Maurya and Gupta empires, home to the world's oldest university at Nalanda.",
    spiritualSignificance: "Bodh Gaya (site of Buddha's enlightenment), Rajgir (where Buddha taught), Vaishali (first democratic republic)."
  },
  CT: {
    code: "CT",
    name: "Chhattisgarh",
    capital: "Raipur",
    region: "Central India",
    languages: ["Hindi", "Chhattisgarhi"],
    danceForms: ["Panthi", "Raut Nacha", "Karma", "Saila"],
    monuments: ["Bhoramdeo Temple", "Sirpur Temple Complex", "Chitrakote Falls", "Danteshwari Temple"],
    festivals: ["Bastar Dussehra (75 days)", "Hareli", "Madai", "Pola"],
    handicrafts: ["Bastar Dhokra (Bell Metal)", "Dokra Art", "Bamboo Craft", "Godna Tattoo Art"],
    cuisine: ["Bafauri", "Chila", "Muthia", "Angakar Roti", "Farra"],
    description: "The Rice Bowl of India, home to the world's longest tribal festival Bastar Dussehra, ancient Sirpur temples, and rich Gondi tribal art.",
    spiritualSignificance: "Danteshwari Temple (one of 52 Shakti Peethas), Rajim Kumbh, and ancient Shiva temples at Bhoramdeo."
  },
  GA: {
    code: "GA",
    name: "Goa",
    capital: "Panaji",
    region: "West India",
    languages: ["Konkani", "Marathi", "English"],
    danceForms: ["Fugdi", "Dekhni", "Dhalo", "Shigmo"],
    monuments: ["Basilica of Bom Jesus (UNESCO)", "Se Cathedral", "Aguada Fort", "Chapora Fort"],
    festivals: ["Goa Carnival", "Shigmo", "Feast of St. Francis Xavier", "Sao Joao"],
    handicrafts: ["Azulejos Ceramic Tiles", "Coconut Shell Crafts", "Goan Pottery", "Cashew Crafts"],
    cuisine: ["Fish Curry Rice", "Vindaloo", "Xacuti", "Bebinca", "Feni"],
    description: "India's smallest state and most vibrant coastal gem — a confluence of Hindu temple culture, Portuguese colonial architecture, and golden beaches.",
    spiritualSignificance: "Basilica of Bom Jesus (UNESCO) housing relics of St. Francis Xavier; Mangeshi and Shanta Durga temples."
  },
  HR: {
    code: "HR",
    name: "Haryana",
    capital: "Chandigarh",
    region: "North India",
    languages: ["Hindi", "Haryanvi"],
    danceForms: ["Phag", "Dhamal", "Jhumar", "Khoria"],
    monuments: ["Kurukshetra Battlefield", "Panipat Museum", "Pinjore Gardens", "Surajkund"],
    festivals: ["Gita Jayanti", "Surajkund Crafts Mela", "Baisakhi", "Lohri"],
    handicrafts: ["Phulkari Embroidery", "Pottery (Rohtak)", "Handloom Durries", "Basketry"],
    cuisine: ["Bajra Khichdi", "Kadhi Pakora", "Singri ki Sabzi", "Bathua Raita", "Churma"],
    description: "The sacred land of Kurukshetra where the Bhagavad Gita was revealed, corridor of India's most decisive battles, and cradle of Harappan civilization.",
    spiritualSignificance: "Kurukshetra (Gita's birthplace), Brahma Sarovar (largest sacred tank in India), and Sthaneshwar Mahadev."
  },
  HP: {
    code: "HP",
    name: "Himachal Pradesh",
    capital: "Shimla",
    region: "North India",
    languages: ["Hindi", "Pahari", "Kinnauri"],
    danceForms: ["Nati", "Kullu Nati", "Chhapeli", "Dangi"],
    monuments: ["Hadimba Temple (Manali)", "Kangra Fort", "Key Monastery (Spiti)", "Tabo Monastery"],
    festivals: ["Kullu Dussehra (UNESCO)", "Losar", "Shivratri (Mandi)", "Minjar Fair"],
    handicrafts: ["Kangra Miniature Painting", "Kullu Shawls", "Chamba Rumal Embroidery", "Kinnauri Carpets"],
    cuisine: ["Dham (feast)", "Siddu", "Babru", "Aktori", "Madra"],
    description: "Dev Bhoomi — Abode of the Gods, nestled in the western Himalayas with ancient Buddhist monasteries, Deodar forests, and Kullu Dussehra.",
    spiritualSignificance: "Chintpurni, Jawala Devi, Chamunda Devi Shakti Peethas; Key and Tabo Buddhist monasteries (1000 years old)."
  },
  JH: {
    code: "JH",
    name: "Jharkhand",
    capital: "Ranchi",
    region: "East India",
    languages: ["Hindi", "Santali", "Bengali"],
    danceForms: ["Chhau (Seraikella)", "Jhumair", "Mardana Jhumair", "Domkach"],
    monuments: ["Baidyanath Temple (Deoghar)", "Pareshnath Hill Jain Temples", "Jagannath Temple (Ranchi)", "Netarhat"],
    festivals: ["Sarhul", "Karma", "Tusu Parab", "Sohrai"],
    handicrafts: ["Sohrai & Khovar Painting", "Dokra Craft", "Bamboo & Cane", "Paitkar Painting"],
    cuisine: ["Dhuska", "Chilka Roti", "Rugra", "Handia (Rice Beer)", "Litti"],
    description: "The tribal heartland of India, rich with Santali culture, Chhau martial dance, sacred Baidyanath Jyotirlinga, and mineral-rich forest landscapes.",
    spiritualSignificance: "Baidyanath Jyotirlinga (one of 12), Pareshnath Hill (holiest Jain pilgrimage in East India), and Rajrappa Chhinnamasta Devi."
  },
  MN: {
    code: "MN",
    name: "Manipur",
    capital: "Imphal",
    region: "Northeast India",
    languages: ["Meitei (Manipuri)", "Tangkul", "Mizo"],
    danceForms: ["Manipuri (Classical)", "Ras Lila", "Thang-Ta (Martial)", "Lai Haraoba"],
    monuments: ["Kangla Fort", "Govindaji Temple", "Loktak Lake", "Shri Govindajee Temple"],
    festivals: ["Yaoshang (Holi)", "Ningol Chakouba", "Cheiraoba", "Kut"],
    handicrafts: ["Moirang Phee Weaving", "Kauna Reed Craft", "Pottery (Longpi)", "Bamboo & Cane"],
    cuisine: ["Eromba", "Singju", "Ngari Fish", "Chamthong", "Paknam"],
    description: "The Jewel of India — birthplace of Manipuri classical dance, Polo (brought to the world), sacred Loktak Lake, and the martial art Thang-Ta.",
    spiritualSignificance: "Govindajee Temple (Vaishnavism centre), Kangla Fort (sacred seat of Meitei kings), and Thangjing Hill deity."
  },
  ML: {
    code: "ML",
    name: "Meghalaya",
    capital: "Shillong",
    region: "Northeast India",
    languages: ["Khasi", "Garo", "Jaintia"],
    danceForms: ["Nongkrem Dance", "Wangala Dance (Garo)", "Laho Dance", "Shad Suk Mynsiem"],
    monuments: ["Living Root Bridges (Cherrapunji)", "Mawlynnong Village", "Shillong Peak", "Nohkalikai Falls"],
    festivals: ["Shad Suk Mynsiem", "Wangala", "Nongkrem", "Behdienkhlam"],
    handicrafts: ["Cane & Bamboo Craft", "Khasi Traditional Weaving", "Garo Daka Shawl", "Wood Carving"],
    cuisine: ["Jadoh (Khasi Rice-Meat)", "Dohneiiong", "Tungrymbai", "Nakham Bitchi"],
    description: "Abode of Clouds — the wettest place on earth at Mawsynram, matrilineal Khasi society, and the miraculous living root bridges of Cherrapunji.",
    spiritualSignificance: "Living Bridges of Cherrapunji (sacred ecological architecture), Mawlynnong — Asia's cleanest village with animist traditions."
  },
  MZ: {
    code: "MZ",
    name: "Mizoram",
    capital: "Aizawl",
    region: "Northeast India",
    languages: ["Mizo", "English"],
    danceForms: ["Cheraw (Bamboo Dance)", "Khuallam", "Chheih Lam", "Sarlamkai"],
    monuments: ["Reiek Heritage Village", "Vantawng Falls", "Murlen National Park", "Durtlang Hills"],
    festivals: ["Chapchar Kut", "Mim Kut", "Pawl Kut", "Thalfavang Kut"],
    handicrafts: ["Puanchei (Traditional Textile)", "Bamboo & Cane Craft", "Mizo Shawls", "Thangchhuah Weaving"],
    cuisine: ["Bai (Mustard Leaves Stew)", "Mizo Vawksa Rep", "Saawhchiar", "Zu (Rice Beer)"],
    description: "The Land of the Blue Mountains — known for its gentle Mizo people, the mesmerizing Cheraw bamboo dance, and verdant rolling hills.",
    spiritualSignificance: "Reiek mountain (spiritual significance in Mizo tradition); strong Christian heritage with colonial-era churches."
  },
  NL: {
    code: "NL",
    name: "Nagaland",
    capital: "Kohima",
    region: "Northeast India",
    languages: ["Nagamese", "English", "16 tribal languages"],
    danceForms: ["War Dance (Konyak)", "Chang Lo", "Zeliang Dance", "Angami Warrior Dance"],
    monuments: ["Kohima War Cemetery", "Dzukou Valley", "Khonoma Village", "Japfu Peak"],
    festivals: ["Hornbill Festival", "Moatsu (Ao Tribe)", "Sekrenyi (Angami)", "Tuluni"],
    handicrafts: ["Naga Shawls", "Cane & Bamboo", "Wood Carving", "Beadwork & Jewelry"],
    cuisine: ["Smoked Pork with Bamboo Shoot", "Galho", "Anishi", "Naga Chili Chutney"],
    description: "Land of the Nagas — 16 distinct warrior tribes, the spectacular Hornbill Festival, terraced rice fields, and vibrant headhunter heritage.",
    spiritualSignificance: "Kohima War Cemetery (WWII battle turning point); animist Naga spiritual traditions, sacred village morung (dormitory) culture."
  },
  SK: {
    code: "SK",
    name: "Sikkim",
    capital: "Gangtok",
    region: "Northeast India",
    languages: ["Nepali", "Sikkimese (Bhutia)", "Lepcha"],
    danceForms: ["Cham (Masked Dance)", "Maruni", "Singhi Chham (Snow Lion Dance)", "Gha-To Kito"],
    monuments: ["Rumtek Monastery", "Pemayangtse Monastery", "Namgyal Institute of Tibetology", "Kangchenjunga"],
    festivals: ["Losar", "Saga Dawa", "Pang Lhabsol", "Tihar"],
    handicrafts: ["Thangka Painting", "Wood Carving", "Carpet Weaving", "Silver Jewellery"],
    cuisine: ["Momos", "Thukpa", "Gundruk", "Sha Phaley", "Chang (Millet Beer)"],
    description: "The Switzerland of the East — flanked by Kangchenjunga (world's 3rd highest peak), ancient Buddhist monasteries, and cardamom forests.",
    spiritualSignificance: "Pemayangtse (17th-century Nyingma monastery), Rumtek Monastery (seat of Karmapa), and Kangchenjunga (sacred mountain guardian)."
  },
  TG: {
    code: "TG",
    name: "Telangana",
    capital: "Hyderabad",
    region: "South India",
    languages: ["Telugu", "Urdu"],
    danceForms: ["Perini Sivatandavam", "Lambadi Dance", "Dappu Dance", "Kolatam"],
    monuments: ["Ramappa Temple (UNESCO)", "Golconda Fort", "Charminar", "Warangal Fort"],
    festivals: ["Bathukamma", "Bonalu", "Telangana Formation Day", "Ugadi"],
    handicrafts: ["Pochampally Ikat", "Nirmal Paintings", "Bidriware", "Kalamkari"],
    cuisine: ["Hyderabadi Biryani", "Gongura Pickle", "Sakinalu", "Pesarattu", "Qubani ka Meetha"],
    description: "The land of Nizams, UNESCO-listed Ramappa Temple, Hyderabadi Biryani culture, and the magnificent Golconda Diamond fort.",
    spiritualSignificance: "Yadadri Lakshmi Narasimha Temple, Thousand Pillar Temple at Warangal, and Yadagirigutta."
  },
  TR: {
    code: "TR",
    name: "Tripura",
    capital: "Agartala",
    region: "Northeast India",
    languages: ["Bengali", "Kokborok"],
    danceForms: ["Hojagiri", "Garia", "Lebang Boomani", "Mamita"],
    monuments: ["Ujjayanta Palace", "Neermahal (Lake Palace)", "Unakoti Rock Carvings", "Tripura Sundari Temple"],
    festivals: ["Kharchi Puja", "Garia Puja", "Ker Festival", "Diwali"],
    handicrafts: ["Bamboo Craft", "Cane Work", "Rignai Weaving", "Wood Carving"],
    cuisine: ["Mui Borok (fish dishes)", "Gudok", "Bangui Rice", "Chakhwi"],
    description: "A cultural bridge between Northeast India and Bangladesh, known for ancient Unakoti rock carvings, Neermahal palace on water, and tribal Kokborok heritage.",
    spiritualSignificance: "Tripura Sundari Shakti Peeth (one of 51 Shakti Peethas), Unakoti (9 million carved Shiva figures) — major Shaivite pilgrimage."
  },
  UT: {
    code: "UT",
    name: "Uttarakhand",
    capital: "Dehradun",
    region: "North India",
    languages: ["Hindi", "Garhwali", "Kumaoni"],
    danceForms: ["Jhora", "Langvir Nritya", "Chholiya", "Barada Nati"],
    monuments: ["Badrinath Temple", "Kedarnath Temple", "Hemkund Sahib", "Haridwar Ganga Ghats"],
    festivals: ["Kumbh Mela (Haridwar)", "Ganga Dussehra", "Uttarayani", "Phool Dei"],
    handicrafts: ["Aipan Folk Art", "Ring (Copper Utensils)", "Woolen Carpets", "Pahari Miniature Painting"],
    cuisine: ["Kafuli", "Bhatt ki Churdkani", "Chainsoo", "Bal Mithai", "Singori"],
    description: "Dev Bhoomi — the sacred Himalayan abode hosting the Char Dham pilgrimage (Badrinath, Kedarnath, Gangotri, Yamunotri) and the source of the Ganga.",
    spiritualSignificance: "Char Dham Yatra, Haridwar Kumbh, Rishikesh (world Yoga capital), and Kedarnath Jyotirlinga."
  },
  // ── Union Territories ──────────────────────────────────────────────────────
  AN: {
    code: "AN",
    name: "Andaman & Nicobar Islands",
    capital: "Port Blair",
    region: "Bay of Bengal",
    languages: ["Hindi", "Bengali", "Tamil", "Telugu"],
    danceForms: ["Nicobari Dance", "Onge Tribal Dance", "Karen Dance"],
    monuments: ["Cellular Jail (Kaala Pani)", "Ross Island", "Havelock Island", "Baratang Limestone Caves"],
    festivals: ["Island Tourism Festival", "Subhash Mela", "Andaman Sangeet Natak Festival"],
    handicrafts: ["Shell Craft", "Cane & Bamboo Products", "Coconut Shell Art"],
    cuisine: ["Fish Curry", "Lobster Platters", "Coconut-based dishes", "Jungle Fowl preparations"],
    description: "An archipelago of 572 islands — home to the Cellular Jail (witness to India's freedom struggle), pristine coral reefs, and protected Jarawa tribe.",
    spiritualSignificance: "Cellular Jail — a national pilgrimage site honoring India's freedom fighters who sacrificed lives in Kaala Pani."
  },
  CH: {
    code: "CH",
    name: "Chandigarh",
    capital: "Chandigarh",
    region: "North India",
    languages: ["Hindi", "Punjabi"],
    danceForms: ["Bhangra", "Giddha"],
    monuments: ["Rock Garden (Nek Chand)", "Capitol Complex (UNESCO)", "Sukhna Lake", "Rose Garden"],
    festivals: ["Chandigarh Carnival", "Baisakhi", "Rose Festival"],
    handicrafts: ["Phulkari Embroidery", "Pottery"],
    cuisine: ["Butter Chicken", "Dal Makhani", "Chole Bhature", "Lassi"],
    description: "India's best-planned city — Le Corbusier's modernist masterpiece, home to the Open Hand monument and the legendary Rock Garden sculpted from scrap.",
    spiritualSignificance: "Mansa Devi and Chandi Devi temples; the city's very name honors Goddess Chandi."
  },
  DD: {
    code: "DD",
    name: "Dadra & Nagar Haveli and Daman & Diu",
    capital: "Daman",
    region: "West India",
    languages: ["Gujarati", "Hindi", "Marathi"],
    danceForms: ["Tarpa Dance (Warli)", "Siddi Dance", "Ghoomar"],
    monuments: ["Diu Fort", "St. Paul's Church (Diu)", "Naida Caves", "Vanangana Garden"],
    festivals: ["Daman Festival", "Diu Festival", "Navratri"],
    handicrafts: ["Warli Tribal Art", "Lacquerware", "Bamboo & Cane"],
    cuisine: ["Fish Curry", "Patio", "Coconut Prawn Curry", "Vindaloo"],
    description: "Former Portuguese enclaves on India's western coast — known for colonial architecture, pristine beaches, Warli tribal art, and sea forts.",
    spiritualSignificance: "St. Paul's Church (Diu) — one of the best-preserved Portuguese churches; Gangeshwar Shiva Temple with sea-washed lingas."
  },
  DL: {
    code: "DL",
    name: "Delhi",
    capital: "New Delhi",
    region: "North India",
    languages: ["Hindi", "Punjabi", "Urdu", "English"],
    danceForms: ["Kathak", "Bhangra", "Giddha", "Sufi Qawwali"],
    monuments: ["Red Fort (UNESCO)", "Qutub Minar (UNESCO)", "Humayun's Tomb (UNESCO)", "India Gate", "Lotus Temple"],
    festivals: ["Diwali", "Qutub Festival", "Durga Puja", "Eid", "Republic Day Parade"],
    handicrafts: ["Zardozi Embroidery", "Meenakari Jewelry", "Papier-Mache", "Dilli Haat Crafts"],
    cuisine: ["Butter Chicken", "Chole Bhature", "Dilli ki Chaat", "Nihari", "Paranthe Wali Gali"],
    description: "The eternal capital — 8 historical cities layered atop each other, from Indraprastha of Mahabharata to Shahjahanabad, cradle of Mughal and Sultanate glory.",
    spiritualSignificance: "Hazrat Nizamuddin Dargah (Sufi pilgrimage), Lotus Temple, Akshardham Temple, and Kalkaji Mandir."
  },
  JK: {
    code: "JK",
    name: "Jammu & Kashmir",
    capital: "Srinagar (Summer) / Jammu (Winter)",
    region: "North India",
    languages: ["Kashmiri", "Dogri", "Urdu", "Hindi"],
    danceForms: ["Rouf", "Hafiza", "Bhand Pather", "Dumhal"],
    monuments: ["Srinagar Dal Lake Houseboats", "Shankaracharya Temple", "Martand Sun Temple", "Hari Parbat Fort"],
    festivals: ["Tulip Festival (Dal Lake)", "Hemis Festival", "Baisakhi", "Urs of Hazrat Bal"],
    handicrafts: ["Pashmina Shawls", "Kashmiri Carpet Weaving", "Paper Mache", "Walnut Wood Carving"],
    cuisine: ["Rogan Josh", "Wazwan Feast", "Kahwa Tea", "Yakhni", "Haak Saag"],
    description: "Paradise on Earth — Dal Lake's shikaras, Mughal gardens, Pashmina weaving tradition, and the ancient Shaivite heritage of Kashmir Shaivism.",
    spiritualSignificance: "Amarnath Shiva Cave (Jyotirlinga site), Vaishno Devi (2nd most visited shrine in India), and Martand Sun Temple ruins."
  },
  LA: {
    code: "LA",
    name: "Ladakh",
    capital: "Leh",
    region: "North India (Himalayan)",
    languages: ["Ladakhi", "Tibetan", "Hindi", "Urdu"],
    danceForms: ["Cham (Masked Monastery Dance)", "Shondol (Royal Dance)", "Jabro", "Gzas"],
    monuments: ["Thikse Monastery", "Hemis Monastery", "Leh Palace", "Pangong Tso Lake"],
    festivals: ["Hemis Festival", "Losar (Tibetan New Year)", "Ladakh Festival", "Sindhu Darshan"],
    handicrafts: ["Thangka Paintings", "Pashmina Weaving", "Ladakhi Carpet (Radi)", "Silver Jewellery"],
    cuisine: ["Tsampa", "Skyu (Pasta Stew)", "Butter Tea (Gur-Gur Chai)", "Momos", "Chhang (Barley Beer)"],
    description: "The Land of High Passes — a moonscape of monasteries perched on cliffs, turquoise Pangong Lake, and ancient Tibetan Buddhist civilization at 3,500m altitude.",
    spiritualSignificance: "Hemis Monastery (largest monastic festival in the Himalayas), Thikse (resembles Potala Palace), and the sacred Indus-Zanskar confluence."
  },
  LD: {
    code: "LD",
    name: "Lakshadweep",
    capital: "Kavaratti",
    region: "Arabian Sea",
    languages: ["Malayalam", "Jeseri (Mahl)"],
    danceForms: ["Lava Dance", "Kolkali", "Parichakali", "Oppana"],
    monuments: ["Agatti Island", "Kavaratti Mosque", "Marine Museum", "Bangaram Atoll"],
    festivals: ["Eid ul-Fitr", "Eid ul-Adha", "Muharram", "Milad-un-Nabi"],
    handicrafts: ["Coconut Shell Craft", "Coir Products", "Handloom Weaving"],
    cuisine: ["Tuna Fish Curry", "Octopus dishes", "Coconut-based curries", "Kallummakaya (Mussels)"],
    description: "India's only coral island territory — 36 pristine atolls with lagoons of turquoise water, untouched coral reefs, and a simple fishing community lifestyle.",
    spiritualSignificance: "Hazrat Ubaidullah's Dargah on Andrott Island — believed to be one of the earliest Islamic missionaries to India (7th century CE)."
  },
  PY: {
    code: "PY",
    name: "Puducherry",
    capital: "Puducherry",
    region: "South India",
    languages: ["Tamil", "French", "Telugu", "Malayalam"],
    danceForms: ["Bharatanatyam", "Karagattam", "Oyilattam"],
    monuments: ["Auroville Matrimandir", "Sri Aurobindo Ashram", "French Quarter (White Town)", "Immaculate Conception Cathedral"],
    festivals: ["Bastille Day", "Pongal", "Masi Magam", "Kartikai Deepam"],
    handicrafts: ["Handmade Paper", "Incense (Agarbatti)", "Leather Goods", "Terracotta Pottery"],
    cuisine: ["Creole Cuisine", "Pondicherry Fish Curry", "Baguette with Curry", "Pain de Campagne"],
    description: "The French Riviera of the East — where Tamil heritage meets colonial French boulevard culture, home to Sri Aurobindo Ashram and the experimental Auroville township.",
    spiritualSignificance: "Sri Aurobindo Ashram (integral yoga philosophy), Auroville (universal town beyond religions), and ancient Vedapuri Isvaran Temple."
  }
};

interface BharatMapExplorerProps {
  onNavigateTab?: (tabId: string, contextId?: string) => void;
  onAskAI?: (prompt: string) => void;
}

export const BharatMapExplorer: React.FC<BharatMapExplorerProps> = ({
  onNavigateTab,
  onAskAI
}) => {
  const { t, language } = useLanguage();
  const currentLangMeta = SUPPORTED_LANGUAGES.find((l) => l.code === language) || { name: "English", code: "en" };
  const [selectedCode, setSelectedCode] = useState<string>("RJ");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNarrating, setIsNarrating] = useState(false);
  const [translatedSubtitle, setTranslatedSubtitle] = useState<string | null>(null);

  const activeState = STATES_CULTURE_REGISTRY[selectedCode] || {
    code: selectedCode,
    name: selectedCode,
    capital: "Heritage Center",
    region: "Bharat",
    languages: ["Hindi", "Regional"],
    danceForms: ["Regional Folk Arts"],
    monuments: ["Historical Temples & Palaces"],
    festivals: ["Regional Utsavas"],
    handicrafts: ["Traditional Handlooms & Crafts"],
    cuisine: ["Regional Delicacies"],
    description: "An integral cultural realm of Bharat, bearing distinctive folklore, art, and traditions.",
    spiritualSignificance: "Sacred pilgrim pathways and regional sanctuaries."
  };

  const handleStateClick = (code: string) => {
    setSelectedCode(code);
    if (isNarrating) {
      audioManager.stopNarration();
      setIsNarrating(false);
      setTranslatedSubtitle(null);
    }
  };

  const handleToggleNarration = async () => {
    if (isNarrating) {
      audioManager.stopNarration();
      setIsNarrating(false);
      setTranslatedSubtitle(null);
      return;
    }

    setIsNarrating(true);
    setTranslatedSubtitle(null);
    const speechText = `${activeState.name}. Capital is ${activeState.capital}. ${activeState.description} ${activeState.spiritualSignificance || ""}`.trim();
    await audioManager.speakNarration(
      speechText,
      language,
      () => {
        setIsNarrating(false);
        setTranslatedSubtitle(null);
      },
      (translated) => {
        setTranslatedSubtitle(translated);
      }
    );
  };

  return (
    <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs text-[#D4AF37] font-mono tracking-widest uppercase">
          <Globe className="w-3.5 h-3.5" />
          Interactive State Atlas of India
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#E8DFD1] tracking-tight">
          Bharat <span className="text-[#D4AF37]">Darshan</span>
        </h1>
        <p className="text-sm sm:text-base text-[#E8DFD1]/70 leading-relaxed">
          Click any State or Union Territory across the sacred geography of India to uncover its classical dances, heritage monuments, GI-tagged crafts, and living traditions.
        </p>
      </div>

      {/* State Quick Selector Buttons for common states */}
      <div className="flex flex-wrap items-center justify-center gap-2 pb-2">
        {Object.keys(STATES_CULTURE_REGISTRY).map((code) => {
          const st = STATES_CULTURE_REGISTRY[code];
          const isSelected = selectedCode === code;
          return (
            <button
              key={code}
              onClick={() => handleStateClick(code)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                isSelected
                  ? "bg-[#D4AF37] text-[#07080B] font-bold shadow-lg shadow-[#D4AF37]/20 scale-105"
                  : "bg-[#181B24] text-[#E8DFD1]/70 hover:text-[#D4AF37] border border-white/5 hover:border-[#D4AF37]/30"
              }`}
            >
              {st.name}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Interactive Map (Left) + Cultural Dossier Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: SVG India Map Container */}
        <div className="lg:col-span-7 bg-[#0E1015] border border-[#D4AF37]/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-xs font-mono text-[#D4AF37]">
            <MapPin className="w-4 h-4 text-[#D4AF37] animate-pulse" />
            <span>Click any territory on map</span>
          </div>

          <div className="flex justify-center items-center py-4 min-h-[500px]">
            <div className="w-full max-w-[540px]">
              <IndiaMap
                onClick={handleStateClick}
                size="100%"
                mapColor="#1c202a"
                strokeColor="#D4AF37"
                strokeWidth="0.8"
                hoverColor="#D4AF37"
                className="transition-all duration-300 cursor-pointer"
              />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-[#E8DFD1]/50">
            <span>Hover to inspect • Click to open Cultural Dossier</span>
            <span className="font-mono text-[#D4AF37]">State Code: {selectedCode}</span>
          </div>
        </div>

        {/* Right: Rich State Cultural Dossier */}
        <div className="lg:col-span-5 bg-[#0E1015] border border-[#D4AF37]/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Top Badge & State Title */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#D4AF37] px-2.5 py-1 rounded-md bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                {activeState.region} • {activeState.code}
              </span>
              <span className="text-xs text-[#E8DFD1]/60 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                Capital: <strong className="text-[#E8DFD1]">{activeState.capital}</strong>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#E8DFD1]">
              {activeState.name}
            </h2>
            <p className="text-xs sm:text-sm text-[#E8DFD1]/70 leading-relaxed">
              {activeState.description}
            </p>

            {/* Regional Sarvam Audio Narration Button */}
            <div className="pt-1">
              <button
                onClick={handleToggleNarration}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isNarrating
                    ? "bg-[#D4AF37] text-[#07080B] shadow-md animate-pulse font-bold"
                    : "bg-white/10 hover:bg-[#D4AF37]/20 text-[#F5E0A0] border border-[#D4AF37]/35"
                }`}
              >
                {isNarrating ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />}
                <span>{isNarrating ? "Stop Audio" : `Listen State Lore • ${currentLangMeta.name}`}</span>
              </button>
            </div>

            {isNarrating && translatedSubtitle && (
              <div className="p-3 rounded-xl bg-black/80 border border-[#D4AF37]/40 text-[#F5E0A0] text-xs font-serif leading-relaxed animate-fade-in flex items-start gap-2 shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5 animate-spin" />
                <span>{translatedSubtitle}</span>
              </div>
            )}
          </div>

          {/* Languages */}
          <div className="p-3.5 rounded-2xl bg-[#181B24] border border-white/5 space-y-1.5">
            <div className="text-[11px] font-mono text-[#D4AF37] uppercase flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5" />
              Spoken Languages
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activeState.languages.map((l, idx) => (
                <span key={idx} className="text-xs px-2.5 py-0.5 rounded-md bg-white/5 text-[#E8DFD1]">
                  {l}
                </span>
              ))}
            </div>
          </div>

          {/* Key Cultural Pillars */}
          <div className="space-y-4 text-xs sm:text-sm">
            {/* Monuments */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-mono text-[#D4AF37] uppercase flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-[#D4AF37]" />
                Iconic Monuments & Temples
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {activeState.monuments.map((m, idx) => (
                  <li key={idx} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[#E8DFD1]/80 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>

            {/* Dance & Performing Arts */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-mono text-[#D4AF37] uppercase flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-[#D4AF37]" />
                Classical & Folk Dances
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeState.danceForms.map((d, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 text-xs">
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {/* Traditional Handicrafts & GI Tags */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-mono text-[#D4AF37] uppercase flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
                Handicrafts & GI Tags
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeState.handicrafts.map((h, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/5 text-[#E8DFD1]/80 text-xs">
                    {h}
                  </span>
                ))}
              </div>
            </div>

            {/* Cuisine */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-mono text-[#D4AF37] uppercase flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-[#D4AF37]" />
                Famous Cuisine
              </div>
              <p className="text-xs text-[#E8DFD1]/70">
                {activeState.cuisine.join(" • ")}
              </p>
            </div>
          </div>

          {/* Action Button: Ask Pandit AI about this State */}
          <div className="pt-2">
            <button
              onClick={() => {
                if (onAskAI) {
                  onAskAI(`Tell me about the spiritual heritage, classical arts, and ancient history of ${activeState.name}.`);
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#07080B] font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-lg shadow-[#D4AF37]/20"
            >
              <Bot className="w-4 h-4" />
              Ask Cultural Guide about {activeState.name}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
