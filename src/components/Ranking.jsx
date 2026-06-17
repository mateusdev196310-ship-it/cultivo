import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, User, RefreshCw } from 'lucide-react';
import { getLeaderboard, getTurmas, fetchLeaderboard } from '../db';

export default function Ranking({ currentUser, dbUpdateTick }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [turmaName, setTurmaName] = useState('');

  const loadRanking = async () => {
    // 1. Carrega o ranking local imediatamente (rápido)
    setLeaderboard(getLeaderboard(currentUser));
    
    // 2. Busca o ranking atualizado diretamente do Supabase e atualiza o estado
    const freshRanking = await fetchLeaderboard(currentUser);
    setLeaderboard(freshRanking);
    
    // Obter nome da turma se o usuário tiver uma
    if (currentUser && !currentUser.isAdmin && currentUser.turmaId) {
      const turmas = getTurmas();
      const myTurma = turmas.find(t => t.id === currentUser.turmaId);
      if (myTurma) {
        setTurmaName(myTurma.nome);
      }
    }
  };

  useEffect(() => {
    loadRanking();
  }, [currentUser, dbUpdateTick]);

  // Encontrar a posição do próprio usuário
  const userRankIndex = leaderboard.findIndex(u => u.email === currentUser.email);
  const userRank = userRankIndex !== -1 ? userRankIndex + 1 : null;
  const userPoints = userRankIndex !== -1 ? leaderboard[userRankIndex].points : 0;

  // Separar Top 3 e o restante
  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];
  const rest = leaderboard.slice(3);

  return (
    <div className="ranking-container">
      <div className="ranking-header-section">
        <div className="section-header-refresh">
          <div>
            <h2>{turmaName ? `Classificação - ${turmaName}` : 'Classificação Geral'}</h2>
            <p className="subtitle">Mantenha suas plantas ativas e acerte quizzes para subir de nível!</p>
          </div>
          <button onClick={loadRanking} className="btn-refresh" title="Atualizar Ranking">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {leaderboard.length === 0 ? (
        <div className="empty-state card-nature">
          <Trophy size={48} className="text-muted empty-icon" />
          <h3>Nenhum participante ainda</h3>
          <p>Seja o primeiro a cultivar para abrir o ranking!</p>
        </div>
      ) : (
        <div className="ranking-body animate-fade-in">
          
          {/* PODIUM VISUAL (1º, 2º, 3º colocados) */}
          <div className="podium-wrapper">
            
            {/* 2º LUGAR */}
            <div className="podium-step step-second animate-slide-up">
              <div className="podium-avatar-container">
                <div className="podium-avatar bg-silver">
                  {top2 ? top2.name.charAt(0).toUpperCase() : <User size={18} />}
                </div>
                <div className="podium-medal silver"><Medal size={14} /></div>
              </div>
              <div className="podium-pedestal p-second">
                <span className="podium-name">{top2 ? top2.name.split(' ')[0] : 'Vazio'}</span>
                <span className="podium-points">{top2 ? `${top2.points} XP` : '0 XP'}</span>
                <div className="pedestal-block">2º</div>
              </div>
            </div>

            {/* 1º LUGAR (Mais alto e no meio) */}
            <div className="podium-step step-first animate-slide-up">
              <div className="podium-avatar-container">
                <div className="podium-avatar bg-gold">
                  {top1 ? top1.name.charAt(0).toUpperCase() : <User size={24} />}
                </div>
                <div className="podium-medal gold"><Trophy size={16} /></div>
              </div>
              <div className="podium-pedestal p-first">
                <span className="podium-name">{top1 ? top1.name.split(' ')[0] : 'Vazio'}</span>
                <span className="podium-points">{top1 ? `${top1.points} XP` : '0 XP'}</span>
                <div className="pedestal-block">1º</div>
              </div>
            </div>

            {/* 3º LUGAR */}
            <div className="podium-step step-third animate-slide-up">
              <div className="podium-avatar-container">
                <div className="podium-avatar bg-bronze">
                  {top3 ? top3.name.charAt(0).toUpperCase() : <User size={18} />}
                </div>
                <div className="podium-medal bronze"><Medal size={14} /></div>
              </div>
              <div className="podium-pedestal p-third">
                <span className="podium-name">{top3 ? top3.name.split(' ')[0] : 'Vazio'}</span>
                <span className="podium-points">{top3 ? `${top3.points} XP` : '0 XP'}</span>
                <div className="pedestal-block">3º</div>
              </div>
            </div>

          </div>

          {/* Destaque do Usuário Logado */}
          {!currentUser.isAdmin && userRank !== null && (
            <div className="user-rank-highlight card-nature animate-fade-in">
              <div className="user-rank-header">
                <Award size={18} className="text-yellow" />
                <span>Minha Posição de Cultivo</span>
              </div>
              <div className="user-rank-content">
                <div className="left">
                  <span className="user-position-num">#{userRank}</span>
                  <div>
                    <h4>{currentUser.name} (Você)</h4>
                    <p className="email-muted">{currentUser.email}</p>
                  </div>
                </div>
                <div className="right">
                  <strong>{userPoints} XP</strong>
                </div>
              </div>
            </div>
          )}

          {/* LISTA COMPLETA DOS LÍDERES */}
          <div className="ranking-list card-nature">
            <h3>Tabela de Líderes</h3>
            <div className="ranking-table-rows">
              {leaderboard.map((student, idx) => {
                const rank = idx + 1;
                const isSelf = student.email === currentUser.email;
                return (
                  <div key={student.email} className={`ranking-list-row ${isSelf ? 'self-row' : ''}`}>
                    <div className="row-left">
                      <span className={`rank-position-badge pos-${rank <= 3 ? rank : 'normal'}`}>
                        {rank}
                      </span>
                      <div className="row-avatar">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="row-info">
                        <span className="row-name">{student.name} {isSelf && <strong className="text-green">(Você)</strong>}</span>
                        {currentUser.isAdmin && <span className="row-email">{student.email}</span>}
                      </div>
                    </div>
                    <div className="row-right">
                      <strong>{student.points} XP</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
