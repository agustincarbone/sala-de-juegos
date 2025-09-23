import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Firestore, collection, addDoc, collectionData, query, orderBy, limit, Timestamp, CollectionReference, DocumentData, collectionGroup } from '@angular/fire/firestore';

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
    private messagesCollection: CollectionReference<Message, DocumentData>;
    public messages$: Observable<Message[]>;

    constructor() {
        // Explicitly cast the collection to CollectionReference<Message>
        this.messagesCollection = collection(this.firestore, 'chatMessages') as CollectionReference<Message>;
        this.messages$ = collectionData(query(this.messagesCollection, orderBy('timestamp', 'asc'), limit(25))) as Observable<Message[]>;
    }

    // Añade un nuevo mensaje a la colección
    async sendMessage(user: string, text: string) {
        const message: Message = { user, text, timestamp: Timestamp.now() };
        await addDoc(this.messagesCollection, message);
    }
}
