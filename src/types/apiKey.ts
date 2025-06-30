export interface ApiKey {
  id: number;
  name: string;
  type: 'production' | 'development';
  usage: string;
  key: string;
  usage_limit?: number | null;
}

export interface ApiKeyForm {
  keyName: string;
  keyType: 'production' | 'development';
  limitUsage: boolean;
  usageLimit: string;
  usage: string;
  key: string;
} 