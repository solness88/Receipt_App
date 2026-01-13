import type { FormData, ValidationErrors } from './types';

export const validateForm = (formData: FormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!formData.recipientName.trim()) {
    errors.recipientName = '宛名を入力してください';
  }

  if (!formData.issueDate) {
    errors.issueDate = '発行日を入力してください';
  }

  if (!formData.amount.trim()) {
    errors.amount = '金額を入力してください';
  } else {
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      errors.amount = '有効な金額を入力してください';
    }
  }

  if (!formData.description.trim()) {
    errors.description = '但し書きを入力してください';
  }

  return errors;
};

export const formatDateJapanese = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
};

export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('ja-JP');
};

export const generateReceiptNumber = (dateString: string): string => {
  if (!dateString) return '00000';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[date.getMonth()];
  const day = date.getDate();

  // 3桁のランダム数字 (100-999)
  const randomNum = Math.floor(Math.random() * 900) + 100;
  
  return `${year}${month}${day}-${randomNum}`;
};