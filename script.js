document.addEventListener('DOMContentLoaded', () => {
    // 1. Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = 60; // Fixed header height
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 2. Reveal Animations on Scroll (Intersection Observer)
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.classList.add('animate-up');
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.1
    });

    document.querySelectorAll('.animate-up').forEach(el => {
        el.style.opacity = '0'; // Initial state
        revealObserver.observe(el);
    });

    // 3. Header background change on scroll (Optional, for better UX)
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    });
});

function playVideo(element) {
  element.innerHTML = `
    <iframe 
      src="https://www.youtube.com/embed/xUemVdPq_58?autoplay=1&rel=0"
      allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
      allowfullscreen
      playsinline>
    </iframe>
  `;
}
