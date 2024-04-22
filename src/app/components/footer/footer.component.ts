import {Component, Inject} from '@angular/core';
import {DatePipe, DOCUMENT, NgOptimizedImage} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    NgOptimizedImage,
    ReactiveFormsModule,
    DatePipe,
    RouterLink
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  protected currentDate: Date = new Date();

  constructor(
    @Inject(DOCUMENT) private document: Document) {
  }

  protected goToTop(): void {
    this.document.body.scrollTop = 0;
    this.document.documentElement.scrollTop = 0;
  }

  protected newsletterForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  protected submitNewsletterForm(): void {
    if (this.newsletterForm.valid) {
      // subscribe to newsletter
    }
  }

}
