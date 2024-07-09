import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../../services/contact-service/contact.service';
import { Contact } from '../../Interface/Contact';
import { ContactStateService } from '../../services/contact-state-service/contact-state.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})

export class ContactFormComponent implements OnInit {
  contactForm: FormGroup;
  isEditMode = false;
  errorMessage$: Observable<string | null>; 

  constructor(
    private fb: FormBuilder,
    private contactStateService: ContactStateService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.contactForm = this.fb.group({
      id: [0],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
    this.errorMessage$ = this.contactStateService.errorMessage$; 
  }

  ngOnInit(): void {
    const contactId = this.route.snapshot.params['id'];
    if (contactId) {
      this.isEditMode = true;
      this.contactStateService.contacts$.subscribe((contacts) => {
        const contact = contacts.find(c => c.id === +contactId);
        if (contact) {
          this.contactForm.patchValue(contact);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      const contact: Contact = this.contactForm.value;
      if (this.isEditMode) {
        this.contactStateService.updateContact(contact);
      } else {
        this.contactStateService.addContact(contact);
      }
      this.router.navigate(['/']);
    }
  }
}