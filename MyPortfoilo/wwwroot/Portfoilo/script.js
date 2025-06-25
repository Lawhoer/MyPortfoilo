// Handwriting Animation for Hello
function writeHandwritingText(element, text, startDelay) {
    element.innerHTML = ''; // Boşalt
    
    setTimeout(() => {
        for (let i = 0; i < text.length; i++) {
            const letter = document.createElement('span');
            letter.textContent = text[i];
            letter.className = 'letter';
            letter.style.animationDelay = `${i * 0.15}s`;
            element.appendChild(letter);
        }
    }, startDelay * 1000);
}

// Dynamic Text Animation
function scrambleText(element, text, callback) {
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let currentIndex = 0;
    
    element.textContent = ''; // Başlangıçta boş
    
    function addNextLetter() {
        if (currentIndex >= text.length) {
            if (callback) callback(); // Animasyon bitince callback çağır
            return;
        }
        
        const targetChar = text[currentIndex];
        let scrambleCount = 0;
        const maxScrambles = 5;
        
        const scrambleInterval = setInterval(() => {
            if (scrambleCount < maxScrambles) {
                const currentText = text.slice(0, currentIndex);
                const scrambleChar = targetChar === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)];
                element.textContent = currentText + scrambleChar;
                scrambleCount++;
            } else {
                element.textContent = text.slice(0, currentIndex + 1);
                clearInterval(scrambleInterval);
                currentIndex++;
                
                setTimeout(() => {
                    addNextLetter();
                }, 8);
            }
        }, 15);
    }
    
    addNextLetter();
}

function deleteText(element, callback) {
    const currentText = element.textContent;
    let currentIndex = currentText.length;
    
    function deleteLetter() {
        if (currentIndex <= 0) {
            if (callback) callback();
            return;
        }
        
        element.textContent = currentText.slice(0, currentIndex - 1);
        currentIndex--;
        
        setTimeout(() => {
            deleteLetter();
        }, 30);
    }
    
    deleteLetter();
}

// Sayfa yüklendiğinde animasyon başlat
window.addEventListener('load', function() {
    const dynamicElement = document.querySelector('.dynamic-text');
    const nameMain = document.querySelector('.name-main');
    const helloText = document.querySelector('.hello-text');
    
    // Ripple efektlerini aktif et
    const rippleContainer = document.querySelector('.ripple-container');
    const centerDrop = document.querySelector('.center-drop');
    
    // 1. Ripple ve Hello aynı anda başlat
    rippleContainer.classList.add('active');
    centerDrop.classList.add('active');
    
    // Hello yazısını el yazısı animasyonuyla yaz
    writeHandwritingText(helloText, "Hello", 0.6);
    
    // 2. 1.5s sonra hello küçülmeye başlasın
    setTimeout(() => {
        helloText.classList.remove('initial');
        helloText.classList.add('final');
        
        // 3. Hello küçüldükten sonra I am kısmını fade-in ile göster
        setTimeout(() => {
            nameMain.classList.add('showing');
            
            // Kısa bir süre sonra fade-in başlat
            setTimeout(() => {
                nameMain.classList.add('visible');
            }, 50);
        }, 1000);
        
        // 4. I am göründükten 0.5s sonra typing animasyonu başlasın
        setTimeout(() => {
            // Typing başladığında sola kaydır
            nameMain.classList.add('typing');
            
            // "Eren Akıncı" yazıyor
            scrambleText(dynamicElement, "Eren Akıncı", function() {
                // Yazma bitince ortala
                nameMain.classList.remove('typing');
                nameMain.classList.add('centered');
                
                setTimeout(() => {
                    // Silme başladığında tekrar sola kaydır
                    nameMain.classList.remove('centered');
                    nameMain.classList.add('typing');
                    
                    // Sonra siliyor
                    deleteText(dynamicElement, function() {
                        setTimeout(() => {
                            // "A Developer" yazıyor
                            scrambleText(dynamicElement, "A Developer", function() {
                                // Yazma bitince ortala
                                nameMain.classList.remove('typing');
                                nameMain.classList.add('centered');
                            });
                        }, 100);
                    });
                }, 1500); // "Eren Akıncı" 1.5 saniye kalıyor
            });
        }, 500);
    }, 1500);
});

// Smooth scroll ve active indicator kontrolü
const rightSection = document.querySelector('.right-section');
const indicators = document.querySelectorAll('.indicator');

// Scroll event listener
rightSection.addEventListener('scroll', function() {
    // Eğer proje detayı açıksa ve scroll yapılıyorsa kapat
    if (isExpanded) {
        hideProjectOverlay();
        return;
    }
    
    const sections = document.querySelectorAll('.profile-main-section, .about-main-section, .projects-main-section');
    const scrollTop = rightSection.scrollTop;
    const sectionHeight = rightSection.clientHeight;
    
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollTop >= sectionTop - sectionHeight/2 && scrollTop < sectionBottom - sectionHeight/2) {
            indicators.forEach(ind => ind.classList.remove('active'));
            indicators[index]?.classList.add('active');
        }
    });
});

