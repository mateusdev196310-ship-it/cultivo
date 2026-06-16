import React, { useState, useEffect } from 'react';
import { Award, HelpCircle, Trophy, Check, X, ArrowRight, Sparkles, Play } from 'lucide-react';
import { quizQuestions } from '../data/mockData';
import { awardPoints, getTodayDateBR, getBrasiliaDate } from '../db';

// Algoritmo Fisher-Yates para embaralhamento perfeito e aleatório das questões
function shuffleQuestions(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function Quiz({ user, onUpdateUserPoints, onGoToRanking }) {
  const [quizState, setQuizState] = useState(null);
  const [brasiliaDate, setBrasiliaDate] = useState(null);

  // Carregar o fuso horário de Brasília da internet
  useEffect(() => {
    let active = true;
    const loadDate = async () => {
      const dateStr = await getBrasiliaDate();
      if (active) {
        setBrasiliaDate(dateStr);
      }
    };
    loadDate();
    return () => { active = false; };
  }, [user?.email]);

  // Carregar ou inicializar o quiz do localStorage ao montar ou mudar de usuário
  useEffect(() => {
    if (!user || !user.email) return;
    const key = `cultiva_quiz_active_${user.email.trim().toLowerCase()}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.questions) && parsed.questions.length === 5) {
          setQuizState(parsed);
          return;
        }
      } catch (e) {
        console.warn("[EcoQuiz] Falha ao recuperar estado do quiz:", e);
      }
    }
    // Caso não exista, gera um novo quiz padrão embaralhado
    const shuffled = shuffleQuestions(quizQuestions);
    const selected = shuffled.slice(0, 5);
    setQuizState({
      id: 'quiz-' + Date.now(),
      questions: selected,
      currentIdx: 0,
      selectedOpt: null,
      isAnswered: false,
      correctCount: 0,
      completed: false,
      pointsEarned: 0,
      hasAwarded: false,
      started: false
    });
  }, [user?.email]);

  // Salvar no localStorage sempre que o estado do quiz mudar
  useEffect(() => {
    if (!user || !user.email || !quizState) return;
    const key = `cultiva_quiz_active_${user.email.trim().toLowerCase()}`;
    localStorage.setItem(key, JSON.stringify(quizState));
  }, [quizState, user?.email]);

  // Obter a quantidade de quizzes concluídos hoje
  const getDailyQuizCount = () => {
    if (!user || user.isAdmin || !brasiliaDate) return 0;
    const countKey = `cultiva_quiz_daily_count_${user.email.trim().toLowerCase()}`;
    const dailyDataRaw = localStorage.getItem(countKey);
    if (dailyDataRaw) {
      try {
        const parsed = JSON.parse(dailyDataRaw);
        if (parsed && parsed.date === brasiliaDate) {
          return parsed.count || 0;
        }
      } catch (e) {}
    }
    return 0;
  };

  if (!quizState || !brasiliaDate) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 0' }}>
        <div className="spinner-mini" style={{ borderTopColor: 'var(--primary)', width: 30, height: 30 }} />
      </div>
    );
  }

  const dailyCount = getDailyQuizCount();
  const limitReached = dailyCount >= 2;
  const currentQuestion = quizState.questions[quizState.currentIdx];

  const handleStart = () => {
    if (quizState.completed || limitReached) return;
    setQuizState(prev => ({
      ...prev,
      started: true,
      currentIdx: 0,
      selectedOpt: null,
      isAnswered: false,
      correctCount: 0,
      pointsEarned: 0,
      hasAwarded: false
    }));
  };

  const handleSelectOption = (idx) => {
    if (quizState.isAnswered) return;
    setQuizState(prev => ({
      ...prev,
      selectedOpt: idx
    }));
  };

  const handleConfirm = () => {
    if (quizState.selectedOpt === null || quizState.isAnswered) return;
    
    const isCorrect = quizState.selectedOpt === currentQuestion.answerIndex;
    setQuizState(prev => ({
      ...prev,
      correctCount: isCorrect ? prev.correctCount + 1 : prev.correctCount,
      isAnswered: true
    }));
  };

  const handleNext = () => {
    if (quizState.currentIdx < quizState.questions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentIdx: prev.currentIdx + 1,
        selectedOpt: null,
        isAnswered: false
      }));
    } else {
      // Quiz concluído!
      const totalCorrect = quizState.correctCount;
      const points = totalCorrect * 20;

      setQuizState(prev => {
        const newState = {
          ...prev,
          completed: true,
          started: false,
          pointsEarned: points
        };

        // Atribuir os pontos para o aluno no LocalStorage/Supabase (se não for admin)
        if (!user.isAdmin && !prev.hasAwarded) {
          const updated = awardPoints(
            user.email,
            points,
            user.name,
            'quiz',
            `EcoQuiz ${dailyCount + 1}/2 🌱`,
            `Acertou ${totalCorrect} de 5 questões no EcoQuiz (${dailyCount + 1}/2)`
          );
          if (onUpdateUserPoints) {
            onUpdateUserPoints(updated.points);
          }
          newState.hasAwarded = true;

          // Registrar incremento no contador diário usando o fuso de Brasília
          const countKey = `cultiva_quiz_daily_count_${user.email.trim().toLowerCase()}`;
          const dailyDataRaw = localStorage.getItem(countKey);
          let dailyData = { date: brasiliaDate, count: 0 };
          if (dailyDataRaw) {
            try {
              const parsed = JSON.parse(dailyDataRaw);
              if (parsed && parsed.date === brasiliaDate) {
                dailyData = parsed;
              }
            } catch (e) {}
          }
          dailyData.count += 1;
          localStorage.setItem(countKey, JSON.stringify(dailyData));
        }

        return newState;
      });
    }
  };

  // Gerar um novo quiz usando o embaralhamento Fisher-Yates
  const handleGenerateNewQuiz = () => {
    if (limitReached) {
      alert("Você já atingiu o limite de 2 quizzes hoje!");
      return;
    }
    const shuffled = shuffleQuestions(quizQuestions);
    const selected = shuffled.slice(0, 5);
    setQuizState({
      id: 'quiz-' + Date.now(),
      questions: selected,
      currentIdx: 0,
      selectedOpt: null,
      isAnswered: false,
      correctCount: 0,
      completed: false,
      pointsEarned: 0,
      hasAwarded: false,
      started: true // Inicia direto
    });
  };

  return (
    <div className="quiz-container">
      {/* 1. TELA INICIAL (Não iniciado) */}
      {!quizState.started && !quizState.completed && (
        <div className="quiz-start-screen card-nature text-center animate-fade-in">
          <div className="quiz-badge-icon">
            <Trophy size={48} className={limitReached ? "text-muted" : "text-yellow"} />
          </div>
          <h2>Desafio EcoQuiz 🌱</h2>
          <p className="quiz-intro-text">
            Mostre o que você aprendeu sobre **Germinação**, **Fotossíntese** e **Compostagem**!
          </p>
          
          <div className="quiz-rules">
            <h4>Como funciona:</h4>
            <ul>
              <li>São <strong>5 perguntas</strong> de múltipla escolha.</li>
              <li>Cada resposta correta vale <strong>+20 pontos</strong>.</li>
              <li>Limite diário: <strong>No máximo 2 quizzes por dia</strong>.</li>
              <li>Gabarito máximo: <strong>100 XP</strong> por rodada!</li>
              <li>Sua pontuação sobe direto para o <strong>Ranking Escolar</strong>!</li>
            </ul>
          </div>

          {limitReached ? (
            <div style={{
              margin: '20px 0',
              padding: '16px',
              backgroundColor: '#fff8e1',
              borderRadius: 'var(--radius-md)',
              border: '1.5px dashed #ffb300',
              textAlign: 'left'
            }}>
              <p style={{ fontSize: '13px', color: '#b78103', margin: 0, fontWeight: 700 }}>
                🔒 Limite Diário Atingido!
              </p>
              <p style={{ fontSize: '12px', color: '#5d4037', margin: '4px 0 0 0', lineHeight: '1.4' }}>
                Você concluiu os 2 quizzes de hoje! Novas questões serão liberadas amanhã. Aproveite para cuidar do seu plantio ou comentar no feed! 🌱
              </p>
            </div>
          ) : (
            <button className="btn btn-primary btn-block" onClick={handleStart}>
              {dailyCount === 0 ? "Fazer Quiz 1/2" : "Fazer Quiz 2/2"} <Play size={16} fill="currentColor" />
            </button>
          )}
        </div>
      )}

      {/* 2. QUIZ EM ANDAMENTO */}
      {quizState.started && currentQuestion && (
        <div className="quiz-active card-nature animate-slide-up">
          {/* Cabeçalho do Quiz */}
          <div className="quiz-progress-header">
            <span>Questão {quizState.currentIdx + 1} de {quizState.questions.length}</span>
            <div className="progress-bar-track">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${((quizState.currentIdx + 1) / quizState.questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Pergunta */}
          <div className="quiz-question-box">
            <HelpCircle size={20} className="question-icon text-green" />
            <h3>{currentQuestion.question}</h3>
          </div>

          {/* Alternativas */}
          <div className="quiz-options-list">
            {currentQuestion.options.map((option, idx) => {
              let optClass = "quiz-opt-btn";
              if (quizState.selectedOpt === idx) optClass += " selected";
              
              if (quizState.isAnswered) {
                if (idx === currentQuestion.answerIndex) {
                  optClass += " correct";
                } else if (quizState.selectedOpt === idx) {
                  optClass += " incorrect";
                } else {
                  optClass += " disabled";
                }
              }

              return (
                <button
                  key={idx}
                  className={optClass}
                  onClick={() => handleSelectOption(idx)}
                  disabled={quizState.isAnswered}
                >
                  <span className="opt-letter">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="opt-text">{option}</span>
                  {quizState.isAnswered && idx === currentQuestion.answerIndex && (
                    <Check size={18} className="check-opt text-success" />
                  )}
                  {quizState.isAnswered && quizState.selectedOpt === idx && idx !== currentQuestion.answerIndex && (
                    <X size={18} className="check-opt text-danger" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explicação da Resposta */}
          {quizState.isAnswered && (
            <div className={`quiz-explanation-box animate-fade-in ${quizState.selectedOpt === currentQuestion.answerIndex ? 'success' : 'danger'}`}>
              <h5>
                {quizState.selectedOpt === currentQuestion.answerIndex ? '🎉 Resposta Correta!' : '❌ Ops, não foi dessa vez!'}
              </h5>
              <p>{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="quiz-actions">
            {!quizState.isAnswered ? (
              <button
                className="btn btn-primary btn-block"
                onClick={handleConfirm}
                disabled={quizState.selectedOpt === null}
              >
                Confirmar Resposta
              </button>
            ) : (
              <button className="btn btn-primary btn-block" onClick={handleNext}>
                {quizState.currentIdx < quizState.questions.length - 1 ? 'Próxima Pergunta' : 'Finalizar e Ver Pontos'}
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. TELA DE RESULTADOS / QUIZ COMPLETADO (Bloqueado) */}
      {quizState.completed && (
        <div className="quiz-result-screen card-nature text-center animate-fade-in">
          <div className="result-badge">
            <Award size={64} className="text-yellow" />
          </div>

          {quizState.correctCount === quizState.questions.length ? (
            <div>
              <h2>Desempenho Perfeito! 🌟</h2>
              <p className="subtitle">Você é um verdadeiro Gênio da Sustentabilidade! 5/5!</p>
            </div>
          ) : quizState.correctCount >= 4 ? (
            <div>
              <h2>Excelente! 🌱</h2>
              <p className="subtitle">Ótimo conhecimento! Quase perfeito!</p>
            </div>
          ) : quizState.correctCount >= 3 ? (
            <div>
              <h2>Parabéns! 🌿</h2>
              <p className="subtitle">Ótimo conhecimento sobre nossa ecologia escolar.</p>
            </div>
          ) : (
            <div>
              <h2>Bom esforço! 📚</h2>
              <p className="subtitle">Estude os módulos educativos para acertar mais na próxima vez.</p>
            </div>
          )}

          {/* Placar */}
          <div className="score-board">
            <div className="score-stat">
              <span>Acertos</span>
              <strong>{quizState.correctCount} / {quizState.questions.length}</strong>
            </div>
            <div className="score-stat highlight">
              <span>Pontos Ganhos</span>
              <strong className="text-yellow">+{quizState.pointsEarned} XP</strong>
            </div>
          </div>

          {user.isAdmin && (
            <p className="admin-points-notice">
              *Como administrador, seus pontos não são computados no ranking escolar.
            </p>
          )}

          {limitReached ? (
            <div style={{
              margin: '20px 0',
              padding: '16px',
              backgroundColor: '#fff8e1',
              borderRadius: 'var(--radius-md)',
              border: '1.5px dashed #ffb300',
              textAlign: 'left'
            }}>
              <p style={{ fontSize: '13px', color: '#b78103', margin: 0, fontWeight: 700 }}>
                🔒 Limite Diário Atingido!
              </p>
              <p style={{ fontSize: '12px', color: '#5d4037', margin: '4px 0 0 0', lineHeight: '1.4' }}>
                Você concluiu os 2 quizzes de hoje! Novas questões serão liberadas amanhã. Aproveite para cuidar do seu plantio ou comentar no feed! 🌱
              </p>
            </div>
          ) : (
            <div style={{
              margin: '20px 0',
              padding: '12px',
              backgroundColor: 'var(--primary-light)',
              borderRadius: 'var(--radius-md)',
              border: '1.5px dashed var(--primary)'
            }}>
              <p style={{ fontSize: '12px', color: 'var(--primary-dark)', margin: 0, fontWeight: 500 }}>
                🔒 <strong>Primeiro quiz concluído!</strong> Você ainda pode fazer mais um quiz hoje para acumular pontos.
              </p>
            </div>
          )}

          <div className="result-actions" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {!limitReached && (
              <button className="btn btn-primary btn-block" onClick={handleGenerateNewQuiz} style={{
                background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
                boxShadow: '0 4px 14px rgba(46,125,50,0.3)',
                fontWeight: 700
              }}>
                <Sparkles size={16} style={{ marginRight: 4 }} /> Gerar Quiz 2/2 (IA)
              </button>
            )}
            <button className="btn btn-secondary btn-block" onClick={onGoToRanking}>
              Ver Ranking <Trophy size={14} style={{ marginLeft: 4 }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
