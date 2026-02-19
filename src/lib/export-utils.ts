import type { Entity } from '@/lib/types';

export interface FilteredTradeData {
  id: string;
  name: string;
  type: string;
  pair?: string;
  direction?: string;
  setup_type?: string;
  entry?: number;
  stop?: number;
  target?: number;
  risk_reward?: number;
  result?: string;
  grade?: number;
  killzone?: string;
  session?: string;
  timestamp?: string;
}

export function prepareTradeDataForExport(entities: Entity[]): FilteredTradeData[] {
  return entities.map(entity => {
    const metadata = entity.metadata || {};
    const execution = metadata.execution || {};
    const setup = metadata.setup || {};
    const market = metadata.market || {};
    const time = metadata.time || {};
    
    return {
      id: entity.id,
      name: entity.name,
      type: entity.type,
      pair: market.pair || metadata.pair,
      direction: market.direction || metadata.direction,
      setup_type: setup.setup_type || metadata.setup_type,
      entry: execution.entry_price || metadata.entry,
      stop: execution.stop_loss || metadata.stop,
      target: execution.target || metadata.target,
      risk_reward: execution.risk_reward_ratio || metadata.risk_reward,
      result: execution.result || metadata.result || metadata.meta?.example_type,
      grade: metadata.grade || execution.grade || setup.quality_grade,
      killzone: time.killzone || metadata.killzone,
      session: time.session || metadata.session,
      timestamp: metadata.meta?.timestamp || entity.createdAt
    };
  });
}

export function generateExportFilename(
  baseName: string,
  format: 'csv' | 'json',
  filters?: Record<string, unknown>
): string {
  const date = new Date().toISOString().split('T')[0];
  const hasFilters = filters && Object.values(filters).some(v => v !== undefined);
  const filterSuffix = hasFilters ? '-filtered' : '';
  return `${baseName}${filterSuffix}-${date}.${format}`;
}

export function exportToCSV(data: FilteredTradeData[], filename: string): void {
  if (data.length === 0) {
    return;
  }

  const headers = Object.keys(data[0]);
  
  const escapeCSVValue = (value: unknown): string => {
    const str = String(value ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvContent = [
    headers.map(escapeCSVValue).join(','),
    ...data.map(row => headers.map(h => escapeCSVValue(row[h as keyof FilteredTradeData])).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToJSON(data: FilteredTradeData[], filename: string): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportFullEntities(entities: Entity[], filename: string): void {
  const jsonString = JSON.stringify(entities, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportEntitiesToJSON(entities: Entity[]): void {
  const jsonString = JSON.stringify(entities, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `ict-entities-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportEntitiesToCSV(entities: Entity[]): void {
  if (entities.length === 0) {
    return;
  }

  const headers = [
    'ID',
    'Name',
    'Type',
    'Domain',
    'Description',
    'Source File',
    'Created At',
    'Updated At',
    'Tags',
    'Metadata'
  ];

  const rows = entities.map(entity => [
    entity.id,
    entity.name,
    entity.type,
    entity.domain,
    entity.description || '',
    entity.sourceFile || '',
    entity.createdAt,
    entity.updatedAt || '',
    (entity.tags || []).join('; '),
    JSON.stringify(entity.metadata || {})
  ]);

  const escapeCSVValue = (value: string): string => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  const csvContent = [
    headers.map(escapeCSVValue).join(','),
    ...rows.map(row => row.map(cell => escapeCSVValue(String(cell))).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `ict-entities-export-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportEntities(entities: Entity[], format: 'json' | 'csv'): void {
  if (format === 'json') {
    exportEntitiesToJSON(entities);
  } else {
    exportEntitiesToCSV(entities);
  }
}
