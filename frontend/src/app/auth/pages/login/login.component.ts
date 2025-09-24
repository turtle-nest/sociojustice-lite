import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  Validators,
  FormGroup,
  FormControl,
  NonNullableFormBuilder,
} from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth.service';
import type { AuthResponse } from '../../auth.service';

type LoginForm = FormGroup<{
  email: FormControl<string>;
  password: FormControl<string>;
}>;

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
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      email: this.fb.control('', { validators: [Validators.required, Validators.email] }),
      password: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(8)],
      }),
    });
  }

  get authState$() {
    return this.auth.isAuthenticated$;
  }

  get loggedInNow(): boolean {
    return this.auth.isLoggedIn();           // check sync
  }

  get redirectTarget(): string {
    return this.route.snapshot.queryParamMap.get('redirectUrl') || '/home';
  }

  go(): void {
    this.router.navigateByUrl(this.redirectTarget);
  }

  get hasToken(): boolean {
    return !!localStorage.getItem('sj_token');
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
        const redirect = this.route.snapshot.queryParamMap.get('redirectUrl') || '/home';
        this.router.navigateByUrl(redirect);
      },
      error: (err: unknown) => {
        const anyErr = err as { error?: { message?: string } };
        this.serverError = anyErr?.error?.message ?? 'Échec de la connexion. Vérifiez vos identifiants.';
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }
}
