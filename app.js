import { siteConfig } from './config.js';

const state = {
    lang: 'tr',       
    currentView: 'sip-panel', 
    activeCategory: null,     
    sliderInterval: null,
    mobileMenuOpen: false,    
    openAccordion: null,      
    sortBy: 'default',
    lightboxImages: [],
    currentLightboxIndex: 0,
    activeGalleryIndex: 0
};

window.state = state;

const DOM = {
    header: document.getElementById('main-header'),
    content: document.getElementById('app-content'),
    footer: document.getElementById('main-footer')
};

function t() { return siteConfig.i18n[state.lang]; }

function updateDocumentTitle(viewOrId) {
    const baseTitle = "Kartech Panel Structures House Systems";
    let subTitle = "";
    if (['sip-panel', 'ev-modelleri', 'bahce-yapilari', 'garaj-sistemleri', 'uretim', 'galeri', 'hakkimizda'].includes(viewOrId)) {
        subTitle = t().pageTitles[viewOrId];
    } else {
        const project = siteConfig.projects.find(p => p.id === viewOrId);
        if (project) subTitle = state.lang === 'tr' ? project.title : project.titleEn;
    }
    document.title = subTitle ? `${subTitle} | ${baseTitle}` : baseTitle;
}

// 🌟 FİX: Kategori seçimini sıfırlamamak için keepCategory parametresi eklendi
export function navigate(viewOrId, evt = null, keepCategory = false) {
    if (evt) evt.preventDefault(); 
    
    if (state.mobileMenuOpen) {
        window.toggleMobileMenu();
    }

    if (state.currentView === viewOrId && !keepCategory && !state.activeCategory) {
        return; 
    }

    // Eğer dışarıdan veya logodan tıklanırsa filtreyi sıfırla, menüden filtrelendiyse koru
    if (!keepCategory) {
        state.activeCategory = null; 
    }
    
    if (state.sliderInterval) { clearInterval(state.sliderInterval); state.sliderInterval = null; }

    state.currentView = viewOrId;
    
    DOM.content.classList.remove('page-fade-in');
    DOM.content.classList.add('page-fade-out');
    
    renderHeader();
    updateDocumentTitle(viewOrId);

    setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
        
        if (['sip-panel', 'ev-modelleri', 'bahce-yapilari', 'garaj-sistemleri'].includes(viewOrId)) {
            renderProjectsPage(viewOrId);
        } 
        else if (['uretim', 'galeri', 'hakkimizda'].includes(viewOrId)) {
            renderGenericPage(viewOrId);
        } else {
            renderProjectDetail(viewOrId);
        }

        DOM.content.classList.remove('page-fade-out');
        DOM.content.classList.add('page-fade-in');
        
        window.dispatchEvent(new Event('scroll'));
    }, 350); 
}

export function changeLanguage(lang) {
    if (state.lang === lang) return;
    state.lang = lang;
    document.documentElement.lang = lang; 
    
    renderHeader();
    updateDocumentTitle(state.currentView);
    
    if (['sip-panel', 'ev-modelleri', 'bahce-yapilari', 'garaj-sistemleri'].includes(state.currentView)) renderProjectsPage(state.currentView);
    else if (['uretim', 'galeri', 'hakkimizda'].includes(state.currentView)) renderGenericPage(state.currentView);
    else renderProjectDetail(state.currentView);
    
    renderFooter();
}

window.navigate = navigate;
window.changeLanguage = changeLanguage;

// 🌟 FİX: Siyah menüden filtre seçince doğrudan o kategori seçili olarak yönlendirir
window.filterAndNavigate = function(menuId, catId, evt) {
    if(evt) {
        evt.preventDefault();
        evt.stopPropagation();
    }
    
    if (state.mobileMenuOpen) {
        window.toggleMobileMenu();
    }

    state.activeCategory = catId === 'all' ? null : catId;
    
    // Yönlendirme fonksiyonunu kategori silinmesin diye "true" ile çağırıyoruz
    if (state.currentView !== menuId) {
        navigate(menuId, null, true); 
    } else {
        renderProjectsPage(menuId);
        setTimeout(() => {
             const grid = document.getElementById('projects-grid');
             if(grid) grid.scrollIntoView({behavior: 'smooth'});
        }, 100);
    }
};

