import React, { useState, useEffect } from 'react';
import { MODULES_DATA } from '../mockData';

export default function QuizTab({ 
  isEnrolled, 
  selectedModule, 
  moduleProgress, 
  onCompleteQuiz, 
  studentInfo,
  showToast,
  onNavigateToTab
}) {
  const [activeModule, setActiveModule] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  // Sync if selectedModule changes from outside (ModulesTab)
  useEffect(() => {
    if (selectedModule && isEnrolled) {
      startQuizSession(selectedModule);
    }
  }, [selectedModule, isEnrolled]);

  const startQuizSession = (module) => {
    setActiveModule(module);
    setCurrentQuestionIdx(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setQuizScore(0);
    setShowResults(false);
    setShowCertificate(false);
  };

  if (!isEnrolled) {
    return (
      <div className="quiz-container" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '30px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📝</div>
        <h2 style={{ fontFamily: 'var(--font-title)', fontWeight: 900, fontSize: '1.4rem', color: 'var(--blue-deep)' }}>
          Quizzes Bloqueados
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '10px 0 20px 0', lineHeight: 1.5, maxWidth: '280px' }}>
          Para testar seus conhecimentos e emitir certificados, você precisa ter uma matrícula ativa.
        </p>
        <button className="checkout-btn" onClick={() => onNavigateToTab('enroll')}>
          Fazer Matrícula Agora
        </button>
      </div>
    );
  }

  // Dashboard state if no active quiz session is running
  if (!activeModule) {
    return (
      <div className="quiz-container">
        <div className="section-title">
          <span>Quizzes Disponíveis</span>
        </div>

        <div className="quiz-selection-card">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
          </svg>
          <h3>Teste o seu Conhecimento</h3>
          <p>Selecione um dos módulos abaixo para testar o seu aprendizado técnico em APH. A aprovação exige 70% de acerto.</p>
        </div>

        <div className="quiz-selection-list">
          {MODULES_DATA.map((module) => {
            const prog = moduleProgress[module.id];
            const hasCompleted = prog && prog.quizScore !== null;
            const scorePercent = hasCompleted ? Math.round((prog.quizScore / 10) * 100) : null;
            
            return (
              <div 
                key={module.id} 
                className="quiz-select-item"
                onClick={() => startQuizSession(module)}
              >
                <div style={{ flex: 1, marginRight: '8px' }}>
                  <div className="quiz-select-title">
                    Módulo {module.number}: {module.title.split(' - ')[0]}
                  </div>
                </div>
                {hasCompleted ? (
                  <div className="quiz-select-score" style={{ backgroundColor: scorePercent >= 70 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: scorePercent >= 70 ? 'var(--success)' : 'var(--error)' }}>
                    Nota: {scorePercent}%
                  </div>
                ) : (
                  <div className="quiz-select-btn">
                    Iniciar <span>➔</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Active quiz session items
  const questions = activeModule.questions;
  const currentQuestion = questions[currentQuestionIdx];

  const handleAnswerSelect = (optLetter) => {
    if (isAnswered) return;
    setSelectedAnswer(optLetter);
    setIsAnswered(true);
    
    if (optLetter === currentQuestion.answer) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // Calculate final score
      onCompleteQuiz(activeModule.id, quizScore);
      setShowResults(true);
    }
  };

  // Score page
  if (showResults) {
    const passed = quizScore >= 7;
    const finalPercent = (quizScore / 10) * 100;
    
    return (
      <div className="quiz-results-container">
        <div className={`result-circle-box ${passed ? 'pass' : 'fail'}`}>
          <div className="result-percentage">{finalPercent}%</div>
          <div className="result-fraction">{quizScore}/10 Acertos</div>
        </div>

        <h3 className="result-title">
          {passed ? "Aprovado! Parabéns!" : "Revise a Aula!"}
        </h3>
        <p className="result-subtitle">
          {passed 
            ? `Você demonstrou excelente entendimento no Módulo ${activeModule.number}. Seu certificado de proficiência está pronto!` 
            : `Você acertou ${quizScore} de 10 questões. Precisava de pelo menos 7 acertos para aprovação. Deseja tentar novamente?`}
        </p>

        <div className="result-actions">
          {passed && (
            <button className="cert-btn" onClick={() => setShowCertificate(true)}>
              🎓 Baixar Certificado PDF
            </button>
          )}
          <button className="quiz-reset-btn" onClick={() => startQuizSession(activeModule)}>
            Refazer este Quiz
          </button>
          <button className="quiz-reset-btn" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', marginTop: '8px' }} onClick={() => setActiveModule(null)}>
            Voltar para Painel de Quizzes
          </button>
        </div>

        {/* Certificate Modal Overlay */}
        {showCertificate && (
          <div className="certificate-modal-overlay">
            <div className="certificate-card">
              <div className="cert-seal">🎖️</div>
              <h2 className="cert-header">Certificado de Conclusão</h2>
              <div className="cert-subtitle">Atendimento Pré-Hospitalar (APH)</div>
              
              <p className="cert-presentation">Certificamos para os devidos fins de direito que o aluno(a)</p>
              <h1 className="cert-recipient">{studentInfo.name}</h1>
              <p className="cert-text">
                concluiu com êxito os testes acadêmicos e práticos referentes ao <strong>Módulo {activeModule.number}: {activeModule.title}</strong>, sob instrução teórica de Charles Aquino, obtendo nota final de <strong>{finalPercent}%</strong> e carga horária equivalente a <strong>20 horas</strong> letivas de APH.
              </p>

              <div className="cert-signatures">
                <div className="cert-sig-line">
                  <div className="cert-sig-name">Charles Aquino</div>
                  <span>Instrutor Técnico</span>
                </div>
                <div className="cert-sig-line">
                  <div className="cert-sig-name" style={{ fontFamily: 'monospace' }}>#CA-{activeModule.id}-{studentInfo.name.length}</div>
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
                onClick={() => setShowCertificate(false)}
              >
                Voltar
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="quiz-container">
      {/* Header Info */}
      <div className="quiz-header">
        <span className="quiz-header-title">Módulo {activeModule.number} • Quiz</span>
        <span className="quiz-header-counter">Questão {currentQuestionIdx + 1} de 10</span>
      </div>

      <div className="quiz-progress-bar">
        <div 
          className="quiz-progress-fill" 
          style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="question-card">
        <p className="question-text">{currentQuestion.question}</p>
        
        <div className="options-list">
          {['A', 'B', 'C', 'D'].map((letter, idx) => {
            const isCorrectOption = letter === currentQuestion.answer;
            const isSelectedOption = letter === selectedAnswer;
            
            let btnClass = "";
            if (isAnswered) {
              if (isSelectedOption) {
                btnClass = isCorrectOption ? "selected-correct" : "selected-incorrect";
              } else if (isCorrectOption) {
                btnClass = "correct-dimmed";
              }
            }

            return (
              <button
                key={letter}
                className={`option-btn ${btnClass}`}
                onClick={() => handleAnswerSelect(letter)}
                disabled={isAnswered}
              >
                <div className="option-letter">{letter}</div>
                <div style={{ flex: 1 }}>{currentQuestion.options[idx]}</div>
              </button>
            );
          })}
        </div>

        {/* Textbook explanation */}
        {isAnswered && (
          <div className={`quiz-explanation-box ${selectedAnswer === currentQuestion.answer ? 'correct' : 'incorrect'}`}>
            <h5 className={`quiz-explanation-title ${selectedAnswer === currentQuestion.answer ? 'correct' : 'incorrect'}`}>
              {selectedAnswer === currentQuestion.answer ? "✓ Resposta Correta!" : "✕ Resposta Incorreta!"}
            </h5>
            <p>{currentQuestion.explanation}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="quiz-footer">
        <button
          className="quiz-next-btn"
          disabled={!isAnswered}
          onClick={handleNext}
        >
          <span>{currentQuestionIdx === questions.length - 1 ? "Verificar Resultado" : "Próxima Questão"}</span>
          <span>➔</span>
        </button>
      </div>
    </div>
  );
}
