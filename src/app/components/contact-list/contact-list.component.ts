import { Component, OnInit } from '@angular/core';
import { ContactService } from '../../services/contact-service/contact.service';
import { Contact } from '../../Interface/Contact';
import { Observable } from 'rxjs';
import { ContactStateService } from '../../services/contact-state-service/contact-state.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})

export class ContactListComponent implements OnInit {
  contacts$: Observable<Contact[]>;
  errorMessage$: Observable<string | null>;

  constructor(private contactStateService: ContactStateService) {
    this.contacts$ = this.contactStateService.contacts$;
    this.errorMessage$ = this.contactStateService.errorMessage$; 
  }

  ngOnInit(): void {}

  deleteContact(id: number): void {
    this.contactStateService.deleteContact(id);
  }
}
