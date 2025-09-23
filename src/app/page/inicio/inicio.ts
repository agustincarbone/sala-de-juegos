import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-inicio',
  imports: [CommonModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Inicio {
  private auth = inject(AuthService);
  private router = inject(Router);
  protected mostrarJuegos = false;

  user = this.auth.currentUser;

  listarJuegos() {
    this.mostrarJuegos = !this.mostrarJuegos;
  }
}
