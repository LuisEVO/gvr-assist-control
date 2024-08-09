import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import {
  AssistControl,
  AssistControlService,
} from '../../assist-control.service';
import { MapsUrlPipe } from './mapsUrl.pipe';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-my-registers',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatIconModule,
    MapsUrlPipe,
  ],
  templateUrl: './my-registers.component.html',
  styleUrl: './my-registers.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ),
    ]),
  ],
})
export default class MyRegistersComponent implements OnInit {
  private readonly assistControlService = inject(AssistControlService);
  loading = false;
  displayedColumns: string[] = ['type', 'date', 'time', 'maps'];
  dataSource: AssistControl[] = [];
  expandedElement: AssistControl | null = null;

  ngOnInit(): void {
    this.loading = true;

    this.assistControlService.getAllByUser().then((registers) => {
      console.log(registers);
      this.dataSource = registers;
      this.loading = false;
    });
  }
}
