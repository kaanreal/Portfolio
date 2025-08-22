        // ===== GLOBAL VARIABLES AND STATE =====
        
        // Feature toggles and state management
        let particlesEnabled = true;
        let osuVisible = false;
        let keysPressed = {};

        // ===== PARTICLE SYSTEM =====
        
        /**
         * Creates and animates floating background particles
         * Generates random particles with varying sizes and positions
         */
        function createParticles() {
            if (!particlesEnabled) return;
            
            const particlesContainer = document.getElementById('particles');
            particlesContainer.innerHTML = '';
            const particleCount = 50;

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                
                // Randomize particle properties for organic movement
                const size = Math.random() * 4 + 1;
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                
                // Stagger animation timing for natural effect
                particle.style.animationDelay = Math.random() * 6 + 's';
                particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
                
                particlesContainer.appendChild(particle);
            }
        }

        /**
         * Initializes mouse interaction with particles
         * Creates subtle parallax effect based on cursor position
         */
        function initMouseInteraction() {
            document.addEventListener('mousemove', throttle((e) => {
                if (!particlesEnabled) return;
                
                const particles = document.querySelectorAll('.particle');
                const mouseX = e.clientX / window.innerWidth;
                const mouseY = e.clientY / window.innerHeight;

                // Apply parallax movement to each particle
                particles.forEach((particle, index) => {
                    const speed = (index % 5 + 1) * 0.3;
                    const x = (mouseX - 0.5) * speed;
                    const y = (mouseY - 0.5) * speed;
                    
                    particle.style.transform += `translate(${x}px, ${y}px)`;
                });
            }, 16));
        }

        // ===== USER INTERFACE FUNCTIONS =====

        /**
         * Placeholder function for upcoming skins feature
         * Displays development status to users
         */
        function comingSoon() {
            alert("I still need to make skins :(");
        }

        /**
         * Opens specified modal with smooth animation
         * @param {string} modalId - The ID of the modal to open
         */
        function openModal(modalId) {
            const modal = document.getElementById(modalId);
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }

        /**
         * Closes specified modal and restores scrolling
         * @param {string} modalId - The ID of the modal to close
         */
        function closeModal(modalId) {
            const modal = document.getElementById(modalId);
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }

        /**
         * Opens fullscreen image viewer for polaroid photos
         * @param {HTMLElement} polaroidElement - The polaroid element clicked
         */
        function openFullscreen(polaroidElement) {
            const overlay = document.getElementById('fullscreenOverlay');
            const fullscreenImg = document.getElementById('fullscreenImage');
            const originalImg = polaroidElement.querySelector('img');
            
            // Transfer image source to fullscreen viewer
            fullscreenImg.src = originalImg.src;
            fullscreenImg.alt = originalImg.alt;
            
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        /**
         * Closes fullscreen image viewer
         */
        function closeFullscreen() {
            const overlay = document.getElementById('fullscreenOverlay');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        /**
         * Handles skin download functionality (placeholder)
         * @param {string} filename - Name of the skin file to download
         */
        function downloadSkin(filename) {
            alert(`Downloading ${filename}...`);
        }

        // ===== CONTACT FORM SYSTEM =====

        /**
         * Initializes contact form with Formspree integration
         * Handles form submission and user feedback
         */
        function initContactForm() {
            const form = document.getElementById('contactForm');
            const statusMsg = document.getElementById('formStatus');

            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                // Show loading state
                statusMsg.style.display = "block";
                statusMsg.textContent = "Sending message...";

                // Submit form data to Formspree
                const data = new FormData(form);
                const response = await fetch(form.action, {
                    method: form.method,
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });

                // Handle response and provide user feedback
                if (response.ok) {
                    statusMsg.textContent = "✅ Message sent successfully!";
                    form.reset();

                    // Auto-close modal after successful submission
                    setTimeout(() => {
                        closeModal('contactModal');
                        statusMsg.style.display = "none";
                    }, 1500);
                } else {
                    statusMsg.textContent = "❌ Error sending message. Please try again.";
                }
            });
        }

        /**
         * Opens social media links in new tabs
         * @param {string} platform - The social platform identifier
         */
        function openSocialLink(platform) {
            const links = {
                youtube: 'https://www.youtube.com/@kaaanreal',
                twitter: 'https://twitter.com/kaaanreal',
                osu: 'https://osu.ppy.sh/users/26595459',
                discord: 'https://discord.gg/QbgXmUn8AY'
            };
            
            if (links[platform] && links[platform] !== '#') {
                window.open(links[platform], '_blank');
            } else {
                alert(`${platform} link not configured yet!`);
            }
        }

        // ===== 3D POLAROID EFFECTS =====

        /**
         * Initializes interactive 3D tilt effects for polaroid images
         * Creates realistic perspective changes based on mouse movement
         */
        function init3DTiltEffect() {
            const polaroids = document.querySelectorAll('.polaroid');
            
            polaroids.forEach(polaroid => {
                // Dynamic tilt based on mouse position within element
                polaroid.addEventListener('mousemove', function(e) {
                    const rect = this.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    
                    const mouseX = e.clientX - centerX;
                    const mouseY = e.clientY - centerY;
                    
                    // Calculate rotation values based on mouse offset
                    const rotateX = 8 + (mouseY / (rect.height / 2)) * -12;
                    const rotateY = 15 + (mouseX / (rect.width / 2)) * 15;
                    const rotateZ = (mouseX / (rect.width / 2)) * 4;
                    
                    // Apply enhanced 3D transform
                    this.style.transform = `
                        perspective(1000px) 
                        rotateX(${rotateX}deg) 
                        rotateY(${rotateY}deg) 
                        rotateZ(${rotateZ}deg)
                        scale(1.08) 
                        translateZ(45px)
                    `;
                });
                
                // Reset to original position when mouse leaves
                polaroid.addEventListener('mouseleave', function() {
                    this.style.transform = this.dataset.originalTransform || 'perspective(1000px) rotateX(15deg) rotateY(25deg) rotateZ(-3deg) translateZ(15px)';
                });
            });
        }

        /**
         * Initializes polaroid gallery with randomized positioning
         * Creates unique transform values for each polaroid
         */
        function initPolaroidEffects() {
            const polaroids = document.querySelectorAll('.polaroid');
            polaroids.forEach((polaroid, index) => {
                // Generate random rotation values for organic appearance
                const randomX = 10 + Math.random() * 10;
                const randomY = 20 + Math.random() * 15;
                const randomZ = -5 + Math.random() * 8;
                const randomDelay = Math.random() * 4;
                const randomDuration = 6 + Math.random() * 4;
                
                // Apply randomized initial transform
                const originalTransform = `perspective(1000px) rotateX(${randomX}deg) rotateY(${randomY}deg) rotateZ(${randomZ}deg) translateZ(15px)`;
                polaroid.style.transform = originalTransform;
                polaroid.style.animationDelay = randomDelay + 's';
                polaroid.style.animationDuration = randomDuration + 's';
                
                // Store original transform for reset functionality
                polaroid.dataset.originalTransform = originalTransform;
            });
            
            init3DTiltEffect();
        }

        // ===== NAVIGATION SYSTEM =====

        /**
         * Initializes navigation interactions and animations
         * Handles active states and click effects
         */
        function initNavigation() {
            // Navigation item click handling
            document.querySelectorAll('.nav-item:not(.dropdown)').forEach(item => {
                item.addEventListener('click', function() {
                    // Update active state
                    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Subtle click animation
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 150);
                });
            });

            // Social icon ripple effects
            document.querySelectorAll('.social-icon').forEach(icon => {
                icon.addEventListener('click', function() {
                    // Create ripple effect element
                    const ripple = document.createElement('div');
                    ripple.style.position = 'absolute';
                    ripple.style.borderRadius = '50%';
                    ripple.style.background = 'rgba(255, 255, 255, 0.6)';
                    ripple.style.transform = 'scale(0)';
                    ripple.style.animation = 'ripple 0.6s linear';
                    ripple.style.left = '50%';
                    ripple.style.top = '50%';
                    ripple.style.width = '100%';
                    ripple.style.height = '100%';
                    ripple.style.marginLeft = '-50%';
                    ripple.style.marginTop = '-50%';
                    
                    this.appendChild(ripple);
                    setTimeout(() => ripple.remove(), 600);
                });
            });
        }

        // ===== EVENT LISTENERS =====

        /**
         * Initializes global event listeners for UI interactions
         * Handles modal closing, keyboard shortcuts, and overlay clicks
         */
        function initEventListeners() {
            // Close modals when clicking outside content area
            document.querySelectorAll('.modal').forEach(modal => {
                modal.addEventListener('click', function(e) {
                    if (e.target === this) {
                        closeModal(this.id);
                    }
                });
            });

            // Close fullscreen overlay when clicking outside image
            document.getElementById('fullscreenOverlay').addEventListener('click', function(e) {
                if (e.target === this) {
                    closeFullscreen();
                }
            });

            // Global keyboard shortcut handling
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    // Close all active modals on Escape key
                    document.querySelectorAll('.modal.active').forEach(modal => {
                        closeModal(modal.id);
                    });
                    closeFullscreen();
                    
                    // Hide osu player if visible
                    if (osuVisible) {
                        const player = document.getElementById('osuPlayer');
                        if (player) {
                            player.style.display = 'none';
                            osuVisible = false;
                            keysPressed = {};
                        }
                    }
                }
            });
        }

        // ===== EASTER EGG SYSTEM =====

        /**
         * Initializes hidden osu! player easter egg
         * Activated by pressing D+F or J+K key combinations simultaneously
         */
        function initOsuPlayer() {
            document.addEventListener('keydown', (e) => {
                keysPressed[e.key.toLowerCase()] = true;

                // Check for key combination activation
                if (!osuVisible && ((keysPressed['d'] && keysPressed['f']) || (keysPressed['j'] && keysPressed['k']))) {
                    const player = document.getElementById('osuPlayer');
                    if (player) {
                        player.style.display = 'block';
                        osuVisible = true;
                    }
                }
            });

            // Track key releases to reset combination state
            document.addEventListener('keyup', (e) => {
                keysPressed[e.key.toLowerCase()] = false;
            });
        }

        // ===== UTILITY FUNCTIONS =====

        /**
         * Throttle function to limit function execution frequency
         * Used for performance optimization on frequent events like mousemove
         * @param {Function} func - Function to throttle
         * @param {number} limit - Minimum time between executions in milliseconds
         */
        function throttle(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            }
        }

        // ===== INITIALIZATION =====

        /**
         * Main initialization function
         * Runs all setup functions when DOM is fully loaded
         */
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize all systems in order
            createParticles();
            initMouseInteraction();
            initPolaroidEffects();
            initNavigation();
            initContactForm();
            initEventListeners();
            initOsuPlayer();
        });