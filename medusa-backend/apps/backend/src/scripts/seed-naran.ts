import { ExecArgs } from "@medusajs/framework/types";
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { createProductsWorkflow } from "@medusajs/medusa/core-flows";
import { MN_TO_HANDLE } from "./seed-categories";

// Product photos live in web/public/products/<handle>.{jpg|png}. These handles
// have transparent-background cutouts (PNG); the rest are promo-card JPGs.
const PNG = new Set([
  "converse-suede-low-black", "converse-chuck-low-black-stars", "converse-chuck-low-blue-check",
  "converse-chuck70-hi-black", "converse-retro-trainer-burgundy", "converse-star-player-burgundy",
]);
const IMG = (handle: string) => `/products/${handle}.${PNG.has(handle) ? "png" : "jpg"}`;

type Seed = {
  title: string; handle: string; price: number; cat: string;
  sizes: string[]; desc: string;
};

// Converse canvas sizing (unisex) and New Balance sizing.
const CV = ["36", "37", "38", "39", "40", "41", "42", "43", "44"];
const NB = ["40", "41", "42", "43", "44", "45"];
// UGG footwear (EU) and The North Face apparel sizing.
const UG = ["36", "37", "38", "39", "40", "41", "42"];
const AP = ["XS", "S", "M", "L", "XL", "XXL"];

