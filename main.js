let activeShapes = [];

function createPS4Background() {
    for (let i = 0; i < 8; i++) {
        createFloatingShape();
    }
    
    createInteractiveParticles();
}

function getNonOverlappingPosition(size) {
    const padding = 60;
    const maxAttempts = 50;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const x = Math.random() * (window.innerWidth - size - 80) + 40;
        const y = Math.random() * (window.innerHeight - size - 80) + 40;
        
        let isOverlapping = false;
        for (const shape of activeShapes) {
            const shapeRect = shape.getBoundingClientRect();
            const shapeCenterX = shapeRect.left + shapeRect.width / 2;
            const shapeCenterY = shapeRect.top + shapeRect.height / 2;
            
            const distance = Math.sqrt(
                Math.pow(x + size/2 - shapeCenterX, 2) + 
                Math.pow(y + size/2 - shapeCenterY, 2)
            );
            
            if (distance < padding) {
                isOverlapping = true;
                break;
            }
        }
        
        if (!isOverlapping) {
            return { x, y };
        }
    }
    
    return {
        x: Math.random() * (window.innerWidth - size - 80) + 40,
        y: Math.random() * (window.innerHeight - size - 80) + 40
    };
}

function createFloatingShape() {
    const shape = document.createElement('div');
    const size = Math.random() * 60 + 30;
    
    const position = getNonOverlappingPosition(size);
    const x = position.x;
    const y = position.y;
    
    const spinDirection = Math.random() > 0.5 ? 1 : -1;
    const spinSpeed = Math.random() * 0.6 + 0.3;
    let moveX = (Math.random() - 0.5) * 0.8;
    let moveY = (Math.random() - 0.5) * 0.8;
    const moveSpeed = Math.random() * 0.2 + 0.1;
    
    const lifetime = Math.random() * 40000 + 30000;
    
    shape.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        background: linear-gradient(45deg, rgba(0, 150, 255, 0.4), rgba(0, 150, 255, 0.15));
        border: 2px solid rgba(0, 150, 255, 0.6);
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        z-index: -1;
        opacity: 0;
        transform: translate(0px, 0px) rotate(0deg);
        box-shadow: 0 0 20px rgba(0, 150, 255, 0.4);
        transition: opacity 2s ease-in-out;
        will-change: transform;
    `;
    
    document.body.appendChild(shape);
    activeShapes.push(shape);
    
    setTimeout(() => {
        shape.style.opacity = '1';
    }, 100);
    
    let currentX = 0;
    let currentY = 0;
    let currentRotation = 0;
    
    const moveInterval = setInterval(() => {
        currentX += moveX * moveSpeed;
        currentY += moveY * moveSpeed;
        currentRotation += spinDirection * spinSpeed;
        
        if (x + currentX < 40) {
            currentX = 40 - x;
            moveX = Math.abs(moveX) * 0.8;
        } else if (x + currentX > window.innerWidth - size - 40) {
            currentX = window.innerWidth - size - 40 - x;
            moveX = -Math.abs(moveX) * 0.8;
        }
        
        if (y + currentY < 40) {
            currentY = 40 - y;
            moveY = Math.abs(moveY) * 0.8;
        } else if (y + currentY > window.innerHeight - size - 40) {
            currentY = window.innerHeight - size - 40 - y;
            moveY = -Math.abs(moveY) * 0.8;
        }
        
        shape.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${currentRotation}deg)`;
        
    }, 100);
    
    let glowIntensity = 0.4;
    let glowDirection = 1;
    
    const glowInterval = setInterval(() => {
        glowIntensity += glowDirection * 0.005;
        if (glowIntensity >= 0.5 || glowIntensity <= 0.3) {
            glowDirection *= -1;
        }
        shape.style.boxShadow = `0 0 ${20 * glowIntensity}px rgba(0, 150, 255, ${glowIntensity})`;
    }, 500);
    
    setTimeout(() => {
        shape.style.transition = 'opacity 3s ease-in-out';
        shape.style.opacity = '0';
        
        clearInterval(moveInterval);
        clearInterval(glowInterval);
        
        setTimeout(() => {
            if (shape.parentNode) {
                shape.parentNode.removeChild(shape);
                const index = activeShapes.indexOf(shape);
                if (index > -1) {
                    activeShapes.splice(index, 1);
                }
            }
        }, 3000);
    }, lifetime);
}

function createInteractiveParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 4 + 1;
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(0, 150, 255, 0.7);
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            animation: particleFloat ${Math.random() * 15 + 15}s linear infinite;
            box-shadow: 0 0 ${size * 3}px rgba(0, 150, 255, 0.6);
            opacity: 1;
        `;
        
        particlesContainer.appendChild(particle);
    }
    
    document.body.appendChild(particlesContainer);
}

function addDynamicCSS() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particleFloat {
            0% { 
                transform: translateY(100vh) scale(0.5);
                opacity: 0;
            }
            10% { 
                opacity: 1;
                transform: translateY(90vh) scale(1);
            }
            90% { 
                opacity: 1;
                transform: translateY(10vh) scale(1);
            }
            100% { 
                transform: translateY(-100px) scale(0.5);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}


function initHamburgerMenu() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navOverlay = document.querySelector('.nav-overlay');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (!hamburgerMenu || !navOverlay) return;

    hamburgerMenu.addEventListener('click', function() {
        hamburgerMenu.classList.toggle('active');
        navOverlay.classList.toggle('active');
        
        if (navOverlay.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            hamburgerMenu.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.style.overflow = '';
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    navOverlay.addEventListener('click', function(e) {
        if (e.target === navOverlay) {
            hamburgerMenu.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navOverlay.classList.contains('active')) {
            hamburgerMenu.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

function initScrollAnimations() {
    const scrollElements = document.querySelectorAll('.container, .name-section, .projects-section, .about-section, .contact-section');
    
    if (scrollElements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scroll-animate');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    });
    
    scrollElements.forEach(element => {
        observer.observe(element);
    });
}

function handleVideoPlaceholders() {
    const videoContainers = document.querySelectorAll('.image-placeholder');
    
    videoContainers.forEach(container => {
        const video = container.querySelector('video');
        if (video) {
            container.classList.add('video-present');
            
            video.addEventListener('canplay', () => {
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log('Autoplay prevented:', error);
                    });
                }
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    addDynamicCSS();
    createPS4Background();
    initHamburgerMenu();
    initScrollAnimations();
    handleVideoPlaceholders();
    
    setInterval(() => {
        if (activeShapes.length < 8) {
            const randomDelay = Math.random() * 15000 + 10000;
            setTimeout(() => {
                if (activeShapes.length < 8) {
                    createFloatingShape();
                }
            }, randomDelay);
        }
    }, 15000);
});
