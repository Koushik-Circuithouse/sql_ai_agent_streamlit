export interface ApiResponse {
  success: boolean;
  error?: string;
}

export interface DatabasesResponse extends ApiResponse {
  databases: string[];
}

export interface TablesResponse extends ApiResponse {
  tables: string[];
}

export interface SchemaColumn {
  field: string;
  type: string;
  null: string;
  key: string;
  default: string | null;
  extra: string;
}

export interface SchemaResponse extends ApiResponse {
  schema: SchemaColumn[];
  schema_str: string;
}

export interface GenerateSqlRequest {
  question: string;
  schema_str: string;
}

export interface GenerateSqlResponse extends ApiResponse {
  sql: string;
}

export interface ExecuteSqlRequest {
  database: string;
  sql: string;
}

export interface ExecuteSqlResponse extends ApiResponse {
  columns: string[];
  rows: Record<string, unknown>[];
  row_count: number;
}
