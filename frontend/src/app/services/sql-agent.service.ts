import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  DatabasesResponse,
  TablesResponse,
  SchemaResponse,
  GenerateSqlRequest,
  GenerateSqlResponse,
  ExecuteSqlRequest,
  ExecuteSqlResponse
} from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class SqlAgentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDatabases(): Observable<DatabasesResponse> {
    return this.http.get<DatabasesResponse>(`${this.apiUrl}/databases`);
  }

  getTables(database: string): Observable<TablesResponse> {
    return this.http.get<TablesResponse>(`${this.apiUrl}/databases/${database}/tables`);
  }

  getTableSchema(database: string, table: string): Observable<SchemaResponse> {
    return this.http.get<SchemaResponse>(`${this.apiUrl}/databases/${database}/tables/${table}/schema`);
  }

  generateSql(request: GenerateSqlRequest): Observable<GenerateSqlResponse> {
    return this.http.post<GenerateSqlResponse>(`${this.apiUrl}/generate-sql`, request);
  }

  executeSql(request: ExecuteSqlRequest): Observable<ExecuteSqlResponse> {
    return this.http.post<ExecuteSqlResponse>(`${this.apiUrl}/execute-sql`, request);
  }
}
