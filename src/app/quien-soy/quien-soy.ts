import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GithubService, GithubProfile } from '../services/github.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-quien-soy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quien-soy.html',
  styleUrl: './quien-soy.css'
})
export class QuienSoy implements OnInit {
  private githubService = inject(GithubService);

  profile$: Observable<GithubProfile> | undefined;
  private username = 'agustincarbone';

  ngOnInit(): void {
    this.profile$ = this.githubService.getProfile(this.username);
  }
}