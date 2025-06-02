// Основной JavaScript файл
console.log('Django + Webpack + SASS Setup Ready!');

// Пример модуля
class App {
  constructor() {
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    console.log('App initialized');
  }
  
  setupEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('DOM loaded');
      
      // Пример обработчика событий
      const buttons = document.querySelectorAll('.btn');
      buttons.forEach(button => {
        button.addEventListener('click', this.handleButtonClick.bind(this));
      });
    });
  }
  
  handleButtonClick(event) {
    event.preventDefault();
    console.log('Button clicked:', event.target);
  }
}

// Инициализация приложения
new App();

// Hot Module Replacement для разработки
if (module.hot) {
  module.hot.accept();
}