// «X-MAS» — бодит каталог (Converse + New Balance). Үнэ шууд төгрөгөөр (mnt).
const CATALOG: Seed[] = [
  // ── Converse — Chuck 70 / Chuck Taylor ──
  { title: "Converse Chuck 70 Hi Navy", handle: "converse-chuck70-hi-navy", price: 349000, cat: "Converse", sizes: CV, desc: "Chuck 70 өндөр хийц, navy даавуун гадаргуу, vintage тал улавчтай." },
  { title: "Converse Chuck 70 Hi Daisy Blue", handle: "converse-chuck70-hi-daisy-blue", price: 349000, cat: "Converse", sizes: CV, desc: "Цэнхэр даавуун Chuck 70, хатгамал цагаан цэцэгтэй өндөр хийц." },
  { title: "Converse Chuck 70 Hi Natural", handle: "converse-chuck70-hi-natural", price: 349000, cat: "Converse", sizes: CV, desc: "Parchment/natural өнгийн сонгодог Chuck 70 өндөр хийц." },
  { title: "Converse Chuck 70 Hi White Star", handle: "converse-chuck70-hi-white-star", price: 349000, cat: "Converse", sizes: CV, desc: "Цагаан даавуун Chuck 70, хажуугийн од хээтэй өндөр хийц." },
  { title: "Converse Chuck 70 Hi Grey Denim", handle: "converse-chuck70-hi-grey-denim", price: 349000, cat: "Converse", sizes: CV, desc: "Саарал жинсэн Chuck 70, distressed фрэй хээтэй өндөр хийц." },
  { title: "Converse Chuck 70 Hi Daisy White", handle: "converse-chuck70-hi-daisy-white", price: 349000, cat: "Converse", sizes: CV, desc: "Цагаан Chuck 70, хатгамал цэцэгтэй өндөр хийц." },
  { title: "Converse Chuck 70 Hi Black", handle: "converse-chuck70-hi-black", price: 349000, cat: "Converse", sizes: CV, desc: "Сонгодог хар Chuck 70, All Star patch-тай өндөр хийц." },
  { title: "Converse Chuck 70 Hi Blue", handle: "converse-chuck70-hi-blue", price: 349000, cat: "Converse", sizes: CV, desc: "Navy blue сонгодог Chuck 70 өндөр хийц." },
  { title: "Converse Chuck 70 Hi Black Star", handle: "converse-chuck70-hi-black-star", price: 349000, cat: "Converse", sizes: CV, desc: "Хар даавуун Chuck 70, хажуугийн цагаан од хээтэй." },
  { title: "Converse Chuck Low Zip Cream", handle: "converse-chuck-low-zip-cream", price: 349000, cat: "Converse", sizes: CV, desc: "Cream өнгийн намхан Chuck, урд талын цахилгаантай." },
  { title: "Converse Chuck Low Zip Black", handle: "converse-chuck-low-zip-black", price: 349000, cat: "Converse", sizes: CV, desc: "Хар намхан Chuck, урд талын цахилгаантай." },
  { title: "Converse Chuck Low Blue Check", handle: "converse-chuck-low-blue-check", price: 349000, cat: "Converse", sizes: CV, desc: "Цэнхэр намхан Chuck, шатрын хээтэй онцгой хувилбар." },
  { title: "Converse Chuck Low Pink Stars", handle: "converse-chuck-low-pink-stars", price: 349000, cat: "Converse", sizes: CV, desc: "Ягаан намхан Chuck, цэнхэр од хээтэй." },
  { title: "Converse Chuck Low Grey Stars", handle: "converse-chuck-low-grey-stars", price: 349000, cat: "Converse", sizes: CV, desc: "Саарал намхан Chuck, од хээтэй." },
  { title: "Converse Chuck Low Cream Stars", handle: "converse-chuck-low-cream-stars", price: 349000, cat: "Converse", sizes: CV, desc: "Cream намхан Chuck, мөнгөлөг од хээтэй." },
  { title: "Converse Chuck Platform Pink", handle: "converse-chuck-platform-pink", price: 349000, cat: "Converse", sizes: CV, desc: "Ягаан patent өндөр platform Chuck — өндөрсгөсөн тал улавчтай." },
  { title: "Converse Chuck Low Platform Black Stars", handle: "converse-chuck-low-black-stars", price: 349000, cat: "Converse", sizes: CV, desc: "Хар namhan platform Chuck, мөнгөлөг од хээтэй." },

  // ── Converse — One Star / Star Player ──
  { title: "Converse One Star Mustard Suede", handle: "converse-one-star-mustard", price: 349000, cat: "Converse", sizes: CV, desc: "Гичийн шар suede One Star, IRAK Gore-Tex, хар тал улавчтай." },
  { title: "Converse One Star Navy Suede", handle: "converse-one-star-navy", price: 349000, cat: "Converse", sizes: CV, desc: "Navy suede One Star, IRAK Gore-Tex, моно хар тал улавчтай." },
  { title: "Converse One Star Black Suede", handle: "converse-one-star-black", price: 349000, cat: "Converse", sizes: CV, desc: "Моно хар suede One Star, цагаан одтой." },
  { title: "Converse Star Player 76 Burgundy", handle: "converse-star-player-burgundy", price: 299000, cat: "Converse", sizes: CV, desc: "Burgundy suede Star Player 76, cream тал улавч, chevron логотой." },

  // ── Converse — Suede low / retro trainer ──
  { title: "Converse Suede Retro Pink", handle: "converse-suede-retro-pink", price: 349000, cat: "Converse", sizes: CV, desc: "Ягаан suede намхан retro, цэнхэр үдээстэй." },
  { title: "Converse Suede Low Red", handle: "converse-suede-low-red", price: 349000, cat: "Converse", sizes: CV, desc: "Улаан suede намхан, ягаан үдээстэй, cream тал улавчтай." },
  { title: "Converse Suede Low Black", handle: "converse-suede-low-black", price: 349000, cat: "Converse", sizes: CV, desc: "Хар suede намхан, хос өнгийн үдээстэй, cream хамартай." },
  { title: "Converse Futsal Black Gum", handle: "converse-futsal-black", price: 299000, cat: "Converse", sizes: CV, desc: "Хар futsal силуэт, gum тал улавч, chevron логотой." },
  { title: "Converse Retro Trainer Burgundy", handle: "converse-retro-trainer-burgundy", price: 299000, cat: "Converse", sizes: CV, desc: "Burgundy retro гүйлтийн силуэт, gum тал улавчтай." },
  { title: "Converse Retro Trainer Green", handle: "converse-retro-trainer-green", price: 299000, cat: "Converse", sizes: CV, desc: "Ногоон retro гүйлтийн силуэт, gum тал улавчтай." },

  // ── New Balance 1906A (хямдралтай) ──
  { title: "New Balance 1906A Silver", handle: "nb-1906a-silver", price: 250000, cat: "New Balance", sizes: NB, desc: "Мөнгөлөг/цагаан 1906A, N-ergy дэрлэгтэй Y2K силуэт. Хямдралтай." },
  { title: "New Balance 1906A Black", handle: "nb-1906a-black", price: 250000, cat: "New Balance", sizes: NB, desc: "Моно хар 1906A, N-ergy дэрлэгтэй Y2K силуэт. Хямдралтай." },
  { title: "New Balance 1906A Grey", handle: "nb-1906a-grey", price: 250000, cat: "New Balance", sizes: NB, desc: "Саарал 1906A, N-ergy дэрлэгтэй Y2K силуэт. Хямдралтай." },

  // ── UGG — өвлийн гутал, платформ, puffer, пүүз, шаахай ──
  { title: "UGG Classic Aztec Knit Boot", handle: "ugg-classic-knit-aztec", price: 540000, cat: "UGG", sizes: UG, desc: "Олон өнгийн ацтек нэхмэл eskimo гутал, хонины арьсан дулаалгатай." },
  { title: "UGG Platform Mini Sage", handle: "ugg-platform-mini-sage", price: 490000, cat: "UGG", sizes: UG, desc: "Сэйж-ногоон suede платформ мини гутал, арал нэмсэн улавчтай." },
  { title: "UGG Leather Shearling Heel Boot", handle: "ugg-leather-heel-boot-black", price: 650000, cat: "UGG", sizes: UG, desc: "Хар арьсан өсгийтэй гутал, хонины ноосон эргүүлсэн зах." },
  { title: "UGG Platform Buckle Clog Chestnut", handle: "ugg-platform-clog-chestnut", price: 430000, cat: "UGG", sizes: UG, desc: "Chestnut suede платформ clog, тэвхтэй горхи ба хонины арьсан дотортой." },
  { title: "UGG Weather Sneaker Boot Black", handle: "ugg-sneaker-boot-black", price: 560000, cat: "UGG", sizes: UG, desc: "Хар усанд тэсвэртэй sneaker-boot, чанксан улавчтай өвлийн загвар." },
  { title: "UGG Classic Sweater Knit Tall Sand", handle: "ugg-sweater-knit-tall-sand", price: 590000, cat: "UGG", sizes: UG, desc: "Элсэн өнгийн өндөр нэхмэл цамцан түрийтэй, suede хөлтэй платформ." },
  { title: "UGG Classic Sweater Knit Tall Black", handle: "ugg-sweater-knit-tall-black", price: 590000, cat: "UGG", sizes: UG, desc: "Хар өндөр нэхмэл цамцан түрийтэй платформ гутал." },
  { title: "UGG Classic Sweater Knit Tall Chocolate", handle: "ugg-sweater-knit-tall-chocolate", price: 590000, cat: "UGG", sizes: UG, desc: "Шоколадон бор өндөр нэхмэл цамцан түрийтэй платформ гутал." },
  { title: "UGG Classic Ultra Mini Chestnut", handle: "ugg-ultra-mini-chestnut", price: 480000, cat: "UGG", sizes: UG, desc: "Chestnut suede Classic Ultra Mini, 17.5mm Twinface хонины арьс." },
  { title: "UGG Classic Mini Fair Isle Chestnut", handle: "ugg-mini-fairisle-chestnut", price: 510000, cat: "UGG", sizes: UG, desc: "Chestnut мини, fair-isle нэхмэл эргүүлсэн үслэг захтай." },
  { title: "UGG Tazz Platform Chestnut", handle: "ugg-tazz-chestnut", price: 450000, cat: "UGG", sizes: UG, desc: "Chestnut suede Tazz платформ, braid зах, хонины ноосон дотортой." },
  { title: "UGG Classic Maxi Puffer Mini White", handle: "ugg-puffer-mini-white", price: 440000, cat: "UGG", sizes: UG, desc: "Цагаан puffer мини, хөнгөн дулаахан куртик гадаргуутай платформ." },
  { title: "UGG Classic Maxi Puffer Mini Black", handle: "ugg-puffer-mini-black", price: 440000, cat: "UGG", sizes: UG, desc: "Хар puffer мини, хөнгөн дулаахан куртик гадаргуутай платформ." },
  { title: "UGG Classic Maxi Puffer Mini Sand", handle: "ugg-puffer-mini-sand", price: 440000, cat: "UGG", sizes: UG, desc: "Элсэн өнгийн puffer мини, хөнгөн дулаахан куртик гадаргуутай." },
  { title: "UGG LA Cloud Low Sneaker Chestnut", handle: "ugg-lowmel-sneaker-chestnut", price: 520000, cat: "UGG", sizes: UG, desc: "Chestnut suede намхан sneaker, бүдүүн үдээс, хонины арьсан дотортой." },
  { title: "UGG LA Cloud Low Sneaker Pink", handle: "ugg-lowmel-sneaker-pink", price: 520000, cat: "UGG", sizes: UG, desc: "Ягаан suede намхан sneaker, бүдүүн үдээстэй." },
  { title: "UGG LA Cloud Low Sneaker Sand", handle: "ugg-lowmel-sneaker-sand", price: 520000, cat: "UGG", sizes: UG, desc: "Элсэн өнгийн suede намхан sneaker, бүдүүн үдээстэй." },
  { title: "UGG LA Cloud Low Sneaker Black", handle: "ugg-lowmel-sneaker-black", price: 520000, cat: "UGG", sizes: UG, desc: "Хар suede намхан sneaker, бүдүүн үдээстэй." },
  { title: "UGG LA Cloud Low Sneaker Cow Print", handle: "ugg-lowmel-sneaker-cow", price: 540000, cat: "UGG", sizes: UG, desc: "Үхрийн хээтэй үслэг намхан sneaker, онцгой хувилбар." },
  { title: "UGG LA Cloud Low Sneaker Black Leather", handle: "ugg-lowmel-sneaker-black-leather", price: 540000, cat: "UGG", sizes: UG, desc: "Хар арьсан намхан sneaker, бүдүүн үдээстэй." },
  { title: "UGG Leather Lace-Up Boot Brown", handle: "ugg-leather-laceup-brown", price: 620000, cat: "UGG", sizes: UG, desc: "Бор жинхэнэ арьсан үдээстэй гутал, lug улавч, хонины арьсан дотортой." },
  { title: "UGG Classic Weather Mini Chestnut", handle: "ugg-weather-mini-chestnut", price: 560000, cat: "UGG", sizes: UG, desc: "Chestnut усанд тэсвэртэй weather мини, Vibram улавчтай." },
  { title: "UGG Classic Mini II Chocolate", handle: "ugg-classic-mini-chocolate", price: 490000, cat: "UGG", sizes: UG, desc: "Шоколадон suede Classic Mini II, хонины арьсан дулаалгатай." },
  { title: "UGG Classic Mini II Chestnut", handle: "ugg-classic-mini-chestnut", price: 490000, cat: "UGG", sizes: UG, desc: "Chestnut suede Classic Mini II, хонины арьсан дулаалгатай." },
  { title: "UGG Classic Mini II Black", handle: "ugg-classic-mini-black", price: 490000, cat: "UGG", sizes: UG, desc: "Хар suede Classic Mini II, хонины арьсан дулаалгатай." },
  { title: "UGG Tasman Fluff Platform Chestnut", handle: "ugg-tasman-fluff-chestnut", price: 470000, cat: "UGG", sizes: UG, desc: "Chestnut suede Tasman платформ, хонины ноосон эргүүлсэн захтай." },
  { title: "UGG Tasman Fluff Platform Taupe", handle: "ugg-tasman-fluff-taupe", price: 470000, cat: "UGG", sizes: UG, desc: "Taupe suede Tasman платформ, хонины ноосон эргүүлсэн захтай." },
  { title: "UGG Classic Weather Mini Black", handle: "ugg-weather-mini-black", price: 560000, cat: "UGG", sizes: UG, desc: "Хар усанд тэсвэртэй weather мини, бэхжүүлсэн хамар ба улавчтай." },
  { title: "UGG Classic Weather Hybrid Chestnut", handle: "ugg-weather-hybrid-chestnut", price: 560000, cat: "UGG", sizes: UG, desc: "Chestnut weather hybrid мини, цайвар lug улавчтай." },
  { title: "UGG Classic Sweater Knit Tall Pink", handle: "ugg-sweater-knit-tall-pink", price: 590000, cat: "UGG", sizes: UG, desc: "Ягаан өндөр нэхмэл цамцан түрийтэй платформ гутал." },
  { title: "UGG Tasman Clog Pink", handle: "ugg-tasman-clog-pink", price: 430000, cat: "UGG", sizes: UG, desc: "Ягаан suede Tasman clog, хонины арьсан дотортой slip-on." },
  { title: "UGG Classic Ultra Mini Sand", handle: "ugg-ultra-mini-sand", price: 480000, cat: "UGG", sizes: UG, desc: "Элсэн өнгийн suede Classic Ultra Mini, Twinface хонины арьс." },
  { title: "UGG Cozy Sheepskin Slipper Dark Brown", handle: "ugg-cozy-slipper-dark-brown", price: 350000, cat: "UGG", sizes: UG, desc: "Бараан бор хонины арьсан дулаан гэрийн шаахай-бүүт." },
  { title: "UGG Cozy Sheepskin Slipper Taupe", handle: "ugg-cozy-slipper-taupe", price: 350000, cat: "UGG", sizes: UG, desc: "Taupe хонины арьсан дулаан гэрийн шаахай-бүүт." },
  { title: "UGG Alpine Tassel Hiker Olive", handle: "ugg-hiker-tassel-olive", price: 650000, cat: "UGG", sizes: UG, desc: "Olive suede уулын загварын гутал, сүлжмэл үдээс ба тассельтай." },
  { title: "UGG Tasman Slipper Chestnut", handle: "ugg-tasman-chestnut", price: 390000, cat: "UGG", sizes: UG, desc: "Chestnut suede Tasman шаахай, braid зах, хонины арьсан дотортой." },
  { title: "UGG Lace-Up Moc Sneaker Chestnut", handle: "ugg-moc-laceup-chestnut", price: 480000, cat: "UGG", sizes: UG, desc: "Chestnut suede үдээстэй moc sneaker, хонины арьсан дотортой." },

  // ── The North Face — 1996 Nuptse puffer, cropped, урт down parka ──
  { title: "The North Face 1996 Retro Nuptse Blush", handle: "tnf-nuptse-blush-black", price: 690000, cat: "The North Face", sizes: AP, desc: "Blush ягаан/хар 1996 Nuptse пуховик, 700-fill down дүүргэгчтэй." },
  { title: "The North Face 1996 Retro Nuptse Olive", handle: "tnf-nuptse-olive-black", price: 690000, cat: "The North Face", sizes: AP, desc: "Olive ногоон/хар 1996 Nuptse пуховик, 700-fill down дүүргэгчтэй." },
  { title: "The North Face 1996 Retro Nuptse Ivory", handle: "tnf-nuptse-ivory-black", price: 690000, cat: "The North Face", sizes: AP, desc: "Цагаан/хар 1996 Nuptse пуховик, 700-fill down дүүргэгчтэй." },
  { title: "The North Face 1996 Retro Nuptse Cream Camel", handle: "tnf-nuptse-cream-camel", price: 690000, cat: "The North Face", sizes: AP, desc: "Cream/camel 1996 Nuptse пуховик, 700-fill down дүүргэгчтэй." },
  { title: "The North Face Cropped Nuptse Charcoal", handle: "tnf-nuptse-cropped-charcoal", price: 650000, cat: "The North Face", sizes: AP, desc: "Charcoal богино хэлбэрийн Nuptse пуховик, цээжний нэхмэл патчтай." },
  { title: "The North Face Cropped Nuptse Burgundy", handle: "tnf-nuptse-cropped-burgundy", price: 650000, cat: "The North Face", sizes: AP, desc: "Burgundy богино хэлбэрийн Nuptse пуховик, цээжний нэхмэл патчтай." },
  { title: "The North Face 1996 Nuptse Graphite Patch", handle: "tnf-nuptse-graphite-patch", price: 720000, cat: "The North Face", sizes: AP, desc: "Graphite саарал Nuptse пуховик, цээжний нэхмэл лого патчтай." },
  { title: "The North Face 1996 Nuptse Ice Blue Patch", handle: "tnf-nuptse-ice-blue-patch", price: 720000, cat: "The North Face", sizes: AP, desc: "Ice blue цайвар цэнхэр Nuptse пуховик, цээжний нэхмэл патчтай." },
  { title: "The North Face 1996 Nuptse Pale Sage Patch", handle: "tnf-nuptse-pale-sage-patch", price: 720000, cat: "The North Face", sizes: AP, desc: "Pale sage цайвар ногоон Nuptse пуховик, цээжний нэхмэл патчтай." },
  { title: "The North Face 1996 Retro Nuptse Dusty Rose", handle: "tnf-nuptse-dusty-rose", price: 690000, cat: "The North Face", sizes: AP, desc: "Dusty rose ягаан/plum 1996 Nuptse пуховик, 700-fill down." },
  { title: "The North Face 1996 Retro Nuptse Purple", handle: "tnf-nuptse-purple-black", price: 690000, cat: "The North Face", sizes: AP, desc: "Ягаан-нил/хар 1996 Nuptse пуховик, 700-fill down дүүргэгчтэй." },
  { title: "The North Face 1996 Retro Nuptse Navy", handle: "tnf-nuptse-navy-black", price: 690000, cat: "The North Face", sizes: AP, desc: "Navy/хар 1996 Nuptse пуховик, 700-fill down дүүргэгчтэй." },
  { title: "The North Face 1996 Retro Nuptse Emerald", handle: "tnf-nuptse-emerald-black", price: 690000, cat: "The North Face", sizes: AP, desc: "Emerald ногоон/хар 1996 Nuptse пуховик, 700-fill down." },
  { title: "The North Face 1996 Retro Nuptse Charcoal", handle: "tnf-nuptse-charcoal-black", price: 690000, cat: "The North Face", sizes: AP, desc: "Charcoal саарал/хар 1996 Nuptse пуховик, 700-fill down." },
  { title: "The North Face 1996 Retro Nuptse Orange", handle: "tnf-nuptse-orange-black", price: 690000, cat: "The North Face", sizes: AP, desc: "Улбар шар/хар 1996 Nuptse пуховик, 700-fill down дүүргэгчтэй." },
  { title: "The North Face Long Down Parka Ivory", handle: "tnf-long-parka-ivory", price: 890000, cat: "The North Face", sizes: AP, desc: "Цагаан урт down parka, өвдөг хүрэх урт, дулаахан өвлийн загвар." },
  { title: "The North Face Himalayan Long Parka Cream Camel", handle: "tnf-long-parka-cream-camel", price: 890000, cat: "The North Face", sizes: AP, desc: "Cream/camel урт malluk down parka, малгайтай, өвдөг хүрэх урт." },
  { title: "The North Face Long Down Parka Navy", handle: "tnf-long-parka-navy", price: 890000, cat: "The North Face", sizes: AP, desc: "Navy урт down parka, малгайтай, өвдөг хүрэх урт дулаахан хийц." },
  { title: "The North Face Long Down Parka Rose Brown", handle: "tnf-long-parka-rose-brown", price: 890000, cat: "The North Face", sizes: AP, desc: "Rose brown урт down parka, малгайтай, өвдөг хүрэх урт хийц." },
  { title: "The North Face 1996 Retro Nuptse Teal", handle: "tnf-nuptse-teal-petrol", price: 690000, cat: "The North Face", sizes: AP, desc: "Teal/petrol цэнхэр 1996 Nuptse пуховик, 700-fill down." },
  { title: "The North Face Cropped Nuptse Ivory Beige", handle: "tnf-nuptse-cropped-ivory", price: 650000, cat: "The North Face", sizes: AP, desc: "Ivory/beige богино хэлбэрийн Nuptse пуховик, цээжний нэхмэл патчтай." },
];

