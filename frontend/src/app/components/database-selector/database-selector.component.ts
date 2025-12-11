import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SqlAgentService } from '../../services/sql-agent.service';

@Component({
  selector: 'app-database-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="selector-container">
      <label for="database-select">Select Database</label>
      <select
        id="database-select"
        [(ngModel)]="selectedDatabase"
        (ngModelChange)="onDatabaseChange($event)"
        [disabled]="loading">
        <option value="">-- Choose a database --</option>
        <option *ngFor="let db of databases" [value]="db">{{ db }}</option>
      </select>
      <div class="loading-indicator" *ngIf="loading">Loading...</div>
      <div class="error-message" *ngIf="error">{{ error }}</div>
    </div>
  `,
  styles: [`
    .selector-container {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #a1a1aa;
      font-size: 0.875rem;
    }
    select {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid #3f3f46;
      border-radius: 8px;
      background: #27272a;
      color: #e4e4e7;
      font-size: 1rem;
      cursor: pointer;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    select:hover {
      border-color: #4f46e5;
    }
    select:focus {
      outline: none;
      border-color: #4f46e5;
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
    }
    select:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .loading-indicator {
      margin-top: 0.5rem;
      color: #a1a1aa;
      font-size: 0.875rem;
    }
    .error-message {
      margin-top: 0.5rem;
      color: #ef4444;
      font-size: 0.875rem;
    }
  `]
})
export class DatabaseSelectorComponent implements OnInit {
  @Output() databaseSelected = new EventEmitter<string>();

  databases: string[] = [];
  selectedDatabase = '';
  loading = false;
  error = '';

  constructor(private sqlAgentService: SqlAgentService) {}

  ngOnInit(): void {
    this.loadDatabases();
  }

  loadDatabases(): void {
    this.loading = true;
    this.error = '';

    this.sqlAgentService.getDatabases().subscribe({
      next: (response) => {
        if (response.success) {
          this.databases = response.databases;
        } else {
          this.error = response.error || 'Failed to load databases';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to connect to server';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onDatabaseChange(database: string): void {
    this.databaseSelected.emit(database);
  }
}
