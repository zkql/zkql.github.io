document.addEventListener('DOMContentLoaded', () => {
    const enterScreen = document.getElementById('enterScreen');
    const mainContent = document.getElementById('mainContent');

    // Click to enter functionality
    enterScreen.addEventListener('click', () => {
        enterScreen.style.display = 'none';
        mainContent.classList.remove('hidden');
        
        setTimeout(() => {
            mainContent.classList.add('visible');
        }, 50);
    });

    // Parallax effect (desktop only)
    document.addEventListener('mousemove', (e) => {
        if (window.innerWidth > 768) {
            const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
            mainContent.style.transform = `perspective(1000px) rotateY(${moveX}deg) rotateX(${-moveY}deg) scale(1)`;
        }
    });

    // Prevent zoom on desktop
    document.addEventListener('wheel', function(e) {
        if(e.ctrlKey) {
            e.preventDefault();
        }
    }, { passive: false });

    // Prevent zoom on mobile
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });

    document.addEventListener('touchend', function(e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });

    // Prevent pinch zoom
    document.addEventListener('gesturestart', function(e) {
        e.preventDefault();
    });

    // Optional: Typing effect for bio
    class TypeWriter {
        constructor(txtElement, words, wait = 3000) {
            this.txtElement = txtElement;
            this.words = words;
            this.txt = '';
            this.wordIndex = 0;
            this.wait = parseInt(wait, 10);
            this.type();
            this.isDeleting = false;
        }

        type() {
            const current = this.wordIndex % this.words.length;
            const fullTxt = this.words[current];

            if (this.isDeleting) {
                this.txt = fullTxt.substring(0, this.txt.length - 1);
            } else {
                this.txt = fullTxt.substring(0, this.txt.length + 1);
            }

            this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

            let typeSpeed = 100;

            if (this.isDeleting) {
                typeSpeed /= 2;
            }

            if (!this.isDeleting && this.txt === fullTxt) {
                typeSpeed = this.wait;
                this.isDeleting = true;
            } else if (this.isDeleting && this.txt === '') {
                this.isDeleting = false;
                this.wordIndex++;
                typeSpeed = 500;
            }

            setTimeout(() => this.type(), typeSpeed);
        }
    }

    // Initialize typing effect if element exists
    const txtElement = document.querySelector('.typing');
    if (txtElement) {
        const words = JSON.parse(txtElement.getAttribute('data-words'));
        new TypeWriter(txtElement, words, 3000);
    }

    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            mainContent.style.transform = 'scale(1)';
        }
    });

    // Reset transform on touch devices
    let touchStartY = 0;
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });

    document.addEventListener('touchmove', (e) => {
        const touchY = e.touches[0].clientY;
        const diff = touchStartY - touchY;

        // Prevent default only if trying to scroll the body
        if (
            (diff > 0 && window.scrollY === 0) ||
            (diff < 0 && window.scrollY + window.innerHeight === document.documentElement.scrollHeight)
        ) {
            e.preventDefault();
        }
    }, { passive: false });

    // Handle resize
    window.addEventListener('resize', () => {
        mainContent.style.transform = 'scale(1)';
    });

    // Optional: Add audio support
    const audio = document.querySelector('audio');
    if (audio) {
        document.addEventListener('click', () => {
            audio.play().catch(() => {
                // Handle autoplay restrictions
            });
        }, { once: true });
    }

    // Add this to your existing script.js
    function addScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = `slideIn 0.5s ease-out forwards ${entry.target.dataset.delay || '0s'}`;
                }
            });
        });

        document.querySelectorAll('.social-link').forEach((link, index) => {
            link.style.opacity = '0';
            link.dataset.delay = `${index * 0.1}s`;
            observer.observe(link);
        });
    }

    // Call this after content is visible
    addScrollAnimations();
});
