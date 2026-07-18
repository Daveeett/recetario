import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly email = signal('');
  readonly password = signal('');
  readonly loading = signal(false);
  readonly error = signal('');

  submit(): void {
    if (!this.email() || !this.password()) {
      this.error.set('Completa todos los campos');
      return;
    }
    this.loading.set(true);
    this.error.set('');

    this.auth.login({ email: this.email(), password: this.password() }).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.error.set(err.error?.error?.message ?? 'Credenciales incorrectas');
        this.loading.set(false);
      },
    });
  }
}
