import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
authStatusChecked: any;

  async login() {
    if (!this.email || !this.password) {
      Swal.fire({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'Por favor, ingresa tu correo y contraseña.',
        heightAuto: false
      });
      return;
    }
    try {
      await this.auth.login(this.email, this.password);
      this.router.navigate(['/home']);
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error de inicio de sesión',
        text: 'El correo o la contraseña son incorrectos. Por favor, inténtalo de nuevo.',
        heightAuto: false
      });
    }
  }

  fastLogin(userType: 'admin' | 'tester' | 'guest') {
    if (userType === 'admin') {
      this.email = 'admin@admin.com';
      this.password = '123456';
    } else if (userType === 'tester') {
      this.email = 'tester@example.com';
      this.password = 'password123';
    } else {
      this.email = 'guest@example.com';
      this.password = 'password123';
    }
  }
}