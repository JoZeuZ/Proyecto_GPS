import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-review',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.css']
})
export class AddReviewComponent implements OnInit {
  public reviewForm!: FormGroup;

  categories = ['Comida', 'Servicio', 'Ambiente', 'General'];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.reviewForm = new FormGroup({
      titulo: new FormControl('', [Validators.required]),
      descripción: new FormControl('', [Validators.required]),
      estrellas: new FormControl(0.5, [Validators.required, Validators.min(0.5), Validators.max(5)]),
      categoria: new FormControl('General', [Validators.required])
    });
  }

  addReview(): void {
    if (this.reviewForm.invalid) {
      this.markAllAsTouched(this.reviewForm);
      return;
    }

    const newReview = {
      ...this.reviewForm.value,
      estrellas: Number(this.reviewForm.value.estrellas)  // Ensure it's a number
    };

    this.http.post('http://localhost:3000/api/resenas', newReview).subscribe({
      next: (response: any) => {
        alert('Review added successfully');
        this.reviewForm.reset({ estrellas: 0.5, categoria: 'General' });
      },
      error: (error: any) => {
        alert('An error occurred while adding the review');
      }
    });
  }

  markAllAsTouched(group: FormGroup): void {
    Object.values(group.controls).forEach(control => {
      if (control instanceof FormControl) {
        control.markAsTouched();
      } else if (control instanceof FormGroup) {
        this.markAllAsTouched(control);
      }
    });
  }

  getErrorMessage(formControlName: string): string {
    const control = this.reviewForm.get(formControlName);

    if (control && control.hasError('required')) {
      return 'This field is required.';
    } else if (control && control.hasError('min')) {
      return 'Minimum value is 0.5.';
    } else if (control && control.hasError('max')) {
      return 'Maximum value is 5.';
    }

    return '';
  }
}



