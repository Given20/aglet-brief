/**
 * Main JavaScript File
 * Handles page transitions, loader, and general site functionality
 */
document.addEventListener('DOMContentLoaded', function() {
    // querySelector finds the first element that matches the CSS selector
    const pageLoader = document.querySelector('.page-loader'); 
    const body = document.body; 
    
    // This event listener waits for ALL resources (images, videos, etc.) to finish loading
    window.addEventListener('load', () => {
        // setTimeout adds a small delay (500ms = 0.5 seconds) before hiding the loader
        // This creates a smoother transition instead of hiding it immediately
        setTimeout(() => {
            // We check if pageLoader exists first to avoid errors
            if (pageLoader) {
                pageLoader.classList.add('hidden'); // Adds the 'hidden' class to make the loader disappear
            }
            body.classList.remove('loading'); // Removes the 'loading' class from the body
            body.classList.add('loaded'); // Adds the 'loaded' class to the body, likely for CSS transitions
        }, 500);
    });
    
    setupPageTransitions();
    
    /**
     * This function sets up smooth transitions between pages
     */
    function setupPageTransitions() {
        // Select all links inside navigation elements
        const navLinks = document.querySelectorAll('nav a');
        
        // Loop through each link and add a click event handler
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Check if the link is to a page on the same website (internal link)
                // hostname is the domain name part of the URL
                if (this.hostname === window.location.hostname) {
                    e.preventDefault(); // Stop the default link behavior (immediate navigation)
                    const href = this.getAttribute('href'); // Get the URL we want to navigate to
                    
                    // If we're already on this page (link has 'active' class), just navigate normally
                    if (this.classList.contains('active')) {
                        window.location.href = href;
                        return; 
                    }
                    
                    // If the mobile menu is open (has 'active' class), close it before navigating
                    const mobileNav = document.querySelector('nav.active');
                    if (mobileNav) {
                        mobileNav.classList.remove('active'); // Hide the mobile menu
                        document.querySelector('.hamburger').classList.remove('active'); // Reset hamburger icon
                        body.style.overflow = ''; // Restore scrolling (empty string resets to default value)
                    }
                    
                    // Show the loader before navigating to the new page
                    if (pageLoader) {
                        pageLoader.classList.remove('hidden'); // Make loader visible
                        body.classList.add('loading'); // Add loading state to body
                        body.classList.remove('loaded'); // Remove loaded state
                    }
                    
                    // Wait a bit before actually changing pages to let animations complete
                    setTimeout(() => {
                        window.location.href = href; // Actually navigate to the new page
                    }, 800); // Wait 800ms (0.8 seconds) before navigating
                }
            });
        });
    }
    
    /**
     * This function prepares videos to play more smoothly when users hover over them
     * It preloads video metadata and sets up hover events
     */
    function preloadVideos() {
        // Find all video elements on the page
        const videos = document.querySelectorAll('video');
        
        // Loop through each video
        videos.forEach(video => {
            // This is more efficient than preloading the entire video
            video.preload = 'metadata';
            
            // Check if this video should autoplay on hover (has the data-autoplay attribute)
            if (video.hasAttribute('data-autoplay')) {
                // Find the parent container (slider-item) that wraps the video
                const container = video.closest('.slider-item');
                
                if (container) {
                    // When mouse enters the container, play the video
                    container.addEventListener('mouseenter', () => {
                        video.play();
                    });
                    
                    // When mouse leaves, pause the video and reset it to the beginning
                    container.addEventListener('mouseleave', () => {
                        video.pause();
                        video.currentTime = 0; // Reset video to start
                    });
                }
            }
        });
    }
    
    /*
     * This function sets up animation triggers for elements as they scroll into view
     */
    function initAnimatedElements() {
        // Find all elements with the 'animate-on-scroll' class
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        // If there are no animated elements, exit the function early
        if (animatedElements.length === 0) return;
        
        // Configure the Intersection Observer
        const observerOptions = {
            root: null, // null means we observe intersections with the viewport
            rootMargin: '0px', // no margin around the root
            threshold: 0.2 // trigger when 20% of the element is visible
        };
        
        // Create a new Intersection Observer
        const observer = new IntersectionObserver((entries) => {
            // Loop through each observed element that has triggered an intersection
            entries.forEach(entry => {
                // If the element is now intersecting (visible)
                if (entry.isIntersecting) {
                    // Add the 'animate' class which triggers CSS animations
                    entry.target.classList.add('animate');
                    // Stop observing this element (animation only needs to trigger once)
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Start observing each animated element
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    /**
     * This function handles the mobile navigation menu (hamburger menu)
     * It toggles the menu open/closed
     */
    function setupMobileNav() {
        // Select the hamburger button and navigation menu
        const hamburger = document.querySelector('.hamburger');
        const nav = document.querySelector('header nav');
        
        // Only proceed if both elements exist
        if (hamburger && nav) {
            // When hamburger is clicked, toggle both the hamburger and nav menu
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active'); // Toggle hamburger icon state
                nav.classList.toggle('active'); // Toggle menu visibility
                
                // Prevent body scrolling when menu is open by setting overflow property
                // If nav is active, prevent scrolling with 'hidden', otherwise restore normal scrolling
                body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
            });
            
            // Close menu when clicking outside of it or the hamburger button
            document.addEventListener('click', (e) => {
                // Check if menu is open AND click was outside both nav and hamburger
                if (nav.classList.contains('active') && 
                    !nav.contains(e.target) && 
                    !hamburger.contains(e.target)) {
                    nav.classList.remove('active'); // Close the menu
                    hamburger.classList.remove('active'); // Reset hamburger icon
                    body.style.overflow = ''; // Restore scrolling
                }
            });
            
            // Handle window resize events (like rotating phone or resizing browser)
            window.addEventListener('resize', () => {
                // If window is wider than mobile breakpoint (768px) and menu is open, close it
                if (window.innerWidth > 768 && nav.classList.contains('active')) {
                    nav.classList.remove('active'); // Close the menu
                    hamburger.classList.remove('active'); // Reset hamburger icon
                    body.style.overflow = ''; // Restore scrolling
                }
            });
        }
    }
    
    /**
     * This function sets up lazy loading for images
     * Images won't load until they're about to become visible on screen
     */
    function setupLazyLoading() {
        // Check if browser supports
        if ('IntersectionObserver' in window) {
            // Create an observer specifically for images
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    // When an image enters the viewport
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.getAttribute('data-src'); // Get the real image URL
                        
                        // If there's a data-src attribute, load the image
                        if (src) {
                            img.src = src; // Set the actual image source
                            img.removeAttribute('data-src'); // Remove the data attribute
                            img.classList.add('loaded'); // Add loaded class for styling/transitions
                        }
                        
                        // Stop observing this image after loading it
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            // Find all images with data-src attribute (these are our lazy images)
            const lazyImages = document.querySelectorAll('img[data-src]');
            
            // Start observing each lazy image
            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers that don't support Intersection Observer
            // Just load all images immediately
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => {
                img.src = img.getAttribute('data-src');
                img.classList.add('loaded');
            });
        }
    }
    
    // Initialize all components by calling their functions
    preloadVideos();
    initAnimatedElements();
    setupMobileNav();
    setupLazyLoading();
    
    // Set up smooth scrolling for anchor links (links to sections on the same page)
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault(); 
            
            const targetId = this.getAttribute('href'); // Get the section ID (like #about)
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // If mobile menu is open, close it before scrolling
                const mobileNav = document.querySelector('nav.active');
                if (mobileNav) {
                    mobileNav.classList.remove('active');
                    document.querySelector('.hamburger').classList.remove('active');
                    body.style.overflow = '';
                }
                
                // Smoothly scroll to the section
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth' // This creates the smooth animation
                });
            }
        });
    });
});