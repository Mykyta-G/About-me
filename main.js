// Floating shapes system with random timing and collision prevention
let activeShapes = [];

function createPS4Background() {
    // Create initial shapes
    for (let i = 0; i < 15; i++) {
        createFloatingShape();
    }
    
    createInteractiveParticles();
}

// Find position where new shape won't overlap existing ones
function getNonOverlappingPosition(size) {
    const padding = 80;
    const maxAttempts = 100;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const x = Math.random() * (window.innerWidth - size - 100) + 50;
        const y = Math.random() * (window.innerHeight - size - 100) + 50;
        
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
        x: Math.random() * (window.innerWidth - size - 100) + 50,
        y: Math.random() * (window.innerHeight - size - 100) + 50
    };
}

function createFloatingShape() {
    const shape = document.createElement('div');
    const size = Math.random() * 80 + 40;
    
    const position = getNonOverlappingPosition(size);
    const x = position.x;
    const y = position.y;
    
    // Random movement and rotation properties
    const spinDirection = Math.random() > 0.5 ? 1 : -1;
    const spinSpeed = Math.random() * 0.8 + 0.4;
    const moveX = (Math.random() - 0.5) * 1.2;
    const moveY = (Math.random() - 0.5) * 1.2;
    const moveSpeed = Math.random() * 0.3 + 0.2;
    
    const lifetime = Math.random() * 30000 + 25000;
    
    shape.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        background: linear-gradient(45deg, rgba(0, 150, 255, 0.5), rgba(0, 150, 255, 0.2));
        border: 3px solid rgba(0, 150, 255, 0.8);
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        z-index: -1;
        opacity: 0;
        transform: translate(0px, 0px) rotate(0deg);
        box-shadow: 0 0 30px rgba(0, 150, 255, 0.6), inset 0 0 20px rgba(0, 150, 255, 0.1);
        transition: opacity 3s ease-in-out;
        will-change: transform;
    `;
    
    document.body.appendChild(shape);
    activeShapes.push(shape);
    
    // Fade in the shape
    setTimeout(() => {
        shape.style.opacity = '1';
    }, 100);
    
    // Movement and rotation tracking
    let currentX = 0;
    let currentY = 0;
    let currentRotation = 0;
    
    const moveInterval = setInterval(() => {
        currentX += moveX * moveSpeed;
        currentY += moveY * moveSpeed;
        currentRotation += spinDirection * spinSpeed;
        
        // Bounce off screen edges
        if (x + currentX < 50) {
            currentX = 50 - x;
            moveX = Math.abs(moveX) * 0.7;
        } else if (x + currentX > window.innerWidth - size - 50) {
            currentX = window.innerWidth - size - 50 - x;
            moveX = -Math.abs(moveX) * 0.7;
        }
        
        if (y + currentY < 50) {
            currentY = 50 - y;
            moveY = Math.abs(moveY) * 0.7;
        } else if (y + currentY > window.innerHeight - size - 50) {
            currentY = window.innerHeight - size - 50 - y;
            moveY = -Math.abs(moveY) * 0.7;
        }
        
        shape.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${currentRotation}deg)`;
        
    }, 80);
    
    // Glow animation
    let glowIntensity = 0.6;
    let glowDirection = 1;
    
    const glowInterval = setInterval(() => {
        glowIntensity += glowDirection * 0.008;
        if (glowIntensity >= 0.65 || glowIntensity <= 0.55) {
            glowDirection *= -1;
        }
        shape.style.boxShadow = `0 0 ${30 * glowIntensity}px rgba(0, 150, 255, ${glowIntensity}), inset 0 0 20px rgba(0, 150, 255, 0.1)`;
    }, 300);
    
    // Fade out and remove shape
    setTimeout(() => {
        shape.style.transition = 'opacity 4s ease-in-out';
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
        }, 4000);
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
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 5 + 2;
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(0, 150, 255, 0.9);
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            animation: particleFloat ${Math.random() * 20 + 20}s linear infinite;
            box-shadow: 0 0 ${size * 4}px rgba(0, 150, 255, 0.8);
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

document.addEventListener('DOMContentLoaded', () => {
    addDynamicCSS();
    createPS4Background();
    
    // Handle video placeholders
    handleVideoPlaceholders();
    
    // Maintain shape count with random spawn timing
    setInterval(() => {
        if (activeShapes.length < 15) {
            const randomDelay = Math.random() * 12000 + 8000;
            setTimeout(() => {
                if (activeShapes.length < 15) {
                    createFloatingShape();
                }
            }, randomDelay);
        }
    }, 10000);
});

function handleVideoPlaceholders() {
    const videoContainers = document.querySelectorAll('.image-placeholder');
    
    videoContainers.forEach(container => {
        const video = container.querySelector('video');
        if (video) {
            // Hide the placeholder X when video is present
            container.classList.add('video-present');
            
            // Add video event listeners for better user experience
            video.addEventListener('loadeddata', () => {
                console.log('Video loaded successfully:', video.src);
            });
            
            video.addEventListener('error', (e) => {
                console.error('Video error:', e);
                // Fallback: show placeholder if video fails to load
                container.classList.remove('video-present');
            });
            
            // Ensure video plays on mobile devices
            video.addEventListener('canplay', () => {
                // Try to play the video
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log('Autoplay prevented:', error);
                        // Add play button or other fallback
                    });
                }
            });
        }
    });
}
