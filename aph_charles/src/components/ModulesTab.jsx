import React, { useState } from 'react';
import { MODULES_DATA } from '../mockData';

export default function ModulesTab({ 
  isEnrolled, 
  moduleProgress, 
  onStartQuiz, 
  onMarkVideoWatched, 
  onMarkPdfRead, 
  showToast 
}) {
  const [selectedModule, setSelectedModule] = useState(null);
  const [activeVideoModule, setActiveVideoModule] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  // Open action bottom sheet
  const handleModuleClick = (module) => {
    if (!isEnrolled) {
      showToast("Acesso bloqueado! Faça a matrícula para liberar os módulos.", "error");
      return;
    }
    setSelectedModule(module);
  };

  // Simulate PDF download
  const handleOpenPdf = (moduleId) => {
    onMarkPdfRead(moduleId);
    showToast(`PDF do Módulo ${moduleId} carregado com sucesso!`, "success");
    setSelectedModule(null);
  };

  // Open custom video player
  const handleOpenVideo = (module) => {
    setActiveVideoModule(module);
    setIsVideoPlaying(true);
    setVideoProgress(0);
    setSelectedModule(null);
    
    // Simulate video playing timeline and AI notification
    let currentPct = 0;
    const interval = setInterval(() => {
      currentPct += 5;
      setVideoProgress(currentPct);
      if (currentPct >= 100) {
        clearInterval(interval);
        onMarkVideoWatched(module.id);
      }
    }, 300);
  };

  const closeVideoPlayer = () => {
    setIsVideoPlaying(false);
    setActiveVideoModule(null);
  };

  return (
    <div className="modules-container">
      <div className="section-title">
        <span>Módulos do Curso</span>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          {isEnrolled ? "Curso Liberado" : "Acesso Restrito"}
        </span>
      </div>

      {!isEnrolled && (
        <div style={{
          background: 'rgba(244, 123, 32, 0.08)',
          border: '1px dashed var(--primary)',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '20px',
          textAlign: 'center',
          fontSize: '0.85rem',
          lineHeight: '1.4',
          color: 'var(--blue-deep)'
        }}>
          🔒 <strong>Área Restrita:</strong> Todos os 10 módulos estão bloqueados. Acesse a aba <strong>Matrícula</strong> para ativar sua conta.
        </div>
      )}

      {MODULES_DATA.map((module) => {
        const prog = moduleProgress[module.id] || { pdfRead: false, videoWatched: false, quizScore: null, percent: 0 };
        const isCompleted = prog.percent === 100;
        
        return (
          <div 
            key={module.id} 
            className={`module-item ${isEnrolled ? 'unlocked' : 'locked'}`}
            onClick={() => handleModuleClick(module)}
          >
            {/* Number Indicator */}
            <div className="module-number">
              {module.number}
            </div>

            {/* Info */}
            <div className="module-info">
              <div className="module-title-row">
                <span className="module-item-title">{module.title}</span>
              </div>
              <p className="module-item-subtitle">{module.subtitle}</p>
              
              {/* Media Availability Indicators */}
              <div className="module-indicators">
                <span className={`indicator-icon ${prog.pdfRead ? 'active' : ''}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  PDF
                </span>
                <span className={`indicator-icon ${prog.videoWatched ? 'active' : ''}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                  Vídeo IA
                </span>
                <span className={`indicator-icon ${prog.quizScore !== null ? 'active' : ''}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                  Quiz
                </span>
              </div>

              {/* Progress Bar (Visible only when Enrolled) */}
              {isEnrolled && (
                <div className="module-progress-bar">
                  <div className="module-progress-fill" style={{ width: `${prog.percent}%` }}></div>
                </div>
              )}
            </div>

            {/* Lock/Unlock Badge */}
            <div className="module-status">
              {!isEnrolled ? (
                <div className="status-badge locked">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
              ) : isCompleted ? (
                <div className="status-badge unlocked">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
              ) : (
                <div className="status-badge" style={{ background: 'rgba(244,123,32,0.1)', color: 'var(--primary)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Unlocked Module Bottom Sheet Actions */}
      {selectedModule && (
        <div className="bottom-sheet-overlay" onClick={() => setSelectedModule(null)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="bottom-sheet-handle"></div>
            <h3 className="bottom-sheet-title">Módulo {selectedModule.number}</h3>
            <p className="bottom-sheet-subtitle">{selectedModule.title}</p>
            
            <div className="sheet-options">
              <button className="sheet-btn" onClick={() => handleOpenPdf(selectedModule.id)}>
                <div className="sheet-btn-icon pdf">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div className="sheet-btn-info">
                  <span className="sheet-btn-title">Abrir PDF do Módulo</span>
                  <span className="sheet-btn-desc">Material de leitura completo, diretrizes e apostilas.</span>
                </div>
                <span className="sheet-btn-chevron">→</span>
              </button>

              <button className="sheet-btn" onClick={() => handleOpenVideo(selectedModule)}>
                <div className="sheet-btn-icon video">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                </div>
                <div className="sheet-btn-info">
                  <span className="sheet-btn-title">Assistir Análise da IA</span>
                  <span className="sheet-btn-desc">Vídeo-análise comentada por Charles Aquino com suporte de IA.</span>
                </div>
                <span className="sheet-btn-chevron">→</span>
              </button>

              <button className="sheet-btn" onClick={() => { onStartQuiz(selectedModule); setSelectedModule(null); }}>
                <div className="sheet-btn-icon quiz">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                </div>
                <div className="sheet-btn-info">
                  <span className="sheet-btn-title">Responder o Quiz</span>
                  <span className="sheet-btn-desc">10 perguntas objetivas para fixar o aprendizado e liberar o certificado.</span>
                </div>
                <span className="sheet-btn-chevron">→</span>
              </button>
            </div>

            <button className="sheet-close-btn" onClick={() => setSelectedModule(null)}>Fechar</button>
          </div>
        </div>
      )}

      {/* Premium Video Player Modal */}
      {isVideoPlaying && activeVideoModule && (
        <div className="video-overlay">
          <div className="video-modal-header">
            <div className="video-modal-title">
              <h3>{activeVideoModule.videoTitle}</h3>
              <p>Módulo {activeVideoModule.number} • Análise Assistida por IA</p>
            </div>
            <button className="video-close-btn" onClick={closeVideoPlayer}>✕</button>
          </div>

          <div className="video-wrapper">
            {/* Simulated Video Element */}
            <video className="video-player-element" src={activeVideoModule.videoUrl} autoPlay muted loop />
            
            {/* Custom Controls */}
            <div className="video-custom-controls">
              <div className="video-timeline" onClick={(e) => {
                const rect = e.target.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const pct = (clickX / rect.width) * 100;
                setVideoProgress(pct);
              }}>
                <div className="video-timeline-fill" style={{ width: `${videoProgress}%` }}></div>
              </div>
              <div className="video-controls-row">
                <button className="video-btn-play">
                  {videoProgress >= 100 ? (
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                  )}
                </button>
                <div className="video-time">
                  {Math.floor((videoProgress / 100) * 12)}s / 12s
                </div>
                <div className="video-ai-tag">
                  ⚡ Análise da IA Ativa
                </div>
              </div>
            </div>
          </div>

          {/* AI Feedbacks box */}
          <div className="video-ai-overlay-box">
            <div className="video-ai-header">
              <span>🤖</span> Análise Preditiva da Inteligência Artificial
            </div>
            <p className="video-ai-content">
              {videoProgress < 30 ? (
                "Inicializando modelo de análise na cena do ocorrido... Mapeando vias de acesso físicas e checando integridade estrutural do cenário."
              ) : videoProgress < 60 ? (
                "Análise Corporal detectada: O socorrista executa Jaw Thrust correto para manter alinhamento neutro e desobstruir vias aéreas. Nível de segurança verificado: Verde."
              ) : videoProgress < 95 ? (
                "Detecção Biomecânica: O posicionamento de ombros e angulação da massagem RCP cumprem as diretrizes do PHTLS (5cm de compressão e retorno torácico total)."
              ) : (
                "Análise concluída com sucesso! Todos os checkpoints de atendimento foram validados por Charles Aquino. Módulo marcado como assistido!"
              )}
            </p>
          </div>
          
          <button 
            className="sheet-close-btn" 
            style={{ marginTop: '24px', background: 'var(--primary)', color: 'white' }} 
            onClick={closeVideoPlayer}
          >
            {videoProgress >= 100 ? "Concluir e Voltar" : "Fechar Player"}
          </button>
        </div>
      )}
    </div>
  );
}
