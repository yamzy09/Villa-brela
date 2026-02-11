import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styles: [`
    :host { display: block; }
    .hero-gradient { background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.5) 100%); }
    body { scroll-behavior: smooth; }
  `]
})
export class App implements OnInit {
  currentLang: 'fr' | 'en' = 'fr';

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('villa_lang') as 'fr' | 'en';
      if (saved) this.currentLang = saved;
    }
  }

  setLanguage(lang: 'fr' | 'en') {
    this.currentLang = lang;
    if (typeof window !== 'undefined') {
      localStorage.setItem('villa_lang', lang);
      document.documentElement.lang = lang;
    }
  }
}
