import React, { useState } from 'react';

export default function EnrollTab({ isEnrolled, onEnrollComplete, showToast }) {
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(1); // 1: loader, 2: success

  // Credit Card Form States
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardInstallments, setCardInstallments] = useState('1');

  const handleCopyPixKey = () => {
    navigator.clipboard.writeText("098.765.432-10");
    showToast("Chave PIX copiada para a área de transferência!", "success");
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    if (isEnrolled) {
      showToast("Você já possui acesso a este curso!", "info");
      return;
    }

    if (paymentMethod === 'card') {
      if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
        showToast("Por favor, preencha todos os campos do cartão!", "error");
        return;
      }
    }

    // Trigger loading flow
    setIsProcessing(true);
    setProcessingStep(1);

    // After 2 seconds, show success badge
    setTimeout(() => {
      setProcessingStep(2);
      
      // After 1.5 more seconds, complete enrollment and unlock
      setTimeout(() => {
        setIsProcessing(false);
        onEnrollComplete();
        showToast("Parabéns! Sua matrícula foi ativada com sucesso.", "success");
      }, 1500);

    }, 2000);
  };

  return (
    <div className="enroll-container">
      {/* Hero Banner */}
      <div className="enroll-hero">
        <span className="enroll-tag">Acesso Vitalício</span>
        <h2 className="enroll-course-name">Curso APH Premium</h2>
        <p className="enroll-course-desc">
          Domine o Atendimento Pré-Hospitalar do básico ao avançado com metodologia reconhecida internacionalmente.
        </p>
        
        <div className="enroll-pricing">
          <div className="enroll-price-old">De R$ 497,00 por apenas</div>
          <div className="enroll-price-new">
            <span style={{ fontSize: '1rem', fontWeight: 700 }}>12x de</span>
            <span>R$ 29,70</span>
          </div>
          <div className="enroll-price-period">ou R$ 297,00 à vista no PIX</div>
        </div>
      </div>

      {/* Benefits checklist */}
      <div className="benefits-card">
        <h3 className="benefits-title">O que você vai receber:</h3>
        <div className="benefits-list">
          <div className="benefit-item">
            <span className="benefit-icon">✓</span>
            <span><strong>10 Módulos Completos:</strong> Apostilas em PDF exclusivas escritas por Charles Aquino.</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">✓</span>
            <span><strong>10 Vídeo-Análises com IA:</strong> Estudo de casos clínicos mapeados por algoritmo de robótica médica.</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">✓</span>
            <span><strong>100 Questões de Quiz:</strong> Avaliação contínua para testar seus limites técnicos.</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">✓</span>
            <span><strong>Certificados Individuais:</strong> Um certificado em PDF para cada módulo concluído.</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">✓</span>
            <span><strong>Mural da Turma:</strong> Compartilhe suas fotos práticas e receba feedback de Charles Aquino.</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">✓</span>
            <span><strong>Mentoria e Feed:</strong> Acesso direto às atualizações e dicas quentes semanais.</span>
          </div>
        </div>
      </div>

      {/* Payment methods selectors */}
      <div className="payment-card">
        <h3 className="benefits-title" style={{ marginBottom: '6px' }}>Escolha a forma de pagamento:</h3>
        
        <div className="payment-methods-tabs">
          <button 
            type="button"
            className={`payment-tab ${paymentMethod === 'pix' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('pix')}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M21 12H12m0 0v9m0-9V3m0 9h9"/></svg>
            PIX
          </button>
          
          <button 
            type="button"
            className={`payment-tab ${paymentMethod === 'card' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('card')}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            Cartão
          </button>
          
          <button 
            type="button"
            className={`payment-tab ${paymentMethod === 'boleto' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('boleto')}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="3" y2="18"/><line x1="7" y1="6" x2="7" y2="18"/><line x1="11" y1="6" x2="11" y2="18"/><line x1="13" y1="6" x2="13" y2="18"/><line x1="17" y1="6" x2="17" y2="18"/><line x1="21" y1="6" x2="21" y2="18"/></svg>
            Boleto
          </button>
        </div>

        {/* Dynamic Payment Panels */}
        {paymentMethod === 'pix' && (
          <div className="pix-panel">
            <div className="pix-qr-container">
              {/* Simulated QR Code using SVG */}
              <svg viewBox="0 0 100 100" width="100%" height="100%">
                <rect x="0" y="0" width="100" height="100" fill="none" />
                <rect x="5" y="5" width="25" height="25" fill="#1A3A5C" />
                <rect x="10" y="10" width="15" height="15" fill="white" />
                <rect x="70" y="5" width="25" height="25" fill="#1A3A5C" />
                <rect x="75" y="10" width="15" height="15" fill="white" />
                <rect x="5" y="70" width="25" height="25" fill="#1A3A5C" />
                <rect x="10" y="75" width="15" height="15" fill="white" />
                
                {/* Random QR pixels */}
                <rect x="40" y="10" width="5" height="20" fill="#F47B20" />
                <rect x="50" y="5" width="10" height="10" fill="#1A3A5C" />
                <rect x="40" y="40" width="20" height="20" fill="#1A3A5C" />
                <rect x="70" y="40" width="10" height="5" fill="#F47B20" />
                <rect x="80" y="50" width="15" height="15" fill="#1A3A5C" />
                <rect x="40" y="75" width="15" height="10" fill="#F47B20" />
                <rect x="60" y="80" width="25" height="10" fill="#1A3A5C" />
              </svg>
            </div>
            <p className="pix-instructions">
              Escaneie o código QR acima ou copie a chave copia e cola abaixo para efetuar o pagamento instantâneo.
            </p>
            <button type="button" className="pix-copy-btn" onClick={handleCopyPixKey}>
              📋 Copiar Código PIX
            </button>
          </div>
        )}

        {paymentMethod === 'card' && (
          <div className="card-panel">
            <input 
              type="text" 
              className="card-input" 
              placeholder="Número do Cartão (0000 0000 0000 0000)"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
              required
            />
            <input 
              type="text" 
              className="card-input" 
              placeholder="Nome Impresso no Cartão"
              value={cardName}
              onChange={(e) => setCardName(e.target.value.toUpperCase())}
              required
            />
            <div className="card-input-row">
              <input 
                type="text" 
                className="card-input" 
                placeholder="Validade (MM/AA)"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value.slice(0, 5))}
                required
              />
              <input 
                type="password" 
                className="card-input" 
                placeholder="CVV"
                value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                required
              />
            </div>
            <select 
              className="form-select"
              value={cardInstallments}
              onChange={(e) => setCardInstallments(e.target.value)}
              style={{ fontSize: '0.8rem', padding: '12px' }}
            >
              <option value="1">1x de R$ 297,00 (sem juros)</option>
              <option value="3">3x de R$ 99,00 (sem juros)</option>
              <option value="6">6x de R$ 49,50 (sem juros)</option>
              <option value="12">12x de R$ 29,70 (com juros)</option>
            </select>
          </div>
        )}

        {paymentMethod === 'boleto' && (
          <div className="boleto-panel">
            <div className="boleto-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 18h16V6H4v12zM8 6v12M12 6v12M16 6v12"/>
              </svg>
            </div>
            <p className="pix-instructions">
              O boleto bancário será gerado e enviado para o seu e-mail. A compensação bancária ocorre em até 2 dias úteis.
            </p>
          </div>
        )}

        <div style={{ marginTop: '24px' }}>
          {isEnrolled ? (
            <button 
              type="button" 
              className="checkout-btn" 
              disabled 
              style={{ background: 'var(--success)', cursor: 'default', boxShadow: 'none' }}
            >
              ✓ Matrícula Ativada
            </button>
          ) : (
            <button type="button" className="checkout-btn" onClick={handleCheckout}>
              ⚡ Garantir Meu Acesso
            </button>
          )}
        </div>
      </div>

      {/* Simulated Payment Gateway Processing Loader */}
      {isProcessing && (
        <div className="payment-processing-overlay">
          {processingStep === 1 ? (
            <>
              <div className="pulse-loader">
                {/* Ambulance / Health Cross icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
              </div>
              <h3 style={{ fontFamily: 'var(--font-title)', fontWeight: 900, fontSize: '1.4rem' }}>Processando Transação...</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '8px', maxWidth: '240px' }}>
                Conectando ao gateway de pagamento seguro de Charles Aquino APH. Não feche este aplicativo.
              </p>
            </>
          ) : (
            <>
              <div className="payment-success-badge">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h3 style={{ fontFamily: 'var(--font-title)', fontWeight: 900, fontSize: '1.4rem', color: 'var(--success)' }}>Pagamento Confirmado!</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '8px', maxWidth: '240px' }}>
                Seu acesso vitalício foi liberado. Redirecionando para a sala de aula...
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
