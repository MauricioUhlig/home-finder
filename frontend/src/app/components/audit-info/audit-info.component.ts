import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Audit } from '../../models/audit.model';

@Component({
  selector: 'app-audit-info',
  templateUrl: './audit-info.component.html',
  styleUrls: ['./audit-info.component.css'],
  imports: [CommonModule,]
})
export class AuditInfoComponent {
  @Input() audit!: Audit; // Input property for audit data

  formatDate(date: Date): string {
    return date.toLocaleString('pt-br', {dateStyle: "full", timeStyle: "medium"})
  }
}