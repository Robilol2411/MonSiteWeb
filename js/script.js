document.getElementById('year').textContent = new Date().getFullYear();

const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
let isMenuOpen = false;

mobileMenuBtn.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;
    mobileMenu.classList.toggle('hidden');
    mobileMenuBtn.setAttribute('aria-expanded', isMenuOpen);
    
    if (isMenuOpen) {
         mobileMenuBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    } else {
         mobileMenuBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>';
    }
});

function navigateTo(targetId) {

    if(isMenuOpen) {
        mobileMenuBtn.click();
    }

    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });

    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('text-yellow-400');
        link.classList.add('text-slate-300');
        link.removeAttribute('aria-current');
        
        if(link.getAttribute('data-target') === targetId) {
            link.classList.add('text-yellow-400');
            link.classList.remove('text-slate-300');
            link.setAttribute('aria-current', 'page');
        }
    });

    document.querySelectorAll('.nav-link-mobile').forEach(link => {
        link.classList.remove('text-yellow-400');
        link.classList.add('text-slate-200');
        
        if(link.getAttribute('data-target') === targetId) {
            link.classList.add('text-yellow-400');
            link.classList.remove('text-slate-200');
        }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
 
    const homeLink = document.querySelector('.nav-link[data-target="accueil"]');
    if (homeLink) {
        homeLink.classList.add('text-yellow-400');
        homeLink.classList.remove('text-slate-300');
    }
    
    const activeMobile = document.querySelector('.nav-link-mobile[data-target="accueil"]');
    if(activeMobile) {
        activeMobile.classList.add('text-yellow-400');
        activeMobile.classList.remove('text-slate-200');
    }
});