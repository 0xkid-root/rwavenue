export type TransactionType = 'buy' | 'sell' | 'validate' | 'tokenize';

export interface Transaction {
  id: string;
  type: TransactionType;
  assetId: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: Date;
  from: string;
  to: string;
}