// New UGG + TNF photography is transparent-background cutouts (PNG).
for (const c of CATALOG) if (c.cat === "UGG" || c.cat === "The North Face") PNG.add(c.handle);

// Remove any prior catalog on reseed (placeholders, beauty, VEXO, Medusa demo).
const OLD_HANDLES = [
  "nike-air-max-90","nike-air-force-1","nike-dunk-low","adidas-samba-og","adidas-ultraboost",
  "adidas-gazelle","nb-550","nb-9060","nb-1906r","puma-suede-classic","puma-rs-x","puma-palermo",
  "converse-chuck-70-hi","converse-chuck-low","converse-run-star",
  "edp-bloom","edp-signature","rose-elixir","citrus-cologne","glow-serum","vitc-serum","hydra-cream",
  "cleansing-foam","lip-velvet-nude","lip-matte-ruby","silk-foundation","volume-mascara",
  "body-lotion-silk","shower-gel-vanilla","premium-gift-set","skincare-starter-kit",
  "tech-fleece-hoodie","performance-tank","training-joggers","compression-longsleeve",
  "windbreaker-jacket","lined-training-shorts","seamless-leggings","womens-cropped-tee",
  "tactical-sling-bag","performance-cap","thermal-hooded-base","cargo-tech-pants",
  "sweatshirt","sweatpants","shorts","t-shirt",
];