window.filterCategory = function(catId, evt) {
    if(evt) evt.preventDefault();
    state.activeCategory = catId === 'all' ? null : catId;
    if (!['sip-panel', 'ev-modelleri', 'bahce-yapilari', 'garaj-sistemleri'].includes(state.currentView)) {
        state.currentView = 'sip-panel';
    }
    renderProjectsPage(state.currentView);
};

window.sortProjects = function(sortBy) {
    state.sortBy = sortBy;
    renderProjectsPage(state.currentView);
};

window.toggleMobileMenu = function() {
    state.mobileMenuOpen = !state.mobileMenuOpen;
    const overlay = document.getElementById('vg-overlay-bg');
    
    if(state.mobileMenuOpen) {
        state.openAccordion = null; 
        document.body.classList.add('menu-open');
        
        document.querySelectorAll('.accordion-content').forEach(el => el.classList.remove('open'));
        document.querySelectorAll('.accordion-icon').forEach(el => el.classList.remove('rotate-180'));
        
        if (overlay) overlay.classList.add('active');
    } else {
        document.body.classList.remove('menu-open');
        if (overlay) overlay.classList.remove('active');
    }
};

window.toggleAccordion = function(menuId, evt) {
    if (evt) {
        evt.preventDefault();
        evt.stopPropagation();
    }
    
    const targetContent = document.getElementById(`accordion-${menuId}`);
    const targetIcon = document.getElementById(`icon-${menuId}`);

    if (state.openAccordion === menuId) {
        state.openAccordion = null;
        if (targetContent) targetContent.classList.remove('open');
        if (targetIcon) targetIcon.classList.remove('rotate-180');
    } else {
        document.querySelectorAll('.accordion-content').forEach(el => el.classList.remove('open'));
        document.querySelectorAll('.accordion-icon').forEach(el => el.classList.remove('rotate-180'));
        
        state.openAccordion = menuId;
        if (targetContent) targetContent.classList.add('open');
        if (targetIcon) targetIcon.classList.add('rotate-180');
    }
};

window.closeMenuFromOutside = function(e) {
    if(e.target.id === 'vg-overlay-bg') window.toggleMobileMenu();
};

window.changeMainImage = function(src) {
    const mainImg = document.getElementById('detail-main-image');
    if(mainImg) {
        mainImg.style.opacity = 0; 
        mainImg.style.transform = 'scale(0.95)';
        setTimeout(() => { 
            mainImg.src = src; 
            mainImg.style.opacity = 1; 
            mainImg.style.transform = 'scale(1)';
        }, 300); 
    }
};

window.setGalleryImage = function(index) {
    if (state.sliderInterval) { clearInterval(state.sliderInterval); state.sliderInterval = null; }
    state.activeGalleryIndex = index;
    window.changeMainImage(state.lightboxImages[index]);
};

window.openLightboxCurrent = function() {
    if (state.sliderInterval) { clearInterval(state.sliderInterval); state.sliderInterval = null; }
    window.openLightbox(state.activeGalleryIndex);
};

window.openLightbox = function(startIndex) {
    const overlay = document.getElementById('lightbox-overlay');
    const img = document.getElementById('lightbox-img');
    const counter = document.getElementById('lightbox-counter');
    
    state.currentLightboxIndex = startIndex;
    img.src = state.lightboxImages[startIndex];
    counter.innerText = `${startIndex + 1} / ${state.lightboxImages.length}`;
    
    overlay.classList.add('active');
    document.addEventListener('keydown', window.handleLightboxKeys);
};

window.closeLightbox = function() {
    document.getElementById('lightbox-overlay').classList.remove('active');
    document.removeEventListener('keydown', window.handleLightboxKeys);
};

