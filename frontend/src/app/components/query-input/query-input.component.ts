import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SqlAgentService } from '../../services/sql-agent.service';

@Component({
  selector: 'app-query-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="query-container" *ngIf="schemaStr">
      <label for="question-input">Ask a question about your data</label>
      <div class="input-wrapper">
        <input
          id="question-input"
          type="text"
          [(ngModel)]="question"
          placeholder="e.g., Show all products with price greater than 100"
          (keyup.enter)="generateSql()"
          [disabled]="loading">
        <button
          (click)="generateSql()"
          [disabled]="!question.trim() || loading"
          class="generate-btn">
          <span *ngIf="!loading">Generate SQL</span>
          <span *ngIf="loading">Generating...</span>
        </button>
      </div>

      <div class="error-message" *ngIf="error">{{ error }}</div>

      <div class="sql-output" *ngIf="generatedSql">
        <h4>Generated SQL</h4>
        <pre><code>{{ generatedSql }}</code></pre>
        <button (click)="executeSql()" class="execute-btn" [disabled]="executing">
          <span *ngIf="!executing">Execute Query</span>
          <span *ngIf="executing">Executing...</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .query-container {
      margin-bottom: 1.5rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #a1a1aa;
      font-size: 0.875rem;
    }
    .input-wrapper {
      display: flex;
      gap: 0.75rem;
    }
    input {
      flex: 1;
      padding: 0.75rem 1rem;
      border: 1px solid #3f3f46;
      border-radius: 8px;
      background: #27272a;
      color: #e4e4e7;
      font-size: 1rem;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    input:focus {
      outline: none;
      border-color: #4f46e5;
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
    }
    input:disabled {
      opacity: 0.6;
    }
    input::placeholder {
      color: #71717a;
    }
    .generate-btn {
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      white-space: nowrap;
    }
    .generate-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
    }
    .generate-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .sql-output {
      margin-top: 1.5rem;
      padding: 1rem;
      background: #18181b;
      border-radius: 8px;
      border: 1px solid #3f3f46;
    }
    .sql-output h4 {
      margin-bottom: 0.75rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: #a1a1aa;
    }
    pre {
      background: #0f0f11;
      padding: 1rem;
      border-radius: 6px;
      overflow-x: auto;
      margin-bottom: 1rem;
    }
    code {
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      color: #10b981;
      font-size: 0.875rem;
      line-height: 1.5;
    }
    .execute-btn {
      padding: 0.5rem 1rem;
      background: #10b981;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .execute-btn:hover:not(:disabled) {
      background: #059669;
    }
    .execute-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .error-message {
      margin-top: 0.5rem;
      color: #ef4444;
      font-size: 0.875rem;
    }
  `]
})
export class QueryInputComponent {
  @Input() schemaStr = '';
  @Input() database = '';
  @Output() queryExecuted = new EventEmitter<{ columns: string[], rows: Record<string, unknown>[] }>();

  question = '';
  generatedSql = '';
  loading = false;
  executing = false;
  error = '';

  constructor(private sqlAgentService: SqlAgentService) {}

  generateSql(): void {
    if (!this.question.trim()) return;

    this.loading = true;
    this.error = '';
    this.generatedSql = '';

    this.sqlAgentService.generateSql({
      question: this.question,
      schema_str: this.schemaStr
    }).subscribe({
      next: (response) => {
        if (response.success) {
          this.generatedSql = response.sql;
        } else {
          this.error = response.error || 'Failed to generate SQL';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to generate SQL';
        this.loading = false;
        console.error(err);
      }
    });
  }

  executeSql(): void {
    if (!this.generatedSql) return;

    this.executing = true;
    this.error = '';

    this.sqlAgentService.executeSql({
      database: this.database,
      sql: this.generatedSql
    }).subscribe({
      next: (response) => {
        if (response.success) {
          this.queryExecuted.emit({
            columns: response.columns,
            rows: response.rows
          });
        } else {
          this.error = response.error || 'Failed to execute SQL';
        }
        this.executing = false;
      },
      error: (err) => {
        this.error = 'Failed to execute SQL';
        this.executing = false;
        console.error(err);
      }
    });
  }
}
