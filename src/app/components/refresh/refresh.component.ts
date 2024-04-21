import { Component } from '@angular/core';

@Component({
  selector: 'app-refresh',
  standalone: true,
  imports: [],
  templateUrl: './refresh.component.html',
  styleUrl: './refresh.component.scss'
})
export class RefreshComponent {

  refreshPage(): void {
    window.location.reload();
  }
}
