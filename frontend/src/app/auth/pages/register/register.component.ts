import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  Validators,
  FormGroup,
  FormControl,
  NonNullableFormBuilder,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';

function matchPasswords(group: AbstractControl): ValidationErrors | null {
  const pass = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return pass === confirm ? null : { mismatch: true };
}

type RegisterForm = FormGroup<{
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}>;

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  isSubmitting = false;
  showPassword = false;
  showConfirm = false;
  serverError = '';
  successMessage = '';

  form!: RegisterForm;

  constructor(
    private fb: NonNullableFormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group(
      {
        email: this.fb.control('', { validators: [Validators.required, Validators.email] }),
        password: this.fb.control('', { validators: [Validators.required, Validators.minLength(8)] }),
        confirmPassword: this.fb.control('', { validators: [Validators.required] }),
      },
      { validators: [matchPasswords] }
    );
  }

  togglePassword(): void { this.showPassword = !this.showPassword; }
  toggleConfirm(): void { this.showConfirm = !this.showConfirm; }

  submit(): void {
    this.serverError = '';
    this.successMessage = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const { email, password, confirmPassword } = this.form.getRawValue();
    this.auth.register({ email, password, confirmPassword }).subscribe({
      next: (): void => {
        this.successMessage = 'Inscription réussie. Vous pouvez maintenant vous connecter.';
        setTimeout(() => this.router.navigateByUrl('/auth/login'), 800);
      },
      error: (err: unknown): void => {
        const anyErr = err as { error?: { message?: string } };
        this.serverError = anyErr?.error?.message ?? 'Échec de l’inscription.';
        this.isSubmitting = false;
      },
      complete: (): void => { this.isSubmitting = false; },
    });
  }
}
