/* ============================================
   SLOTS OF CHOICE - Main JavaScript
   "The Choice of Professionals"
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all modules
  App.init();
});

const App = {
  init: function() {
    this.mobileMenu();
    this.stickyHeader();
    this.smoothScroll();
    this.filters();
    this.animateOnScroll();
    this.dropdownMenus();
    this.updateFooterYear(); // <-- auto year
  },

  // ---------- Mobile Menu ----------
  mobileMenu: function() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function() {
      toggle.classList.toggle('active');
      nav.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });

    // Close menu when clicking a link
    const navLinks = nav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        toggle.classList.remove('active');
        nav.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        toggle.classList.remove('active');
        nav.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });
  },

  // ---------- Sticky Header ----------
  stickyHeader: function() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;
    const scrollThreshold = 100;

    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;

      // Add scrolled class
      if (currentScroll > scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    });
  },

  // ---------- Smooth Scroll ----------
  smoothScroll: function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerHeight = document.querySelector('.header')?.offsetHeight || 70;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  },

  // ---------- Filters ----------
  filters: function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const filterSelects = document.querySelectorAll('.filter-select');

    if (filterBtns.length === 0 && filterSelects.length === 0) return;

    // Button filters
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const filterGroup = this.closest('.filter-buttons');
        if (filterGroup) {
          filterGroup.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        }
        this.classList.add('active');
        App.applyFilters();
      });
    });

    // Select filters
    filterSelects.forEach(select => {
      select.addEventListener('change', function() {
        App.applyFilters();
      });
    });
  },

  applyFilters: function() {
    const casinoCards = document.querySelectorAll('.casino-card');
    const activeFilters = this.getActiveFilters();

    casinoCards.forEach(card => {
      const matchesAllFilters = this.cardMatchesFilters(card, activeFilters);
      
      if (matchesAllFilters) {
        card.style.display = '';
        card.classList.add('animate-fade-in-up');
      } else {
        card.style.display = 'none';
        card.classList.remove('animate-fade-in-up');
      }
    });

    // Show "no results" message if needed
    this.checkNoResults();
  },

  getActiveFilters: function() {
    const filters = {};

    // Get button filter values
    document.querySelectorAll('.filter-buttons').forEach(group => {
      const activeBtn = group.querySelector('.filter-btn.active');
      if (activeBtn) {
        const filterType = group.dataset.filterType;
        const filterValue = activeBtn.dataset.filter;
        if (filterType && filterValue && filterValue !== 'all') {
          filters[filterType] = filterValue;
        }
      }
    });

    // Get select filter values
    document.querySelectorAll('.filter-select').forEach(select => {
      const filterType = select.dataset.filterType;
      const filterValue = select.value;
      if (filterType && filterValue && filterValue !== 'all') {
        filters[filterType] = filterValue;
      }
    });

    return filters;
  },

  cardMatchesFilters: function(card, filters) {
    for (const [filterType, filterValue] of Object.entries(filters)) {
      const cardValue = card.dataset[filterType];
      
      // Handle multiple values (comma-separated)
      if (cardValue) {
        const cardValues = cardValue.split(',').map(v => v.trim().toLowerCase());
        if (!cardValues.includes(filterValue.toLowerCase())) {
          return false;
        }
      } else {
        return false;
      }
    }
    return true;
  },

  checkNoResults: function() {
    const container = document.querySelector('.casino-grid, .top-picks-grid');
    if (!container) return;

    const visibleCards = container.querySelectorAll('.casino-card:not([style*="display: none"])');
    let noResultsMsg = container.querySelector('.no-results');

    if (visibleCards.length === 0) {
      if (!noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.className = 'no-results';
        noResultsMsg.innerHTML = `
          <p style="text-align: center; padding: 3rem; color: var(--text-muted);">
            No casinos match your current filters. 
            <button class="btn btn-secondary btn-sm" onclick="App.resetFilters()">Reset Filters</button>
          </p>
        `;
        container.appendChild(noResultsMsg);
      }
    } else if (noResultsMsg) {
      noResultsMsg.remove();
    }
  },

  resetFilters: function() {
    // Reset button filters
    document.querySelectorAll('.filter-buttons').forEach(group => {
      group.querySelectorAll('.filter-btn').forEach((btn, index) => {
        btn.classList.toggle('active', index === 0);
      });
    });

    // Reset select filters
    document.querySelectorAll('.filter-select').forEach(select => {
      select.value = 'all';
    });

    this.applyFilters();
  },

  // ---------- Animate on Scroll ----------
  animateOnScroll: function() {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.card, .category-card, .casino-card').forEach(el => {
      el.style.opacity = '0';
      observer.observe(el);
    });
  },

  // ---------- Dropdown Menus ----------
  dropdownMenus: function() {
    const dropdowns = document.querySelectorAll('.nav-item');
    
    dropdowns.forEach(dropdown => {
      const link = dropdown.querySelector('.nav-link');
      const menu = dropdown.querySelector('.nav-dropdown');
      
      if (!menu) return;

      // For touch devices
      link?.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          menu.classList.toggle('active');
        }
      });
    });
  },

  // ---------- Footer Year ----------
  updateFooterYear: function() {
    const year = new Date().getFullYear();
    // Works on any page that has one of these:
    // <span class="js-current-year">2024</span>
    // or <span data-year="2024"></span>
    const yearTargets = document.querySelectorAll('.js-current-year, [data-year]');
    yearTargets.forEach(el => {
      el.textContent = year;
    });
  },

  // ---------- Utility Functions ----------
  utils: {
    // Debounce function
    debounce: function(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    // Format currency
    formatCurrency: function(amount, currency = 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
      }).format(amount);
    },

    // Get URL parameter
    getUrlParam: function(param) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
    }
  }
};

// Expose resetFilters globally for onclick
window.App = App;
