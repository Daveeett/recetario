import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export default class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly username = signal('');
  readonly email = signal('');
  readonly password = signal('');
  readonly loading = signal(false);
  readonly error = signal('');

  submit(): void {
    if (!this.username() || !this.email() || !this.password()) {
      this.error.set('Completa todos los campos');
      return;
    }
    this.loading.set(true);
    this.error.set('');

    this.auth.register({
      username: this.username(),
      email: this.email(),
      password: this.password()
    }).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.error.set(err.error?.error?.message ?? 'Error al registrar usuario');
        this.loading.set(false);
      },
    });
  }
}
