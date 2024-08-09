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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import {
  AssistControl,
  AssistControlService,
  AssistControlType,
} from '../../assist-control.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatButtonModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  host: {
    '[class.loading]': 'loading',
  },
})
export default class RegisterComponent implements OnInit {
  private readonly assistControlService = inject(AssistControlService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

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
      this.selectedIndex = !!todayIn && !todayOut ? 1 : 0;
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

    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    })
      .then((geo) => {
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
      })
      .catch(() => {
        this.snackBar.open(
          'Es necesario permitir el acceso a la ubicación',
          'Cerrar',
          {
            duration: 3000,
            verticalPosition: 'top',
          },
        );
        this.saving = false;
      });
  }
}