window.changeLightboxImage = function(direction) {
    state.currentLightboxIndex += direction;
    if (state.currentLightboxIndex < 0) state.currentLightboxIndex = state.lightboxImages.length - 1;
    else if (state.currentLightboxIndex >= state.lightboxImages.length) state.currentLightboxIndex = 0;
    
    const img = document.getElementById('lightbox-img');
    const counter = document.getElementById('lightbox-counter');
    
    img.style.opacity = 0;
    img.style.transform = direction > 0 ? 'translateX(100px) scale(0.9)' : 'translateX(-100px) scale(0.9)';
    
    setTimeout(() => {
        img.src = state.lightboxImages[state.currentLightboxIndex];
        img.style.opacity = 1;
        img.style.transform = 'translateX(0) scale(1)';
        counter.innerText = `${state.currentLightboxIndex + 1} / ${state.lightboxImages.length}`;
    }, 250);
};

window.handleLightboxKeys = function(e) {
    if (e.key === 'Escape') window.closeLightbox();
    if (e.key === 'ArrowRight') window.changeLightboxImage(1);
    if (e.key === 'ArrowLeft') window.changeLightboxImage(-1);
};

window.shareProject = function(evt) {
    evt.preventDefault();
    navigator.clipboard.writeText(window.location.href).then(() => {
        showToast(state.lang === 'tr' ? 'Bağlantı kopyalandı!' : 'Link copied!');
    });
};

function showToast(message) {
    const toast = document.getElementById('toast-message');
    toast.innerHTML = `<i class="fas fa-check-circle mr-2 text-brand-green"></i>${message}`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

window.formatPhone = function(input) {
    let x = input.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
    input.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '') + (x[4] ? '-' + x[4] : '');
};

window.submitTestForm = function(evt, form) {
    evt.preventDefault();
    const inputs = form.querySelectorAll('input');
    const message = `TALEBİ\nİsim: ${inputs[0].value}\nTel: ${inputs[1].value}`;
    window.open(`https://wa.me/905308321046?text=${encodeURIComponent(message)}`, '_blank');
    document.getElementById('alert-modal').classList.add('active');
    form.reset(); 
};

