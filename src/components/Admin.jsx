import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Users, Sprout, BarChart3, MessageSquare, Heart, RefreshCw, Plus, Trash2, Camera, X } from 'lucide-react';
import { getPlants, getPosts, getClassFeedback, getUsers, getTurmas, createTurma, deleteTurma, updateTurmaFoto, updateUsersTurma, compressImage, deletePlant, formatDateBR, getActivities } from '../db';


const TABS = [
  { id: 'dashboard', label: '📊 Painel', icon: BarChart3 },
  { id: 'turmas', label: '🏫 Turmas', icon: Users },
  { id: 'notas', label: '📝 Notas', icon: BarChart3 },
  { id: 'feedback', label: '💬 Opinião', icon: MessageSquare },
];

// Tabela de pontos por atividade (vale nota)
const ACTIVITY_POINTS = {
  plantio: { label: 'Plantio Inicial', icon: '🌱', pts: 420 },
  atualizacao: { label: 'Atualização Semanal', icon: '📸', pts: 100 },
  curtida: { label: 'Curtida no Feed', icon: '❤️', pts: 5 },
  comentario: { label: 'Comentário no Feed', icon: '💬', pts: 10 },
  quiz: { label: 'Quiz (por acerto)', icon: '🏆', pts: 20 },
  feedback: { label: 'Opinião da Aula', icon: '😍', pts: 10 },
};

