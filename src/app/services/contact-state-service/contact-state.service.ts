import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of } from 'rxjs';
import { Contact } from '../../Interface/Contact';
import { ContactService } from '../contact-service/contact.service';

@Injectable({
  providedIn: 'root'
})
export class ContactStateService {
  private contactsSubject = new BehaviorSubject<Contact[]>([]);
  contacts$: Observable<Contact[]> = this.contactsSubject.asObservable();
  errorMessage$ = new BehaviorSubject<string | null>(null); 

  constructor(private contactService: ContactService) {
    this.loadContacts();
  }

  private loadContacts() {
    this.contactService.getContacts().pipe(
      catchError((error) => {
        const message = this.getErrorMessage(error);
        this.errorMessage$.next(message);
        return of([]); 
      })
    ).subscribe((contacts) => {
      this.contactsSubject.next(contacts);
    });
  }

  addContact(contact: Contact) {
    this.contactService.addContact(contact).pipe(
      catchError((error) => {
        const message = this.getErrorMessage(error);
        this.errorMessage$.next(message);
        return of(contact); 
      })
    ).subscribe((newContact) => {
      this.contactsSubject.next([...this.contactsSubject.value, newContact]);
    });
  }

  updateContact(contact: Contact) {
    this.contactService.updateContact(contact).pipe(
      catchError((error) => {
        const message = this.getErrorMessage(error);
        this.errorMessage$.next(message);
        return of();
      })
    ).subscribe(() => {
      const updatedContacts = this.contactsSubject.value.map(c =>
        c.id === contact.id ? contact : c
      );
      this.contactsSubject.next(updatedContacts);
    });
  }

  deleteContact(id: number) {
    this.contactService.deleteContact(id).pipe(
      catchError((error) => {
        const message = this.getErrorMessage(error);
        this.errorMessage$.next(message);
        return of();
      })
    ).subscribe(() => {
      const updatedContacts = this.contactsSubject.value.filter(c => c.id !== id);
      this.contactsSubject.next(updatedContacts);
    });
  }

  private getErrorMessage(error: any): string {
    if (error.error && error.error.message) {
      return error.error.message;
    } else if (error.message) {
      return error.message;
    } else {
      return 'An unknown error occurred.';
    }
  }
}