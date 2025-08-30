        // ===== GLOBAL VARIABLES AND STATE =====
        
        // Feature toggles and state management
        let osuVisible = false;
        let keysPressed = {};

        // ===== FALLING IMAGES SYSTEM =====

        /**
         * Creates falling images background effect
         * Two different images falling with rotation
         */
        function createFallingImages() {
            const container = document.getElementById('bgContainer');
            const images = [
                'assets/images/arrow1.png',      // Replace with your first image path
                'assets/images/arrow2.png'       // Replace with your second image path
            ];

            function createFallingImage() {
                const img = document.createElement('img');
                img.className = 'falling-image';
                
                // Randomly select one of the two images
                img.src = images[Math.floor(Math.random() * images.length)];
                
                // Random horizontal position (ensure it starts completely off-screen)
                img.style.left = Math.random() * (window.innerWidth + 200) - 100 + 'px';
                
                // Start much higher above screen
                img.style.top = '-200px';
                
                // Random size between 30px and 80px
                const size = Math.random() * 50 + 30;
                img.style.width = size + 'px';
                img.style.height = size + 'px';
                
                // Random animation duration between 6-12 seconds (faster)
                const duration = Math.random() * 6 + 6;
                img.style.animationDuration = duration + 's';
                
                // Random delay to stagger the images
                img.style.animationDelay = Math.random() * 1.5 + 's';
                
                container.appendChild(img);
                
                // Remove image after animation completes
                setTimeout(() => {
                    if (img.parentNode) {
                        img.remove();
                    }
                }, (duration + 1.5) * 1000);
            }

            // Create images more frequently
            setInterval(createFallingImage, 600);
            
            // Create initial batch
            for (let i = 0; i < 3; i++) {
                setTimeout(createFallingImage, i * 300);
            }
        }

        // ===== USER INTERFACE FUNCTIONS =====

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
         * Opens fullscreen viewer for skin preview images
         * @param {HTMLElement} skinPolaroidElement - The skin polaroid element clicked
         */
        function openSkinFullscreen(skinPolaroidElement) {
            const overlay = document.getElementById('fullscreenOverlay');
            const fullscreenImg = document.getElementById('fullscreenImage');
            const currentImg = skinPolaroidElement.querySelector('.skin-preview img');
            
            // Transfer current skin image to fullscreen viewer
            fullscreenImg.src = currentImg.src;
            fullscreenImg.alt = currentImg.alt;
            
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
            const polaroids = document.querySelectorAll('.polaroid, .skin-preview-polaroid');
            
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
                    this.style.transition = 'transform 0.1s ease-out';
                });
                
                // Smooth reset to original position when mouse leaves
                polaroid.addEventListener('mouseleave', function() {
                    this.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
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
            
            // Initialize skin polaroids too
            const skinPolaroids = document.querySelectorAll('.skin-preview-polaroid');
            skinPolaroids.forEach((polaroid, index) => {
                // Generate random rotation values for skin polaroids
                const randomX = 8 + Math.random() * 6;
                const randomY = 15 + Math.random() * 12;
                const randomZ = -3 + Math.random() * 6;
                const randomDelay = Math.random() * 4;
                const randomDuration = 6 + Math.random() * 4;
                
                // Apply randomized initial transform for skin polaroids
                const originalTransform = `perspective(1000px) rotateX(${randomX}deg) rotateY(${randomY}deg) rotateZ(${randomZ}deg) translateZ(15px)`;
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
         * Activated by pressing D+F+J+K key combinations simultaneously
         */
        function initOsuPlayer() {
            document.addEventListener('keydown', (e) => {
                keysPressed[e.key.toLowerCase()] = true;

                // Check for all 4 keys pressed simultaneously
                if (!osuVisible && keysPressed['d'] && keysPressed['f'] && keysPressed['j'] && keysPressed['k']) {
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

        // ===== SKIN PREVIEW SLIDING SYSTEM =====
        /**
         * Initializes sliding preview system for skin images
         * Simple cycling system with proper sliding animation
         */
        function initSkinPreviewSliding() {
            const skinItems = document.querySelectorAll(".skin-item");

            skinItems.forEach(item => {
                const previewContainer = item.querySelector(".skin-preview");
                const imageList = JSON.parse(item.dataset.images);
                
                // Skip if only one image
                if (imageList.length <= 1) return;
                
                let currentIndex = 0;
                
                // Clear container and create first image
                previewContainer.innerHTML = '';
                const currentImg = document.createElement('img');
                currentImg.src = imageList[0];
                currentImg.alt = 'Skin Preview';
                currentImg.style.position = 'absolute';
                currentImg.style.top = '0';
                currentImg.style.left = '0';
                currentImg.style.width = '100%';
                currentImg.style.height = '100%';
                currentImg.style.objectFit = 'cover';
                currentImg.style.transition = 'transform 0.6s ease-in-out';
                previewContainer.appendChild(currentImg);

                setInterval(() => {
                    currentIndex = (currentIndex + 1) % imageList.length;
                    
                    // Create next image
                    const nextImg = document.createElement('img');
                    nextImg.src = imageList[currentIndex];
                    nextImg.alt = 'Skin Preview';
                    nextImg.style.position = 'absolute';
                    nextImg.style.top = '0';
                    nextImg.style.left = '0';
                    nextImg.style.width = '100%';
                    nextImg.style.height = '100%';
                    nextImg.style.objectFit = 'cover';
                    nextImg.style.transform = 'translateX(100%)';
                    nextImg.style.transition = 'transform 0.6s ease-in-out';
                    
                    previewContainer.appendChild(nextImg);
                    
                    // Trigger slide animation
                    setTimeout(() => {
                        currentImg.style.transform = 'translateX(-100%)';
                        nextImg.style.transform = 'translateX(0)';
                    }, 10);
                    
                    // Clean up after animation
                    setTimeout(() => {
                        if (currentImg.parentNode) {
                            currentImg.remove();
                        }
                        nextImg.style.transform = 'translateX(0)';
                        currentImg = nextImg;
                    }, 650);
                    
                }, 4000);
            });
        }

        // ===== INITIALIZATION =====

        /**
         * Main initialization function
         * Runs all setup functions when DOM is fully loaded
         */
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize all systems in order
            createFallingImages();
            initPolaroidEffects();
            initNavigation();
            initContactForm();
            initEventListeners();
            initOsuPlayer();
            initSkinPreviewSliding();
        });