// Slider functionality starts here
document.addEventListener('DOMContentLoaded', function() {
  const sliderContent = document.querySelector('.slider-content');
  const arrowLeft = document.querySelector('.slider-arrow-left');
  const arrowRight = document.querySelector('.slider-arrow-right');
  const progressFill = document.querySelector('.progress-fill');
  const sliderItems = document.querySelectorAll('.slider-item');

  // Calculate item dimensions for scrolling
  const getItemDimensions = () => {
    const viewportWidth = window.innerWidth;
    const item = sliderItems[0];
    if (viewportWidth <= 820) {
      // Mobile/Tablet: Vertical scrolling
      return {
        isVertical: true,
        scrollAmount: item.offsetHeight // Full item height for vertical snap
      };
    } else {
      // Desktop: Horizontal scrolling
      let width;
      if (viewportWidth <= 576) {
        width = item.offsetWidth; // Mobile: 100%
      } else if (viewportWidth <= 768) {
        width = item.offsetWidth; // Tablet: 50%
      } else {
        width = item.offsetWidth; // Desktop: 33.33%
      }
      return {
        isVertical: false,
        scrollAmount: width / 4 // Smaller scroll for smooth horizontal experience
      };
    }
  };

  let dimensions = getItemDimensions();

  // Update scroll position when arrows are clicked
  arrowLeft.addEventListener('click', () => {
    sliderContent.scrollBy({
      left: dimensions.isVertical ? 0 : -dimensions.scrollAmount,
      top: dimensions.isVertical ? -dimensions.scrollAmount : 0,
      behavior: 'smooth'
    });
  });

  arrowRight.addEventListener('click', () => {
    sliderContent.scrollBy({
      left: dimensions.isVertical ? 0 : dimensions.scrollAmount,
      top: dimensions.isVertical ? dimensions.scrollAmount : 0,
      behavior: 'smooth'
    });
  });

  // Recalculate on window resize
  window.addEventListener('resize', () => {
    dimensions = getItemDimensions();
    updateProgressBar(); // Update progress bar on resize
  });

  // Function to update the progress bar
  const updateProgressBar = () => {
    if (!progressFill) return; // Skip if no progress fill element
    let scrollPercentage;
    if (dimensions.isVertical) {
      // Vertical scrolling (mobile/tablet)
      scrollPercentage = sliderContent.scrollTop / (sliderContent.scrollHeight - sliderContent.clientHeight);
      progressFill.style.height = `${scrollPercentage * 100}%`;
      progressFill.style.width = '100%'; // Full width for vertical bar
    } else {
      // Horizontal scrolling (desktop)
      scrollPercentage = sliderContent.scrollLeft / (sliderContent.scrollWidth - sliderContent.clientWidth);
      progressFill.style.width = `${scrollPercentage * 100}%`;
      progressFill.style.height = '100%'; // Full height for horizontal bar
    }
  };

  // Add mouse wheel event listener to the slider container
  document.querySelector('.slider-container').addEventListener('wheel', function(e) {
    e.preventDefault();

    sliderContent.scrollBy({
      left: dimensions.isVertical ? 0 : (e.deltaY > 0 ? dimensions.scrollAmount : -dimensions.scrollAmount),
      top: dimensions.isVertical ? (e.deltaY > 0 ? dimensions.scrollAmount : -dimensions.scrollAmount) : 0,
      behavior: 'smooth'
    });

    // Update progress bar after scroll
    updateProgressBar();
  }, { passive: false });

  // Update progress bar on scroll
  sliderContent.addEventListener('scroll', updateProgressBar);

  // Initialize videos to play when hovered
  sliderItems.forEach(item => {
    const video = item.querySelector('video');
    if (video) {
      item.addEventListener('mouseenter', () => {
        video.play();
      });
      item.addEventListener('mouseleave', () => {
        video.pause();
      });
    }
  });

  // Initialize progress bar
  updateProgressBar();
});