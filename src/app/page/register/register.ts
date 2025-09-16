import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth/auth.service';
import { FirebaseError } from '@angular/fire/app';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Register {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';

  async register() {
    if (!this.email || !this.password) {
      Swal.fire({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'Por favor, completa todos los campos para registrarte.',
        heightAuto: false
      });
      return;
    }
    try {
      await this.auth.register(this.email, this.password);
      await Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'Serás redirigido a la página de inicio.',
        timer: 2000,
        showConfirmButton: false,
        heightAuto: false
      });
      this.router.navigate(['/home']);
    } catch (error: any) {
      let errorMessage = 'Ocurrió un error inesperado durante el registro.';
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'El correo electrónico ya está en uso. Por favor, utiliza otro.';
            break;
          case 'auth/weak-password':
            errorMessage = 'La contraseña es demasiado débil. Debe tener al menos 6 caracteres.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'El formato del correo electrónico no es válido.';
            break;
        }
      }
      Swal.fire({
        icon: 'error',
        title: 'Error de Registro',
        text: errorMessage,
        heightAuto: false
      });
    }
  }
}
