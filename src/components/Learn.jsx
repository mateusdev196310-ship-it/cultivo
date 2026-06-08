import React, { useState } from 'react';
import { 
  Sprout, Sun, Trash2, ChevronLeft, ChevronRight, 
  Check, X, BookOpen, Lightbulb, Heart, ArrowRight, Trophy
} from 'lucide-react';
import { germinationStages, photosynthesisPhases, compostingInfo } from '../data/mockData';
import Quiz from './Quiz';
import { getClassFeedback, submitClassFeedback } from '../db';

export default function Learn({ user, onUpdateUserPoints, onGoToRanking }) {
  const [activeModule, setActiveModule] = useState(null); // 'germination' | 'photosynthesis' | 'composting' | 'quiz' | null
  const [currentGerminationStep, setCurrentGerminationStep] = useState(0);
  const [photosynthesisTab, setPhotosynthesisTab] = useState('clara'); // 'clara' | 'escura'
  const [compostingTab, setCompostingTab] = useState('info'); // 'info' | 'steps' | 'dosdonts'
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
  
  const [studentVote, setStudentVote] = useState(() => {
    if (!user || user.isAdmin) return null;
    const list = getClassFeedback();
    const cleanEmail = user.email.trim().toLowerCase();
    const found = list.find(f => f.email === cleanEmail);
    return found ? found.vote : null;
  });

  return (
    <div className="learn-container">
      {activeModule === null ? (
        <div className="learn-dashboard">
          <div className="welcome-banner">
            <span className="badge">Módulos Educativos</span>
            <h2>O que vamos cultivar hoje?</h2>
            <p>Escolha um assunto abaixo para aprender de forma rápida e divertida com ilustrações e dicas interativas.</p>
          </div>

          {/* Enquete de Feedback da Aula */}
          {user && !user.isAdmin && !studentVote && (
            <div className="card-nature feedback-student-poll animate-fade-in" style={{
              padding: '16px 20px',
              marginBottom: '20px',
              borderLeft: '4px solid var(--primary)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>
                💬 Vocês gostaram da aula de hoje?
              </h3>
              <div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Escolha um emoji abaixo para enviar sua reação. Você ganha <strong>+10 XP</strong> no ranking!
                </p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {[
                    { emoji: '😍', label: 'Adorei!' },
                    { emoji: '🙂', label: 'Gostei' },
                    { emoji: '😐', label: 'Regular' },
                    { emoji: '😢', label: 'Não gostei' }
                  ].map((opt) => (
                    <button
                      key={opt.emoji}
                      onClick={() => {
                        submitClassFeedback(user.email, user.name, opt.emoji);
                        setStudentVote(opt.emoji);
                        if (onUpdateUserPoints) {
                          onUpdateUserPoints(10);
                        }
                      }}
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '8px',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        minWidth: '70px'
                      }}
                      className="feedback-emoji-btn"
                    >
                      <span style={{ fontSize: '24px' }}>{opt.emoji}</span>
                      <span style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="modules-grid">
            {/* Card 1: Germinação */}
            <div 
              className="module-card card-germination"
              onClick={() => {
                setActiveModule('germination');
                setCurrentGerminationStep(0);
              }}
            >
              <div className="module-icon-wrapper">
                <Sprout size={32} />
              </div>
              <div className="module-content">
                <h3>Da Semente ao Broto</h3>
                <p>Descubra as 7 subetapas fascinantes da germinação e como a vida começa.</p>
                <span className="module-action">Começar Jornada <ArrowRight size={14} /></span>
              </div>
            </div>

            {/* Card 2: Fotossíntese */}
            <div 
              className="module-card card-photosynthesis"
              onClick={() => {
                setActiveModule('photosynthesis');
                setPhotosynthesisTab('clara');
              }}
            >
              <div className="module-icon-wrapper">
                <Sun size={32} />
              </div>
              <div className="module-content">
                <h3>A Magia da Fotossíntese</h3>
                <p>Entenda como as plantas transformam luz do sol em energia nas fases clara e escura.</p>
                <span className="module-action">Ver a Mágica <ArrowRight size={14} /></span>
              </div>
            </div>

            {/* Card 3: Compostagem */}
            <div 
              className="module-card card-composting"
              onClick={() => {
                setActiveModule('composting');
                setCompostingTab('info');
              }}
            >
              <div className="module-icon-wrapper">
                <Trash2 size={32} />
              </div>
              <div className="module-content">
                <h3>Reciclagem da Natureza</h3>
                <p>Aprenda a fazer compostagem passo a passo e o que pode ir ou não na composteira.</p>
                <span className="module-action">Aprender a Reciclar <ArrowRight size={14} /></span>
              </div>
            </div>

            {/* Card 4: Quiz Ecológico */}
            <div 
              className="module-card card-quiz animate-fade-in"
              onClick={() => {
                setActiveModule('quiz');
              }}
            >
              <div className="module-icon-wrapper">
                <Trophy size={32} />
              </div>
              <div className="module-content">
                <h3>Desafio EcoQuiz 🏆</h3>
                <p>Teste seus conhecimentos ecológicos e acumule pontos para subir no Ranking!</p>
                <span className="module-action text-yellow">Jogar Agora <ArrowRight size={14} /></span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="module-details animate-slide-up">
          <button className="btn-back" onClick={() => setActiveModule(null)}>
            <ChevronLeft size={16} /> Voltar aos Módulos
          </button>

          {/* DETALHES DO MÓDULO: GERMINAÇÃO */}
          {activeModule === 'germination' && (
            <div className="module-body germination-module">
              <div className="module-title-section">
                <span className="icon-badge badge-green"><Sprout size={20} /></span>
                <h2>Germinação da Semente</h2>
                <p className="subtitle">Conheça o processo de 7 etapas da semente ao algodão ou terra!</p>
              </div>

              {/* Visualizador de etapas */}
              <div className="step-carousel">
                <div className="step-indicator-bar">
                  {germinationStages.map((stage, idx) => (
                    <button 
                      key={stage.id} 
                      className={`step-dot ${idx === currentGerminationStep ? 'active' : ''} ${idx < currentGerminationStep ? 'completed' : ''}`}
                      onClick={() => setCurrentGerminationStep(idx)}
                      title={stage.title}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                <div className="carousel-card card-nature">
                  <div className="card-header">
                    <span className="step-tag">Etapa {currentGerminationStep + 1} de 7</span>
                    <span className="duration-tag">{germinationStages[currentGerminationStep].duration}</span>
                  </div>

                  {germinationStages[currentGerminationStep].imageUrl && (
                    <div className="edu-image-container">
                      <img 
                        src={germinationStages[currentGerminationStep].imageUrl} 
                        alt={germinationStages[currentGerminationStep].title} 
                        className="edu-image"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  <h3 className="step-title">{germinationStages[currentGerminationStep].title}</h3>
                  <p className="step-description">{germinationStages[currentGerminationStep].description}</p>

                  <div className="tip-box">
                    <div className="tip-header">
                      <Lightbulb size={16} className="tip-icon" />
                      <h4>Dica de Cultivo</h4>
                    </div>
                    <p>{germinationStages[currentGerminationStep].tip}</p>
                  </div>
                </div>

                <div className="carousel-controls">
                  <button 
                    className="btn btn-secondary btn-circle"
                    onClick={() => setCurrentGerminationStep(prev => Math.max(0, prev - 1))}
                    disabled={currentGerminationStep === 0}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="step-count">{currentGerminationStep + 1} / 7</span>
                  <button 
                    className="btn btn-secondary btn-circle"
                    onClick={() => setCurrentGerminationStep(prev => Math.min(germinationStages.length - 1, prev + 1))}
                    disabled={currentGerminationStep === germinationStages.length - 1}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* DETALHES DO MÓDULO: FOTOSSÍNTESE */}
          {activeModule === 'photosynthesis' && (
            <div className="module-body photosynthesis-module">
              <div className="module-title-section">
                <span className="icon-badge badge-yellow"><Sun size={20} /></span>
                <h2>A Magia da Fotossíntese</h2>
                <p className="subtitle">Como as plantas fabricam seu próprio alimento e purificam o ar!</p>
              </div>

              {/* Abas Clara vs Escura */}
              <div className="tab-buttons">
                <button 
                  className={`tab-btn ${photosynthesisTab === 'clara' ? 'active' : ''}`}
                  onClick={() => {
                    setPhotosynthesisTab('clara');
                    setCurrentPhotoIdx(0);
                  }}
                >
                  Fase Clara <span className="tab-sub text-yellow">Fase de Luz</span>
                </button>
                <button 
                  className={`tab-btn ${photosynthesisTab === 'escura' ? 'active' : ''}`}
                  onClick={() => {
                    setPhotosynthesisTab('escura');
                    setCurrentPhotoIdx(0);
                  }}
                >
                  Fase Escura <span className="tab-sub text-brown">Ciclo de Calvin</span>
                </button>
              </div>

              {/* Conteúdo da Aba */}
              {photosynthesisPhases.map((phase) => {
                if (phase.id !== photosynthesisTab) return null;
                return (
                  <div key={phase.id} className="phase-card card-nature animate-fade-in">
                    <div className="card-header">
                      <span className="stage-tag">{phase.location}</span>
                    </div>
                    
                    {phase.imageUrl && (
                      <div className="edu-image-container">
                        <img 
                          src={phase.imageUrl} 
                          alt={phase.title} 
                          className="edu-image"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    {phase.imageUrls && phase.imageUrls.length > 0 && (
                      <div className="edu-carousel-container">
                        <div className="edu-image-container">
                          <img 
                            src={phase.imageUrls[currentPhotoIdx]} 
                            alt={`${phase.title} - Imagem ${currentPhotoIdx + 1}`} 
                            className="edu-image animate-fade-in"
                            key={currentPhotoIdx}
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="carousel-mini-controls">
                          <button 
                            className="btn-mini-circle"
                            onClick={() => setCurrentPhotoIdx(prev => (prev === 0 ? phase.imageUrls.length - 1 : prev - 1))}
                            title="Imagem Anterior"
                          >
                            <ChevronLeft size={16} />
                          </button>
                          <span className="mini-carousel-indicator">
                            {currentPhotoIdx + 1} de {phase.imageUrls.length}
                          </span>
                          <button 
                            className="btn-mini-circle"
                            onClick={() => setCurrentPhotoIdx(prev => (prev === phase.imageUrls.length - 1 ? 0 : prev + 1))}
                            title="Próxima Imagem"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      </div>
                    )}

                    <h3>{phase.title}</h3>
                    <h4 className="subtitle">{phase.subtitle}</h4>
                    <p>{phase.description}</p>
                    
                    <ul className="bullet-list">
                      {phase.bullets.map((bullet, i) => (
                        <li key={i}>{bullet}</li>
                      ))}
                    </ul>

                    <div className="summary-box">
                      <strong>Fórmula Simplificada:</strong>
                      <p>{phase.summary}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* DETALHES DO MÓDULO: COMPOSTAGEM */}
          {activeModule === 'composting' && (
            <div className="module-body composting-module">
              <div className="module-title-section">
                <span className="icon-badge badge-brown"><Trash2 size={20} /></span>
                <h2>Compostagem Orgânica</h2>
                <p className="subtitle">Reduza o lixo e crie o melhor alimento para as suas plantas!</p>
              </div>

              {/* Sub-abas de Compostagem */}
              <div className="sub-tabs">
                <button 
                  className={`sub-tab-btn ${compostingTab === 'info' ? 'active' : ''}`}
                  onClick={() => setCompostingTab('info')}
                >
                  O que é
                </button>
                <button 
                  className={`sub-tab-btn ${compostingTab === 'steps' ? 'active' : ''}`}
                  onClick={() => setCompostingTab('steps')}
                >
                  Passo a Passo
                </button>
                <button 
                  className={`sub-tab-btn ${compostingTab === 'dosdonts' ? 'active' : ''}`}
                  onClick={() => setCompostingTab('dosdonts')}
                >
                  O que pode ir?
                </button>
              </div>

              {/* Aba O que é / Benefícios / Curiosidades */}
              {compostingTab === 'info' && (
                <div className="composting-info animate-fade-in">
                  <div className="card-nature">
                    {compostingInfo.imageUrl && (
                      <div className="edu-image-container">
                        <img 
                          src={compostingInfo.imageUrl} 
                          alt="Compostagem" 
                          className="edu-image"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                    <h3>O que é Compostagem?</h3>
                    <p>{compostingInfo.description}</p>
                  </div>

                  <div className="info-section">
                    <h3>💡 Benefícios Incríveis</h3>
                    <div className="benefits-grid">
                      {compostingInfo.benefits.map((benefit, i) => (
                        <div key={i} className="benefit-card">
                          <Check size={18} className="text-green" />
                          <p>{benefit}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="info-section">
                    <h3>🌱 Curiosidades Curiosas</h3>
                    <div className="curiosities-list">
                      {compostingInfo.curiosities.map((curiosity, i) => (
                        <div key={i} className="curiosity-item">
                          <span className="curiosity-icon">✨</span>
                          <p>{curiosity}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Aba Passo a Passo */}
              {compostingTab === 'steps' && (
                <div className="composting-steps animate-fade-in">
                  <h3>Como Fazer em Casa (5 passos)</h3>
                  <div className="vertical-timeline">
                    {compostingInfo.steps.map((step) => (
                      <div key={step.step} className="timeline-node">
                        <div className="node-number">{step.step}</div>
                        <div className="node-content card-nature">
                          <h4>{step.title}</h4>
                          <p>{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Aba O que pode x O que não pode */}
              {compostingTab === 'dosdonts' && (
                <div className="composting-dosdonts animate-fade-in">
                  <h3>Alimentando a Composteira</h3>
                  <p className="subtitle-center">Para manter os microrganismos e minhocas felizes, selecione os resíduos certos!</p>
                  
                  <div className="dos-donts-grid">
                    {/* Pode ir */}
                    <div className="column-dos card-nature">
                      <div className="column-header text-green">
                        <Check size={24} />
                        <h4>Pode ir ✅</h4>
                      </div>
                      <ul>
                        {compostingInfo.podeIr.map((item, idx) => (
                          <li key={idx}>
                            <span className="bullet-ok"><Check size={12} /></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Não pode ir */}
                    <div className="column-donts card-nature">
                      <div className="column-header text-red">
                        <X size={24} />
                        <h4>Não pode ir 🚫</h4>
                      </div>
                      <ul>
                        {compostingInfo.naoPodeIr.map((item, idx) => (
                          <li key={idx}>
                            <span className="bullet-error"><X size={12} /></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* DETALHES DO MÓDULO: QUIZ */}
          {activeModule === 'quiz' && (
            <Quiz 
              user={user} 
              onUpdateUserPoints={onUpdateUserPoints} 
              onGoToRanking={() => {
                setActiveModule(null);
                onGoToRanking();
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
