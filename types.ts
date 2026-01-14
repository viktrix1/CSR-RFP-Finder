export interface ScraperConfig {
  sectors: string[];
  geography: string[];
  deadline: string;
  specificOrganization: string;
  outputFormat: 'xlsx' | 'csv' | 'json';
}

export interface Opportunity {
  title: string;
  organization: string;
  focusArea: string;
  region: string;
  budget: string;
  deadline: string;
  type: 'RFP' | 'RFQ' | 'EOI' | 'Other';
  link: string;
  brief: string;
}

export interface Source {
  title: string;
  uri: string;
}

export interface SearchResult {
  opportunities: Opportunity[];
  sources: Source[];
}

export enum AppStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}