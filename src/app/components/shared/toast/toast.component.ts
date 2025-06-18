import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {
  message: string | null = null;

  constructor(private notification: NotificationService) {}

  ngOnInit(): void {
    this.notification.message$.subscribe(msg => {
      this.message = msg;
    });
  }
}
