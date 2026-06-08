import React, { useState } from 'react';
import { Award, HelpCircle, Trophy, Check, X, ArrowRight, Sparkles, Play, RefreshCw } from 'lucide-react';
import { quizQuestions } from '../data/mockData';
import { awardPoints } from '../db';

export default function Quiz({ user, onUpdateUserPoints, onGoToRanking }) {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);

  const currentQuestion = quizQuestions[currentIdx];

  const handleStart = () => {
    setQuizStarted(true);
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setQuizCompleted(false);
    setPointsEarned(0);
  };

  const handleSelectOption = (idx) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
  };

  const handleConfirm = () => {
    if (selectedOpt === null || isAnswered) return;
    
    const isCorrect = selectedOpt === currentQuestion.answerIndex;
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }
    
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentIdx < quizQuestions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else {
      // Quiz completo!
      const totalCorrect = correctCount + (selectedOpt === currentQuestion.answerIndex ? 1 : 0);
      const points = totalCorrect * 20;
      
      setPointsEarned(points);
      
      // Atribuir os pontos para o aluno no LocalStorage (se não for admin)
      if (points > 0 && !user.isAdmin) {
        const updated = awardPoints(user.email, points, user.name);
        if (onUpdateUserPoints) {
          onUpdateUserPoints(updated.points);
        }
      }
      
      setQuizCompleted(true);
      setQuizStarted(false);
    }
  };

  return (
    <div className="quiz-container">
      {/* 1. TELA INICIAL */}
      {!quizStarted && !quizCompleted && (
        <div className="quiz-start-screen card-nature text-center animate-fade-in">
          <div className="quiz-badge-icon">
            <Trophy size={48} className="text-yellow" />
          </div>
          <h2>Desafio EcoQuiz 🌱</h2>
          <p className="quiz-intro-text">
            Mostre o que você aprendeu sobre **Germinação**, **Fotossíntese** e **Compostagem**!
          </p>
          
          <div className="quiz-rules">
            <h4>Como funciona:</h4>
            <ul>
              <li>São <strong>10 perguntas</strong> de múltipla escolha.</li>
              <li>Cada resposta correta vale <strong>+20 pontos</strong>.</li>
              <li>Gabarito máximo: <strong>200 XP</strong> por rodada!</li>
              <li>Sua pontuação sobe direto para o <strong>Ranking Escolar</strong>!</li>
            </ul>
          </div>

          <button className="btn btn-primary btn-block" onClick={handleStart}>
            Começar Desafio <Play size={16} fill="currentColor" />
          </button>
        </div>
      )}

      {/* 2. QUIZ EM ANDAMENTO */}
      {quizStarted && currentQuestion && (
        <div className="quiz-active card-nature animate-slide-up">
          {/* Cabeçalho do Quiz */}
          <div className="quiz-progress-header">
            <span>Questão {currentIdx + 1} de {quizQuestions.length}</span>
            <div className="progress-bar-track">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${((currentIdx + 1) / quizQuestions.length) * 100}%` }}
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
              if (selectedOpt === idx) optClass += " selected";
              
              if (isAnswered) {
                if (idx === currentQuestion.answerIndex) {
                  optClass += " correct";
                } else if (selectedOpt === idx) {
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
                  disabled={isAnswered}
                >
                  <span className="opt-letter">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="opt-text">{option}</span>
                  {isAnswered && idx === currentQuestion.answerIndex && (
                    <Check size={18} className="check-opt text-success" />
                  )}
                  {isAnswered && selectedOpt === idx && idx !== currentQuestion.answerIndex && (
                    <X size={18} className="check-opt text-danger" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explicação da Resposta */}
          {isAnswered && (
            <div className={`quiz-explanation-box animate-fade-in ${selectedOpt === currentQuestion.answerIndex ? 'success' : 'danger'}`}>
              <h5>
                {selectedOpt === currentQuestion.answerIndex ? '🎉 Resposta Correta!' : '❌ Ops, não foi dessa vez!'}
              </h5>
              <p>{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="quiz-actions">
            {!isAnswered ? (
              <button
                className="btn btn-primary btn-block"
                onClick={handleConfirm}
                disabled={selectedOpt === null}
              >
                Confirmar Resposta
              </button>
            ) : (
              <button className="btn btn-primary btn-block" onClick={handleNext}>
                {currentIdx < quizQuestions.length - 1 ? 'Próxima Pergunta' : 'Finalizar e Ver Pontos'}
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. TELA DE RESULTADOS */}
      {quizCompleted && (
        <div className="quiz-result-screen card-nature text-center animate-fade-in">
          <div className="result-badge">
            <Award size={64} className="text-yellow" />
          </div>

          {correctCount === quizQuestions.length ? (
            <div>
              <h2>Desempenho Perfeito! 🌟</h2>
              <p className="subtitle">Você é um verdadeiro Gênio da Sustentabilidade! 10/10!</p>
            </div>
          ) : correctCount >= 8 ? (
            <div>
              <h2>Excelente! 🌱</h2>
              <p className="subtitle">Ótimo conhecimento! Quase perfeito!</p>
            </div>
          ) : correctCount >= 6 ? (
            <div>
              <h2>Parabéns! 🌿</h2>
              <p className="subtitle">Ótimo conhecimento sobre nossa ecologia escolar.</p>
            </div>
          ) : (
            <div>
              <h2>Bom esforço! 📚</h2>
              <p className="subtitle">Continue estudando os módulos educativos para acertar mais da próxima vez.</p>
            </div>
          )}

          {/* Placar */}
          <div className="score-board">
            <div className="score-stat">
              <span>Acertos</span>
              <strong>{correctCount} / {quizQuestions.length}</strong>
            </div>
            <div className="score-stat highlight">
              <span>Pontos Ganhos</span>
              <strong className="text-yellow">+{pointsEarned} XP</strong>
            </div>
          </div>

          {user.isAdmin && (
            <p className="admin-points-notice">
              *Como administrador, seus pontos não são computados no ranking escolar.
            </p>
          )}

          <div className="result-actions">
            <button className="btn btn-secondary" onClick={handleStart}>
              <RefreshCw size={14} /> Refazer Quiz
            </button>
            <button className="btn btn-primary" onClick={onGoToRanking}>
              Ver Ranking <Trophy size={14} style={{ marginLeft: 4 }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
