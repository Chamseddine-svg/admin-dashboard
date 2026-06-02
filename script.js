/**
 * =============================================
 * DASHBOARD INTERACTIVITY
 * =============================================
 * Features:
 * - Theme toggle (light/dark) with localStorage
 * - Collapsible sidebar hover (CSS only, no JS needed)
 * - Active navigation state
 * - Live project search filter
 * - Notification badge increment + toast
 * - Button ripple effects
 * - Card action toasts
 * - General toast notification system
 */

document.addEventListener('DOMContentLoaded', () => {
  // ========== THEME MANAGEMENT ==========
  const html = document.documentElement;
  const themeToggle = document.querySelector('[data-testid="theme-toggle"]');
  const themeIcon = themeToggle.querySelector('.theme-icon');

  // Load saved theme from localStorage (default to light)
  const savedTheme = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  // Toggle theme on button click
  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const newTheme = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    showToast(`Theme switched to ${newTheme} mode`, 'success');
  });

  /**
   * Updates the theme icon: sun for dark mode (to switch to light),
   * moon for light mode (to switch to dark).
   */
  function updateThemeIcon(theme) {
    themeIcon.className = 'mdi theme-icon ' +
      (theme === 'dark' ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent');
  }

  // ========== SIDEBAR NAVIGATION ACTIVE STATE ==========
  const navLinks = document.querySelectorAll('.nav-item a');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Remove active class from all items
      navLinks.forEach(l => l.parentElement.classList.remove('active'));
      // Add active to the clicked item
      this.parentElement.classList.add('active');
    });
  });

  // ========== LIVE PROJECT SEARCH FILTER ==========
  const searchInput = document.getElementById('search');
  const projectCards = document.querySelectorAll('[data-testid="project-card"]');
  const projectCountSpan = document.querySelector('[data-testid="project-count"]');

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    let visibleCount = 0;

    projectCards.forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      const description = card.querySelector('p').textContent.toLowerCase();

      // Show card if query matches title or description
      if (title.includes(query) || description.includes(query)) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Update project count display
    projectCountSpan.textContent = `${visibleCount} project${visibleCount !== 1 ? 's' : ''}`;

    // Show toast if no results found
    if (query && visibleCount === 0) {
      showToast('No matching projects found', 'error');
    }
  });

  // ========== NOTIFICATION BADGE ==========
  const notifBtn = document.querySelector('[data-testid="notification-btn"]');
  const badge = document.querySelector('[data-testid="notification-badge"]');

  notifBtn.addEventListener('click', () => {
    let count = parseInt(badge.textContent, 10);
    count++;
    badge.textContent = count;
    // Re-trigger pulse animation
    badge.style.animation = 'none';
    badge.offsetHeight; // trigger reflow
    badge.style.animation = 'pulse 0.4s ease';
    showToast(`You have ${count} notifications`, 'success');
  });

  // ========== BUTTON RIPPLE EFFECT ==========
  function createRipple(event) {
    const btn = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add('ripple-effect');

    btn.appendChild(ripple);

    // Remove ripple after animation ends
    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
  }

  // Attach ripple to all primary buttons
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', createRipple);
  });

  // ========== CARD ACTION BUTTONS (TOAST DEMO) ==========
  document.querySelectorAll('.card-actions .icon-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent card click if needed
      const action = btn.getAttribute('aria-label') || 'Action';
      showToast(`${action} clicked`, 'success');
    });
  });

  // ========== TOAST NOTIFICATION SYSTEM ==========
  /**
   * Displays a temporary toast message.
   * @param {string} message - The message text
   * @param {'success'|'error'} type - Type of toast (affects color and icon)
   */
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    // Choose icon based on type
    const iconClass = type === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle';
    toast.innerHTML = `<span class="mdi ${iconClass}"></span> ${message}`;

    container.appendChild(toast);

    // Remove after 3 seconds (CSS animation handles fade out)
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
});