// Converte pontos em conceito/nota
function pontosParaNota(pts) {
  if (pts >= 300) return { letra: 'A+', cor: '#2e7d32' };
  if (pts >= 200) return { letra: 'A', cor: '#388e3c' };
  if (pts >= 150) return { letra: 'B', cor: '#1976d2' };
  if (pts >= 100) return { letra: 'C', cor: '#f57c00' };
  if (pts >= 50)  return { letra: 'D', cor: '#e53935' };
  return { letra: 'E', cor: '#9e9e9e' };
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [plants, setPlants] = useState([]);
  const [posts, setPosts] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [users, setUsers] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [stats, setStats] = useState({
    totalPlants: 0, totalStudents: 0, totalUpdates: 0, totalComments: 0, totalLikes: 0,
  });

  // Estados para criar nova turma
  const [newTurmaName, setNewTurmaName] = useState('');
  const [newTurmaFoto, setNewTurmaFoto] = useState(null); // dataURL
  const [showNewTurmaForm, setShowNewTurmaForm] = useState(false);
  const [selectedTurmaFoto, setSelectedTurmaFoto] = useState({}); // { [turmaId]: fotoDataUrl }
  const fileInputRef = useRef(null);
  const turmaFotoRefs = useRef({});
  const [groupingTurmaId, setGroupingTurmaId] = useState(null);
  const [selectedStudentEmails, setSelectedStudentEmails] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const loadAdminData = () => {
    const allPlants = getPlants();
    const allPosts = getPosts();
    const allUsers = getUsers();
    const allTurmas = getTurmas();
    const allFeedback = getClassFeedback();

    const totalPlants = allPlants.length;
    const emails = allPlants.map(p => p.studentEmail);
    const uniqueStudents = new Set(emails).size;
    let totalUpdates = 0;
    allPlants.forEach(p => { totalUpdates += p.photos.length; });
    let totalComments = 0;
    let totalLikes = 0;
    allPosts.forEach(post => {
      totalComments += post.comments.length;
      totalLikes += post.likes.length;
    });

    setPlants(allPlants);
    setPosts(allPosts);
    setUsers(allUsers);
    setTurmas(allTurmas);
    setFeedbackList(allFeedback);
    setStats({ totalPlants, totalStudents: uniqueStudents, totalUpdates, totalComments, totalLikes });
  };

  useEffect(() => { loadAdminData(); }, []);

  // Agrupar alunos por turma
  const getAlunosByTurma = (turmaId) => {
    return users.filter(u => u.turmaId === turmaId);
  };
  const getSemTurma = () => users.filter(u => !u.turmaId);

  // Calcular espécies
  const speciesCount = {};
  plants.forEach(p => { speciesCount[p.species] = (speciesCount[p.species] || 0) + 1; });
  const speciesData = Object.keys(speciesCount).map(key => ({
    name: key,
    count: speciesCount[key],
    percentage: Math.round((speciesCount[key] / plants.length) * 100) || 0
  })).sort((a, b) => b.count - a.count);

  // Handler para foto da nova turma
  const handleNewTurmaFotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      setNewTurmaFoto(compressed);
    } catch (err) {
      console.error("Erro ao comprimir imagem:", err);
      // Fallback a FileReader caso falhe
      const reader = new FileReader();
      reader.onload = (ev) => setNewTurmaFoto(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Handler para criar turma
  const handleCreateTurma = () => {
    if (!newTurmaName.trim()) return;
    createTurma(newTurmaName, newTurmaFoto);
    setNewTurmaName('');
    setNewTurmaFoto(null);
    setShowNewTurmaForm(false);
    loadAdminData();
  };

  // Handler para excluir turma
  const handleDeleteTurma = (turmaId) => {
    if (!window.confirm('Excluir esta turma? Os alunos não serão apagados, apenas desvinculados.')) return;
    deleteTurma(turmaId);
    loadAdminData();
  };

  // Handler para excluir planta/projeto (Moderação)
  const handleDeletePlant = (plantId) => {
    if (!window.confirm('Excluir este projeto de cultivo e todas as postagens associadas a ele?')) return;
    deletePlant(plantId);
    loadAdminData();
  };

  // Handler para atualizar foto da turma existente
  const handleTurmaFotoChange = async (turmaId, e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      updateTurmaFoto(turmaId, compressed);
      loadAdminData();
    } catch (err) {
      console.error("Erro ao comprimir imagem:", err);
      // Fallback
      const reader = new FileReader();
      reader.onload = (ev) => {
        updateTurmaFoto(turmaId, ev.target.result);
        loadAdminData();
      };
      reader.readAsDataURL(file);
    }
  };

  const parseDateToTimestamp = (dateStr) => {
    if (!dateStr) return 0;
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        return new Date(parts[2], parts[1] - 1, parts[0]).getTime();
      }
    }
    return new Date(dateStr).getTime();
  };

  const getStudentActivities = (studentEmail) => {
    const allActivities = getActivities();
    const cleanEmail = studentEmail.trim().toLowerCase();
    
    return allActivities
      .filter(act => (act.studentEmail || '').trim().toLowerCase() === cleanEmail)
      .map(act => ({
        type: act.type,
        icon: ACTIVITY_POINTS[act.type]?.icon || '✨',
        title: act.title,
        subtitle: act.description,
        date: act.date,
        pts: act.points
      }))
      .sort((a, b) => parseDateToTimestamp(b.date) - parseDateToTimestamp(a.date));
  };

  return (
    <div className="admin-container animate-fade-in">
      <div className="admin-header-section">
        <div className="title-block">
          <ShieldAlert size={28} className="text-green" />
          <h2>Painel da Ester (Administração)</h2>
        </div>
        <p className="subtitle">Gerencie turmas, monitore alunos e veja as opiniões da aula.</p>
      </div>

      {/* Abas do Admin */}
      <div className="admin-tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`admin-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ====== ABA: DASHBOARD ====== */}
      {activeTab === 'dashboard' && (
        <>
          <div className="metrics-grid">
            <div className="metric-card card-nature">
              <div className="metric-icon bg-green-light">
                <Sprout size={22} className="text-green" />
              </div>
              <div className="metric-info">
                <h3>{stats.totalPlants}</h3>
                <p>Plantas Registradas</p>
              </div>
            </div>
            <div className="metric-card card-nature">
              <div className="metric-icon bg-yellow-light">
                <Users size={22} className="text-yellow" />
              </div>
              <div className="metric-info">
                <h3>{stats.totalStudents}</h3>
                <p>Alunos Ativos</p>
              </div>
            </div>
            <div className="metric-card card-nature">
              <div className="metric-icon bg-brown-light">
                <BarChart3 size={22} className="text-brown" />
              </div>
              <div className="metric-info">
                <h3>{stats.totalUpdates}</h3>
                <p>Fotos / Avanços</p>
              </div>
            </div>
            <div className="metric-card card-nature">
              <div className="metric-icon bg-red-light">
                <Heart size={22} className="text-red" />
              </div>
              <div className="metric-info">
                <h3>{stats.totalLikes + stats.totalComments}</h3>
                <p>Interações no Feed</p>
              </div>
            </div>
          </div>

          {/* Gráfico de espécies */}
          <div className="admin-chart-section card-nature">
            <h3>📊 Espécies Mais Cultivadas</h3>
            <p className="chart-subtitle">Percentual de plantas por tipo no aplicativo</p>
            {plants.length === 0 ? (
              <p className="no-data">Nenhum dado para mostrar</p>
            ) : (
              <div className="chart-bars-list">
                {speciesData.map((spec, i) => (
                  <div key={i} className="chart-bar-item">
                    <div className="bar-label">
                      <span>{spec.name}</span>
                      <strong>{spec.count} planta{spec.count !== 1 ? 's' : ''} ({spec.percentage}%)</strong>
                    </div>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${spec.percentage}%`,
                          backgroundColor: i === 0 ? '#2e7d32' : i === 1 ? '#e0a96d' : i === 2 ? '#f9d56e' : '#a8df8e'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Lista de alunos e projetos */}
          <div className="admin-students-section card-nature">
            <div className="section-header-refresh">
              <h3>📋 Alunos e Seus Projetos</h3>
              <button onClick={loadAdminData} className="btn-refresh" title="Recarregar dados">
                <RefreshCw size={16} />
              </button>
            </div>
            {plants.length === 0 ? (
              <p className="no-data">Nenhum projeto registrado por estudantes até o momento.</p>
            ) : (
              <div className="students-table">
                <div className="table-header">
                  <span>Aluno</span>
                  <span>Planta</span>
                  <span>Espécie</span>
                  <span>Fase Atual</span>
                  <span className="text-right">Ações</span>
                </div>
                <div className="table-body">
                  {plants.map((plant) => {
                    const lastPhoto = plant.photos[plant.photos.length - 1];
                    return (
                      <div key={plant.id} className="table-row">
                        <div className="student-cell">
                          <strong>{plant.studentName}</strong>
                          <span className="email-small">{plant.studentEmail}</span>
                        </div>
                        <div className="plant-cell">{plant.name}</div>
                        <div className="species-cell">
                          <span className="badge-species">{plant.species}</span>
                        </div>
                        <div className="stage-cell">
                          <span className="badge-stage">{lastPhoto?.stageName || 'Semente'}</span>
                        </div>
                        <div className="actions-cell text-right" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                          <span className="date-info">Dia {lastPhoto?.day || 1}</span>
                          <button 
                            className="btn-turma-delete" 
                            style={{ padding: '4px 8px', margin: 0, height: 'auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                            onClick={() => handleDeletePlant(plant.id)}
                            title="Excluir projeto de cultivo"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="admin-footer-tip">
            <p>💡 <strong>Dica de Moderação:</strong> Se algum aluno postar imagens inadequadas ou comentários indesejados, você pode excluí-los diretamente no <strong>Feed Verde</strong>.</p>
          </div>
        </>
      )}

      {/* ====== ABA: TURMAS ====== */}
      {activeTab === 'turmas' && (
        <div className="turmas-section animate-fade-in">
          {/* Botão criar turma */}
          {!showNewTurmaForm ? (
            <button
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              onClick={() => setShowNewTurmaForm(true)}
            >
              <Plus size={18} /> Criar Nova Turma
            </button>
          ) : (
            <div className="card-nature turma-create-form animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h4 style={{ margin: 0 }}>🏫 Nova Turma</h4>
                <button onClick={() => { setShowNewTurmaForm(false); setNewTurmaFoto(null); setNewTurmaName(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <X size={18} />
                </button>
              </div>

              <div className="input-group" style={{ marginBottom: 12 }}>
                <label>Nome da Turma</label>
                <div className="input-wrapper">
                  <Users size={16} className="input-icon" />
                  <input
                    type="text"
                    placeholder="Ex: 3ºD, Turma Verde, 9ºA..."
                    value={newTurmaName}
                    onChange={e => setNewTurmaName(e.target.value)}
                  />
                </div>
              </div>

              {/* Upload da foto da turma */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                  📸 Foto da Turma (opcional)
                </label>
                {newTurmaFoto ? (
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img
                      src={newTurmaFoto}
                      alt="Foto da turma"
                      style={{ width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '2px solid var(--primary)' }}
                    />
                    <button
                      onClick={() => setNewTurmaFoto(null)}
                      style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', color: 'white', width: 24, height: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <button
                    className="turma-foto-upload-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera size={20} />
                    <span>Tirar / Escolher Foto da Turma</span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  style={{ display: 'none' }}
                  onChange={handleNewTurmaFotoChange}
                />
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={handleCreateTurma}
                disabled={!newTurmaName.trim()}
              >
                Criar Turma ✅
              </button>
            </div>
          )}

          {/* Lista de Turmas */}
          {turmas.length === 0 ? (
            <div className="card-nature" style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-muted)' }}>
              <Users size={40} style={{ marginBottom: 8, opacity: 0.4 }} />
              <p style={{ fontWeight: 600 }}>Nenhuma turma criada ainda</p>
              <p style={{ fontSize: 12, marginTop: 4 }}>Crie sua primeira turma para agrupar os alunos!</p>
            </div>
          ) : (
            turmas.map(turma => {
              const alunos = getAlunosByTurma(turma.id);
              return (
                <div key={turma.id} className="card-nature turma-card animate-fade-in">
                  {/* Cabeçalho da turma */}
                  <div className="turma-card-header">
                    {turma.fotoUrl ? (
                      <img
                        src={turma.fotoUrl}
                        alt={`Foto da ${turma.nome}`}
                        className="turma-foto"
                      />
                    ) : (
                      <div className="turma-foto-placeholder">
                        <Users size={28} style={{ opacity: 0.5 }} />
                      </div>
                    )}
                    <div className="turma-info">
                      <h4>{turma.nome}</h4>
                      <span className="turma-meta">
                        {alunos.length} aluno{alunos.length !== 1 ? 's' : ''} • Criada em {formatDateBR(turma.criadaEm)}
                      </span>
                    </div>
                    <div className="turma-actions" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <button
                        className="btn-turma-foto"
                        title="Agrupar Alunos"
                        onClick={() => {
                          setGroupingTurmaId(turma.id);
                          setSelectedStudentEmails(alunos.map(a => a.email));
                        }}
                        style={{
                          backgroundColor: '#e8f5e9',
                          color: '#2e7d32',
                          border: '1px solid #a5d6a7',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px'
                        }}
                      >
                        👥 Agrupar
                      </button>
                      <button
                        className="btn-turma-foto"
                        title="Trocar foto da turma"
                        onClick={() => turmaFotoRefs.current[turma.id]?.click()}
                      >
                        <Camera size={14} />
                      </button>
                      <button
                        className="btn-turma-delete"
                        title="Excluir turma"
                        onClick={() => handleDeleteTurma(turma.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                      <input
                        ref={el => turmaFotoRefs.current[turma.id] = el}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        style={{ display: 'none' }}
                        onChange={(e) => handleTurmaFotoChange(turma.id, e)}
                      />
                    </div>
                  </div>

                  {/* Painel de Agrupamento */}
                  {groupingTurmaId === turma.id && (
                    <div className="turma-grouping-panel animate-fade-in" style={{
                      marginTop: '8px',
                      marginBottom: '16px',
                      padding: '12px',
                      backgroundColor: '#f9fbe7',
                      borderRadius: '8px',
                      border: '1.5px solid #d4e157',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      <h5 style={{ margin: 0, fontSize: '12px', fontWeight: 800, color: '#558b2f' }}>
                        👥 Associar Alunos a esta Turma ({turma.nome})
                      </h5>
                      
                      <div className="student-selection-list" style={{
                        maxHeight: '180px',
                        overflowY: 'auto',
                        border: '1px solid #d4e157',
                        borderRadius: '6px',
                        backgroundColor: '#ffffff',
                        padding: '4px'
                      }}>
                        {users.filter(u => !u.isAdmin).length === 0 ? (
                          <p style={{ fontSize: '11px', color: 'var(--text-muted)', padding: '8px', textAlign: 'center' }}>
                            Nenhum aluno cadastrado no aplicativo ainda.
                          </p>
                        ) : (
                          users.filter(u => !u.isAdmin).map(student => {
                            const studentTurma = turmas.find(t => t.id === student.turmaId);
                            const isChecked = selectedStudentEmails.includes(student.email);
                            
                            return (
                              <label key={student.email} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '6px 8px',
                                fontSize: '12px',
                                cursor: 'pointer',
                                borderBottom: '1px solid #f1f8e9'
                              }}>
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedStudentEmails(prev => [...prev, student.email]);
                                    } else {
                                      setSelectedStudentEmails(prev => prev.filter(email => email !== student.email));
                                    }
                                  }}
                                />
                                <div style={{ flex: 1 }}>
                                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{student.name}</span>
                                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: '6px' }}>({student.email})</span>
                                </div>
                                {student.turmaId && student.turmaId !== turma.id && (
                                  <span style={{ fontSize: '9px', backgroundColor: '#efebe9', color: '#5d4037', padding: '2px 6px', borderRadius: '10px' }}>
                                    já em: {studentTurma?.nome}
                                  </span>
                                )}
                                {!student.turmaId && (
                                  <span style={{ fontSize: '9px', backgroundColor: '#fff8e1', color: '#ff8f00', padding: '2px 6px', borderRadius: '10px' }}>
                                    Sem Turma
                                  </span>
                                )}
                              </label>
                            );
                          })
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 10px', fontSize: '11px', height: 'auto', border: '1px solid var(--border-color)' }}
                          onClick={() => setGroupingTurmaId(null)}
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          style={{ padding: '4px 10px', fontSize: '11px', height: 'auto', backgroundColor: '#558b2f' }}
                          onClick={async () => {
                            await updateUsersTurma(turma.id, selectedStudentEmails);
                            setGroupingTurmaId(null);
                            loadAdminData();
                          }}
                        >
                          Salvar Alterações
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Alunos desta turma */}
                  {alunos.length === 0 ? (
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', padding: '8px 0', textAlign: 'center' }}>
                      Nenhum aluno nesta turma ainda. Os alunos escolhem a turma ao fazer o login.
                    </p>
                  ) : (
                    <div className="turma-alunos-list">
                      {alunos.map((aluno, idx) => (
                        <div key={aluno.email} className="turma-aluno-row">
                          <div className="aluno-avatar-mini">
                            {aluno.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <div style={{ flex: 1 }}>
                            <strong style={{ fontSize: 13, display: 'block' }}>{aluno.name}</strong>
                            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{aluno.email}</span>
                          </div>
                          <span className="aluno-xp-badge">{aluno.points || 0} XP</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Alunos sem turma */}
          {getSemTurma().length > 0 && (
            <div className="card-nature turma-card">
              <div className="turma-card-header">
                <div className="turma-foto-placeholder" style={{ background: '#f5f5f5' }}>
                  <Users size={24} style={{ opacity: 0.3 }} />
                </div>
                <div className="turma-info">
                  <h4 style={{ color: 'var(--text-muted)' }}>Sem Turma</h4>
                  <span className="turma-meta">{getSemTurma().length} aluno{getSemTurma().length !== 1 ? 's' : ''} não agrupados</span>
                </div>
              </div>
              <div className="turma-alunos-list">
                {getSemTurma().map((aluno) => (
                  <div key={aluno.email} className="turma-aluno-row">
                    <div className="aluno-avatar-mini" style={{ background: 'var(--text-muted)' }}>
                      {aluno.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: 13, display: 'block' }}>{aluno.name}</strong>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{aluno.email}</span>
                    </div>
                    <span className="aluno-xp-badge">{aluno.points || 0} XP</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ====== ABA: FEEDBACK ====== */}
      {activeTab === 'feedback' && (
        <div className="admin-chart-section card-nature feedback-section animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <MessageSquare size={20} className="text-green" />
            <h3 style={{ margin: 0 }}>💬 Opinião dos Alunos: Vocês gostaram da aula de hoje?</h3>
          </div>
          <p className="chart-subtitle">Resumo das reações enviadas pelos estudantes</p>

          {(() => {
            const emojiCounts = { '😍': 0, '🙂': 0, '😐': 0, '😢': 0 };
            feedbackList.forEach(f => {
              if (emojiCounts[f.vote] !== undefined) emojiCounts[f.vote]++;
            });
            const emojiLabels = { '😍': 'Adorei!', '🙂': 'Gostei', '😐': 'Regular', '😢': 'Não gostei' };

            return feedbackList.length === 0 ? (
              <p className="no-data">Nenhum feedback enviado pelos alunos ainda.</p>
            ) : (
              <div className="feedback-admin-dashboard">
                <div className="feedback-reactions-summary" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))',
                  gap: '8px',
                  margin: '16px 0 20px 0'
                }}>
                  {Object.keys(emojiCounts).map((emo) => {
                    const count = emojiCounts[emo] || 0;
                    const percentage = Math.round((count / feedbackList.length) * 100) || 0;
                    return (
                      <div key={emo} className="summary-reaction-card" style={{
                        backgroundColor: 'var(--bg-app)',
                        padding: '10px 8px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
                      }}>
                        <span style={{ fontSize: '24px' }}>{emo}</span>
                        <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', margin: '4px 0' }}>{emojiLabels[emo]}</span>
                        <strong style={{ fontSize: '12px', color: 'var(--text-main)' }}>{count} {count === 1 ? 'voto' : 'votos'}</strong>
                        <span style={{ fontSize: '10px', color: 'var(--primary-dark)', fontWeight: '700' }}>({percentage}%)</span>
                      </div>
                    );
                  })}
                </div>

                <div className="feedback-details-list">
                  <h4 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>Respostas Individuais</h4>
                  <div className="feedback-scroll-list" style={{
                    maxHeight: '300px', overflowY: 'auto',
                    border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', backgroundColor: 'white'
                  }}>
                    {feedbackList.map((f, idx) => (
                      <div key={idx} className="feedback-row-item" style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '10px 14px',
                        borderBottom: idx === feedbackList.length - 1 ? 'none' : '1px solid var(--border-color)',
                        fontSize: '12px'
                      }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <strong style={{ color: 'var(--text-main)' }}>{f.name}</strong>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{f.email}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '18px' }}>{f.vote}</span>
                          <strong style={{ color: 'var(--primary-dark)' }}>{emojiLabels[f.vote]}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
      {/* ====== ABA: NOTAS ====== */}
      {activeTab === 'notas' && (
        <div className="notas-section animate-fade-in">
          <div className="card-nature" style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 4 }}>📝 Tabela de Notas por Atividade</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
              Cada atividade realizada pelo aluno vale pontos que são convertidos em nota. Quanto mais o aluno participa, maior a nota!
            </p>
            {/* Legenda de atividades */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 16 }}>
              {Object.values(ACTIVITY_POINTS).map((act) => (
                <div key={act.label} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'var(--bg-app)', padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)', fontSize: 11
                }}>
                  <span style={{ fontSize: 16 }}>{act.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{act.label}</div>
                    <div style={{ color: 'var(--primary-dark)', fontWeight: 600 }}>+{act.pts} XP</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Escala de conceitos */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[['A+','#2e7d32','300+'],['A','#388e3c','200-299'],['B','#1976d2','150-199'],['C','#f57c00','100-149'],['D','#e53935','50-99'],['E','#9e9e9e','0-49']].map(([l,c,r]) => (
                <span key={l} style={{ fontSize: 10, fontWeight: 700, color: 'white', background: c, padding: '2px 8px', borderRadius: 20 }}>
                  {l} ({r} XP)
                </span>
              ))}
            </div>
          </div>

          {/* Tabela de alunos com notas */}
          {users.filter(u => !u.isAdmin).length === 0 ? (
            <div className="card-nature" style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>
              <p>Nenhum aluno registrado ainda.</p>
            </div>
          ) : (
            <div className="notas-table card-nature">
              <div className="notas-table-header">
                <span>Aluno</span>
                <span style={{ textAlign: 'center' }}>XP Total</span>
                <span style={{ textAlign: 'center' }}>Nota</span>
              </div>
              {[...users].filter(u => !u.isAdmin).sort((a, b) => (b.points||0) - (a.points||0)).map((aluno, idx) => {
                const nota = pontosParaNota(aluno.points || 0);
                // Calcular atividades do aluno
                const alunoPlants = plants.filter(p => p.studentEmail === aluno.email);
                const alunoPlantios = alunoPlants.length;
                const alunoAtualizacoes = alunoPlants.reduce((acc, p) => acc + Math.max(0, p.photos.length - 1), 0);
                const alunoPosts = posts.filter(p => p.studentEmail === aluno.email);
                const alunoFeedback = feedbackList.find(f => f.email === aluno.email);
                const alunoCurtidas = posts.reduce((acc, p) => acc + (p.likes.includes(aluno.email) ? 1 : 0), 0);
                const alunoComentarios = posts.reduce((acc, p) => acc + p.comments.filter(c => c.studentEmail === aluno.email).length, 0);
                const studentActs = getActivities().filter(a => (a.studentEmail || '').trim().toLowerCase() === aluno.email.trim().toLowerCase());
                const alunoQuizzes = studentActs.filter(a => a.type === 'quiz').length;
                const turma = turmas.find(t => t.id === aluno.turmaId);

                return (
                  <div key={aluno.email} className="notas-row">
                    <div className="notas-aluno-cell">
                      <div className="aluno-avatar-mini" style={{ background: idx === 0 ? '#fbc02d' : idx === 1 ? '#9e9e9e' : idx === 2 ? '#c97b2e' : 'var(--primary)' }}>
                        {idx + 1}
                      </div>
                      <div>
                        <strong style={{ fontSize: 13 }}>{aluno.name}</strong>
                        {turma && <span style={{ display: 'block', fontSize: 10, color: 'var(--text-muted)' }}>🏫 {turma.nome}</span>}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                          {alunoPlantios > 0 && <span className="nota-badge-act">🌱 {alunoPlantios} plantio{alunoPlantios>1?'s':''}</span>}
                          {alunoAtualizacoes > 0 && <span className="nota-badge-act">📸 {alunoAtualizacoes} atualiz.</span>}
                          {alunoCurtidas > 0 && <span className="nota-badge-act">❤️ {alunoCurtidas} curtida{alunoCurtidas>1?'s':''}</span>}
                          {alunoComentarios > 0 && <span className="nota-badge-act">💬 {alunoComentarios} coment.</span>}
                          {alunoQuizzes > 0 && <span className="nota-badge-act">🏆 {alunoQuizzes} quiz{alunoQuizzes>1?'zes':''}</span>}
                          {alunoFeedback && <span className="nota-badge-act">😍 feedback</span>}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <strong style={{ fontSize: 15, color: 'var(--primary-dark)' }}>{aluno.points || 0}</strong>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>XP</div>
                    </div>
                    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <span style={{
                        fontSize: 20, fontWeight: 900,
                        color: nota.cor,
                        background: nota.cor + '22',
                        padding: '4px 12px',
                        borderRadius: 8,
                        display: 'inline-block'
                      }}>{nota.letra}</span>
                      <button
                        onClick={() => setSelectedStudent(aluno)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--primary-dark)',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          padding: '2px 6px',
                        }}
                      >
                        🔍 Ver Atividades
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODAL DE HISTÓRICO DE ATIVIDADES DO ALUNO */}
      {selectedStudent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '16px',
        }} onClick={() => setSelectedStudent(null)}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
          }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{
              padding: '16px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f9fafb',
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', color: '#111827', fontWeight: 800 }}>
                  📋 Histórico de Atividades
                </h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
                  {selectedStudent.name} ({selectedStudent.email})
                </p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                style={{
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#4b5563',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Resumo */}
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#f0fdf4',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <span style={{ fontSize: '12px', color: '#166534', fontWeight: 700 }}>
                  🏫 Turma: {turmas.find(t => t.id === selectedStudent.turmaId)?.nome || 'Sem Turma'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#166534', backgroundColor: '#dcfce7', padding: '4px 8px', borderRadius: '8px' }}>
                  {selectedStudent.points || 0} XP
                </span>
                <span style={{
                  fontSize: '13px',
                  fontWeight: 900,
                  color: pontosParaNota(selectedStudent.points || 0).cor,
                  backgroundColor: pontosParaNota(selectedStudent.points || 0).cor + '15',
                  padding: '4px 8px',
                  borderRadius: '8px',
                }}>
                  Nota: {pontosParaNota(selectedStudent.points || 0).letra}
                </span>
              </div>
            </div>

            {/* List */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              {getStudentActivities(selectedStudent.email).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 16px', color: '#9ca3af' }}>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Nenhuma atividade registrada</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>O aluno ainda não interagiu com o aplicativo.</p>
                </div>
              ) : (
                getStudentActivities(selectedStudent.email).map((act, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: '#f9fafb',
                    border: '1px solid #f3f4f6',
                  }}>
                    <div style={{
                      fontSize: '20px',
                      backgroundColor: '#ffffff',
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    }}>
                      {act.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 style={{ margin: 0, fontSize: '13px', color: '#1f2937', fontWeight: 700 }}>
                          {act.title}
                        </h4>
                        <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700 }}>
                          +{act.pts} XP
                        </span>
                      </div>
                      <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#4b5563', lineHeight: '1.4' }}>
                        {act.subtitle}
                      </p>
                      <div style={{ marginTop: '8px', fontSize: '10px', color: '#9ca3af', fontWeight: 500 }}>
                        📅 Realizado em: {act.date}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div style={{
              padding: '12px 16px',
              borderTop: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb',
              textAlign: 'right',
            }}>
              <button
                className="btn btn-secondary"
                style={{ padding: '6px 16px', fontSize: '12px', height: 'auto', border: '1px solid var(--border-color)' }}
                onClick={() => setSelectedStudent(null)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
