import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  readonly isDark = signal<boolean>(false);

  constructor() {
    // Load preference from localStorage
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.isDark.set(savedTheme === 'dark' || (!savedTheme && prefersDark));

    // Effect to apply theme attribute to root HTML element
    effect(() => {
      const dark = this.isDark();
      if (dark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  toggleTheme() {
    this.isDark.update(dark => !dark);
  }
}
