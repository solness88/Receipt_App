import { useState, useEffect } from 'react';
import type { FormData } from './types';
import { formatDateJapanese, formatCurrency, generateReceiptNumber } from './utils';
import { generateReceiptPDF } from './pdfGenerator';
import { COMPANY_INFO } from './companyConfig';
import './App.css';

function App() {
  const [formData, setFormData] = useState<FormData>({
    recipientName: '',
    issueDate: '',
    amount: '',
    description: '',
    notes: '',
  });

  // モーダルの開閉状態を追加
  const [isRecipientModalOpen, setIsRecipientModalOpen] = useState(false);
  const [newRecipient, setNewRecipient] = useState(''); // 新規宛名の入力値

  const [recipients, setRecipients] = useState<string[]>(() => {
    const saved = localStorage.getItem('recipients');
    return saved ? JSON.parse(saved) : [];
  });

  const [isRecipientDropdownOpen, setIsRecipientDropdownOpen] = useState(false);

  // 但し書き用のステートを追加
  const [descriptions, setDescriptions] = useState<string[]>(() => {
    const saved = localStorage.getItem('descriptions');
    return saved ? JSON.parse(saved) : [];
  });

  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [newDescription, setNewDescription] = useState('');
  const [isDescriptionDropdownOpen, setIsDescriptionDropdownOpen] = useState(false);
  




  const [showToast, setShowToast] = useState(false);







  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // handleInputChangeの下に追加
  const handleDateClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.currentTarget.showPicker();
  };

  // handleDateClickの下に追加
  const handleGeneratePDF = async () => {
    // 簡易バリデーション
    if (!formData.recipientName.trim()) {
      alert('宛名を入力してください');
      return;
    }
    if (!formData.issueDate) {
      alert('発行日を入力してください');
      return;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('金額を入力してください');
      return;
    }
    if (!formData.description.trim()) {
      alert('但し書きを入力してください');
      return;
    }

    try {
      await generateReceiptPDF(formData);

      // トースト表示
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);  // 3秒後に消える
      
      
      // PDF生成後に入力内容をクリア
      setFormData({
        recipientName: '',
        issueDate: '',
        amount: '',
        description: '',
        notes: ''
      });

      // 最初の入力欄にフォーカス
      setTimeout(() => {
        const firstInput = document.querySelector('input[name="recipientName"]') as HTMLInputElement;
        if (firstInput) {
          firstInput.focus();
        }
      }, 100);

        
    } catch (error) {
      console.error('PDF生成エラー:', error);
      alert('PDFの生成に失敗しました。');
    }
  };

  // 宛名を追加
  const handleAddRecipient = () => {
    if (!newRecipient.trim()) {
      alert('宛名を入力してください');
      return;
    }
  
    const updated = [...recipients, newRecipient.trim()];
    setRecipients(updated);
    localStorage.setItem('recipients', JSON.stringify(updated));
    setNewRecipient(''); // 入力欄をクリア
  };

  // 宛名を削除
  const handleDeleteRecipient = (index: number) => {
    const updated = recipients.filter((_, i) => i !== index);
    setRecipients(updated);
    localStorage.setItem('recipients', JSON.stringify(updated));
  };

  // 宛名を選択
  const handleSelectRecipient = (recipient: string) => {
    setFormData((prev) => ({
      ...prev,
      recipientName: recipient,
    }));
    setIsRecipientDropdownOpen(false);
  };

  // 但し書きを追加
  const handleAddDescription = () => {
    if (!newDescription.trim()) {
      alert('但し書きを入力してください');
      return;
    }
  
    const updated = [...descriptions, newDescription.trim()];
    setDescriptions(updated);
    localStorage.setItem('descriptions', JSON.stringify(updated));
    setNewDescription('');
  };

  // 但し書きを削除
  const handleDeleteDescription = (index: number) => {
    const updated = descriptions.filter((_, i) => i !== index);
    setDescriptions(updated);
    localStorage.setItem('descriptions', JSON.stringify(updated));
  };

  // 但し書きを選択
  const handleSelectDescription = (description: string) => {
    setFormData((prev) => ({
      ...prev,
      description: description,
    }));
    setIsDescriptionDropdownOpen(false);
  };

  // 外側クリックでドロップダウンを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // 宛名ドロップダウン
      if (!target.closest('.input-with-dropdown.recipient')) {
        setIsRecipientDropdownOpen(false);
      }
      
      // 但し書きドロップダウン
      if (!target.closest('.input-with-dropdown.description')) {
        setIsDescriptionDropdownOpen(false);
      }
    };

    if (isRecipientDropdownOpen || isDescriptionDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isRecipientDropdownOpen, isDescriptionDropdownOpen]);

  // 金額を数値に変換
  const amountNumber = parseFloat(formData.amount) || 0;

  // 領収書番号を生成
  const receiptNumber = generateReceiptNumber(formData.issueDate);

  return (
    <div className="app-container">
      <h1>領収書作成アプリ</h1>
      <div className="main-layout">

        {/* 左側：入力フォーム */}
        <div className="input-section">
          <div className="form-group">
            <label>宛名</label>
            <div className="input-with-dropdown recipient">
              <input 
                type="text" 
                name="recipientName"
                value={formData.recipientName}
                onChange={handleInputChange}
                placeholder="宛名を入力"
              />
              <button
                type="button"
                className="dropdown-toggle"
                onClick={() => setIsRecipientDropdownOpen(!isRecipientDropdownOpen)}
              >
                ▼
              </button>
              
              {/* ドロップダウンメニュー */}
              {isRecipientDropdownOpen && recipients.length > 0 && (
                <div className="dropdown-menu">
                  {recipients.map((recipient, index) => (
                    <div
                      key={index}
                      className="dropdown-item"
                      onClick={() => handleSelectRecipient(recipient)}
                    >
                      {recipient}
                    </div>
                  ))}
                </div>
              )}
            </div>  {/* input-with-dropdown の閉じタグ */}
          </div>  {/* form-group の閉じタグ */}

          <div className="form-group">
            <label>発行日</label>
            <input 
              type="date"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleInputChange}
              onClick={handleDateClick}  // ← この1行を追加
            />
          </div>

          <div className="form-group">
            <label>金額（円）</label>
            <input 
              type="number" 
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="金額を入力"
            />
          </div>

          <div className="form-group">
            <label>但し書き</label>
            <div className="input-with-dropdown description">  {/* descriptionクラスを追加 */}
              <input 
                type="text" 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="お品代、講座代など"
              />
              <button
                type="button"
                className="dropdown-toggle"
                onClick={() => setIsDescriptionDropdownOpen(!isDescriptionDropdownOpen)}
              >
                ▼
              </button>
              
              {/* ドロップダウンメニュー */}
              {isDescriptionDropdownOpen && descriptions.length > 0 && (
                <div className="dropdown-menu">
                  {descriptions.map((description, index) => (
                    <div
                      key={index}
                      className="dropdown-item"
                      onClick={() => handleSelectDescription(description)}
                    >
                      {description}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>備考（任意）</label>
            <textarea 
              rows={5}
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="追加で表示したい情報があれば入力してください"
            />
          </div>

          {/* 備考のform-groupの下に追加 */}
          <div className="form-group">
            <button 
              type="button"
              onClick={handleGeneratePDF}
              className="btn-generate-pdf"
            >
              PDFをダウンロード
            </button>
          </div>

          {/* 宛名管理ボタンを追加 */}
          <div className="form-group">
            <button 
              type="button"
              onClick={() => setIsRecipientModalOpen(true)}
              className="btn-manage-recipients"
            >
              宛名を管理
            </button>
          </div>

          {/* 但し書き管理ボタンを追加 */}
          <div className="form-group">
            <button 
              type="button"
              onClick={() => setIsDescriptionModalOpen(true)}
              className="btn-manage-descriptions"
            >
              但し書きを管理
            </button>
          </div>
        </div>

        {/* 右側：プレビュー */}
        <div className="preview-section">
          <div className="receipt-preview">
            {/* 左上：Receipt */}
            <div className="receipt-corner-title">Receipt</div>
            <div className="receipt-corner-line"></div>

            {/* 右上：会社ロゴ */}
            <div className="company-logo">
              <img src="./logo.jpg" alt="ロゴ" />
            </div>

            {/* 中央：領収書タイトル */}
            <div className="receipt-main-title">
              <h1>領収書</h1>
            </div>

            {/* 宛名と右側情報の行 */}
            <div className="receipt-info-row">
              {/* 左側：宛名 */}
              <div className="recipient-section">
                <div className="recipient-line-wrapper">
                  <span className="recipient-name">
                    {formData.recipientName || '　'}
                  </span>
                  <span className="recipient-sama">様</span>
                </div>
              </div>

              {/* 右側：No.と発行日 */}
              <div className="receipt-metadata">
                <div className="metadata-row">
                  <span className="metadata-label">No.</span>
                  <span className="metadata-value">{receiptNumber}</span>
                </div>
                <div className="metadata-row">
                  <span className="metadata-label">発行日</span>
                  <span className="metadata-value">
                    {formatDateJapanese(formData.issueDate) || '　'}
                  </span>
                </div>
              </div>
            </div>

            {/* 金額ボックス */}
            <div className="amount-box">
              <span className="amount-yen">¥</span>
              <span className="amount-number">
                {amountNumber > 0 ? formatCurrency(amountNumber) : '0'}
              </span>
              <span className="amount-dash">-</span>
              <span className="amount-tax-label">(税込)</span>
            </div>

            {/* 但し書き */}
            <div className="description-section">
              <div className="description-wrapper">
                <div className="description-content">
                  <span className="description-label">但し</span>
                  <span className="description-text">
                    {formData.description || '　'}
                  </span>
                  <span className="description-suffix">として</span>
                </div>
                <div className="description-underline"></div>
              </div>
            </div>

            {/* デフォルト文言 */}
            <div className="note-text">
              上記正に領収いたしました。
            </div>

            {/* 備考（入力がある場合のみ表示） */}
            {formData.notes && (
              <div className="additional-notes">
                {formData.notes}
              </div>
            )}

            {/* 下部：会社情報と印鑑 */}
            <div className="footer-section">
              <div className="company-details">
                <div className="company-name">{COMPANY_INFO.name}</div>
                <div className="company-address">{COMPANY_INFO.postal}</div>
                <div className="company-address">{COMPANY_INFO.address}</div>
                <div className="company-phone">Tel: {COMPANY_INFO.tel}</div>
              </div>
              <div className="stamp-box">
                <img src="./stamp.jpg" alt="印" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 宛名管理モーダル */}
      {isRecipientModalOpen && (
        <div className="modal-overlay" onClick={() => setIsRecipientModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>宛名を管理</h2>
            
            {/* 追加フォーム */}
            <div className="modal-form">
              <input
                type="text"
                value={newRecipient}
                onChange={(e) => setNewRecipient(e.target.value)}
                placeholder="新しい宛名を入力"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleAddRecipient();
                }}
              />
              <button onClick={handleAddRecipient} className="btn-add">
                追加
              </button>
            </div>

            {/* 宛名一覧 */}
            <div className="recipient-list">
              {recipients.length === 0 ? (
                <p className="empty-message">登録された宛名はありません</p>
              ) : (
                recipients.map((recipient, index) => (
                  <div key={index} className="recipient-item">
                    <span className="recipient-name">{recipient}</span>
                    <button
                      onClick={() => handleDeleteRecipient(index)}
                      className="btn-delete"
                    >
                      削除
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* 閉じるボタン */}
            <button
              onClick={() => setIsRecipientModalOpen(false)}
              className="btn-close-modal"
            >
              閉じる
            </button>
          </div>
        </div>
      )}

      {/* 但し書き管理モーダル */}
      {isDescriptionModalOpen && (
        <div className="modal-overlay" onClick={() => setIsDescriptionModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>但し書きを管理</h2>
            
            {/* 追加フォーム */}
            <div className="modal-form">
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="新しい但し書きを入力"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleAddDescription();
                }}
              />
              <button onClick={handleAddDescription} className="btn-add">
                追加
              </button>
            </div>

            {/* 但し書き一覧 */}
            <div className="recipient-list">
              {descriptions.length === 0 ? (
                <p className="empty-message">登録された但し書きはありません</p>
              ) : (
                descriptions.map((description, index) => (
                  <div key={index} className="recipient-item">
                    <span className="recipient-name">{description}</span>
                    <button
                      onClick={() => handleDeleteDescription(index)}
                      className="btn-delete"
                    >
                      削除
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* 閉じるボタン
            <button
              onClick={() => setIsDescriptionModalOpen(false)}
              className="btn-close-modal"
            >
              閉じる
            </button>
          </div>
        </div>




      {showToast && (
        <div className="toast">
          ✓ PDFをダウンロードしました！
        </div>
      )}





      )}
    </div>
  ); */}



          {/* 閉じるボタン */}
          <button
            onClick={() => setIsDescriptionModalOpen(false)}
            className="btn-close-modal"
          >
            閉じる
          </button>
        </div>
      </div>
    )}

    {/* トースト通知 */}
    {showToast && (
      <div className="toast">
        ✓ PDFをダウンロードしました！
      </div>
    )}

  </div>
);



}

export default App;