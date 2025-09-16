import { Injectable, inject } from '@angular/core';
import {Firestore, collection, addDoc, collectionData, query, orderBy, limit, Timestamp} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Message {
    user: string;
    text: string;
    timestamp: Timestamp;
}

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    private firestore: Firestore = inject(Firestore);
    private messagesCollection = collection(this.firestore, 'chatMessages');

    // Obtiene los últimos 25 mensajes ordenados por fecha
    getMessages(): Observable<Message[]> {
        const q = query(this.messagesCollection, orderBy('timestamp', 'asc'), limit(25));
        return collectionData(q) as Observable<Message[]>;
    }

    // Añade un nuevo mensaje a la colección
    async sendMessage(user: string, text: string) {
        const message: Message = { user, text, timestamp: Timestamp.now() };
        await addDoc(this.messagesCollection, message);
    }
}
