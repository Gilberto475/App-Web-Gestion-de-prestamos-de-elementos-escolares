
const CONFIG = {
  API_BASE_URL: 'https://api.colreser.com',
  ANIMATION_DURATION: 300,
  NOTIFICATION_DURATION: 5000
};


class ColReserApp {
  constructor() {
    this.currentUser = null;
    this.isLoading = false;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeAnimations();
    this.loadUserPreferences();
    this.setupNotifications();
  }

  setupEventListeners() {
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }


    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
      togglePassword.addEventListener('click', () => this.togglePasswordVisibility());
    }


    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(btn => {
      btn.addEventListener('click', (e) => this.handleSocialLogin(e));
    });

    
    const rememberMe = document.getElementById('rememberMe');
    if (rememberMe) {
      rememberMe.addEventListener('change', () => this.handleRememberMe());
    }

    
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach(card => {
      card.addEventListener('click', (e) => this.handleActionCardClick(e));
    });

    
    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
      userProfile.addEventListener('click', () => this.toggleUserDropdown());
    }

   
    this.setupFormValidation();
  }

  setupFormValidation() {
    const inputs = document.querySelectorAll('input[required]');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('placeholder') || field.name;
    
    if (!value) {
      this.showFieldError(field, `${fieldName} es requerido`);
      return false;
    }

    if (field.type === 'email' && !this.isValidEmail(value)) {
      this.showFieldError(field, 'Email inválido');
      return false;
    }

    if (field.type === 'password' && value.length < 6) {
      this.showFieldError(field, 'La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    this.clearFieldError(field);
    return true;
  }

  showFieldError(field, message) {
    this.clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
      color: #e74c3c;
      font-size: 0.8rem;
      margin-top: 5px;
      animation: slideIn 0.3s ease;
    `;
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = '#e74c3c';
  }

  clearFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
      errorDiv.remove();
    }
    field.style.borderColor = '#e1e5e9';
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username')?.value;
    const password = document.getElementById('password')?.value;
    
    if (!username || !password) {
      this.showNotification('Por favor completa todos los campos', 'error');
      return;
    }

    this.showLoading(true);
    
    try {
    
      await this.simulateLogin(username, password);
      
      this.showNotification('¡Inicio de sesión exitoso!', 'success');
      
     
      setTimeout(() => {
        window.location.href = 'estudiante.html';
      }, 1500);
      
    } catch (error) {
      this.showNotification('Error en el inicio de sesión', 'error');
    } finally {
      this.showLoading(false);
    }
  }

  async simulateLogin(username, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        
        if (username && password) {
          this.currentUser = {
            id: 1,
            username: username,
            name: 'Estudiante Ejemplo',
            email: 'estudiante@universidad.edu',
            role: 'student'
          };
          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
          resolve();
        } else {
          reject(new Error('Credenciales inválidas'));
        }
      }, 2000);
    });
  }

  togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.getElementById('togglePassword');
    const icon = toggleBtn.querySelector('i');
    
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      icon.className = 'fas fa-eye-slash';
    } else {
      passwordInput.type = 'password';
      icon.className = 'fas fa-eye';
    }
  }

  handleSocialLogin(e) {
    e.preventDefault();
    const provider = e.currentTarget.classList.contains('google') ? 'Google' : 'Microsoft';
    this.showNotification(`Iniciando sesión con ${provider}...`, 'info');
  }

  handleRememberMe() {
    const rememberMe = document.getElementById('rememberMe');
    if (rememberMe) {
      localStorage.setItem('rememberMe', rememberMe.checked);
    }
  }

  toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
      navMenu.classList.toggle('show');
    }
  }

  handleActionCardClick(e) {
    const card = e.currentTarget;
    const action = card.dataset.action;
    
    if (action) {
      this.showNotification(`Navegando a ${action}...`, 'info');
      setTimeout(() => {
        window.location.href = `${action}.html`;
      }, 500);
    }
  }

  toggleUserDropdown() {
    const dropdown = document.querySelector('.user-dropdown');
    if (dropdown) {
      dropdown.classList.toggle('show');
    }
  }

  initializeAnimations() {

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    
    const animatableElements = document.querySelectorAll('.stat-card, .action-card, .login-card');
    animatableElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  showLoading(show) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
      if (show) {
        loadingOverlay.classList.add('show');
      } else {
        loadingOverlay.classList.remove('show');
      }
    }
  }

  showNotification(message, type = 'info') {
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas ${this.getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button class="notification-close">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;

   
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${this.getNotificationColor(type)};
      color: white;
      padding: 15px 20px;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
      z-index: 10000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 300px;
    `;


    document.body.appendChild(notification);

    
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => this.closeNotification(notification));

    setTimeout(() => {
      this.closeNotification(notification);
    }, CONFIG.NOTIFICATION_DURATION);
  }

  closeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  getNotificationIcon(type) {
    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
  }

  getNotificationColor(type) {
    const colors = {
      success: '#27ae60',
      error: '#e74c3c',
      warning: '#f39c12',
      info: '#3498db'
    };
    return colors[type] || colors.info;
  }

  loadUserPreferences() {
    const rememberMe = localStorage.getItem('rememberMe');
    if (rememberMe === 'true') {
      const rememberMeCheckbox = document.getElementById('rememberMe');
      if (rememberMeCheckbox) {
        rememberMeCheckbox.checked = true;
      }
    }

    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  setupNotifications() {
    
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }

  
  initializeDashboard() {
    this.loadDashboardData();
    this.setupDashboardCharts();
    this.setupRealTimeUpdates();
  }

  async loadDashboardData() {
    try {
     
      const stats = await this.fetchDashboardStats();
      this.updateDashboardStats(stats);
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    }
  }

  async fetchDashboardStats() {
    
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          totalPrestamos: 15,
          prestamosActivos: 3,
          proximosVencimientos: 2,
          elementosDisponibles: 45
        });
      }, 1000);
    });
  }

  updateDashboardStats(stats) {
    const statElements = document.querySelectorAll('.stat-number');
    if (statElements.length >= 4) {
      statElements[0].textContent = stats.totalPrestamos;
      statElements[1].textContent = stats.prestamosActivos;
      statElements[2].textContent = stats.proximosVencimientos;
      statElements[3].textContent = stats.elementosDisponibles;
    }
  }

  setupDashboardCharts() {

    console.log('Configurando gráficos del dashboard...');
  }

  setupRealTimeUpdates() {
   
    setInterval(() => {
      this.updateRealTimeData();
    }, 30000); 
  }

  updateRealTimeData() {
    
    console.log('Actualizando datos en tiempo real...');
  }
}


class Utils {
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static formatDate(date) {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  static generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.colReserApp = new ColReserApp();
  

  if (window.location.pathname.includes('estudiante.html')) {
    window.colReserApp.initializeDashboard();
  }
});



window.Utils = Utils;