function renderHeader() {
    const menuItems = ['sip-panel', 'ev-modelleri', 'bahce-yapilari', 'garaj-sistemleri', 'uretim', 'galeri', 'hakkimizda'];

    const overlayMenuHTML = menuItems.map(id => {
        const isProjectMenu = ['ev-modelleri', 'bahce-yapilari', 'garaj-sistemleri'].includes(id);
        const label = t().menu[id];
        
        if (isProjectMenu) {
            const categories = siteConfig.categories[id] || [];
            const isOpen = state.openAccordion === id;
            
            return `
            <div class="mb-3 md:mb-5">
               <div class="flex items-center justify-between cursor-pointer group w-full max-w-sm" onclick="window.toggleAccordion('${id}', event)">
                   <span class="text-2xl md:text-4xl font-semibold text-gray-300 group-hover:text-white transition">${label}</span>
                   <i id="icon-${id}" class="accordion-icon fas fa-chevron-down text-base md:text-xl text-gray-500 group-hover:text-white transition transform ${isOpen ? 'rotate-180' : ''}"></i>
               </div>
               
               <div id="accordion-${id}" class="accordion-content ${isOpen ? 'open' : ''} pl-4 md:pl-6 border-l border-gray-700 ml-2 flex flex-col">
                   <a href="#" class="text-base md:text-xl text-gray-400 hover:text-brand-orange cursor-pointer font-medium py-1.5" onclick="window.filterAndNavigate('${id}', 'all', event)">${t().allProjectsTitle}</a>
                   ${categories.map(cat => `
                       <a href="#" class="text-base md:text-xl text-gray-400 hover:text-brand-orange cursor-pointer font-medium py-1.5" onclick="window.filterAndNavigate('${id}', '${cat.id}', event)">${cat[state.lang]}</a>
                   `).join('')}
               </div>
            </div>
            `;
        } else {
            return `
            <div class="mb-3 md:mb-5">
                <a href="#" onclick="navigate('${id}', event)" class="text-2xl md:text-4xl font-semibold text-gray-300 hover:text-white transition inline-block">${label}</a>
            </div>
            `;
        }
    }).join('');

    // 🌟 FİX: Logo yapısı basitleştirildi. Absolute veya css hileleri yerine flex box içinde doğal akışa bırakıldı.
    DOM.header.innerHTML = `
        <div class="max-w-[1400px] mx-auto px-6 h-full flex items-center justify-between relative z-50">
            
            <div class="cursor-pointer h-full flex items-center py-2" onclick="navigate('sip-panel')">
                 <img src="${siteConfig.contact.logoSrc}" alt="Kartech Panel Structures House Systems" class="h-10 md:h-14 lg:h-16 w-auto object-contain transition-transform duration-300 hover:scale-105">
            </div>
            
            <div class="flex items-center space-x-3 md:space-x-4 ml-auto">
                
                <div class="hidden sm:flex space-x-3 text-white social-icons mr-2">
                    <a href="${siteConfig.contact.social.instagram}" target="_blank" class="hover:text-brand-orange text-xl transition-colors"><i class="fab fa-instagram"></i></a>
                    <a href="${siteConfig.contact.social.facebook}" target="_blank" class="hover:text-brand-orange text-xl transition-colors"><i class="fab fa-facebook-f"></i></a>
                </div>

                <button onclick="navigate('contact')" class="hidden md:block bg-brand-orange hover:bg-orange-500 text-white font-semibold py-2 px-6 rounded-full shadow-md transition-all btn-press text-sm whitespace-nowrap">
                    ${t().consultBtn}
                </button>

                <button onclick="window.toggleMobileMenu()" class="w-10 h-10 md:w-12 md:h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center text-white hover:bg-brand-orange shadow-lg transition-all duration-300 btn-press focus:outline-none shrink-0 z-[101]">
                    <i class="fas fa-bars text-lg pointer-events-none"></i>
                </button>
            </div>
        </div>

        <div id="vg-overlay-bg" onclick="window.closeMenuFromOutside(event)" class="vg-overlay">
            
            <div class="w-full p-6 md:p-8 flex justify-end items-center shrink-0">
                <div class="flex items-center space-x-4 md:space-x-6">
                    <div class="flex space-x-4 text-white mr-2">
                        <a href="${siteConfig.contact.social.instagram}" target="_blank" class="hover:text-brand-orange text-2xl transition-colors"><i class="fab fa-instagram"></i></a>
                        <a href="${siteConfig.contact.social.facebook}" target="_blank" class="hover:text-brand-orange text-2xl transition-colors"><i class="fab fa-facebook-f"></i></a>
                    </div>
                    <button onclick="window.toggleMobileMenu()" class="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-all duration-300 btn-press z-[105]">
                        <i class="fas fa-times text-2xl pointer-events-none"></i>
                    </button>
                </div>
            </div>

            <div class="w-full flex-grow px-8 md:px-24 lg:px-40 flex flex-col justify-start pt-10 pb-24 overflow-y-auto no-scrollbar">
                ${overlayMenuHTML}
                
                <div class="mt-8 pt-8 border-t border-gray-800 flex items-center space-x-6 w-max shrink-0">
                    <div class="flex space-x-4">
                        <span class="cursor-pointer font-bold text-lg btn-press ${state.lang === 'tr' ? 'text-brand-orange' : 'text-gray-500'}" onclick="changeLanguage('tr')">TR</span>
                        <span class="text-gray-700">|</span>
                        <span class="cursor-pointer font-bold text-lg btn-press ${state.lang === 'en' ? 'text-brand-orange' : 'text-gray-500'}" onclick="changeLanguage('en')">EN</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    window.dispatchEvent(new Event('scroll'));
}

function renderGenericPage(pageId) {
    const title = t().pageTitles[pageId] || '';
    const content = t().pageContents[pageId] || '';

    DOM.content.innerHTML = `
        <div class="max-w-5xl mx-auto py-32 px-4 min-h-[60vh]">
            <div class="mb-16">
                <h1 class="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight relative inline-block break-words">
                    ${title}
                    <div class="absolute -bottom-4 left-0 w-24 h-1.5 bg-brand-orange rounded-full"></div>
                </h1>
            </div>
            <div class="bg-white p-8 md:p-16 shadow-xl border border-gray-100 rounded-2xl break-words">
                ${content}
            </div>
        </div>
    `;
}

function renderProjectsPage(pageId) {
    let pageProjects = siteConfig.projects.filter(p => p.pageMenu === pageId);
    
    // 🌟 FİX: Ana sayfada projeleri rastgele sırala (Kayıp olan özellik geri geldi)
    if (pageId === 'sip-panel') {
        pageProjects = [...siteConfig.projects].sort(() => 0.5 - Math.random()).slice(0, 3);
    } else {
        if (state.activeCategory) {
            pageProjects = pageProjects.filter(p => p.categoryId === state.activeCategory);
        }
        if (state.sortBy === 'areaAsc') pageProjects.sort((a, b) => a.area - b.area);
        else if (state.sortBy === 'areaDesc') pageProjects.sort((a, b) => b.area - a.area);
    }

    const specificCategories = siteConfig.categories[pageId] || [];

    const allCatActive = state.activeCategory === null;
    const allCategoriesHTML = `
        <button onclick="filterCategory(null, event)" class="w-full text-left px-6 py-4 border-b border-gray-100/50 transition-all font-semibold btn-press rounded-xl mb-1 ${allCatActive ? 'bg-brand-orange text-white shadow-md' : 'text-gray-600 hover:bg-gray-50 hover:text-brand-orange'}">
            ${t().allProjectsTitle}
        </button>
    ` + specificCategories.map(cat => {
        const isActive = state.activeCategory === cat.id;
        return `
        <button onclick="filterCategory('${cat.id}', event)" class="w-full text-left px-6 py-4 border-b border-gray-100/50 transition-all font-semibold btn-press rounded-xl mb-1 ${isActive ? 'bg-brand-orange text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-brand-orange'}">
            ${cat[state.lang]}
        </button>
    `}).join('');

    const projectsHTML = pageProjects.length > 0 ? pageProjects.map(project => `
        <div class="project-card bg-white border border-gray-100 cursor-pointer rounded-2xl btn-press overflow-hidden flex flex-col group" onclick="navigate('${project.id}')">
            <div class="relative aspect-[4/3] overflow-hidden">
                <img src="${project.mainImage}" class="w-full h-full object-cover">
                <div class="absolute top-4 right-4 bg-gray-900/80 backdrop-blur-sm text-white px-4 py-1.5 font-bold rounded-lg shadow-lg z-10 text-sm tracking-wide">
                    ${project.area} ${t().sqm}
                </div>
                <div class="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors duration-400 flex items-center justify-center pointer-events-none">
                    <span class="bg-brand-orange text-white px-8 py-3 rounded-full font-bold opacity-0 group-hover:opacity-100 transform translate-y-8 group-hover:translate-y-0 transition-all duration-400 shadow-2xl flex items-center">
                        ${t().projectDetailsTitle} <i class="fas fa-arrow-right ml-3"></i>
                    </span>
                </div>
            </div>
            <div class="p-6 md:p-8 bg-white flex-grow flex items-center justify-between border-t border-gray-50">
                <h3 class="text-gray-900 font-bold text-xl group-hover:text-brand-orange transition-colors break-words">${state.lang === 'tr' ? project.title : project.titleEn}</h3>
                <div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-brand-orange group-hover:text-white transition-colors shrink-0">
                    <i class="fas fa-chevron-right text-sm"></i>
                </div>
            </div>
        </div>
    `).join('') : `<div class="col-span-full text-center py-32 text-gray-400 font-medium text-xl bg-white rounded-2xl shadow-sm border border-dashed border-gray-300 break-words"><i class="fas fa-folder-open text-6xl mb-6 block text-gray-300"></i>Bu kategoride proje bulunmamaktadır.</div>`;

    let heroHTML = '';
    let sipPanelContent = '';
    
    if (pageId === 'sip-panel') {
        // 🌟 FİX: Tam %100vh boyutu, beyaz şerit hatasını yok eder. -mt-[80px] kaldırıldı.
        heroHTML = `
            <div class="relative w-full h-[100vh] flex overflow-hidden">
                <div class="absolute inset-0 z-0">
                    <img src="${siteConfig.homeHero.backgroundImage}" class="w-full h-full object-cover">
                </div>

                <div class="relative z-10 w-full md:w-[65%] lg:w-[50%] h-full bg-[#1a201c]/25 backdrop-blur-md flex flex-col justify-center px-8 md:px-16 lg:px-24 pt-20 border-r border-white/10 shadow-2xl">
                    <div class="max-w-2xl transform">
                        <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight break-words">
                            ${siteConfig.homeHero.slogan[state.lang]}
                        </h1>
                        <p class="text-lg md:text-xl text-gray-300 font-medium leading-relaxed break-words">
                            ${siteConfig.homeHero.subSlogan[state.lang]}
                        </p>
                        
                        <div class="mt-12 flex space-x-4">
                            <button onclick="document.getElementById('sip-intro').scrollIntoView({behavior: 'smooth'})" class="bg-transparent border-2 border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white hover:text-black transition-all duration-300 btn-press">
                                Keşfedin <i class="fas fa-arrow-down ml-2"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="bg-white relative z-20 w-full">
                <div id="sip-intro" class="max-w-[1400px] mx-auto px-6 py-20">
                    ${t().pageContents['sip-panel-intro']}
                </div>
                <!-- 🌟 Rastgele Örnek Projeler Bölümü (Geri Geldi) -->
                ${pageProjects.length > 0 ? `
                    <div class="max-w-[1400px] mx-auto px-6 pb-24">
                        <div class="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end">
                            <div>
                                <h2 class="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight break-words">Örnek Projelerimiz</h2>
                                <div class="w-24 h-1.5 bg-brand-orange rounded-full"></div>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            ${projectsHTML}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
        
        sipPanelContent = heroHTML;
    }

    if (pageId !== 'sip-panel') {
        DOM.content.innerHTML = `
            <div id="projects-grid" class="max-w-[1400px] mx-auto px-6 py-12 mt-24">
                <div class="mb-16">
                    <h1 class="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight break-words">${t().pageTitles[pageId]}</h1>
                    <div class="w-24 h-1.5 bg-brand-orange rounded-full"></div>
                </div>

                <div class="flex flex-col lg:flex-row gap-8 lg:gap-16">
                    <div class="w-full lg:w-1/4">
                        <div class="bg-white p-4 rounded-2xl border border-gray-100 lg:sticky lg:top-32 shadow-xl">
                            <h2 class="font-bold text-gray-900 mb-6 px-4 text-xl tracking-tight hidden lg:block break-words">${t().categoryTitle}</h2>
                            <div class="flex flex-row overflow-x-auto no-scrollbar lg:flex-col gap-3 pb-4 lg:pb-0 scroll-smooth snap-x">
                                ${allCategoriesHTML}
                            </div>
                        </div>
                    </div>
                    
                    <div class="w-full lg:w-3/4">
                        <div class="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <span class="text-sm font-semibold text-gray-500 tracking-widest px-2">${pageProjects.length} Sonuç</span>
                            <select onchange="window.sortProjects(this.value)" class="bg-gray-50 border border-gray-200 text-gray-800 font-semibold text-sm rounded-lg focus:ring-2 focus:ring-brand-orange py-2 px-4 cursor-pointer outline-none transition-colors">
                                <option value="default" ${state.sortBy === 'default' ? 'selected' : ''}>Varsayılan</option>
                                <option value="areaAsc" ${state.sortBy === 'areaAsc' ? 'selected' : ''}>m² (Artan)</option>
                                <option value="areaDesc" ${state.sortBy === 'areaDesc' ? 'selected' : ''}>m² (Azalan)</option>
                            </select>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            ${projectsHTML}
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        DOM.content.innerHTML = sipPanelContent;
    }
}

