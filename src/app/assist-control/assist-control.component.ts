import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-assist-control',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    RouterLink,
    RouterOutlet,
  ],
  templateUrl: './assist-control.component.html',
  styleUrl: './assist-control.component.scss',
})
export default class AssistControlComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  protected isAdmin = false;

  ngOnInit(): void {
    this.authService.isAdmin().then((isAdmin) => (this.isAdmin = isAdmin));
  }

  logout() {
    this.authService.signOut().then((res) => {
      if (!res.error) {
        this.router.navigateByUrl('/auth');
      }
    });
  }

  goPage(path: string, drawer: MatDrawer) {
    this.router.navigateByUrl(path);
    drawer.toggle();
  }
}
