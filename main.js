document.addEventListener('DOMContentLoaded', function() {
  // Theme Toggle Functionality
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  
  // Check for saved theme preference or use system preference
  const savedTheme = localStorage.getItem('theme') || 
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  
  // Apply the saved theme
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
  
  // Toggle theme on button click
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }
  
  // Update theme icon based on current theme
  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    themeToggle.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
  }
  
  // Tab Navigation
  const tabs = document.querySelectorAll('.mdc-tab');
  const tabIndicator = document.querySelector('.mdc-tab-indicator');
  let activeTab = document.querySelector('.mdc-tab--active');
  
  // Initialize tab indicator position
  if (activeTab && tabIndicator) {
    updateTabIndicator(activeTab);
  }
  
  // Add click event listeners to tabs
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Update active tab
      tabs.forEach(t => t.classList.remove('mdc-tab--active'));
      tab.classList.add('mdc-tab--active');
      
      // Update tab indicator
      updateTabIndicator(tab);
      
      // Scroll to section
      const targetId = tab.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 20,
            behavior: 'smooth'
          });
        }
      }
    });
  });
  
  // Update tab indicator position and width
  function updateTabIndicator(tab) {
    if (!tabIndicator) return;
    
    const tabContent = tab.querySelector('.mdc-tab__content');
    if (!tabContent) return;
    
    const tabRect = tab.getBoundingClientRect();
    const contentRect = tabContent.getBoundingClientRect();
    const scale = contentRect.width / tabRect.width;
    
    const indicatorContent = tabIndicator.querySelector('.mdc-tab-indicator__content');
    if (indicatorContent) {
      indicatorContent.style.transform = `translateX(${contentRect.left - tabRect.left}px) scaleX(${scale})`;
    }
  }
  
  // Update tab indicator on window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const activeTab = document.querySelector('.mdc-tab--active');
      if (activeTab) {
        updateTabIndicator(activeTab);
      }
    }, 250);
  });
  
  // Update active tab based on scroll position
  const sections = document.querySelectorAll('section[id]');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (pageYOffset >= sectionTop - 100) {
        current = `#${section.getAttribute('id')}`;
      }
    });
    
    tabs.forEach(tab => {
      tab.classList.remove('mdc-tab--active');
      if (tab.getAttribute('href') === current) {
        tab.classList.add('mdc-tab--active');
        updateTabIndicator(tab);
      }
    });
  });
  
  // Mobile menu toggle
  const menuButton = document.querySelector('.mdc-top-app-bar__navigation-icon');
  const tabBar = document.querySelector('.mdc-tab-bar');
  
  if (menuButton && tabBar) {
    menuButton.addEventListener('click', () => {
      tabBar.classList.toggle('mobile-visible');
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!tabBar.contains(e.target) && e.target !== menuButton) {
        tabBar.classList.remove('mobile-visible');
      }
    });
  }
});