function renderProjectDetail(projectId) {
    const project = siteConfig.projects.find(p => p.id === projectId);
    if (!project) return navigate('sip-panel'); 

    const prjTitle = state.lang === 'tr' ? project.title : project.titleEn;
    const prjDesc = project.description[state.lang];

    const fullGallery = [project.mainImage, ...(project.gallery || []).filter(img => img !== project.mainImage)];
    
    state.lightboxImages = fullGallery;
    state.activeGalleryIndex = 0; 
    
    if (state.sliderInterval) clearInterval(state.sliderInterval);
    state.sliderInterval = setInterval(() => {
        state.activeGalleryIndex = (state.activeGalleryIndex + 1) % state.lightboxImages.length;
        window.changeMainImage(state.lightboxImages[state.activeGalleryIndex]);
    }, 4500);

    const thumbnailsHTML = fullGallery.map((img, index) => `
        <div class="w-24 md:w-full aspect-square shrink-0 overflow-hidden rounded-xl border-4 border-white shadow-md hover:border-brand-orange hover:shadow-xl transition-all cursor-pointer btn-press"
             onclick="window.setGalleryImage(${index})">
             <img src="${img}" class="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity">
        </div>
    `).join('');

    DOM.content.innerHTML = `
        <div class="max-w-[1400px] mx-auto px-6 py-32">
            
            <div class="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div class="flex items-center text-sm font-semibold text-brand-orange space-x-2 mb-4 break-words">
                        <span class="cursor-pointer hover:text-gray-900 btn-press transition-colors" onclick="navigate('${project.pageMenu}')">${t().menu[project.pageMenu]}</span>
                        <i class="fas fa-arrow-right text-[10px] text-gray-300"></i>
                        <span class="text-gray-900 font-bold">${prjTitle}</span>
                    </div>
                    <h1 class="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight break-words">${prjTitle}</h1>
                </div>
                
                <div class="flex space-x-3 w-full md:w-auto">
                    <button onclick="window.shareProject(event)" class="flex-1 md:flex-none bg-white border-2 border-gray-200 hover:border-brand-orange text-gray-800 px-6 py-3 rounded-full font-semibold transition-all flex items-center justify-center shadow-sm btn-press">
                        <i class="fas fa-share-alt md:mr-2"></i> <span class="hidden md:inline">Paylaş</span>
                    </button>
                    <button onclick="navigate('${project.pageMenu}')" class="flex-1 md:flex-none bg-gray-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-brand-orange transition-colors flex items-center justify-center shadow-lg btn-press">
                        <i class="fas fa-arrow-left md:mr-2"></i> <span class="hidden md:inline">${t().backBtn}</span>
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16 mb-16">
                
                <div class="lg:col-span-2 flex flex-col md:flex-row gap-6">
                    <div class="w-full md:w-28 flex md:flex-col gap-4 overflow-x-auto md:overflow-visible no-scrollbar pb-4 md:pb-0 snap-x">
                        ${thumbnailsHTML}
                    </div>
                    
                    <div class="flex-grow group relative rounded-2xl shadow-xl overflow-hidden bg-gray-100">
                        <div class="w-full aspect-[4/3] cursor-zoom-in relative" onclick="window.openLightboxCurrent()">
                            <img id="detail-main-image" src="${project.mainImage}" alt="${prjTitle}" class="absolute inset-0 w-full h-full object-cover transition-all duration-500 hover:scale-105">
                            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-opacity duration-300 pointer-events-none"></div>
                            <div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur text-gray-900 px-6 py-2 rounded-full font-bold text-sm opacity-0 group-hover:opacity-100 transition-all duration-400 shadow-xl flex items-center pointer-events-none">
                                <i class="fas fa-expand mr-2 text-brand-orange"></i> Tam Ekran
                            </div>
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-1 space-y-8">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center text-center">
                            <div class="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center mb-4">
                                <i class="fas fa-ruler-combined text-brand-orange text-xl"></i>
                            </div>
                            <span class="text-gray-400 font-semibold text-xs uppercase tracking-widest mb-1 break-words">${t().totalArea}</span>
                            <span class="font-black text-3xl text-gray-900">${project.area}<span class="text-base text-brand-orange ml-1">m²</span></span>
                        </div>
                        <div class="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center text-center">
                            <div class="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                                <i class="fas fa-door-open text-green-500 text-xl"></i>
                            </div>
                            <span class="text-gray-400 font-semibold text-xs uppercase tracking-widest mb-1 break-words">${t().roomCount}</span>
                            <span class="font-black text-3xl text-gray-900">${project.rooms}</span>
                        </div>
                    </div>

                    <div class="bg-[#1a201c] p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
                        <h3 class="text-2xl font-bold text-white mb-2 relative z-10 break-words">${t().getQuoteTitle}</h3>
                        <p class="text-gray-400 text-sm font-medium mb-8 relative z-10 break-words">Mimarımız sizi arayıp bu proje hakkında detaylı bilgi versin.</p>
                        
                        <form class="space-y-4 relative z-10" onsubmit="window.submitTestForm(event, this)">
                            <div>
                                <input type="text" placeholder="${t().formName}" required
                                    class="w-full px-5 py-4 bg-black/40 border border-gray-700 text-white rounded-xl focus:outline-none focus:border-brand-orange focus:bg-black/60 transition-all font-medium placeholder-gray-500">
                            </div>
                            <div>
                                <input type="tel" placeholder="${t().formPhone}" required oninput="window.formatPhone(this)" maxlength="15"
                                    class="w-full px-5 py-4 bg-black/40 border border-gray-700 text-white rounded-xl focus:outline-none focus:border-brand-orange focus:bg-black/60 transition-all font-medium tracking-wider placeholder-gray-500">
                            </div>
                            <button type="submit" 
                                class="w-full bg-brand-orange text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:bg-orange-500 mt-2 flex justify-center items-center text-lg btn-press">
                                <i class="fas fa-paper-plane mr-3"></i> ${t().submitBtn}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div class="bg-white p-10 md:p-16 rounded-3xl shadow-xl border border-gray-100 max-w-4xl break-words">
                <h3 class="text-2xl font-bold mb-6 text-gray-900 border-l-4 border-brand-orange pl-4">${t().projectDetailsTitle}</h3>
                <p class="text-gray-600 leading-relaxed text-lg font-medium">${prjDesc}</p>
            </div>
        </div>
    `;
}

function renderFooter() {
    DOM.footer.innerHTML = `
        <div class="max-w-[1400px] mx-auto px-6 flex flex-col items-center justify-center space-y-8">
            <div class="w-40 flex items-center justify-center cursor-pointer btn-press transition-transform hover:scale-105" onclick="navigate('sip-panel')">
                <img src="${siteConfig.contact.logoSrc}" alt="Kartech Panel Structures House Systems" class="w-full h-auto object-contain">
            </div>
            <p class="text-sm text-gray-500 font-medium tracking-wide text-center break-words">${t().footerText}</p>
        </div>
    `;
}

function initApp() {
    renderHeader();
    renderFooter();
    
    window.addEventListener('scroll', renderHeader);

    state.currentView = 'sip-panel';
    renderProjectsPage('sip-panel');
    updateDocumentTitle('sip-panel'); 
    
    DOM.content.classList.remove('page-fade-out');
    DOM.content.classList.add('page-fade-in');
}

window.addEventListener('DOMContentLoaded', initApp);
