// 領収書データの型定義
export interface ReceiptData {
  recipientName: string;
  issueDate: string;
  amount: number;
  description: string;
  notes: string;
}

// フォーム入力データの型定義
export interface FormData {
  recipientName: string;
  issueDate: string;
  amount: string;
  description: string;
  notes: string;
}

// バリデーションエラーの型定義
export interface ValidationErrors {
  recipientName?: string;
  issueDate?: string;
  amount?: string;
  description?: string;
}