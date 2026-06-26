import React, { useState } from 'react';
import { MODULES_DATA } from '../mockData';

export default function ProfileScreen({ 
  isEnrolled, 
  studentInfo, 
  moduleProgress, 
  onResetAccount, 
  showToast 
}) {
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [notificationsActive, setNotificationsActive] = useState(true);
  const [activeCertificate, setActiveCertificate] = useState(null);

  // Statistics calculation
  const totalModules = 10;
  const completedModules = isEnrolled 
    ? Object.values(moduleProgress).filter(p => p.percent === 100).length 
    : 0;

  const quizzesAnswered = isEnrolled 
    ? Object.values(moduleProgress).filter(p => p.quizScore !== null).length 
    : 0;

  const totalScorePoints = isEnrolled 
    ? Object.values(moduleProgress)
        .filter(p => p.quizScore !== null)
        .reduce((sum, p) => sum + p.quizScore, 0)
    : 0;

  const averageScore = quizzesAnswered > 0 
    ? Math.round(((totalScorePoints) / (quizzesAnswered * 10)) * 100) 
    : 0;

  // List of approved modules (for certificate menu)
  const approvedModules = isEnrolled 
    ? MODULES_DATA.filter(m => {
        const prog = moduleProgress[m.id];
        return prog && prog.quizScore !== null && prog.quizScore >= 7;
      })
    : [];

  const toggleNotifications = () => {
    setNotificationsActive(!notificationsActive);
    showToast(
      notificationsActive ? "Notificações desativadas!" : "Notificações ativadas! Você receberá avisos do Charles.", 
      "info"
    );
  };

  return (
    <div className="profile-container">
      {/* Header Info */}
      <div className="profile-card">
        <img className="profile-avatar-big" src={studentInfo.avatar} alt={studentInfo.name} />
        <h3 className="profile-name">{studentInfo.name}</h3>
        <p className="profile-email">{studentInfo.email}</p>
        
        <span className={`profile-status-pill ${isEnrolled ? 'active' : 'pending'}`}>
          {isEnrolled ? "✓ Plano Ativo (Vitalício)" : "⏳ Matrícula Pendente"}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-value">{completedModules}/{totalModules}</div>
          <div className="stat-label">Módulos Concluídos</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{quizzesAnswered}</div>
          <div className="stat-label">Quizzes Feitos</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{averageScore}%</div>
          <div className="stat-label">Média de Acertos</div>
        </div>
      </div>

      {/* Profile menu */}
      <div className="profile-menu">
        <button className="menu-item" onClick={() => {
          if (approvedModules.length === 0) {
            showToast("Você ainda não gerou nenhum certificado. Alcance 70% ou mais no quiz de um módulo!", "error");
          } else {
            showToast(`Você possui ${approvedModules.length} certificado(s) liberado(s)! Veja abaixo na lista.`, "success");
          }
        }}>
          <div className="menu-item-left">
            <span>🏆</span>
            <span>Meus Certificados ({approvedModules.length})</span>
          </div>
          <span className="menu-item-chevron">➔</span>
        </button>

        <button className="menu-item" onClick={() => {
          if (!isEnrolled) {
            showToast("Acesse a aba Matrícula para liberar os materiais!", "error");
            return;
          }
          const readPdfsCount = Object.values(moduleProgress).filter(p => p.pdfRead).length;
          showToast(`Você baixou ${readPdfsCount} de 10 apostilas em PDF do curso.`, "success");
        }}>
          <div className="menu-item-left">
            <span>📚</span>
            <span>Apostilas & PDFs baixados</span>
          </div>
          <span className="menu-item-chevron">➔</span>
        </button>

        <button className="menu-item" onClick={toggleNotifications}>
          <div className="menu-item-left">
            <span>🔔</span>
            <span>Notificações PWA</span>
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: notificationsActive ? 'var(--success)' : 'var(--text-light)' }}>
            {notificationsActive ? "ATIVADO" : "DESATIVADO"}
          </span>
        </button>

        <button className="menu-item" onClick={() => setShowSupportModal(true)}>
          <div className="menu-item-left">
            <span>💬</span>
            <span>Falar com o Suporte Técnico</span>
          </div>
          <span className="menu-item-chevron">➔</span>
        </button>
      </div>

      {/* Certificates List Accordion (if approved) */}
      {approvedModules.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontFamily: 'var(--font-title)', fontSize: '1rem', color: 'var(--blue-deep)', marginBottom: '10px' }}>
            Certificados Prontos para Impressão:
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {approvedModules.map(m => (
              <div 
                key={m.id}
                onClick={() => setActiveCertificate(m)}
                style={{ 
                  background: 'white', 
                  border: '1px solid #D4AF37', 
                  borderRadius: '10px', 
                  padding: '12px 14px', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ flex: 1 }}>
                  🎓 Módulo {m.number}: {m.title.split(':')[0]}
                </div>
                <div style={{ color: '#D4AF37' }}>Visualizar ➔</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Account Reset / Simulator tools */}
      <div style={{ marginTop: '20px' }}>
        <button 
          className="quiz-reset-btn" 
          onClick={() => {
            onResetAccount();
            showToast("Conta resetada com sucesso para testes!", "success");
          }}
          style={{ 
            color: 'var(--error)', 
            borderColor: 'rgba(239, 68, 68, 0.4)', 
            background: 'rgba(239, 68, 68, 0.02)',
            fontSize: '0.8rem',
            padding: '10px'
          }}
        >
          🔄 Resetar Conta (Testar Fluxo de Bloqueio/Pagamento)
        </button>
      </div>

      {/* Support Modal dialog */}
      {showSupportModal && (
        <div className="bottom-sheet-overlay" onClick={() => setShowSupportModal(false)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center' }}>
            <div className="bottom-sheet-handle"></div>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📞</div>
            <h3 className="bottom-sheet-title">Suporte Técnico</h3>
            <p className="bottom-sheet-subtitle" style={{ maxWidth: '300px', margin: '0 auto 20px auto' }}>
              Precisa de ajuda com o PWA, pagamentos ou emissão de certificados? Fale com a equipe do Charles Aquino.
            </p>
            
            <button 
              className="checkout-btn" 
              onClick={() => {
                window.open("https://wa.me/5599999999999", "_blank");
                setShowSupportModal(false);
              }}
              style={{ background: '#25D366', boxShadow: 'none', marginBottom: '10px' }}
            >
              💬 Iniciar Chat no WhatsApp
            </button>
            
            <button className="sheet-close-btn" onClick={() => setShowSupportModal(false)}>Voltar</button>
          </div>
        </div>
      )}

      {/* Certificate Viewer Overlay */}
      {activeCertificate && (
        <div className="certificate-modal-overlay">
          <div className="certificate-card">
            <div className="cert-seal">🎖️</div>
            <h2 className="cert-header">Certificado de Conclusão</h2>
            <div className="cert-subtitle">Atendimento Pré-Hospitalar (APH)</div>
            
            <p className="cert-presentation">Certificamos para os devidos fins de direito que o aluno(a)</p>
            <h1 className="cert-recipient">{studentInfo.name}</h1>
            <p className="cert-text">
              concluiu com êxito os testes acadêmicos e práticos referentes ao <strong>Módulo {activeCertificate.number}: {activeCertificate.title}</strong>, sob instrução teórica de Charles Aquino, obtendo nota final de <strong>{Math.round(((moduleProgress[activeCertificate.id]?.quizScore || 10) / 10) * 100)}%</strong> e carga horária equivalente a <strong>20 horas</strong> letivas de APH.
            </p>

            <div className="cert-signatures">
              <div className="cert-sig-line">
                <div className="cert-sig-name">Charles Aquino</div>
                <span>Instrutor Técnico</span>
              </div>
              <div className="cert-sig-line">
                <div className="cert-sig-name" style={{ fontFamily: 'monospace' }}>#CA-{activeCertificate.id}-{studentInfo.name.length}</div>
                <span>Código de Autenticidade</span>
              </div>
            </div>

            <div className="cert-footer-info">
              Emitido em {new Date().toLocaleDateString('pt-BR')} • Charles Aquino APH Online.
            </div>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', width: '100%', maxWidth: '360px' }}>
            <button 
              className="cert-btn" 
              style={{ flex: 1 }}
              onClick={() => {
                window.print();
                showToast("Iniciando impressão do Certificado...", "success");
              }}
            >
              🖨️ Imprimir / Salvar PDF
            </button>
            <button 
              className="quiz-reset-btn" 
              style={{ width: '80px', background: '#EF4444', color: 'white', border: 'none' }}
              onClick={() => setActiveCertificate(null)}
            >
              Voltar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
