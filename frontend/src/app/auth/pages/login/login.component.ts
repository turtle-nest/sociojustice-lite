import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  Validators,
  FormGroup,
  FormControl,
  NonNullableFormBuilder,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';

type LoginForm = FormGroup<{
  email: FormControl<string>;
  password: FormControl<string>;
}>;

interface AuthResponse {
  token: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  isSubmitting = false;
  showPassword = false;
  serverError = '';

  form!: LoginForm;

  constructor(
    private fb: NonNullableFormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: this.fb.control('', { validators: [Validators.required, Validators.email] }),
      password: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(8)],
      }),
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  submit(): void {
    this.serverError = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;

    const { email, password } = this.form.getRawValue();
    this.auth.login({ email, password }).subscribe({
      next: (res: AuthResponse) => {
        localStorage.setItem('sj_token', res.token);
        this.router.navigateByUrl('/');
      },
      error: (err: unknown) => {
        const anyErr = err as { error?: { message?: string } };
        this.serverError = anyErr?.error?.message ?? 'Échec de la connexion. Vérifiez vos identifiants.';
        this.isSubmitting = false;
      },
      complete: () => (this.isSubmitting = false),
    });
  }
}
