import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseSelectorComponent } from './components/database-selector/database-selector.component';
import { TableSelectorComponent } from './components/table-selector/table-selector.component';
import { SchemaViewerComponent } from './components/schema-viewer/schema-viewer.component';
import { QueryInputComponent } from './components/query-input/query-input.component';
import { ResultsTableComponent } from './components/results-table/results-table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    DatabaseSelectorComponent,
    TableSelectorComponent,
    SchemaViewerComponent,
    QueryInputComponent,
    ResultsTableComponent
  ],
  template: `
    <div class="app-container">
      <header>
        <div class="logo">
          <span class="icon">&#9889;</span>
          <h1>SQL AI Agent</h1>
        </div>
        <p class="subtitle">Generate SQL queries using natural language</p>
      </header>

      <main>
        <div class="card selectors-card">
          <div class="selectors-grid">
            <app-database-selector
              (databaseSelected)="onDatabaseSelected($event)">
            </app-database-selector>

            <app-table-selector
              [database]="selectedDatabase"
              (tableSelected)="onTableSelected($event)">
            </app-table-selector>
          </div>
        </div>

        <div class="card" *ngIf="selectedTable">
          <app-schema-viewer
            [database]="selectedDatabase"
            [table]="selectedTable"
            (schemaLoaded)="onSchemaLoaded($event)">
          </app-schema-viewer>

          <app-query-input
            [schemaStr]="schemaStr"
            [database]="selectedDatabase"
            (queryExecuted)="onQueryExecuted($event)">
          </app-query-input>

          <app-results-table
            [columns]="resultColumns"
            [rows]="resultRows">
          </app-results-table>
        </div>

        <div class="empty-state" *ngIf="!selectedTable">
          <div class="empty-icon">&#128269;</div>
          <h2>Select a database and table to get started</h2>
          <p>Choose from the dropdowns above to view the schema and start querying</p>
        </div>
      </main>

      <footer>
        <p>Powered by OpenAI GPT-4o-mini</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
    }

    .icon {
      font-size: 2rem;
    }

    h1 {
      font-size: 2rem;
      font-weight: 700;
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      color: #a1a1aa;
      font-size: 1rem;
    }

    main {
      flex: 1;
    }

    .card {
      background: rgba(39, 39, 42, 0.8);
      backdrop-filter: blur(10px);
      border: 1px solid #3f3f46;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .selectors-card {
      background: rgba(24, 24, 27, 0.8);
    }

    .selectors-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #71717a;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .empty-state h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #a1a1aa;
      margin-bottom: 0.5rem;
    }

    .empty-state p {
      font-size: 0.875rem;
    }

    footer {
      text-align: center;
      padding: 1.5rem;
      color: #52525b;
      font-size: 0.875rem;
    }

    @media (max-width: 640px) {
      .app-container {
        padding: 1rem;
      }

      h1 {
        font-size: 1.5rem;
      }

      .card {
        padding: 1rem;
      }
    }
  `]
})
export class AppComponent {
  selectedDatabase = '';
  selectedTable = '';
  schemaStr = '';
  resultColumns: string[] = [];
  resultRows: Record<string, unknown>[] = [];

  onDatabaseSelected(database: string): void {
    this.selectedDatabase = database;
    this.selectedTable = '';
    this.schemaStr = '';
    this.clearResults();
  }

  onTableSelected(table: string): void {
    this.selectedTable = table;
    this.schemaStr = '';
    this.clearResults();
  }

  onSchemaLoaded(schemaStr: string): void {
    this.schemaStr = schemaStr;
  }

  onQueryExecuted(result: { columns: string[], rows: Record<string, unknown>[] }): void {
    this.resultColumns = result.columns;
    this.resultRows = result.rows;
  }

  private clearResults(): void {
    this.resultColumns = [];
    this.resultRows = [];
  }
}
