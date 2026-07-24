import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-top-nav',
  imports: [FormsModule, RouterLink, NgIconComponent],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.css'
})
export class TopNavComponent {
  readonly query = signal('');
  readonly auth = inject(AuthService);
  readonly themeService = inject(ThemeService);
  readonly sidebarService = inject(SidebarService);
  private router = inject(Router);

  search() {
    const q = this.query().trim();
    if (q) {
      this.router.navigate(['/search'], { queryParams: { q } });
      this.query.set('');
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}