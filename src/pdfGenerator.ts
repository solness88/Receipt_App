import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { FormData } from './types';

/**
 * 領収書PDFを生成してダウンロード
 */
export const generateReceiptPDF = async (formData: FormData): Promise<void> => {
  try {
    // プレビュー要素を取得
    const receiptElement = document.querySelector('.receipt-preview') as HTMLElement;
    
    if (!receiptElement) {
      throw new Error('領収書プレビューが見つかりません');
    }

    console.log('PDF生成開始: プレビューをキャプチャ中...');

    // プレビューを画像化
    // const canvas = await html2canvas(receiptElement, {
    //   scale: 2,
    //   useCORS: true, // 外部画像対応
    //   logging: false,
    //   backgroundColor: '#ffffff',

    // });

    const canvas = await html2canvas(receiptElement, {
      scale: 2,
      useCORS: true, // 外部画像対応
      logging: false,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => {
        const inputs = clonedDoc.querySelectorAll('input, textarea, select');
        inputs.forEach((input: any) => {
          input.disabled = false;
        });
      }
    });




    console.log('キャプチャ完了');

    // A4サイズのPDFを作成
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // キャンバスをPDFに追加
    const imgWidth = 210; // A4幅（mm）
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const imgData = canvas.toDataURL('image/jpeg');
    
    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

    // ファイル名を生成
    const fileDate = new Date(formData.issueDate);
    const fileYear = fileDate.getFullYear();
    const fileMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const fileMonth = fileMonthNames[fileDate.getMonth()];
    const fileDay = fileDate.getDate();
    const fileDateStr = `${fileYear}${fileMonth}${fileDay}`;

    const fileAmount = parseFloat(formData.amount) || 0;
    const sanitizedName = formData.recipientName.replace(/[\\/:*?"<>|]/g, '');
    const nameWithSama = sanitizedName.endsWith('様') ? sanitizedName : `${sanitizedName}様`;

    const filename = `${fileDateStr}_${fileAmount}_${nameWithSama}_発行領収書.pdf`;

    // PDFをダウンロード
    pdf.save(filename);
    
    console.log('PDF生成完了:', filename);
  } catch (error) {
    console.error('PDF生成エラー:', error);
    throw error;
  }
};