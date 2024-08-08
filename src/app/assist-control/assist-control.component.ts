import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import {
  AssistControl,
  AssistControlService,
  AssistControlType,
} from './assist-control.service';
import { FlieUploadComponent } from '../flie-upload/flie-upload.component';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

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

  todayInForm: FormGroup<{ file: FormControl<File | null> }>;
  todayOutForm: FormGroup<{ file: FormControl<File | null> }>;

  constructor() {
    this.todayInForm = this.formBuilder.group({
      file: this.formBuilder.control<File | null>(null, Validators.required),
    });
    this.todayOutForm = this.formBuilder.group({
      file: this.formBuilder.control<File | null>(null, Validators.required),
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

  save(type: AssistControlType) {
    this.saving = true;

    let file: File;

    if (type === AssistControlType.in) {
      file = this.todayInForm.controls.file.value!;
    } else {
      file = this.todayOutForm.controls.file.value!;
    }

    const fileExt = file.name.split('.').pop();
    const filePath = `${Math.random()}.${fileExt}`;

    Promise.all([
      this.assistControlService.uploadDocument(filePath, file),
      this.assistControlService.create({
        type,
        documentPath: filePath,
      }),
    ]).then(([_, res]) => {
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
