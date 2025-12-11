import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-results-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="results-container" *ngIf="columns.length > 0">
      <div class="results-header">
        <h3>Query Results</h3>
        <span class="row-count">{{ rows.length }} row(s) returned</span>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th *ngFor="let col of columns">{{ col }}</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of rows">
              <td *ngFor="let col of columns">{{ formatValue(row[col]) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="no-results" *ngIf="rows.length === 0">
        No results found
      </div>
    </div>
  `,
  styles: [`
    .results-container {
      margin-top: 1.5rem;
    }
    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    h3 {
      font-size: 1rem;
      font-weight: 600;
      color: #e4e4e7;
    }
    .row-count {
      color: #a1a1aa;
      font-size: 0.875rem;
    }
    .table-wrapper {
      overflow-x: auto;
      border-radius: 8px;
      border: 1px solid #3f3f46;
      max-height: 400px;
      overflow-y: auto;
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
      white-space: nowrap;
    }
    th {
      background: #18181b;
      font-weight: 600;
      color: #a1a1aa;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
      position: sticky;
      top: 0;
      z-index: 1;
    }
    td {
      background: #27272a;
      color: #e4e4e7;
    }
    tr:last-child td {
      border-bottom: none;
    }
    tr:hover td {
      background: #323238;
    }
    .no-results {
      text-align: center;
      padding: 2rem;
      color: #71717a;
    }
  `]
})
export class ResultsTableComponent {
  @Input() columns: string[] = [];
  @Input() rows: Record<string, unknown>[] = [];

  formatValue(value: unknown): string {
    if (value === null || value === undefined) {
      return 'NULL';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  }
}
