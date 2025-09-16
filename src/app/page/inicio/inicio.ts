import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-inicio',
  imports: [CommonModule, RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Inicio {
  private auth = inject(AuthService);
  private router = inject(Router);

  user = this.auth.currentUser;

  async logout() {
    try {
      await this.auth.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
}