// Indicator click navigation
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', function(e) {
        e.preventDefault();
        const sections = document.querySelectorAll('.profile-main-section, .about-main-section, .projects-main-section');
        if (sections[index]) {
            rightSection.scrollTo({
                top: sections[index].offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Carousel functionality
const cards = document.querySelectorAll('.carousel-card');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const currentSlideSpan = document.querySelector('.current-slide');
const totalSlidesSpan = document.querySelector('.total-slides');
const carouselBottom = document.querySelector('.carousel-bottom');
const projectOverlay = document.querySelector('.project-overlay');
const overlayTitle = document.querySelector('.overlay-content h2');
const overlayText = document.querySelector('.overlay-content p');
const closeBtn = document.querySelector('.close-btn');

let currentIndex = 0;
let isExpanded = false;
const totalSlides = cards.length;

// Project data
const projects = [
    {
        title: "Tarımda Planlı Üretim (TÜBİTAK 2209-A)",
        technologies: "Kotlin, Android Studio, Mobil Geliştirme, Veri Analizi, MapboxAPI, Firebase",
        year: "2025",
        features: [
            "Türkiye'de tarım sektöründe plansız üretimin önüne geçmek için geliştirilen, sürdürülebilir ve dengeli üretim hedefleyen mobil uygulama.",
            "Gerçek zamanlı ekim verilerinin harita tabanlı gösterimi ile, çiftçilerin ülkenin tarımsal ihtiyaçlarını karşılayacak şekilde üretim kararı almasına yardımcı olan mobil uygulama.",
            "TUBITAK 2209-A Universite Oğrencileri Araştırma Projeleri Destekleme Programı kapsamında desteklenen bir projedir."
        ],
        githubLink: "https://github.com/Lawhoer/Tarim-Projesi",
        color: "pink"
    },
    {
        title: "Türkçe Yardım Çağrısı Tespit Modeli",
        technologies: "Python, PyTorch, BERT, Transformers, Flask, NLP",
        year: "2025",
        features: [
            "Afet durumlarında sosyal medya üzerinden yapılan acil yardım çağrılarını otomatik olarak tespit etmek amacıyla geliştirilen Türkçe NLP projesi.",
            "Piyasada mevcut olan veri setlerinin yetersizliği nedeniyle, sosyal medya (Twitter-X) verileri toplanarak manuel olarak etiketlenip genişletilmiş, böylece özel olarak hazırlanmış bir Türkçe yardım çağrısı veri seti oluşturulmuştur.",
            "Türkçe sosyal medya verileri üzerinde, dbmdz/bert-base-turkish-cased modeli transfer öğrenme yöntemiyle yeniden eğitilerek, yardım çağrılarını tespit edebilen ikili sınıflandırma modeli geliştirildi.",
            "Flask web framework'ü ile real-time tahmin yapan responsive web arayüzü ve RESTful API geliştirildi."
        ],
        githubLink: "https://github.com/Lawhoer/Identifying-Help-Seeking-Tweets-Using-BERT",
        color: "teal"
    },
    {
        title: "Short-Movie Website",
        technologies: "HTML, CSS, JS, Bootstrap, ASP.NET MVC, Entity, Repository Design Pattern, MS SQL",
        year: "2024",
        features: [
            "Kısa film tutkunları için responsive tasarım ve katmanlı mimari kullanılarak geliştirilen interaktif bir dijital platform.",
            "Projenin yönetimi için kapsamı genişletilebilir bir admin paneli entegre edildi.",
            "Bu projenin GitHub adresine, proje başlığına tıklayarak ulaşabilirsiniz."
        ],
        githubLink: "https://github.com/Lawhoer/ShortMovie",
        color: "blue"
    },
    {
        title: "Translation Application",
        technologies: "Java, JavaFX, OCR, Google Translate API, NativeKeyListener",
        year: "2023",
        features: [
            "OCR teknolojisi ile ekrandaki metinleri tespit edip 150+ dilde anında çeviri yapabilen bir masaüstü uygulaması.",
            "Google Translate API entegrasyonu ile doğru ve hızlı çeviri imkanı sunmaktadır.",
            "Bu projenin GitHub adresine, proje başlığına tıklayarak ulaşabilirsiniz."
        ],
        githubLink: "https://github.com/Lawhoer/TranslationApp",
        color: "green"
    },
    {
        title: "Imdb-Inator Chrome Uzantısı",
        technologies: "HTML, CSS, JS, Node.js, Express, Puppeteer, Axios",
        year: "2023",
        features: [
            "IMDB'den istediğiniz filmlerin bilgilerini çekerek kullanıcıya sade ve kullanışlı bir arayüz sunan Chrome uzantısı.",
            "Node.js ile sunucu entegrasyonu sağlanıp dinamik veri alışverişi sağlandı.",
            "Bu projenin GitHub adresine, proje başlığına tıklayarak ulaşabilirsiniz."
        ],
        githubLink: "https://github.com/Lawhoer/Imdb-Inator-Extension",
        color: "orange"
    }
];

totalSlidesSpan.textContent = totalSlides;

function updateCarousel() {
    if (isExpanded) return;
    
    cards.forEach((card, index) => {
        card.classList.remove('active', 'prev', 'next', 'hidden');
        
        if (index === currentIndex) {
            card.classList.add('active');
        } else if (index === (currentIndex - 1 + totalSlides) % totalSlides) {
            card.classList.add('prev');
        } else if (index === (currentIndex + 1) % totalSlides) {
            card.classList.add('next');
        } else {
            card.classList.add('hidden');
        }
    });
    
    currentSlideSpan.textContent = currentIndex + 1;
}

function nextSlide() {
    if (isExpanded) return;
    currentIndex = (currentIndex + 1) % totalSlides;
    updateCarousel();
}

function prevSlide() {
    if (isExpanded) return;
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

function showProjectOverlay() {
    if (!isExpanded) {
        isExpanded = true;
        const project = projects[currentIndex];
        
        // Populate overlay content
        document.querySelector('.overlay-title').textContent = project.title;
        document.querySelector('.project-technologies-inline').textContent = project.technologies;
        document.querySelector('.project-year').textContent = project.year;
        
        // Populate features list
        const featuresList = document.querySelector('.project-features-list');
        featuresList.innerHTML = '';
        project.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresList.appendChild(li);
        });
        
        // Update GitHub link
        document.querySelector('.github-link').href = project.githubLink;
        
        // Show content based on current project index
        // Önce tüm slideshow'ları durdur
        stopSlideshow();
        
        switch (currentIndex) {
            case 0:
                // Tarım projesi - slideshow göster
                document.querySelector('.video-container').style.display = 'none';
                document.querySelector('.project-image-slideshow').style.display = 'block';
                document.querySelector('.bert-image-container').style.display = 'none';
                startSlideshow();
                break;
                
            case 1:
                // BERT projesi - resim göster
                document.querySelector('.video-container').style.display = 'none';
                document.querySelector('.project-image-slideshow').style.display = 'none';
                document.querySelector('.bert-image-container').style.display = 'block';
                break;
                
            case 2:
                // Short movie projesi - video göster
                document.querySelector('.video-container').style.display = 'block';
                document.querySelector('.project-image-slideshow').style.display = 'none';
                document.querySelector('.bert-image-container').style.display = 'none';
                
                const videoSources2 = document.querySelectorAll('.video-container video source');
                videoSources2.forEach(source => {
                    source.src = 'res/vid/short_movie.mp4';
                });
                
                const videos2 = document.querySelectorAll('.video-container video');
                videos2.forEach(video => {
                    video.load();
                    video.play();
                });
                
                // Video senkronizasyonu
                const mainVideo2 = document.querySelector('.video-container .project-video');
                const backgroundVideo2 = document.querySelector('.video-container .video-background');
                if (mainVideo2 && backgroundVideo2) {
                    mainVideo2.addEventListener('timeupdate', () => {
                        if (Math.abs(backgroundVideo2.currentTime - mainVideo2.currentTime) > 0.5) {
                            backgroundVideo2.currentTime = mainVideo2.currentTime;
                        }
                    });
                    backgroundVideo2.currentTime = mainVideo2.currentTime;
                }
                break;
                
            case 3:
                // Çeviri uygulaması - video göster
                document.querySelector('.video-container').style.display = 'block';
                document.querySelector('.project-image-slideshow').style.display = 'none';
                document.querySelector('.bert-image-container').style.display = 'none';
                
                const videoSources3 = document.querySelectorAll('.video-container video source');
                videoSources3.forEach(source => {
                    source.src = 'res/vid/ceviri.mp4';
                });
                
                const videos3 = document.querySelectorAll('.video-container video');
                videos3.forEach(video => {
                    video.load();
                    video.play();
                });
                
                // Video senkronizasyonu
                const mainVideo3 = document.querySelector('.video-container .project-video');
                const backgroundVideo3 = document.querySelector('.video-container .video-background');
                if (mainVideo3 && backgroundVideo3) {
                    mainVideo3.addEventListener('timeupdate', () => {
                        if (Math.abs(backgroundVideo3.currentTime - mainVideo3.currentTime) > 0.5) {
                            backgroundVideo3.currentTime = mainVideo3.currentTime;
                        }
                    });
                    backgroundVideo3.currentTime = mainVideo3.currentTime;
                }
                break;
                
            default:
                // Extension projesi (index 4) ve diğer durumlar - video göster
                document.querySelector('.video-container').style.display = 'block';
                document.querySelector('.project-image-slideshow').style.display = 'none';
                document.querySelector('.bert-image-container').style.display = 'none';
                
                const videoSourcesDefault = document.querySelectorAll('.video-container video source');
                videoSourcesDefault.forEach(source => {
                    source.src = 'res/vid/extention.mp4';
                });
                
                const videosDefault = document.querySelectorAll('.video-container video');
                videosDefault.forEach(video => {
                    video.load();
                    video.play();
                });
                
                // Video senkronizasyonu
                const mainVideoDefault = document.querySelector('.video-container .project-video');
                const backgroundVideoDefault = document.querySelector('.video-container .video-background');
                if (mainVideoDefault && backgroundVideoDefault) {
                    mainVideoDefault.addEventListener('timeupdate', () => {
                        if (Math.abs(backgroundVideoDefault.currentTime - mainVideoDefault.currentTime) > 0.5) {
                            backgroundVideoDefault.currentTime = mainVideoDefault.currentTime;
                        }
                    });
                    backgroundVideoDefault.currentTime = mainVideoDefault.currentTime;
                }
                break;
        }
        
        projectOverlay.classList.remove('pink', 'teal', 'blue', 'green', 'orange');
        projectOverlay.classList.add(project.color);
        projectOverlay.classList.add('show');
        carouselBottom.classList.add('hidden');
    }
}

// Slideshow functionality
let slideshowInterval;
function startSlideshow() {
    const images = document.querySelectorAll('.slideshow-image');
    const backgroundImg = document.querySelector('.slideshow-background');
    
    // Clear any existing interval
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
    }
    
    // Reset to first image
    images.forEach((img, index) => {
        img.classList.remove('active');
        if (index === 0) {
            img.classList.add('active');
        }
    });
    
    // Set background to first image
    if (backgroundImg && images.length > 0) {
        backgroundImg.src = images[0].src;
    }
    
    let currentSlide = 0;
    
    slideshowInterval = setInterval(() => {
        // Remove active class from current image
        images[currentSlide].classList.remove('active');
        
        // Move to next image
        currentSlide = (currentSlide + 1) % images.length;
        
        // Add active class to new image
        images[currentSlide].classList.add('active');
        
        // Update background image
        if (backgroundImg) {
            backgroundImg.src = images[currentSlide].src;
        }
    }, 2500); // Change image every 2.5 seconds
}

function stopSlideshow() {
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
    }
}

