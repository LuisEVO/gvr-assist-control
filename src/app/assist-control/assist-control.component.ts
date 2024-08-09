import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { FlieUploadComponent } from '../flie-upload/flie-upload.component';
import {
  AssistControl,
  AssistControlService,
  AssistControlType,
} from './assist-control.service';

@Component({
  selector: 'app-assist-control',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule,
    FlieUploadComponent,
    ReactiveFormsModule,
    MatIconModule,
    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './assist-control.component.html',
  styleUrl: './assist-control.component.scss',
  host: {
    '[class.loading]': 'loading',
  },
})
export default class AssistControlComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly assistControlService = inject(AssistControlService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  selectedIndex = 0;
  saving = false;
  loading = false;

  todayIn: AssistControl | null = null;
  todayOut: AssistControl | null = null;

  todayInForm: FormGroup<{ text: FormControl<string | null> }>;
  todayOutForm: FormGroup<{ text: FormControl<string | null> }>;

  constructor() {
    this.todayInForm = this.formBuilder.group({
      text: this.formBuilder.control<string | null>(null, Validators.required),
    });
    this.todayOutForm = this.formBuilder.group({
      text: this.formBuilder.control<string | null>(null, Validators.required),
    });
  }

  ngOnInit(): void {
    this.loading = true;

    Promise.all([
      this.assistControlService.getTodayRegister(AssistControlType.in),
      this.assistControlService.getTodayRegister(AssistControlType.out),
    ]).then(([todayIn, todayOut]) => {
      this.todayIn = todayIn;
      this.todayOut = todayOut;
      this.selectedIndex = !!todayIn ? 1 : 0;
      this.loading = false;
    });
  }

  async save(type: AssistControlType) {
    this.saving = true;

    let text: string;

    if (type === AssistControlType.in) {
      text = this.todayInForm.controls.text.value!;
    } else {
      text = this.todayOutForm.controls.text.value!;
    }

    const geo = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    this.assistControlService
      .create({
        type,
        text,
        geo: geo ?? {},
      })
      .then((res) => {
        if (type === AssistControlType.in) {
          this.todayIn = res;
        } else {
          this.todayOut = res;
        }
        this.saving = false;
      });
  }

  logout() {
    this.authService.signOut().then((res) => {
      if (!res.error) {
        this.router.navigateByUrl('/auth');
      }
    });
  }
}
