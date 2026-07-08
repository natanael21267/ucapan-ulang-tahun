document.addEventListener("DOMContentLoaded", () => {
    
    // CONFIGURATION DATA
    const CONFIG = {
        relationshipDate: "2024-05-10T00:00:00", // Ganti tanggal jadian kamu di sini (YYYY-MM-DD)
        reasons: [
            "Caramu mendengarkan ceritaku dengan penuh perhatian.",
            "Senyumanmu yang selalu berhasil meredakan hari-hari beratku.",
            "Sifat sabarmu menghadapi segala kekonyolanku.",
            "Kamu selalu mendukung mimpi dan cita-citaku.",
            "Kehadiranmu membuatku merasa aman dan dihargai.",
            "Caramu tertawa, suara terindah yang pernah kudengar.",
            "Kamu selalu tahu cara membuatku tersenyum kembali.",
            "Kejujuran dan ketulusan hati yang kamu miliki.",
            "Setiap pelukan hangat yang menenangkan jiwaku.",
            "Karena kamu adalah kamu, hadiah terbaik dalam hidupku."
            // Bisa ditambah secara bebas hingga 100 alasan
        ],
        quotes: [
            "Dalam dirimu, aku menemukan cinta dalam bentuk yang paling murni.",
            "Selamat ulang tahun untuk seseorang yang membuat duniaku berputar.",
            "Bersamamu, setiap hari adalah petualangan indah.",
            "Terima kasih telah berjalan bersamaku di bawah langit yang sama."
        ]
    };

    // DOM ELEMENTS CONTAINER
    const dom = {
        progressBar: document.getElementById("progress-bar"),
        loader: document.getElementById("loading-screen"),
        btnOpenGift: document.getElementById("btn-open-gift"),
        lockedContent: document.getElementById("locked-content"),
        mainContent: document.getElementById("main-content"),
        giftBox: document.getElementById("main-gift-box"),
        audio: document.getElementById("birthday-audio"),
        btnPlayPause: document.getElementById("btn-play-pause"),
        volumeSlider: document.getElementById("volume-slider"),
        musicPlayer: document.getElementById("music-player"),
        typingSubtitle: document.getElementById("typing-subtitle"),
        loveLetter: document.getElementById("love-letter"),
        typingLetter: document.getElementById("typing-letter"),
        sliderWrapper: document.getElementById("slider-wrapper"),
        prevSlide: document.getElementById("prev-slide"),
        nextSlide: document.getElementById("next-slide"),
        lightbox: document.getElementById("lightbox"),
        lightboxImg: document.getElementById("lightbox-img"),
        closeLightbox: document.querySelector(".close-lightbox"),
        reasonsGrid: document.getElementById("reasons-grid"),
        quoteText: document.getElementById("quote-text"),
        btnHug: document.getElementById("btn-hug"),
        starfield: document.getElementById("starfield"),
        canvasFx: document.getElementById("canvas-fx"),
        mouseTrail: document.getElementById("mouse-trail")
    };

    // 1. LOADING SCREEN MECHANISM
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                dom.loader.style.opacity = "0";
                dom.loader.style.visibility = "hidden";
                dom.mainContent.classList.remove("blur-content");
            }, 500);
        }
        dom.progressBar.style.width = `${progress}%`;
    }, 150);

    // 2. RIPPLE BUTTON EFFECT
    document.querySelectorAll(".ripple-btn").forEach(btn => {
        btn.addEventListener("click", function(e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;
            const ripple = document.createElement("span");
            ripple.classList.add("ripple-span");
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // 3. MUSIC & CONTENT UNLOCK SYSTEM
    dom.btnOpenGift.addEventListener("click", () => {
        dom.lockedContent.classList.add("show-section");
        dom.musicPlayer.classList.remove("hidden");
        
        // Play Audio securely
        dom.audio.play().then(() => {
            dom.btnPlayPause.innerHTML = '<i class="fas fa-pause"></i>';
        }).catch(err => console.log("Audio play blocked by browser config"));

        // Smooth scroll auto ke bagian Gift Box
        setTimeout(() => {
            dom.giftBox.scrollIntoView({ behavior: "smooth" });
        }, 300);
    });

    // Audio Playback Controls
    dom.btnPlayPause.addEventListener("click", () => {
        if (dom.audio.paused) {
            dom.audio.play();
            dom.btnPlayPause.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            dom.audio.pause();
            dom.btnPlayPause.innerHTML = '<i class="fas fa-play"></i>';
        }
    });

    dom.volumeSlider.addEventListener("input", (e) => {
        dom.audio.volume = e.target.value;
    });

    // 4. GIFT BOX ANIMATION & FX TRIGGER
    dom.giftBox.addEventListener("click", () => {
        if (!dom.giftBox.classList.contains("open")) {
            dom.giftBox.classList.add("open");
            
            // Trigger visual rewards
            fxSystem.spawnConfetti();
            fxSystem.spawnBalloons();
            
            // Start Typing effects
            setTimeout(() => {
                startTypingEffects();
            }, 1000);
        }
    });

    // 5. TYPING ANIMATION HANDLERS
    function startTypingEffects() {
        typeText(dom.typingSubtitle, "Aku punya pesan kecil nan tulus untukmu...", 70);
    }

    function typeText(element, text, speed, callback) {
        element.innerHTML = "";
        let i = 0;
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else if (callback) {
                callback();
            }
        }
        type();
    }

    // Love Letter Reveal Integration
    dom.loveLetter.addEventListener("click", () => {
        if (!dom.loveLetter.classList.contains("open")) {
            dom.loveLetter.classList.add("open");
            const isiSurat = `Hari ini adalah hari istimewa karena orang paling istimewa dilahirkan.\n\nTerima kasih telah membawakan kebahagiaan tanpa batas ke dalam hidupku. Melalui surat kecil ini, aku ingin kamu tahu bahwa rasa sayangku akan terus tumbuh seiring bergantinya waktu.\n\nSelamat ulang tahun, kesayanganku! ❤️`;
            setTimeout(() => {
                typeText(dom.typingLetter, isiSurat, 40);
            }, 600);
        }
    });

    // 6. GALLERY SLIDER SYSTEM
    let currentSlideIndex = 0;
    function getVisibleSlides() {
        if (window.innerWidth <= 576) return 1;
        if (window.innerWidth <= 992) return 2;
        return 3;
    }

    function updateSliderPosition() {
        const gap = 20;
        const totalSlides = dom.sliderWrapper.children.length;
        const visible = getVisibleSlides();
        if (currentSlideIndex > totalSlides - visible) currentSlideIndex = totalSlides - visible;
        if (currentSlideIndex < 0) currentSlideIndex = 0;
        
        const slideWidth = dom.sliderWrapper.clientWidth / visible - ((gap * (visible - 1)) / visible);
        const offset = currentSlideIndex * (slideWidth + gap);
        dom.sliderWrapper.scrollTo({ left: offset, behavior: 'smooth' });
    }

    dom.nextSlide.addEventListener("click", () => {
        currentSlideIndex++;
        updateSliderPosition();
    });

    dom.prevSlide.addEventListener("click", () => {
        currentSlideIndex--;
        updateSliderPosition();
    });

    window.addEventListener("resize", updateSliderPosition);

    // Lightbox Module
    document.querySelectorAll(".gallery-img").forEach(img => {
        img.addEventListener("click", () => {
            dom.lightbox.style.display = "flex";
            dom.lightboxImg.src = img.src;
        });
    });

    dom.closeLightbox.addEventListener("click", () => dom.lightbox.style.display = "none");
    dom.lightbox.addEventListener("click", (e) => {
        if(e.target === dom.lightbox) dom.lightbox.style.display = "none";
    });

    // 7. POPULATE REASONS DYNAMICALLY
    CONFIG.reasons.forEach((reason, idx) => {
        const card = document.createElement("div");
        card.className = "reason-card glass-card scroll-reveal";
        card.innerHTML = `
            <div class="reason-num">#${idx + 1}</div>
            <p>${reason}</p>
        `;
        dom.reasonsGrid.appendChild(card);
    });

    // 8. CHRONO COUNTDOWN LOGIC
    function runRelationshipTimer() {
        const targetDate = new Date(CONFIG.relationshipDate).getTime();
        
        setInterval(() => {
            const now = new Date().getTime();
            const difference = now - targetDate;

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            document.getElementById("count-days").innerText = days;
            document.getElementById("count-hours").innerText = hours;
            document.getElementById("count-minutes").innerText = minutes;
            document.getElementById("count-seconds").innerText = seconds;
        }, 1000);
    }
    runRelationshipTimer();

    // 9. DYNAMIC QUOTES COROUSEL
    let quoteIdx = 0;
    setInterval(() => {
        quoteIdx = (quoteIdx + 1) % CONFIG.quotes.length;
        dom.quoteText.style.opacity = 0;
        setTimeout(() => {
            dom.quoteText.innerText = CONFIG.quotes[quoteIdx];
            dom.quoteText.style.opacity = 1;
        }, 500);
    }, 5000);

    // 10. SCROLL REVEAL (INTERSECTION OBSERVER)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                // Trigger fireworks khusus saat ending section terlihat
                if(entry.target.id === "ending-section") {
                    fxSystem.startEndlessFireworks();
                }
            }
        });
    }, { threshold: 0.15 });

    setTimeout(() => {
        document.querySelectorAll(".scroll-reveal").forEach(el => observer.observe(el));
    }, 1000);

    // 11. HUG ME INTERACTIVE TRIGGER
    dom.btnHug.addEventListener("click", () => {
        fxSystem.burstHearts();
        fxSystem.triggerScreenSparkles();
        // Melambatkan musik secara elegan
        let currentVolume = dom.audio.volume;
        const fadeInterval = setInterval(() => {
            if(currentVolume > 0.2) {
                currentVolume -= 0.05;
                dom.audio.volume = Math.max(currentVolume, 0.2);
                dom.volumeSlider.value = dom.audio.volume;
            } else {
                clearInterval(fadeInterval);
            }
        }, 200);
    });

    // ==========================================
    // FX CANVAS ENGINE (Stars, Particles, Mouse)
    // ==========================================
    const fxSystem = {
        ctxStar: dom.starfield.getContext("2d"),
        ctxFx: dom.canvasFx.getContext("2d"),
        particles: [],
        fireworksRunning: false,

        init() {
            this.resize();
            window.addEventListener("resize", () => this.resize());
            this.generateStars();
            this.loop();
            this.initMouseTrail();
        },
        resize() {
            dom.starfield.width = window.innerWidth;
            dom.starfield.height = window.innerHeight;
            dom.canvasFx.width = window.innerWidth;
            dom.canvasFx.height = window.innerHeight;
        },
        generateStars() {
            this.stars = [];
            for (let i = 0; i < 150; i++) {
                this.stars.push({
                    x: Math.random() * dom.starfield.width,
                    y: Math.random() * dom.starfield.height,
                    size: Math.random() * 1.5,
                    blinkSpeed: Math.random() * 0.02 + 0.005,
                    alpha: Math.random()
                });
            }
        },
        initMouseTrail() {
            window.addEventListener("mousemove", (e) => {
                dom.mouseTrail.style.left = `${e.clientX}px`;
                dom.mouseTrail.style.top = `${e.clientY}px`;
                
                // Tambahkan partikel trail kecil di canvas
                if(Math.random() > 0.4) {
                    this.particles.push({
                        type: 'sparkle',
                        x: e.clientX,
                        y: e.clientY,
                        vx: (Math.random() - 0.5) * 2,
                        vy: (Math.random() - 0.5) * 2,
                        size: Math.random() * 3 + 1,
                        color: `rgba(255, 20, 147, ${Math.random()})`,
                        life: 30
                    });
                }
            });
        },
        loop() {
            // Clear FX Canvas
            this.ctxFx.clearRect(0, 0, dom.canvasFx.width, dom.canvasFx.height);
            
            // Draw & Update Stars
            this.ctxStar.clearRect(0, 0, dom.starfield.width, dom.starfield.height);
            this.ctxStar.fillStyle = "#ffffff";
            this.stars.forEach(star => {
                star.alpha += star.blinkSpeed;
                if (star.alpha > 1 || star.alpha < 0) star.blinkSpeed = -star.blinkSpeed;
                this.ctxStar.globalAlpha = Math.abs(star.alpha);
                this.ctxStar.beginPath();
                this.ctxStar.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                this.ctxStar.fill();
            });
            this.ctxStar.globalAlpha = 1.0;

            // Update Global FX Particles (Confetti, Hearts, etc.)
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life--;

                if (p.type === 'confetti') {
                    p.vy += 0.1; // Gravity
                    this.ctxFx.fillStyle = p.color;
                    this.ctxFx.fillRect(p.x, p.y, p.size, p.size);
                } else if (p.type === 'balloon') {
                    p.vy = -1.5; // Float Up
                    p.x += Math.sin(p.life / 10) * 0.5;
                    this.ctxFx.font = `${p.size}px Arial`;
                    this.ctxFx.fillText("🎈", p.x, p.y);
                } else if (p.type === 'heart') {
                    this.ctxFx.font = `${p.size}px Arial`;
                    this.ctxFx.globalAlpha = p.life / 60;
                    this.ctxFx.fillText("❤️", p.x, p.y);
                } else if (p.type === 'sparkle') {
                    this.ctxFx.fillStyle = p.color;
                    this.ctxFx.beginPath();
                    this.ctxFx.arc(p.x, p.y, p.size, 0, Math.PI*2);
                    this.ctxFx.fill();
                }

                if (p.life <= 0) this.particles.splice(i, 1);
            }
            this.ctxFx.globalAlpha = 1.0;

            requestAnimationFrame(() => this.loop());
        },
        spawnConfetti() {
            const colors = ['#ff1493', '#8a2be2', '#00ffff', '#fffe7a', '#ff69b4'];
            for(let i=0; i<100; i++) {
                this.particles.push({
                    type: 'confetti',
                    x: dom.canvasFx.width / 2,
                    y: dom.canvasFx.height / 2,
                    vx: (Math.random() - 0.5) * 8,
                    vy: (Math.random() - 0.8) * 10,
                    size: Math.random() * 8 + 4,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    life: Math.random() * 100 + 60
                });
            }
        },
        spawnBalloons() {
            for(let i=0; i<15; i++) {
                this.particles.push({
                    type: 'balloon',
                    x: Math.random() * dom.canvasFx.width,
                    y: dom.canvasFx.height + 50,
                    vx: 0,
                    vy: -2,
                    size: Math.random() * 20 + 20,
                    life: 400
                });
            }
        },
        startEndlessFireworks() {
            if (this.fireworksRunning) return;
            this.fireworksRunning = true;
            
            setInterval(() => {
                const targetX = Math.random() * dom.canvasFx.width;
                const targetY = Math.random() * (dom.canvasFx.height * 0.6);
                const colors = ['#ff007f', '#7f00ff', '#00ffff', '#ffff00'];
                const chosenColor = colors[Math.floor(Math.random() * colors.length)];

                for(let i=0; i<40; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = Math.random() * 4 + 1;
                    this.particles.push({
                        type: 'sparkle',
                        x: targetX,
                        y: targetY,
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed,
                        size: Math.random() * 3 + 1,
                        color: chosenColor,
                        life: Math.random() * 30 + 30
                    });
                }
            }, 1200);
        },
        burstHearts() {
            for(let i=0; i<30; i++) {
                this.particles.push({
                    type: 'heart',
                    x: Math.random() * dom.canvasFx.width,
                    y: dom.canvasFx.height / 2 + (Math.random() - 0.5) * 200,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 0.5) * 4,
                    size: Math.random() * 20 + 15,
                    life: 60
                });
            }
        },
        triggerScreenSparkles() {
            for(let i=0; i<100; i++) {
                this.particles.push({
                    type: 'sparkle',
                    x: Math.random() * dom.canvasFx.width,
                    y: Math.random() * dom.canvasFx.height,
                    vx: (Math.random() - 0.5) * 1,
                    vy: (Math.random() - 0.5) * 1,
                    size: Math.random() * 4 + 1,
                    color: `rgba(255, 255, 255, ${Math.random()})`,
                    life: Math.random() * 40 + 20
                });
            }
        }
    };

    fxSystem.init();
});