function hideProjectOverlay() {
    if (isExpanded) {
        isExpanded = false;
        
        // Stop slideshow
        stopSlideshow();
        
        projectOverlay.classList.remove('show');
        carouselBottom.classList.remove('hidden');
    }
}

// Dice Roll Function
function diceRoll() {
    if (isExpanded) return;
    
    const diceBtn = document.querySelector('.dice-btn');
    diceBtn.classList.add('spinning');
    
    // Disable buttons during animation
    nextBtn.disabled = true;
    prevBtn.disabled = true;
    diceBtn.disabled = true;
    
    // Generate random target before starting
    const randomTarget = Math.floor(Math.random() * totalSlides);
    
    let rollCount = 0;
    const maxRolls = 6; // Number of rapid transitions
    const rollSpeed = 180; // Speed between rolls
    
    const rollInterval = setInterval(() => {
        nextSlide();
        rollCount++;
        
        if (rollCount >= maxRolls) {
            clearInterval(rollInterval);
            
            // Direct final selection without extra slide
            currentIndex = randomTarget;
            updateCarousel();
            
            // Re-enable buttons after a short delay
            setTimeout(() => {
                nextBtn.disabled = false;
                prevBtn.disabled = false;
                diceBtn.disabled = false;
                diceBtn.classList.remove('spinning');
            }, 200);
        }
    }, rollSpeed);
}

// Event listeners
nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Dice button listener
const diceBtn = document.querySelector('.dice-btn');
diceBtn.addEventListener('click', diceRoll);

// Only active card clickable
cards.forEach((card, index) => {
    card.addEventListener('click', (e) => {
        if (card.classList.contains('active') && !isExpanded) {
            showProjectOverlay();
        }
    });
});

// Close button functionality
closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    hideProjectOverlay();
});

// ESC key to close
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isExpanded) {
        hideProjectOverlay();
    }
});

// Initialize carousel
updateCarousel();

// Scroll Arrow functionality
const scrollArrow = document.querySelector('.scroll-arrow');
if (scrollArrow) {
    scrollArrow.addEventListener('click', () => {
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
            rightSection.scrollTo({
                top: aboutSection.offsetTop,
                behavior: 'smooth'
            });
        }
    });
} 