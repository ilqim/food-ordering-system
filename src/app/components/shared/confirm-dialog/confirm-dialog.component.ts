import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit, OnDestroy {
  message = '';
  visible = false;

  constructor(private notifier: NotificationService) {}

  ngOnInit(): void {
    this.notifier.confirmMessage$.subscribe(msg => {
      this.message = msg ?? '';
      this.visible = !!msg;
    });

    window.addEventListener('keydown', this.handleKeydown);
  }

  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.handleKeydown);
  }

  handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this.visible) {
      this.onCancel();
    }
  };

  onConfirm() {
    this.notifier.resolveConfirm(true);
  }

  onCancel() {
    this.notifier.resolveConfirm(false);
  }
}
