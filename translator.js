class Translator {
  constructor() {
    this.sourceLanguage = document.getElementById('sourceLanguage');
    this.targetLanguage = document.getElementById('targetLanguage');
    this.inputText = document.getElementById('inputText');
    this.outputText = document.getElementById('outputText');
    this.translateButton = document.getElementById('translateButton');
    this.swapButton = document.getElementById('swapButton');
    this.themeToggle = document.getElementById('themeToggle');

    this.init();
  }

  init() {
    this.translateButton.addEventListener('click', () => this.translate());
    this.swapButton.addEventListener('click', () => this.swapLanguages());
    this.themeToggle.addEventListener('click', () => this.toggleTheme());
    
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeIcon(savedTheme);
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    this.updateThemeIcon(newTheme);
  }

  updateThemeIcon(theme) {
    const moonPath = "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z";
    const sunPath = "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42";
    
    const pathElement = this.themeToggle.querySelector('path');
    pathElement.setAttribute('d', theme === 'light' ? moonPath : sunPath);
  }

  async translate() {
    if (!this.inputText.value.trim()) {
      return;
    }

    this.translateButton.disabled = true;
    this.translateButton.textContent = 'Translating...';

    try {
      const response = await fetch('/api/ai_completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          prompt: `You are a highly skilled translator. Translate the following text from ${this.sourceLanguage.value} to ${this.targetLanguage.value}. 
          Maintain the original meaning, tone, and style while ensuring the translation sounds natural in the target language.
          Provide only the translation, no explanations.
          
          interface Response {
            translation: string;
          }
          
          {
            "translation": "¡Hola mundo!"
          }`,
          data: this.inputText.value
        }),
      });

      const data = await response.json();
      this.outputText.value = data.translation;
    } catch (error) {
      console.error('Translation error:', error);
      this.outputText.value = 'An error occurred during translation. Please try again.';
    } finally {
      this.translateButton.disabled = false;
      this.translateButton.textContent = 'Translate';
    }
  }

  swapLanguages() {
    const tempLang = this.sourceLanguage.value;
    const tempText = this.inputText.value;
    
    this.sourceLanguage.value = this.targetLanguage.value;
    this.targetLanguage.value = tempLang;
    
    this.inputText.value = this.outputText.value;
    this.outputText.value = tempText;
  }
}

// Initialize the translator
new Translator();