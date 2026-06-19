import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styles: [`
    :host { display: block; }
    html { scroll-behavior: smooth; }
  `]
})
export class App implements OnInit {
  currentLang: 'fr' | 'en' = 'fr';

  dateArrivee: string = '';
  dateDepart: string = '';
  nuits: number = 0;
  prixInitial: number = 0;
  prixFinal: number = 0;
  economie: number = 0;

  lightboxOuverte: boolean = false;
  photoActive: number = 0;

  galerie = [
    { src: 'images/hero-brela.jpeg',         alt: 'Villa Brela Sunset — Vue Extérieure' },
    { src: 'images/piscine.png',              alt: 'Piscine à Débordement' },
    { src: 'images/salon-brela.jpg',          alt: 'Salon' },
    { src: 'images/brela-entree.jpg',         alt: 'Entrée' },
    { src: 'images/exterieur-brela-nuit.jpg', alt: 'Extérieur Nuit' },
  ];

  equipements = [
    { icon: '♾️', fr: 'Piscine à Débordement',   en: 'Infinity Pool',        descFr: 'Vue mer panoramique',          descEn: 'Panoramic sea view' },
    { icon: '❄️', fr: 'Climatisation',            en: 'Air Conditioning',     descFr: 'Toutes les pièces',            descEn: 'All rooms' },
    { icon: '📶', fr: 'Wi-Fi Haut Débit',         en: 'High-Speed Wi-Fi',     descFr: 'Fibre optique',                descEn: 'Fiber optic' },
    { icon: '🅿️', fr: 'Parking Privé',            en: 'Private Parking',      descFr: 'Accès sécurisé',               descEn: 'Secure access' },
    { icon: '🍳', fr: 'Cuisine Équipée',           en: 'Fully Equipped Kitchen', descFr: 'Four, réfrigérateur, machine à café', descEn: 'Oven, fridge, coffee machine' },
    { icon: '🛁', fr: 'Salle de Bain Privée',     en: 'Private Bathroom',     descFr: 'Suite parentale & chambre',    descEn: 'Master suite & bedroom' },
    { icon: '🌅', fr: 'Terrasse Panoramique',      en: 'Panoramic Terrace',    descFr: 'Vue sur la Méditerranée',      descEn: 'Mediterranean sea view' },
    { icon: '🏖️', fr: 'Accès Plage',              en: 'Beach Access',         descFr: 'À 5 min à pied',               descEn: '5 min walk' },
    { icon: '🌿', fr: 'Jardin Privatif',           en: 'Private Garden',       descFr: 'Espaces verts aménagés',       descEn: 'Landscaped green spaces' },
    { icon: '🔒', fr: 'Accès Autonome',            en: 'Self Check-in',        descFr: 'Boîte à clés sécurisée',       descEn: 'Secure key box' },
    { icon: '🛏️', fr: '2 Chambres',               en: '2 Bedrooms',           descFr: 'Suite + Chambre double',       descEn: 'Suite + Double bedroom' },
    { icon: '👨‍👩‍👧‍👦', fr: 'Capacité 4 Personnes',   en: 'Up to 4 Guests',      descFr: 'Idéal familles ou couples',    descEn: 'Ideal for families or couples' },
  ];

  avantagesDirect = [
    { fr: 'Meilleur prix garanti — 10% moins cher qu\'Airbnb ou Booking', en: 'Best price guaranteed — 10% cheaper than Airbnb or Booking' },
    { fr: 'Contact direct avec le propriétaire, flexibilité maximale',    en: 'Direct contact with the owner, maximum flexibility' },
    { fr: 'Annulation flexible selon votre accord',                        en: 'Flexible cancellation by mutual agreement' },
    { fr: 'Aucuns frais de service cachés',                                en: 'No hidden service fees' },
  ];

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('villa_lang') as 'fr' | 'en';
      if (saved) {
        this.currentLang = saved;
        document.documentElement.lang = saved;
      }
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (!this.lightboxOuverte) return;
    if (event.key === 'Escape') this.fermerLightbox();
    if (event.key === 'ArrowRight') this.photoSuivante();
    if (event.key === 'ArrowLeft') this.photoPrecedente();
  }

  setLanguage(lang: 'fr' | 'en') {
    this.currentLang = lang;
    if (typeof window !== 'undefined') {
      localStorage.setItem('villa_lang', lang);
      document.documentElement.lang = lang;
    }
  }

  ouvrirLightbox(index: number) {
    this.photoActive = index;
    this.lightboxOuverte = true;
    if (typeof document !== 'undefined') document.body.style.overflow = 'hidden';
  }

  fermerLightbox() {
    this.lightboxOuverte = false;
    if (typeof document !== 'undefined') document.body.style.overflow = '';
  }

  photoSuivante() {
    this.photoActive = (this.photoActive + 1) % this.galerie.length;
  }

  photoPrecedente() {
    this.photoActive = (this.photoActive - 1 + this.galerie.length) % this.galerie.length;
  }

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

      const mois = start.getMonth();
      let prixParNuit = 244; // Basse saison

      if (mois === 6 || mois === 7) {
        prixParNuit = 271; // Haute saison (Juil-Août) → 244€ après -10%
      } else if (mois === 4 || mois === 5 || mois === 8) {
        prixParNuit = 289; // Moyenne saison (Mai, Juin, Sep) → 260€ après -10%
      }

      this.prixInitial = this.nuits * prixParNuit;
      this.economie = Math.round(this.prixInitial * 0.10);
      this.prixFinal = this.prixInitial - this.economie;
    } else {
      this.nuits = 0;
      this.prixFinal = 0;
    }
  }
}
