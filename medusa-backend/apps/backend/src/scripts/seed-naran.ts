import { ExecArgs } from "@medusajs/framework/types";
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { createProductsWorkflow } from "@medusajs/medusa/core-flows";
import { MN_TO_HANDLE } from "./seed-categories";

// Product photos live in web/public/products/<handle>.webp — transparent
// cutouts, so the storefront reads as one set on its white canvas, and WebP so
// 166 of them do not cost 78MB.
const IMG = (handle: string) => `/products/${handle}.webp`;

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
// Nike and the trail brands run on the wider range; bags carry no size at all.
const NK = ["40", "41", "42", "43", "44", "45"];
const ONE = ["One Size"];

// «X-MAS» — бодит каталог (Converse + New Balance). Үнэ шууд төгрөгөөр (mnt).
const CATALOG: Seed[] = [
  // ── Converse — Chuck 70 / Chuck Taylor ──
  { title: "Converse Chuck 70 Hi Black", handle: "converse-chuck70-hi-black", price: 349000, cat: "Converse", sizes: CV, desc: "Сонгодог хар Chuck 70, All Star patch-тай өндөр хийц." },
  { title: "Converse Chuck Low Blue Check", handle: "converse-chuck-low-blue-check", price: 349000, cat: "Converse", sizes: CV, desc: "Цэнхэр намхан Chuck, шатрын хээтэй онцгой хувилбар." },
  { title: "Converse Chuck Low Platform Black Stars", handle: "converse-chuck-low-black-stars", price: 349000, cat: "Converse", sizes: CV, desc: "Хар namhan platform Chuck, мөнгөлөг од хээтэй." },

  // ── Converse — One Star / Star Player ──
  { title: "Converse Star Player 76 Burgundy", handle: "converse-star-player-burgundy", price: 299000, cat: "Converse", sizes: CV, desc: "Burgundy suede Star Player 76, cream тал улавч, chevron логотой." },

  // ── Converse — Suede low / retro trainer ──
  { title: "Converse Suede Low Black", handle: "converse-suede-low-black", price: 349000, cat: "Converse", sizes: CV, desc: "Хар suede намхан, хос өнгийн үдээстэй, cream хамартай." },
  { title: "Converse Retro Trainer Burgundy", handle: "converse-retro-trainer-burgundy", price: 299000, cat: "Converse", sizes: CV, desc: "Burgundy retro гүйлтийн силуэт, gum тал улавчтай." },

  // ── New Balance 1906A (хямдралтай) ──

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

  // ── Converse ──
  { title: "Converse One Star Ox White Red", handle: "converse-one-star-ox-white-red", price: 329000, cat: "Converse", sizes: CV, desc: "Цагаан suede дээр улаан од, сонгодог One Star хэлбэр." },
  { title: "Converse Chuck 70 Hi Sky Blue", handle: "converse-chuck70-hi-sky-blue", price: 349000, cat: "Converse", sizes: CV, desc: "Цайвар хөх Chuck 70, өндөр хийц, vintage тал улавчтай." },
  { title: "Converse Chuck Low Floral Print", handle: "converse-chuck-low-floral-print", price: 319000, cat: "Converse", sizes: CV, desc: "Цэцгэн хээтэй намхан Chuck — зуны хөнгөн сонголт." },
  { title: "Converse Chuck Low Navy Print", handle: "converse-chuck-low-navy-print", price: 319000, cat: "Converse", sizes: CV, desc: "Хар хөх хээтэй намхан Chuck, өдөр тутмын пар." },
  { title: "Converse Chuck 70 Hi Forest Green", handle: "converse-chuck70-hi-forest-green", price: 349000, cat: "Converse", sizes: CV, desc: "Ой ногоон Chuck 70, өндөр хийц." },
  { title: "Converse Chuck Taylor Hi Burgundy", handle: "converse-chuck-hi-burgundy", price: 299000, cat: "Converse", sizes: CV, desc: "Бордо улаан сонгодог Chuck Taylor, өндөр хийц." },
  { title: "Converse Chuck 70 Hi Maroon", handle: "converse-chuck70-hi-maroon", price: 349000, cat: "Converse", sizes: CV, desc: "Гүн бордо Chuck 70, зузаан vintage тал улавч." },
  { title: "Converse Chuck 70 Hi Black Egret", handle: "converse-chuck70-hi-black-egret", price: 349000, cat: "Converse", sizes: CV, desc: "Хар даавуу, цайвар egret тал улавчтай Chuck 70." },
  { title: "Converse Chuck 70 Hi Chocolate", handle: "converse-chuck70-hi-chocolate", price: 349000, cat: "Converse", sizes: CV, desc: "Шоколадон хүрэн Chuck 70 — намрын өнгө." },
  { title: "Converse Chuck Taylor Hi Cream", handle: "converse-chuck-hi-cream", price: 299000, cat: "Converse", sizes: CV, desc: "Цөцгийн өнгийн сонгодог Chuck Taylor." },
  { title: "Converse Chuck Taylor Hi Charcoal", handle: "converse-chuck-hi-charcoal", price: 299000, cat: "Converse", sizes: CV, desc: "Нүүрсэн саарал Chuck Taylor, өндөр хийц." },
  { title: "Converse Chuck 70 Hi Olive", handle: "converse-chuck70-hi-olive", price: 349000, cat: "Converse", sizes: CV, desc: "Чидун ногоон Chuck 70 — цэрэг маягийн өнгө." },
  { title: "Converse x Hello Kitty One Star Red", handle: "converse-hello-kitty-one-star-red", price: 389000, cat: "Converse", sizes: CV, desc: "Hello Kitty хамтын ажиллагаа — улаан suede One Star." },
  { title: "Converse x Hello Kitty Chuck Low Black", handle: "converse-hello-kitty-low-black", price: 369000, cat: "Converse", sizes: CV, desc: "Hello Kitty хэвлэмэл хар намхан Chuck." },
  { title: "Converse One Star Suede Navy", handle: "converse-one-star-suede-navy", price: 329000, cat: "Converse", sizes: CV, desc: "Хар хөх suede One Star, цагаан одтой." },
  { title: "Converse Chuck Low Pink Fade", handle: "converse-chuck-low-pink-fade", price: 299000, cat: "Converse", sizes: CV, desc: "Ягаан шилжилттэй намхан Chuck." },
  { title: "Converse Chuck Low Vintage White", handle: "converse-chuck-low-vintage-white", price: 299000, cat: "Converse", sizes: CV, desc: "Vintage цагаан намхан Chuck Taylor." },
  { title: "Converse Chuck 70 Hi Grey Wash", handle: "converse-chuck70-hi-grey-wash", price: 349000, cat: "Converse", sizes: CV, desc: "Угаасан саарал Chuck 70, denim маягийн гадаргуу." },
  { title: "Converse One Star Low Navy", handle: "converse-one-star-low-navy", price: 329000, cat: "Converse", sizes: CV, desc: "Хар хөх suede, цагаан од — намхан One Star." },
  { title: "Converse Chuck Low Mocha", handle: "converse-chuck-low-mocha", price: 299000, cat: "Converse", sizes: CV, desc: "Мокка хүрэн шилжилттэй намхан Chuck." },
  { title: "Converse Chuck 70 Hi Big Star Black", handle: "converse-chuck70-hi-star-black", price: 359000, cat: "Converse", sizes: CV, desc: "Том одтой хар Chuck 70 — street силуэт." },
  { title: "Converse Chuck 70 Hi Metallic Silver", handle: "converse-chuck70-hi-metallic", price: 359000, cat: "Converse", sizes: CV, desc: "Металлик мөнгөлөг Chuck 70." },
  { title: "Converse Chuck Taylor Hi White Grey", handle: "converse-chuck-hi-white-grey", price: 299000, cat: "Converse", sizes: CV, desc: "Цагаан саарал Chuck Taylor, өндөр хийц." },
  { title: "Converse Chuck Hi Daisy Sky", handle: "converse-chuck-hi-daisy-sky", price: 319000, cat: "Converse", sizes: CV, desc: "Цайвар хөх дээр цагаан цэцэгтэй Chuck." },
  { title: "Converse Chuck Hi Daisy White", handle: "converse-chuck-hi-daisy-white", price: 319000, cat: "Converse", sizes: CV, desc: "Цагаан дээр цэцгэн хээтэй өндөр Chuck." },
  { title: "Converse Chuck Hi Pink Platform", handle: "converse-chuck-hi-pink-platform", price: 369000, cat: "Converse", sizes: CV, desc: "Ягаан өнгийн өндөрсгөсөн platform Chuck." },
  { title: "Converse Chuck Low Lilac", handle: "converse-chuck-low-lilac", price: 299000, cat: "Converse", sizes: CV, desc: "Нил ягаан намхан Chuck, зөөлөн өнгө." },
  { title: "Converse One Star Platform Mustard", handle: "converse-one-star-platform-mustard", price: 369000, cat: "Converse", sizes: CV, desc: "Гичийн шар suede, platform тал улавчтай One Star." },
  { title: "Converse Chuck Low Slip Black", handle: "converse-chuck-low-black-slip", price: 289000, cat: "Converse", sizes: CV, desc: "Үдээсгүй, хялбар өмсдөг хар намхан Chuck." },
  { title: "Converse Chuck 70 Hi White Stud", handle: "converse-chuck70-hi-white-stud", price: 389000, cat: "Converse", sizes: CV, desc: "Цагаан Chuck 70, metal stud чимэглэлтэй." },
  { title: "Converse Chuck Taylor Hi Caramel", handle: "converse-chuck-hi-caramel", price: 299000, cat: "Converse", sizes: CV, desc: "Карамель хүрэн өндөр Chuck Taylor." },
  { title: "Converse Chuck 70 Hi Classic Black", handle: "converse-chuck70-hi-classic-black", price: 349000, cat: "Converse", sizes: CV, desc: "Сонгодог хар Chuck 70, цагаан тал улавчтай." },
  { title: "Converse x Hello Kitty Chuck Low Pink", handle: "converse-hello-kitty-low-pink", price: 369000, cat: "Converse", sizes: CV, desc: "Hello Kitty ягаан хээтэй намхан Chuck." },
  { title: "Converse Chuck Taylor Hi Natural", handle: "converse-chuck-hi-natural", price: 299000, cat: "Converse", sizes: CV, desc: "Байгалийн цайвар өнгийн өндөр Chuck Taylor." },
  { title: "Converse Chuck 70 De Luxe Squared Black", handle: "converse-chuck70-deluxe-black", price: 429000, cat: "Converse", sizes: CV, desc: "Давхар зузаан тал улавчтай De Luxe Squared Chuck 70." },
  { title: "Converse Chuck 70 De Luxe Squared Grey", handle: "converse-chuck70-deluxe-grey", price: 429000, cat: "Converse", sizes: CV, desc: "Угаасан саарал De Luxe Squared — зузаан тал улавч." },
  { title: "Converse Chuck 70 Hi Red", handle: "converse-chuck70-hi-red", price: 349000, cat: "Converse", sizes: CV, desc: "Тод улаан Chuck 70, өндөр хийц." },
  { title: "Converse Chuck 70 Hi Sand", handle: "converse-chuck70-hi-sand", price: 349000, cat: "Converse", sizes: CV, desc: "Элсэн шаргал Chuck 70 — зөөлөн өнгө." },
  { title: "Converse Chuck 70 Hi Coral", handle: "converse-chuck70-hi-coral", price: 349000, cat: "Converse", sizes: CV, desc: "Шүрэн улаан Chuck 70." },
  { title: "Converse Chuck 70 Hi Pistachio", handle: "converse-chuck70-hi-pistachio", price: 349000, cat: "Converse", sizes: CV, desc: "Писта ногоон Chuck 70 — хаврын өнгө." },
  { title: "Converse Chuck 70 Hi Lilac", handle: "converse-chuck70-hi-lilac", price: 349000, cat: "Converse", sizes: CV, desc: "Нил ягаан Chuck 70, өндөр хийц." },
  { title: "Converse Chuck 70 Hi Cobalt", handle: "converse-chuck70-hi-cobalt", price: 349000, cat: "Converse", sizes: CV, desc: "Кобальт хөх Chuck 70." },
  { title: "Converse Chuck 70 Hi Utility Black", handle: "converse-chuck70-hi-utility-black", price: 399000, cat: "Converse", sizes: CV, desc: "Utility хэлбэрийн хар Chuck 70, бүдүүн үдээстэй." },
  { title: "Converse One Star Low Black Leather", handle: "converse-one-star-low-black", price: 339000, cat: "Converse", sizes: CV, desc: "Хар арьсан One Star, цагаан одтой." },
  { title: "Converse One Star Ox Black", handle: "converse-one-star-ox-black", price: 329000, cat: "Converse", sizes: CV, desc: "Хар suede One Star Ox — сонгодог street пар." },
  { title: "Converse One Star Low Cream", handle: "converse-one-star-low-cream", price: 329000, cat: "Converse", sizes: CV, desc: "Цөцгийн suede One Star, зөөлөн одны хээтэй." },
  { title: "Converse One Star Low Black Stars", handle: "converse-one-star-low-black-stars", price: 339000, cat: "Converse", sizes: CV, desc: "Хар One Star, цагаан одны хээтэй." },
  { title: "Converse One Star Pro Red Velvet", handle: "converse-one-star-pro-red", price: 359000, cat: "Converse", sizes: CV, desc: "Улаан хилэн гадаргуутай One Star Pro." },
  { title: "Converse One Star Pro Pink", handle: "converse-one-star-pro-pink", price: 359000, cat: "Converse", sizes: CV, desc: "Зөөлөн ягаан One Star Pro, хөх үдээстэй." },
  { title: "Converse Go 2 Backpack Navy", handle: "converse-backpack-navy", price: 179000, cat: "Converse", sizes: ONE, desc: "Хар хөх Converse үүргэвч — лаптопны тасалгаатай." },
  { title: "Converse Flap Backpack Black White", handle: "converse-flap-bag-black-white", price: 159000, cat: "Converse", sizes: ONE, desc: "Хар цагаан хослолтой жижиг үүргэвч." },
  { title: "Converse Street 22 Backpack Black", handle: "converse-backpack-black", price: 179000, cat: "Converse", sizes: ONE, desc: "Хар Converse үүргэвч — өдөр тутмын багтаамж." },
  { title: "Converse Go 2 Backpack White", handle: "converse-backpack-white", price: 179000, cat: "Converse", sizes: ONE, desc: "Цагаан Converse үүргэвч, олон халаастай." },
  { title: "Converse Street Backpack Black", handle: "converse-backpack-black-street", price: 169000, cat: "Converse", sizes: ONE, desc: "Энгийн хар үүргэвч — сургууль, ажилд." },
  { title: "Converse Go 2 Backpack Blue", handle: "converse-backpack-blue", price: 179000, cat: "Converse", sizes: ONE, desc: "Цэнхэр Converse үүргэвч, хоёр тасалгаатай." },
  { title: "Converse Transition Backpack Red", handle: "converse-backpack-red", price: 189000, cat: "Converse", sizes: ONE, desc: "Улаан Converse үүргэвч — том багтаамжтай." },
  { title: "Converse Go Lo Backpack Pink", handle: "converse-backpack-pink", price: 149000, cat: "Converse", sizes: ONE, desc: "Ягаан жижиг Converse үүргэвч." },
  { title: "Converse Go Lo Backpack Orange", handle: "converse-backpack-orange", price: 149000, cat: "Converse", sizes: ONE, desc: "Улбар шар жижиг Converse үүргэвч." },

  // ── Nike ──
  { title: "Nike Pegasus White Orange", handle: "nike-pegasus-white-orange", price: 489000, cat: "Nike", sizes: NK, desc: "Өдөр тутмын гүйлтийн Nike Pegasus, React дэрлэгтэй." },
  { title: "Nike Metcon Brown", handle: "nike-metcon-brown", price: 459000, cat: "Nike", sizes: NK, desc: "Бэлтгэлийн тогтвортой Nike Metcon — хүнд ачаалалд." },
  { title: "Nike Metcon Red Black", handle: "nike-metcon-red", price: 459000, cat: "Nike", sizes: NK, desc: "Улаан хар Nike Metcon, зал бэлтгэлийн пар." },
  { title: "Nike Metcon Black White", handle: "nike-metcon-black", price: 459000, cat: "Nike", sizes: NK, desc: "Хар цагаан Nike Metcon — тогтвортой тал улавч." },
  { title: "Nike Court Vision White", handle: "nike-court-white", price: 389000, cat: "Nike", sizes: NK, desc: "Цагаан арьсан Nike Court — энгийн сонгодог." },
  { title: "Nike Air Max Black", handle: "nike-air-max-black", price: 529000, cat: "Nike", sizes: NK, desc: "Хар Nike Air Max, агаарын дэрлэгтэй." },
  { title: "Nike Air Max White", handle: "nike-air-max-white", price: 529000, cat: "Nike", sizes: NK, desc: "Цагаан Nike Air Max — өдөр тутмын тав тух." },
  { title: "Nike Air Zoom Structure Black", handle: "nike-structure-black", price: 499000, cat: "Nike", sizes: NK, desc: "Хар Nike Air Zoom — замын гүйлтэд." },
  { title: "Nike Air Force 1 Black", handle: "nike-air-force-1-black", price: 459000, cat: "Nike", sizes: NK, desc: "Хар арьсан Air Force 1 — street сонгодог." },
  { title: "Nike Air Force 1 White", handle: "nike-air-force-1-white", price: 459000, cat: "Nike", sizes: NK, desc: "Цагаан Air Force 1 — хамгийн танигдсан силуэт." },
  { title: "Nike ACG Boot Black Teal", handle: "nike-acg-boot-black-teal", price: 629000, cat: "Nike", sizes: NK, desc: "ACG уулын гутал — ус нэвтрүүлэхгүй, барьцтай." },
  { title: "Nike ACG Boot Olive Rust", handle: "nike-acg-boot-olive", price: 629000, cat: "Nike", sizes: NK, desc: "Чидун ногоон ACG гутал, trail тал улавчтай." },

  // ── New Balance ──
  { title: "New Balance 530 Black", handle: "nb-530-black", price: 459000, cat: "New Balance", sizes: NB, desc: "Хар 530 — retro гүйлтийн силуэт, ABZORB дэрлэг." },
  { title: "New Balance 530 White Navy", handle: "nb-530-white-navy", price: 459000, cat: "New Balance", sizes: NB, desc: "Цагаан дээр хар хөх өргөлттэй 530." },
  { title: "New Balance 530 Silver", handle: "nb-530-silver", price: 459000, cat: "New Balance", sizes: NB, desc: "Мөнгөлөг 530 — Y2K маягийн сонгодог." },
  { title: "New Balance 9060 Black", handle: "nb-9060-black", price: 559000, cat: "New Balance", sizes: NB, desc: "Бүдүүн тал улавчтай 9060, хар өнгө." },
  { title: "New Balance 9060 Grey", handle: "nb-9060-grey", price: 559000, cat: "New Balance", sizes: NB, desc: "Саарал 9060 — chunky силуэт." },
  { title: "New Balance 1906 Check", handle: "nb-1906-check", price: 529000, cat: "New Balance", sizes: NB, desc: "Шалмаг хээтэй 1906 — N-ergy дэрлэгтэй." },

  // ── ASICS ──
  { title: "ASICS Gel-Kayano 14 Silver", handle: "asics-gel-kayano-silver", price: 499000, cat: "ASICS", sizes: NB, desc: "Мөнгөлөг Gel-Kayano 14 — GEL дэрлэгтэй." },
  { title: "ASICS Gel-NYC Black", handle: "asics-gel-nyc-black", price: 499000, cat: "ASICS", sizes: NB, desc: "Хар Gel-NYC, зөөлөн GEL дэрлэг." },

  // ── Salomon ──
  { title: "Salomon XT-6 Black", handle: "salomon-xt6-black", price: 629000, cat: "Salomon", sizes: NB, desc: "Trail гүйлтийн XT-6 — Quicklace, Contagrip тал улавч." },
  { title: "Salomon XT-6 Black Silver", handle: "salomon-xt6-silver", price: 629000, cat: "Salomon", sizes: NB, desc: "Мөнгөлөг XT-6 — бартаат замд зориулсан." },

  // ── The North Face ──
  { title: "The North Face Vectiv Trail Navy", handle: "tnf-vectiv-trail-navy", price: 549000, cat: "The North Face", sizes: NB, desc: "Хар хөх Vectiv trail пүүз — хөнгөн, барьцтай." },
  { title: "The North Face Vectiv Run Navy", handle: "tnf-vectiv-run-navy", price: 549000, cat: "The North Face", sizes: NB, desc: "Vectiv гүйлтийн пүүз, нүүрстөрөгчийн хавтантай." },
  { title: "The North Face Verto Boot Black", handle: "tnf-verto-boot-black", price: 690000, cat: "The North Face", sizes: NB, desc: "Өвлийн уулын гутал — ус нэвтрүүлэхгүй, Vibram тал улавч." },
  { title: "The North Face Verto Boot Grey", handle: "tnf-verto-boot-grey", price: 690000, cat: "The North Face", sizes: NB, desc: "Саарал Verto гутал, Vibram барьцтай тал улавч." },
  { title: "The North Face Vectiv Trail Rust", handle: "tnf-vectiv-trail-rust", price: 549000, cat: "The North Face", sizes: NB, desc: "Зэвэн улаан trail пүүз — уулын замд." },

  // ── UGG ──
  { title: "UGG Classic Knit Tall Black", handle: "ugg-classic-knit-tall-black", price: 650000, cat: "UGG", sizes: UG, desc: "Нэхмэл ба арьсан хослолтой өндөр өвлийн гутал." },
  { title: "UGG Alpine Tassel Boot Black", handle: "ugg-alpine-tassel-black", price: 690000, cat: "UGG", sizes: UG, desc: "Сүлжмэл чимэглэлтэй хар Alpine гутал." },
  { title: "UGG Fluff Slipper Chestnut", handle: "ugg-fluff-slipper-chestnut", price: 320000, cat: "UGG", sizes: UG, desc: "Хонины ноосон гэрийн шаахай — хөнгөн, дулаахан." },
  { title: "UGG Droplet Boot Black", handle: "ugg-droplet-boot-black", price: 560000, cat: "UGG", sizes: UG, desc: "Ус нэвтрүүлэхгүй богино өвлийн гутал, horn товчтой." },
  { title: "UGG Classic Tall Chestnut", handle: "ugg-classic-tall-chestnut", price: 690000, cat: "UGG", sizes: UG, desc: "Сонгодог өндөр UGG — бүтэн хонины ноосон дотортой." },
  { title: "UGG Classic Short Sand", handle: "ugg-classic-short-sand", price: 590000, cat: "UGG", sizes: UG, desc: "Элсэн өнгийн богино сонгодог UGG." },
  { title: "UGG Tazz Platform Chestnut", handle: "ugg-tazz-platform-chestnut", price: 560000, cat: "UGG", sizes: UG, desc: "Tazz platform — ар тал нь задгай, нэхмэл ирмэгтэй." },
  { title: "UGG Tazz Platform Burgundy", handle: "ugg-tazz-burgundy", price: 560000, cat: "UGG", sizes: UG, desc: "Бордо Tazz platform, зузаан тал улавчтай." },
  { title: "UGG Neumel Chukka Black", handle: "ugg-neumel-black", price: 470000, cat: "UGG", sizes: UG, desc: "Хар suede Neumel chukka — эрэгтэй өвлийн пар." },
  { title: "UGG Classic Mini Dark Brown", handle: "ugg-classic-mini-dark-brown", price: 520000, cat: "UGG", sizes: UG, desc: "Хар хүрэн mini UGG, зузаан тал улавчтай." },
  { title: "UGG Classic Mini Platform Chestnut", handle: "ugg-classic-mini-platform-chestnut", price: 560000, cat: "UGG", sizes: UG, desc: "Chestnut өнгийн platform mini UGG." },
  { title: "UGG Classic Mini Platform Black", handle: "ugg-classic-mini-platform-black", price: 560000, cat: "UGG", sizes: UG, desc: "Хар platform mini UGG — өндөрсгөсөн тал улавч." },
  { title: "UGG Classic Mini Platform Sand", handle: "ugg-classic-mini-platform-sand", price: 560000, cat: "UGG", sizes: UG, desc: "Элсэн өнгийн platform mini UGG." },
  { title: "UGG Classic Mini II Chestnut", handle: "ugg-classic-mini-ii-chestnut", price: 520000, cat: "UGG", sizes: UG, desc: "Сонгодог Classic Mini II — chestnut өнгө." },
  { title: "UGG Classic Mini II Black", handle: "ugg-classic-mini-ii-black", price: 520000, cat: "UGG", sizes: UG, desc: "Сонгодог Classic Mini II — хар өнгө." },
  { title: "UGG Shearling Platform Chestnut", handle: "ugg-shearling-platform-chestnut", price: 620000, cat: "UGG", sizes: UG, desc: "Ил гарсан хонины ноостой platform гутал." },

  // ── Christian Dior ──
  { title: "Christian Dior Quilted Rider Boot", handle: "dior-quilted-rider-boot-black", price: 2890000, cat: "Christian Dior", sizes: UG, desc: "Хатгамал арьсан өндөр Rider гутал, алтан товчтой." },
];

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
  // Retired Oct 2026: promo-card JPGs carrying a grey studio backdrop, the
  // CONVERSE/NEW BALANCE wordmark and a baked-in price. Replaced by the
  // transparent cutouts, which is the whole catalogue now.
  "converse-chuck-low-cream-stars","converse-chuck-low-grey-stars","converse-chuck-low-pink-stars",
  "converse-chuck-low-zip-black","converse-chuck-low-zip-cream","converse-chuck-platform-pink",
  "converse-chuck70-hi-black-star","converse-chuck70-hi-blue","converse-chuck70-hi-daisy-blue",
  "converse-chuck70-hi-daisy-white","converse-chuck70-hi-grey-denim","converse-chuck70-hi-natural",
  "converse-chuck70-hi-navy","converse-chuck70-hi-white-star","converse-futsal-black",
  "converse-one-star-black","converse-one-star-mustard","converse-one-star-navy",
  "converse-retro-trainer-green","converse-suede-low-red","converse-suede-retro-pink",
  "nb-1906a-black","nb-1906a-grey","nb-1906a-silver",
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
  logger.info(`X-MAS catalog ready — ${all.length} products across 8 brands.`);
}
