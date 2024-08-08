import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SignUpWithPasswordCredentials } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export default class AuthComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  protected loading = false;
  protected showPassword = false;
  protected authFormGroup: FormGroup<{
    email: FormControl;
    password: FormControl;
  }>;

  constructor() {
    this.authFormGroup = this.formBuilder.group({
      email: [environment.auth.email, [Validators.required, Validators.email]],
      password: [environment.auth.password, Validators.required],
    });
  }

  toogleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  signIn() {
    this.loading = true;
    this.authService
      .signIn(this.authFormGroup.value as SignUpWithPasswordCredentials)
      .then((res) => {
        console.log(res);
        if (res.error) {
          const message =
            res.error.message === 'Invalid login credentials'
              ? 'Correo o contraseña invalido'
              : 'Error inesperado, intente mas tarde';
          this.snackBar.open(message, 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top',
          });
        } else {
          this.router.navigateByUrl('/home');
        }
        this.loading = false;
      });
  }
}
