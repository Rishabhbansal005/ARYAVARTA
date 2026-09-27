"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Check,
  Heart,
  Clock,
  MapPin,
  Search,
  ExternalLink,
  X,
  CreditCard,
  UserCheck,
  Trash2,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useLanguage } from "@/context/LanguageContext";

interface CraftItem {
  id: string;
  title: string;
  craftName: string;
  category: "paintings" | "metalwork" | "textiles" | "woodwork";
  state: string;
  artisanName: string;
  artisanTitle: string;
  price: number;
  craftHours: number;
  giCertified: boolean;
  giCode: string;
  description: string;
  materials: string[];
  gradient: string;
  iconSymbol: string;
  imageUrl: string;
}

const CRAFT_GALLERY: CraftItem[] = [
  {
    id: "pattachitra-01",
    title: "Surya & The 7-Horse Celestial Chariot",
    craftName: "Tala Pattachitra (Palm Leaf Etching)",
    category: "paintings",
    state: "Raghurajpur, Odisha",
    artisanName: "Guru Rabi Narayan Sahoo",
    artisanTitle: "4th Generation Master Craftsman",
    price: 3850,
    craftHours: 48,
    giCertified: true,
    giCode: "GI-OD-PATTA-04",
    description: "Intricately etched with an iron stylus on dried palm leaves and rubbed with lampblack & conch shell white pigments.",
    materials: ["Dried Tala Palm Leaves", "Lampblack (Kajjala)", "Conch Shell Paste", "Hingula Vermilion"],
    gradient: "from-amber-600 via-yellow-700 to-amber-900",
    iconSymbol: "📜",
    imageUrl: "/images/bazaar/pattachitra.jpg",
  },
  {
    id: "bidriware-02",
    title: "Mughal Arabesque Silver Inlay Aftaba Vase",
    craftName: "Bidriware (Silver Inlay on Zinc-Copper)",
    category: "metalwork",
    state: "Bidar, Karnataka",
    artisanName: "Ustad Rashid Ali Khan",
    artisanTitle: "National Master Metal Artisan",
    price: 6400,
    craftHours: 64,
    giCertified: true,
    giCode: "GI-KA-BIDRI-12",
    description: "Cast from blackened zinc-copper alloy, hand-carved with pure 99.9% fine silver wire inlay, treated with historic fort soil.",
    materials: ["Zinc-Copper Alloy", "99.9% Pure Silver Wire", "Bidar Fort Soil & Sal Ammoniac"],
    gradient: "from-slate-700 via-gray-800 to-zinc-950",
    iconSymbol: "🏺",
    imageUrl: "/images/bazaar/bidriware.jpg",
  },
  {
    id: "madhubani-03",
    title: "Tree of Life & Kamadhenu Folk Scroll",
    craftName: "Madhubani (Mithila Bamboo Quill Painting)",
    category: "paintings",
    state: "Madhubani, Bihar",
    artisanName: "Shanti Devi",
    artisanTitle: "State Awardee Mithila Folk Artist",
    price: 2950,
    craftHours: 36,
    giCertified: true,
    giCode: "GI-BR-MITHILA-01",
    description: "Drawn freehand using bamboo quill nibs on handmade cotton rag paper with organic indigo, turmeric, and marigold extracts.",
    materials: ["Handmade Cotton Paper", "Bamboo Quill (Nibs)", "Turmeric, Indigo & Bael Gum"],
    gradient: "from-rose-600 via-pink-700 to-amber-800",
    iconSymbol: "🎨",
    imageUrl: "/images/bazaar/madhubani.jpg",
  },
  {
    id: "banarasi-04",
    title: "Shikargah Royal Katan Silk Brocade",
    craftName: "Banarasi Handloom Brocade Silk",
    category: "textiles",
    state: "Varanasi, Uttar Pradesh",
    artisanName: "Mohammad Farooq Weaver",
    artisanTitle: "Master Jacquard Pit-Loom Weaver",
    price: 8900,
    craftHours: 85,
    giCertified: true,
    giCode: "GI-UP-BANARAS-08",
    description: "Pure mulberry Katan silk handwoven with gold and silver Zari floral jaal motifs inspired by Mughal royal court textiles.",
    materials: ["Mulberry Katan Silk", "Pure Silver & Gold Zari Thread", "Organic Natural Dyes"],
    gradient: "from-red-700 via-rose-800 to-amber-900",
    iconSymbol: "🧣",
    imageUrl: "/images/bazaar/banarasi.jpg",
  },
  {
    id: "tanjore-05",
    title: "Gilded Balaji 22K Gold Foil Painting",
    craftName: "Thanjavur Sacred Gold Foil Art",
    category: "paintings",
    state: "Thanjavur, Tamil Nadu",
    artisanName: "S. Murugesan Sthapati",
    artisanTitle: "Traditional Temple Gilder Lineage",
    price: 11500,
    craftHours: 92,
    giCertified: true,
    giCode: "GI-TN-TANJORE-03",
    description: "Teakwood plank board relief with chalk gesso embossing, embedded with Jaipur semi-precious gems and pure 22K gold leaf.",
    materials: ["Teakwood Base", "22-Karat Gold Leaf", "Jaipur Semi-Precious Gems", "Gesso Paste"],
    gradient: "from-amber-500 via-yellow-600 to-yellow-800",
    iconSymbol: "🖼️",
    imageUrl: "/images/bazaar/tanjore.jpg",
  },
  {
    id: "channapatna-06",
    title: "Organic Lacquer Ivory-Wood Animal Carousel",
    craftName: "Channapatna Wooden Lacquerware",
    category: "woodwork",
    state: "Channapatna, Karnataka",
    artisanName: "B. Manjunath",
    artisanTitle: "Toy-Town Guild Master",
    price: 1450,
    craftHours: 18,
    giCertified: true,
    giCode: "GI-KA-CHANNA-09",
    description: "Turned on a traditional lathe from soft Hale-wood (Wrightia tinctoria) and polished with natural vegetable lacquer and screw-pine leaves.",
    materials: ["Hale Wood (Ivory Wood)", "Natural Shellac", "Turmeric & Indigo Vegetable Lacquer"],
    gradient: "from-emerald-600 via-teal-700 to-cyan-900",
    iconSymbol: "🎠",
    imageUrl: "/images/bazaar/channapatna.jpg",
  },
];

