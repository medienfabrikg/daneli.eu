// ===== Mobile Navigation =====
const navToggle = document.getElementById('navToggle');
const navList = document.getElementById('navList');

navToggle.addEventListener('click', () => {
    navList.classList.toggle('active');
});

// Close mobile nav when clicking a link
navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navList.classList.remove('active');
    });
});

// ===== Header Scroll Effect =====
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ===== Portfolio Gallery & Lightbox (nur auf index.html) =====
const portfolioGrid = document.getElementById('portfolioGrid');

if (portfolioGrid) {
    const portfolioCount = 20; // pic4.jpg to pic23.jpg

    // Generate portfolio items
    for (let i = 4; i <= 23; i++) {
        const item = document.createElement('div');
        item.classList.add('portfolio-item');
        item.innerHTML = `<img src="pics/pic${i}.jpg" alt="Portfolio ${i - 3}" loading="lazy">`;
        item.addEventListener('click', () => openLightbox(i - 4));
        portfolioGrid.appendChild(item);
    }

    // ===== Lightbox =====
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxThumbnails = document.getElementById('lightboxThumbnails');
    let currentLightboxIndex = 0;

    // Generate thumbnails
    for (let i = 4; i <= 23; i++) {
        const thumb = document.createElement('img');
        thumb.src = `pics/pic${i}.jpg`;
        thumb.classList.add('lightbox-thumbnail');
        thumb.addEventListener('click', () => {
            currentLightboxIndex = i - 4;
            updateLightboxImage();
        });
        lightboxThumbnails.appendChild(thumb);
    }

    const thumbnails = document.querySelectorAll('.lightbox-thumbnail');

    function openLightbox(index) {
        currentLightboxIndex = index;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateLightboxImage();
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightboxImage() {
        const imageIndex = currentLightboxIndex + 4;
        lightboxImage.src = `pics/pic${imageIndex}.jpg`;
        lightboxImage.alt = `Portfolio ${currentLightboxIndex + 1}`;

        // Update thumbnails
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === currentLightboxIndex);
        });

        // Scroll thumbnail into view
        thumbnails[currentLightboxIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
    }

    function nextLightboxImage() {
        currentLightboxIndex = (currentLightboxIndex + 1) % portfolioCount;
        updateLightboxImage();
    }

    function prevLightboxImage() {
        currentLightboxIndex = (currentLightboxIndex - 1 + portfolioCount) % portfolioCount;
        updateLightboxImage();
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', prevLightboxImage);
    lightboxNext.addEventListener('click', nextLightboxImage);

    // Close lightbox on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevLightboxImage();
        if (e.key === 'ArrowRight') nextLightboxImage();
    });
}

// ===== Smooth Scroll for Navigation Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections
document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// ===== Lazy Loading Images =====
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ===== Performance: Debounce Scroll Events =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll-heavy operations if needed
const debouncedScroll = debounce(() => {
    // Any heavy scroll operations can go here
}, 100);

window.addEventListener('scroll', debouncedScroll);