export default async function seedNaran({ container }: ExecArgs) {
  const logger = container.resolve("logger");
  const productModule = container.resolve(Modules.PRODUCT);
  const salesChannelModule = container.resolve(Modules.SALES_CHANNEL);
  const fulfillmentModule = container.resolve(Modules.FULFILLMENT);

  const [channel] = await salesChannelModule.listSalesChannels({ name: "Default Sales Channel" });
  const [profile] = await fulfillmentModule.listShippingProfiles({});
  if (!channel || !profile) throw new Error("Missing default sales channel or shipping profile");

  // Resolve category ids by handle (categories seeded by seed-categories.ts).
  const cats = await productModule.listProductCategories(
    { handle: Object.values(MN_TO_HANDLE) },
    { select: ["id", "handle"] as any },
  );
  const catIdByHandle = new Map(cats.map(c => [c.handle, c.id]));
  if (!cats.length) logger.warn("No product categories found — run seed-categories.ts first.");
  const categoryIdsFor = (brand: string): string[] => {
    const id = catIdByHandle.get(MN_TO_HANDLE[brand]);
    return id ? [id] : [];
  };

  // Remove old catalog + any previous X-MAS products (fresh data each run)
  const stale = await productModule.listProducts({ handle: [...OLD_HANDLES, ...CATALOG.map(c => c.handle)] });
  if (stale.length) {
    await productModule.deleteProducts(stale.map(p => p.id));
    logger.info(`Removed ${stale.length} existing products`);
  }

  const toCreate = CATALOG;
  if (toCreate.length) {
    await createProductsWorkflow(container).run({
      input: {
        products: toCreate.map(p => ({
          title: p.title,
          handle: p.handle,
          description: p.desc,
          status: "published" as const,
          category_ids: categoryIdsFor(p.cat),
          thumbnail: IMG(p.handle),
          images: [{ url: IMG(p.handle) }],
          shipping_profile_id: profile.id,
          options: [{ title: "Хэмжээ", values: p.sizes }],
          variants: p.sizes.map(s => ({
            title: s,
            sku: `${p.handle}-${s}`.toLowerCase().replace(/\s+/g, "-"),
            manage_inventory: false,
            options: { "Хэмжээ": s },
            prices: [{ amount: p.price, currency_code: "mnt" }],
          })),
          sales_channels: [{ id: channel.id }],
        })),
      },
    });
    logger.info(`Seeded ${toCreate.length} X-MAS products`);
  } else {
    logger.info("X-MAS catalog already seeded");
  }

  // Ensure every catalog product is linked to the sales channel (Store API visibility)
  const all = await productModule.listProducts({ handle: CATALOG.map(c => c.handle) });
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  let linked = 0;
  for (const p of all) {
    try {
      await link.create({
        [Modules.PRODUCT]: { product_id: p.id },
        [Modules.SALES_CHANNEL]: { sales_channel_id: channel.id },
      });
      linked++;
    } catch { /* already linked */ }
  }
  logger.info(`Sales-channel links: ${linked} created, ${all.length - linked} already present`);
  logger.info(`X-MAS catalog ready — ${all.length} products (Converse + New Balance).`);
}
