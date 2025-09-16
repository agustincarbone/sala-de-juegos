import { Component, inject, OnInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { ChatService, Message } from '../services/chat/chat.service';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css'],
})
export class Chat implements OnInit, AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  authService = inject(AuthService);
  chatService = inject(ChatService);
  private router = inject(Router);
  
  messages$!: Observable<Message[]>;
  newMessage: string = '';
  currentUserEmail: string = '';

  ngOnInit(): void {
    this.messages$ = this.chatService.getMessages();
    this.currentUserEmail = this.authService.currentUser()?.email || 'Anónimo';
    this.scrollToBottom();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  sendMessage(): void {
    if (this.newMessage.trim() === '') return;

    this.chatService.sendMessage(this.currentUserEmail, this.newMessage);
    this.newMessage = '';
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
  
  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
}
