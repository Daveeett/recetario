import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { AuthService } from '../../services/auth.service';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, NgIconComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  readonly auth = inject(AuthService);
  readonly sidebarService = inject(SidebarService);

  readonly categories = [
    { slug: 'dulce', label: 'Dulce', icon: 'heroCake' },
    { slug: 'salada', label: 'Salada', icon: 'heroFire' },
    { slug: 'agridulce', label: 'Agridulce', icon: 'heroSparkles' },
    { slug: 'postre', label: 'Postre', icon: 'heroStar' },
    { slug: 'bebida', label: 'Bebida', icon: 'heroBeaker' },
  ];
}