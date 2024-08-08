import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-flie-upload',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './flie-upload.component.html',
  styleUrl: './flie-upload.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FlieUploadComponent,
      multi: true,
    },
  ],
  host: {
    '[class.disabled]': 'isDisabled'
  }
})
export class FlieUploadComponent {
  value?: File;
  isDisabled: boolean = false;
  onChange?: (value?: File) => void;
  onTouch?: () => void;

  writeValue(value: File): void {
    this.value = value;
  }

  registerOnChange(fn: (value?: File) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
  }

  selectFile(e: any) {
    const file = e.target.files[0];
    e.target.value = '';
    this.value = file;
    this.onChange?.(this.value);
    this.onTouch?.();
  }

  unselectFile(e: Event) {
    e.stopPropagation();
    this.value = undefined;
    this.onChange?.(this.value);
  }
}
