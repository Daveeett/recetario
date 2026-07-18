import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { TopNavComponent } from './components/top-nav/top-nav.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TopNavComponent, SidebarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private router = inject(Router);

  isAuthRoute(): boolean {
    const url = this.router.url;
    return url.startsWith('/login') || url.startsWith('/register');
  }
}