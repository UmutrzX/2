/**
 * ======================================================================
 * YÖNETİM PANELİ (CONFIG DOSYASI) - KARTECH PANEL STRUCTURES HOUSE SYSTEMS
 * ======================================================================
 */

export const siteConfig = {
    // ==========================================
    // BÖLÜM 1: GENEL BİLGİLER VE İLETİŞİM
    // ==========================================
    contact: {
        logoSrc: "https://i.pinimg.com/736x/4e/f6/25/4ef625ad3564670a75e74be775fac392.jpg",
        address: "Sakarya, Türkiye",
        phone: "+90 507 880 76 07", 
        email: "info@kartechpanel.com",
        
        social: { 
            facebook: "#", 
            youtube: "#", 
            instagram: "https://www.instagram.com/muhammet.tutkun/" 
        }
    },

    // ==========================================
    // BÖLÜM 2: ANA SAYFA (HERO) AYARLARI
    // ==========================================
    homeHero: {
        backgroundImage: "https://i.pinimg.com/1200x/bd/20/dd/bd20ddd04e4e1cac3fb9a6b88958749d.jpg",
        slogan: {
            tr: "Lüks ve Minimalizmin Birleşimi",
            en: "Fusion of Luxury and Minimalism"
        },
        subSlogan: {
            tr: "SİP Panel teknolojisiyle hayalinizdeki yapıya hızla kavuşun.",
            en: "Reach your dream structure quickly with SIP Panel technology."
        }
    },

    // ==========================================
    // BÖLÜM 3: FİLTRE KATEGORİLERİ 
    // ==========================================
    categories: {
        "ev-modelleri": [
            { id: "ev-standart", tr: "Standart Evler", en: "Standard Houses" },
            { id: "ev-ahsap", tr: "Ahşap Kaplamalı Evler", en: "Wooden Clad Houses" },
            { id: "ev-luks", tr: "Lüks Villalar", en: "Luxury Villas" }
        ],
        "bahce-yapilari": [
            { id: "by-kamelya", tr: "Kamelya & Çardak", en: "Gazebos & Pergolas" },
            { id: "by-kisbahcesi", tr: "Kış Bahçeleri", en: "Winter Gardens" },
            { id: "by-depo", tr: "Bahçe Depoları", en: "Garden Sheds" }
        ],
        "garaj-sistemleri": [
            { id: "gs-tekacik", tr: "Tek Araçlık Açık Garaj", en: "Single Car Open Garage" },
            { id: "gs-ciftkapali", tr: "Çift Araçlık Kapalı Garaj", en: "Double Car Closed Garage" },
            { id: "gs-atolye", tr: "Atölyeli Garajlar", en: "Garages with Workshop" }
        ]
    },

    // ==========================================
    // BÖLÜM 4: PROJELER 
    // ==========================================
    projects: [
        {
            id: "dubleks-298", 
            title: "Zifin House",
            titleEn: "Duplex Project - 298",
            area: 61, rooms: 3,  
            pageMenu: "ev-modelleri", 
            categoryId: "ev-luks", 
            mainImage: "https://i.pinimg.com/736x/e0/b9/e1/e0b9e1b995c80a7c916a8ad64fa09d83.jpg",
            gallery: [
                "https://i.pinimg.com/736x/e4/9b/cb/e49bcbcb4078e3140f07f75687455669.jpg",
                "https://i.pinimg.com/736x/4f/4e/11/4f4e11dbabea7f52a2425b3d04505b60.jpg"
            ],
            description: {
                tr: "Kartech Panel kalitesiyle tasarlanmış modern iki katlı dubleks proje. Geniş pencereleri ve ferah tasarımı ile lüks bir yaşam sunar.",
                en: "Modern two-story duplex SIP panel project designed with Kartech Panel quality."
            }
        },
        {
            id: "calanthe-145",
            title: "Calanthe Modeli",
            titleEn: "Calanthe Model - 145",
            area: 54, rooms: 4,
            pageMenu: "ev-modelleri", 
            categoryId: "ev-standart",
            mainImage: "https://i.pinimg.com/736x/b3/fc/38/b3fc3888aecdcc57cd78193d31f7bd46.jpg",
            gallery: ["https://i.pinimg.com/1200x/be/d6/bf/bed6bfbffcea556193c1a2b9c7ce4b92.jpg"],
            description: {
                tr: "Doğa ile iç içe yaşam sunan şık ve kullanışlı bir ev tasarımı. Enerji verimliliği yüksek, kurulumu oldukça hızlıdır.",
                en: "A stylish and useful house design offering a life intertwined with nature."
            }
        },
        {
            id: "kis-bahcesi-1",
            title: "Premium Kış Bahçesi",
            titleEn: "Premium Winter Garden",
            area: 25, rooms: 1,
            pageMenu: "bahce-yapilari", 
            categoryId: "by-kisbahcesi",
            mainImage: "https://i.pinimg.com/736x/4f/4e/11/4f4e11dbabea7f52a2425b3d04505b60.jpg",
            gallery: [],
            description: { tr: "Dört mevsim bahçe keyfi sürebileceğiniz özel yalıtımlı yapı sistemimiz.", en: "Special insulated structure system to enjoy your garden all four seasons." }
        },
        {
            id: "garaj-1",
            title: "Çift Araçlık Garaj",
            titleEn: "Double Car Garage",
            area: 40, rooms: 1,
            pageMenu: "garaj-sistemleri", 
            categoryId: "gs-ciftkapali",
            mainImage: "https://i.pinimg.com/1200x/bd/20/dd/bd20ddd04e4e1cac3fb9a6b88958749d.jpg",
            gallery: [],
            description: { tr: "Araçlarınız için yüksek yalıtımlı, güvenli SİP panel garaj çözümü.", en: "Secure, highly insulated SIP panel garage solution for your vehicles." }
        }
    ],

    // ==========================================
    // BÖLÜM 5: ÇEVİRİLER VE SAYFA YAZILARI
    // ==========================================
    i18n: {
        tr: {
            menu: {
                "sip-panel": "Sip Panel", 
                "ev-modelleri": "Ev Modelleri", 
                "bahce-yapilari": "Bahçe Yapıları", 
                "garaj-sistemleri": "Garaj Sistemleri", 
                "uretim": "Üretim", 
                "galeri": "Galeri", 
                "hakkimizda": "Hakkımızda"
            },
            
            consultBtn: "İletişim",
            allProjectsTitle: "Tüm Seçenekler",
            categoryTitle: "Kategoriler",
            sqm: "m²",
            totalArea: "Toplam alan",
            roomCount: "Oda sayısı",
            getQuoteTitle: "Hemen Fiyat Alın",
            formName: "İsminiz",
            formPhone: "Telefon (Örn: 507 880 7607)",
            submitBtn: "Gönder",
            backBtn: "Geri Dön",
            projectDetailsTitle: "Detaylar",
            
            pageTitles: {
                "uretim": "Üretim Tesisimiz",
                "galeri": "Fotoğraf Galerisi",
                "hakkimizda": "Hakkımızda",
                "sip-panel": "Sip Panel",
                "ev-modelleri": "Ev Modellerimiz",
                "bahce-yapilari": "Bahçe Yapılarımız",
                "garaj-sistemleri": "Garaj Sistemlerimiz"
            },
            
            pageContents: {
                "sip-panel-intro": `
                    <div class="text-left max-w-4xl mb-16">
                        <h2 class="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">Geleceğin Yapı Teknolojisi</h2>
                        <p class="text-xl text-gray-600 leading-relaxed font-medium">SİP (Yapısal Yalıtımlı Panel) teknolojisi ile evlerinizi hem daha hızlı inşa ediyor hem de maksimum enerji tasarrufu sağlıyoruz. Kartech Panel Structures House Systems güvencesiyle lüksü doğayla buluşturuyoruz.</p>
                        <div class="mt-8 w-24 h-1.5 bg-brand-orange rounded-full"></div>
                    </div>
                `,
                
                "uretim": `
                    <p class="mb-6 text-xl text-gray-700 leading-relaxed font-medium break-words">Fabrikamızda en son teknoloji ile SİP panellerin üretimini gerçekleştiriyoruz.</p>
                `,
                "galeri": "<p class='text-center text-gray-500 text-xl font-medium break-words'>Şantiye ve tamamlanan projelerimizin detaylı fotoğrafları yakında burada yer alacaktır.</p>",
                "hakkimizda": `
                    <h3 class="text-4xl font-black mb-6 text-gray-900 tracking-tight">Kartech Panel Structures House Systems</h3>
                    <p class="mb-6 text-xl text-gray-700 leading-relaxed font-medium break-words">Yılların verdiği tecrübe ile yenilikçi yapı teknolojilerini Türkiye ile buluşturuyoruz.</p>
                `
            },
            footerText: "© 2026 Kartech Panel Structures House Systems. Tüm hakları saklıdır."
        },
        en: {
            menu: {
                "sip-panel": "Sip Panel", "ev-modelleri": "House Models", 
                "bahce-yapilari": "Garden Structures", "garaj-sistemleri": "Garage Systems", 
                "uretim": "Production", "galeri": "Gallery", "hakkimizda": "About Us"
            },
            consultBtn: "Contact", categoryTitle: "Categories",
            allProjectsTitle: "All Options", sqm: "m²", totalArea: "Total area", roomCount: "Rooms",
            getQuoteTitle: "Get a Quote", formName: "Your Name", formPhone: "Phone",
            submitBtn: "Submit", backBtn: "Go Back", projectDetailsTitle: "Details",
            pageTitles: {
                "uretim": "Production", "galeri": "Gallery", "hakkimizda": "About Us",
                "sip-panel": "SIP Panel", "ev-modelleri": "House Models", 
                "bahce-yapilari": "Garden Structures", "garaj-sistemleri": "Garage Systems"
            },
            pageContents: {
                "sip-panel-intro": `
                    <div class="text-left max-w-4xl mb-16">
                        <h2 class="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">Future Building Technology</h2>
                        <p class="text-xl text-gray-600 leading-relaxed font-medium">We build your homes faster and provide maximum energy savings with SIP technology. Kartech Panel Structures House Systems brings luxury together with nature.</p>
                        <div class="mt-8 w-24 h-1.5 bg-brand-orange rounded-full"></div>
                    </div>
                `,
                "uretim": "<p class='text-xl break-words'>Information about our production facility.</p>",
                "galeri": "<p class='text-xl break-words'>Gallery coming soon.</p>",
                "hakkimizda": "<p class='text-xl break-words'>About Kartech Panel Structures House Systems.</p>"
            },
            footerText: "© 2026 Kartech Panel Structures House Systems. All rights reserved."
        }
    }
};