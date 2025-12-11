import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SqlAgentService } from '../../services/sql-agent.service';
import { SchemaColumn } from '../../models/api.models';

@Component({
  selector: 'app-schema-viewer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="schema-container" *ngIf="database && table">
      <h3>Schema for <span class="table-name">{{ table }}</span></h3>

      <div class="loading-indicator" *ngIf="loading">Loading schema...</div>
      <div class="error-message" *ngIf="error">{{ error }}</div>

      <div class="table-wrapper" *ngIf="schema.length > 0">
        <table>
          <thead>
            <tr>
              <th>Field</th>
              <th>Type</th>
              <th>Null</th>
              <th>Key</th>
              <th>Default</th>
              <th>Extra</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let col of schema">
              <td class="field-name">{{ col.field }}</td>
              <td class="field-type">{{ col.type }}</td>
              <td>{{ col.null }}</td>
              <td>
                <span class="key-badge" *ngIf="col.key">{{ col.key }}</span>
              </td>
              <td>{{ col.default || '-' }}</td>
              <td>{{ col.extra || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .schema-container {
      margin-bottom: 1.5rem;
    }
    h3 {
      margin-bottom: 1rem;
      font-size: 1rem;
      font-weight: 600;
      color: #e4e4e7;
    }
    .table-name {
      color: #4f46e5;
    }
    .table-wrapper {
      overflow-x: auto;
      border-radius: 8px;
      border: 1px solid #3f3f46;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
    }
    th, td {
      padding: 0.75rem 1rem;
      text-align: left;
      border-bottom: 1px solid #3f3f46;
    }
    th {
      background: #18181b;
      font-weight: 600;
      color: #a1a1aa;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
    }
    td {
      background: #27272a;
    }
    tr:last-child td {
      border-bottom: none;
    }
    tr:hover td {
      background: #323238;
    }
    .field-name {
      color: #4f46e5;
      font-weight: 500;
    }
    .field-type {
      color: #10b981;
      font-family: 'Consolas', 'Monaco', monospace;
    }
    .key-badge {
      display: inline-block;
      padding: 0.125rem 0.5rem;
      background: #4f46e5;
      color: white;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .loading-indicator {
      color: #a1a1aa;
      font-size: 0.875rem;
    }
    .error-message {
      color: #ef4444;
      font-size: 0.875rem;
    }
  `]
})
export class SchemaViewerComponent implements OnChanges {
  @Input() database = '';
  @Input() table = '';
  @Output() schemaLoaded = new EventEmitter<string>();

  schema: SchemaColumn[] = [];
  schemaStr = '';
  loading = false;
  error = '';

  constructor(private sqlAgentService: SqlAgentService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['database'] || changes['table']) && this.database && this.table) {
      this.loadSchema();
    }
  }

  loadSchema(): void {
    this.loading = true;
    this.error = '';
    this.schema = [];

    this.sqlAgentService.getTableSchema(this.database, this.table).subscribe({
      next: (response) => {
        if (response.success) {
          this.schema = response.schema;
          this.schemaStr = response.schema_str;
          this.schemaLoaded.emit(this.schemaStr);
        } else {
          this.error = response.error || 'Failed to load schema';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load schema';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