interface BazaarExplorerProps {
  initialCraftId?: string;
}

export const BazaarExplorer: React.FC<BazaarExplorerProps> = ({ initialCraftId }) => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CraftItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activePassportItem, setActivePassportItem] = useState<CraftItem | null>(null);
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);
  const [customerName, setCustomerName] = useState("");

  useEffect(() => {
    if (initialCraftId) {
      const found = CRAFT_GALLERY.find(
        (c) => c.id === initialCraftId || c.id.includes(initialCraftId) || initialCraftId.includes(c.id)
      );
      if (found) {
        setActivePassportItem(found);
      }
    }
  }, [initialCraftId]);

  // Lock background scroll & pause Lenis when Passport modal or Cart drawer is open
  useEffect(() => {
    if (activePassportItem || isCartOpen) {
      if (typeof window !== "undefined" && window.__lenis) {
        window.__lenis.stop();
      }
      document.body.style.overflow = "hidden";
    } else {
      if (typeof window !== "undefined" && window.__lenis) {
        window.__lenis.start();
      }
      document.body.style.overflow = "";
    }
    return () => {
      if (typeof window !== "undefined" && window.__lenis) {
        window.__lenis.start();
      }
      document.body.style.overflow = "";
    };
  }, [activePassportItem, isCartOpen]);

  const handleRemoveFromCart = (indexToRemove: number) => {
    setCart((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const filteredItems = CRAFT_GALLERY.filter((item) => {
    const matchCat = selectedCategory === "all" || item.category === selectedCategory;
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.craftName.toLowerCase().includes(search.toLowerCase()) ||
      item.state.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAddToCart = (item: CraftItem) => {
    setCart((prev) => [...prev, item]);
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#D4AF37", "#F5E0A0", "#FFF"],
    });
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || !customerName.trim()) return;

    try {
      // Connect to Supabase artisan_orders table
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          items: cart.map((i) => ({ id: i.id, title: i.title, price: i.price, artisan: i.artisanName })),
          totalAmount: cart.reduce((sum, item) => sum + item.price, 0),
        }),
      });

      setIsOrderSubmitted(true);
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 },
        colors: ["#D4AF37", "#4ade80", "#F5E0A0"],
      });
      setTimeout(() => {
        setCart([]);
        setIsCartOpen(false);
        setIsOrderSubmitted(false);
        setCustomerName("");
      }, 3500);
    } catch (err) {
      console.warn("Order checkout error:", err);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Title Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#F5E0A0] text-xs tracking-[0.2em]">
          <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>KALA MITRA • AUTHENTIC ARTISAN BAZAAR</span>
        </div>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-gold-gradient tracking-wide">
          Bazaar of Bharat
        </h1>
        <p className="max-w-2xl mx-auto text-xs sm:text-sm text-[#E8DFD1]/70 leading-relaxed">
          Direct patronage of master artisan lineages. Every creation is handmade, GI-tag certified, and accompanied by a verifiable digital craft passport.
        </p>
      </div>

      {/* Filter and Cart Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-[#0E1015] border border-[#D4AF37]/25 shadow-xl">
        {/* Categories */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: "All Masterpieces" },
            { id: "paintings", label: "Paintings & Scrolls" },
            { id: "metalwork", label: "Metal Inlay" },
            { id: "textiles", label: "Silk Handlooms" },
            { id: "woodwork", label: "Woodcraft" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[#D4AF37] text-[#07080B] font-bold shadow-md shadow-[#D4AF37]/30"
                  : "bg-white/5 text-[#E8DFD1]/70 hover:text-[#D4AF37] border border-white/5"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Cart Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative px-5 py-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#07080B] font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-[#D4AF37]/20 hover:scale-105 active:scale-95 transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Cart ({cart.length})</span>
          {cart.length > 0 && (
            <span className="font-mono text-[11px] bg-[#07080B] text-[#D4AF37] px-2 py-0.5 rounded-full ml-1 font-bold">
              ₹{cartTotal.toLocaleString("en-IN")}
            </span>
          )}
        </button>
      </div>

      {/* Craft Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group rounded-3xl bg-[#0E1015] border border-[#D4AF37]/25 overflow-hidden shadow-2xl hover:border-[#D4AF37] transition-all duration-300 flex flex-col justify-between"
          >
            {/* Visual Masterpiece Image Banner */}
            <div className="h-56 relative overflow-hidden group">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
              />
              {/* Luxury dark vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E1015] via-black/20 to-black/60 pointer-events-none" />

              {/* Top Badges */}
              <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#D4AF37]/40 text-[10px] text-white font-mono flex items-center gap-1.5 font-bold shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {item.giCode}
                </span>
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] text-[#F5E0A0] font-mono shadow-md">
                  {item.craftHours} hrs handwork
                </span>
              </div>

              {/* Bottom Tags */}
              <div className="absolute bottom-3 inset-x-3 flex items-center justify-between z-10">
                <span className="text-[11px] font-mono text-white/95 bg-black/75 backdrop-blur-md px-3 py-1 rounded-lg uppercase tracking-wider border border-white/10 inline-block font-semibold">
                  {item.craftName}
                </span>
                <button
                  type="button"
                  onClick={() => setActivePassportItem(item)}
                  className="text-[10px] font-mono text-[#F5E0A0] bg-[#D4AF37]/20 hover:bg-[#D4AF37]/40 border border-[#D4AF37]/40 backdrop-blur-md px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
                >
                  <span>Inspect</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-[#D4AF37] font-mono">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{item.state}</span>
                </div>
                <h3 className="font-serif font-bold text-lg text-[#E8DFD1] group-hover:text-[#D4AF37] transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-[#E8DFD1]/70 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>

              {/* Artisan Micro-profile */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-[#D4AF37] block font-mono">Crafted by Master</span>
                  <strong className="text-[#E8DFD1] block">{item.artisanName}</strong>
                </div>
                <button
                  onClick={() => setActivePassportItem(item)}
                  className="text-[10px] font-mono text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View Passport</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {/* Price & Action */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#E8DFD1]/50 block">Fair-Trade Price</span>
                  <span className="text-xl font-bold font-mono text-[#F5E0A0]">
                    ₹{item.price.toLocaleString("en-IN")}
                  </span>
                </div>
                <button
                  onClick={() => handleAddToCart(item)}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#07080B] font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-md shadow-[#D4AF37]/20 flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{t.addToBag}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Digital Craft Passport Modal */}
      {activePassportItem && (
        <div
          data-lenis-prevent
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActivePassportItem(null);
          }}
        >
          <div
            data-lenis-prevent
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            style={{ overscrollBehavior: "contain" }}
            className="bg-[#0E1015] border border-[#D4AF37]/50 rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl relative max-h-[85vh] overflow-y-auto overscroll-contain custom-scrollbar my-auto"
          >
            <button
              onClick={() => setActivePassportItem(null)}
              className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-black/70 hover:bg-black/95 text-white flex items-center justify-center cursor-pointer border border-[#D4AF37]/40 transition-colors shadow-lg"
              aria-label="Close Passport"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Masterpiece Photo Banner */}
            <div className="relative h-56 sm:h-60 rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-xl shrink-0">
              <img
                src={activePassportItem.imageUrl}
                alt={activePassportItem.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E1015] via-transparent to-black/30 pointer-events-none" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
                <span className="font-serif font-bold text-white text-base drop-shadow-md">
                  {activePassportItem.title}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#D4AF37] text-[#07080B] font-mono font-bold text-[10px] shadow-md">
                  {activePassportItem.giCode}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono text-[#D4AF37] px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 inline-block">
                Digital Craft Passport • {activePassportItem.giCode}
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#E8DFD1] pt-1">
                {activePassportItem.craftName}
              </h2>
              <p className="text-xs text-[#E8DFD1]/60">{activePassportItem.state}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 text-xs">
              <span className="text-[11px] font-mono text-[#D4AF37] uppercase block">
                Heritage Materials Used:
              </span>
              <ul className="grid grid-cols-2 gap-1.5 text-[#E8DFD1]/80">
                {activePassportItem.materials.map((m, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 space-y-1 text-xs">
              <strong className="text-[#F5E0A0] block">Artisan Guarantee:</strong>
              <p className="text-[#E8DFD1]/70 leading-relaxed">
                Handcrafted by {activePassportItem.artisanName} ({activePassportItem.artisanTitle}) using ancestral methods without industrial synthetic shortcuts. 100% of proceeds go directly to the artisan cooperative.
              </p>
            </div>

            <div className="pt-1 pb-1">
              <button
                onClick={() => {
                  handleAddToCart(activePassportItem);
                  setActivePassportItem(null);
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#07080B] font-bold text-xs uppercase tracking-wider cursor-pointer shadow-lg shadow-[#D4AF37]/25 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add this Masterpiece to Bag</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer & Direct Checkout */}
      {isCartOpen && (
        <div
          data-lenis-prevent
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex justify-end animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsCartOpen(false);
          }}
        >
          <div
            data-lenis-prevent
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="relative z-[101] bg-[#0E1015] border-l border-[#D4AF37]/40 w-full max-w-md h-full p-6 flex flex-col justify-between shadow-2xl overflow-y-auto custom-scrollbar"
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="font-serif font-bold text-lg text-white">Artisan Bag</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-mono">
                    {cart.length} {cart.length === 1 ? "item" : "items"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {cart.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearCart}
                      className="text-[11px] font-mono text-red-400/80 hover:text-red-300 transition-colors flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 cursor-pointer"
                      title="Remove all items from bag"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  )}
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white cursor-pointer transition-colors"
                    aria-label="Close Bag"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div
                data-lenis-prevent
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                style={{ overscrollBehavior: "contain" }}
                className="py-4 space-y-3 max-h-[48vh] overflow-y-auto overscroll-contain custom-scrollbar"
              >
                {cart.length === 0 ? (
                  <div className="py-12 text-center text-xs text-[#E8DFD1]/50 space-y-2">
                    <p>Your bag is empty.</p>
                    <p>Select any authentic handcrafted artwork to support rural artisans.</p>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-[#D4AF37]/30 flex items-center justify-between gap-3 text-xs transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-12 h-12 rounded-xl object-cover border border-[#D4AF37]/30 shrink-0 shadow-md"
                        />
                        <div className="min-w-0">
                          <strong className="text-white block mt-0.5 truncate">{item.title}</strong>
                          <span className="text-[10px] text-[#D4AF37] font-mono block truncate">{item.artisanName}</span>
                          <span className="text-[10px] text-[#E8DFD1]/50 block truncate">{item.craftName}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 shrink-0">
                        <span className="font-mono font-bold text-sm text-[#F5E0A0]">
                          ₹{item.price.toLocaleString("en-IN")}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFromCart(idx)}
                          title="Remove item from bag"
                          aria-label={`Remove ${item.title} from bag`}
                          className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-red-400 hover:text-red-300 flex items-center justify-center transition-all cursor-pointer border border-red-500/20 active:scale-90"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Checkout Form */}
            {cart.length > 0 && (
              <form onSubmit={handleCheckout} className="space-y-4 pt-4 pb-4 border-t border-white/10">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-[#E8DFD1]/60">
                    <span>Artisan Fund:</span>
                    <span className="text-[#D4AF37] font-mono font-medium">100% Direct</span>
                  </div>
                  <div className="flex items-center justify-between text-base font-bold text-white">
                    <span>Total Amount:</span>
                    <span className="font-mono text-[#F5E0A0] text-xl">
                      ₹{cartTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-[#E8DFD1]/70 block">
                    Your Name (for Heritage Certificate):
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="E.g. Rishabh Bansal"
                    className="w-full bg-[#181B24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-[#E8DFD1]/40 focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                </div>

                {isOrderSubmitted ? (
                  <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs text-center space-y-1 animate-in fade-in">
                    <Check className="w-5 h-5 mx-auto" />
                    <strong>Order Recorded in Supabase!</strong>
                    <p className="text-[11px] opacity-80">Thank you for patronizing Indian master artisans.</p>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#07080B] font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-lg shadow-[#D4AF37]/25 flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Complete Order & Generate Passport</span>
                  </button>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
