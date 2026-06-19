import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Indispensable pour ngModel

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styles: [`
    :host { display: block; }
    .hero-gradient { background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.5) 100%); }
    html { scroll-behavior: smooth; }
  `]
})
export class App implements OnInit {
  // --- Gestion de la Langue ---
  currentLang: 'fr' | 'en' = 'fr';

  // --- Variables de Calcul ---
  dateArrivee: string = '';
  dateDepart: string = '';
  nuits: number = 0;
  prixInitial: number = 0;
  prixFinal: number = 0;
  economie: number = 0;

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('villa_lang') as 'fr' | 'en';
      if (saved) {
        this.currentLang = saved;
        document.documentElement.lang = saved;
      }
    }
  }

  setLanguage(lang: 'fr' | 'en') {
    this.currentLang = lang;
    if (typeof window !== 'undefined') {
      localStorage.setItem('villa_lang', lang);
      document.documentElement.lang = lang;
    }
  }

  // --- Logique Commerciale ---
  calculerPrix() {
    if (!this.dateArrivee || !this.dateDepart) {
      this.prixFinal = 0;
      return;
    }

    const start = new Date(this.dateArrivee);
    const end = new Date(this.dateDepart);

    if (end > start) {
      const diffTime = Math.abs(end.getTime() - start.getTime());
      this.nuits = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Détermination du prix par nuit selon les saisons
      const mois = start.getMonth(); // 0 = Janvier
      let prixParNuit = 220; // Basse saison par défaut

      if (mois === 6 || mois === 7) {
        prixParNuit = 244; // Juillet (6) - Août (7)
      } else if (mois === 4 || mois === 5 || mois === 8) {
        prixParNuit = 260; // Mai (4), Juin (5), Septembre (8)
      }

      // Calcul avec remise de 10%
      this.prixInitial = this.nuits * prixParNuit;
      this.economie = Math.round(this.prixInitial * 0.10);
      this.prixFinal = this.prixInitial - this.economie;
    } else {
      this.nuits = 0;
      this.prixFinal = 0;
    }
  }
}
