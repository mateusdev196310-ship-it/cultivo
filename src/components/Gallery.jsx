import React, { useState, useEffect } from 'react';
import { Plus, Camera, Sparkles, Calendar, ArrowLeft, Leaf, Eye, Send } from 'lucide-react';
import { getPlants, addPlant, updatePlantPhoto } from '../db';

const PHOTO_PRESETS = [
  { label: "Semente/Plantio", url: "https://images.unsplash.com/photo-1532467411038-57680e4ded04?w=600&auto=format&fit=crop&q=60" },
  { label: "Broto Inicial", url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop&q=60" },
  { label: "Primeiras Folhas", url: "https://images.unsplash.com/photo-1525498128493-380d1990a112?w=600&auto=format&fit=crop&q=60" },
  { label: "Planta Crescida", url: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&auto=format&fit=crop&q=60" }
];

export default function Gallery({ user }) {
  const [plants, setPlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  
  // Estados de formulários
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  
  // Campos do novo registro
  const [newName, setNewName] = useState('');
  const [newSpecies, setNewSpecies] = useState('Feijão');
  const [newPhoto, setNewPhoto] = useState(PHOTO_PRESETS[0].url);
  const [newNotes, setNewNotes] = useState('');

  // Campos de atualização semanal
  const [updateDay, setUpdateDay] = useState(7);
  const [updatePhoto, setUpdatePhoto] = useState(PHOTO_PRESETS[1].url);
  const [updateNotes, setUpdateNotes] = useState('');

  // Estado para exibir análise pós-publicação
  const [publishedAnalysis, setPublishedAnalysis] = useState(null);

  // Carregar plantas do DB
  const loadPlants = () => {
    // Alunos comuns vêem apenas suas plantas. Administrador vê tudo.
    const allPlants = getPlants();
    if (user.isAdmin) {
      setPlants(allPlants);
    } else {
      setPlants(allPlants.filter(p => p.studentEmail === user.email));
    }
  };

  useEffect(() => {
    loadPlants();
  }, [user]);

  // Submeter nova planta (Dia 1)
  const handleAddPlant = (e) => {
    e.preventDefault();
    if (!newName || !newSpecies) return;

    const newPlant = addPlant(
      user.name,
      user.email,
      newName.trim(),
      newSpecies,
      newPhoto,
      newNotes.trim() || `Iniciei o cultivo de ${newName}!`
    );

    if (newPlant && newPlant.photos && newPlant.photos.length > 0) {
      const entry = newPlant.photos[newPlant.photos.length - 1];
      setPublishedAnalysis({
        name: newPlant.name,
        stageName: entry.stageName,
        analysis: entry.analysis,
        day: entry.day,
        url: entry.url
      });
    }

    // Limpar formulário e recarregar
    setNewName('');
    setNewNotes('');
    setNewPhoto(PHOTO_PRESETS[0].url);
    setShowAddForm(false);
    loadPlants();
  };

  // Submeter atualização de foto
  const handleUpdatePlant = (e) => {
    e.preventDefault();
    if (!selectedPlant) return;

    const updated = updatePlantPhoto(
      selectedPlant.id,
      updateDay,
      updatePhoto,
      updateNotes.trim() || `Registro de acompanhamento da planta no Dia ${updateDay}.`
    );

    if (updated && updated.photos && updated.photos.length > 0) {
      const entry = updated.photos[updated.photos.length - 1];
      setPublishedAnalysis({
        name: updated.name,
        stageName: entry.stageName,
        analysis: entry.analysis,
        day: entry.day,
        url: entry.url
      });
    }

    // Resetar formulário
    setUpdateNotes('');
    setShowUpdateForm(false);
    
    // Atualizar planta selecionada no detalhe
    setSelectedPlant(updated);
    loadPlants();
  };

  return (
    <div className="gallery-container">
      {/* Pop-up de Análise Inteligente Pós-Publicação */}
      {publishedAnalysis && (
        <div className="analysis-alert-overlay" style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px',
          backdropFilter: 'blur(4px)'
        }}>
          <div className="analysis-alert-card card-nature animate-scale-up" style={{
            maxWidth: '450px',
            width: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
            border: '2px solid var(--primary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-dark)' }}>
              <Sparkles size={24} style={{ color: '#fbc02d' }} />
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Análise de Evolução Concluída!</h3>
            </div>
            
            <p style={{ fontSize: '13px', margin: 0, color: 'var(--text-muted)' }}>
              O Cultiva APP identificou com sucesso o estágio atual de <strong>{publishedAnalysis.name}</strong>.
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: '#f1f8e9',
              padding: '12px',
              borderRadius: '12px',
              border: '1px solid #c5e1a5'
            }}>
              <img
                src={publishedAnalysis.url}
                alt="Fase identificada"
                style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }}
              />
              <div>
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--primary-dark)', textTransform: 'uppercase' }}>Fase Identificada</span>
                <h4 style={{ margin: '2px 0', fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>{publishedAnalysis.stageName}</h4>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Dia de cultivo: {publishedAnalysis.day}</span>
              </div>
            </div>

            <div className="ai-analysis-box" style={{
              backgroundColor: '#fffde7',
              borderLeft: '4px solid #fbc02d',
              padding: '12px 16px',
              borderRadius: '4px'
            }}>
              <h5 style={{ margin: '0 0 6px 0', fontSize: '12px', fontWeight: 700, color: '#f57f17', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} /> Laudo da IA Cultiva:
              </h5>
              <p style={{ fontSize: '12px', margin: 0, lineHeight: 1.5, color: '#5d4037', fontWeight: 500 }}>
                {publishedAnalysis.analysis}
              </p>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={() => setPublishedAnalysis(null)}
              style={{ padding: '12px', fontSize: '14px', fontWeight: 700, borderRadius: '8px', cursor: 'pointer' }}
            >
              Excelente, entendi! 🌱
            </button>
          </div>
        </div>
      )}

      {/* 1. VISÃO DETALHADA DA PLANTA */}
      {selectedPlant ? (
        <div className="plant-detail animate-slide-up">
          <button className="btn-back" onClick={() => setSelectedPlant(null)}>
            <ArrowLeft size={16} /> Voltar à Galeria
          </button>

          <div className="plant-detail-header">
            <div className="title-area">
              <h2>{selectedPlant.name}</h2>
              <span className="species-badge">{selectedPlant.species}</span>
            </div>
            <p className="student-tag">Cultivado por: <strong>{selectedPlant.studentName}</strong></p>
            <div className="date-tag">
              <Calendar size={14} />
              <span>Início em: {selectedPlant.startDate}</span>
            </div>
          </div>

          {/* Regra de frequência de 7 dias */}
          {!user.isAdmin && selectedPlant.studentEmail === user.email && (() => {
            const lastPhoto = selectedPlant.photos[selectedPlant.photos.length - 1];
            const lastDateStr = lastPhoto ? lastPhoto.date : selectedPlant.startDate;
            const lastDate = new Date(lastDateStr);
            const today = new Date();
            const diffTime = Math.abs(today - lastDate);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const daysLeft = 7 - diffDays;
            const isEligible = diffDays >= 7;

            return (
              <div 
                className="schedule-banner-box animate-fade-in"
                style={{
                  border: '1px solid ' + (isEligible ? 'var(--primary)' : 'var(--accent)'),
                  backgroundColor: isEligible ? 'var(--primary-light)' : 'var(--accent-light)',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  color: isEligible ? 'var(--primary-dark)' : '#5d4037',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>📅</span>
                <span>
                  {isEligible 
                    ? "Excelente! Já se passaram 7 dias desde o último registro. Envie sua nova foto semanal!" 
                    : `Cronograma: Faltam ${daysLeft} dia(s) para completar o intervalo de 7 dias de evolução. (Liberação automática ativa para testes de pódio).`}
                </span>
              </div>
            );
          })()}

          {/* Botão de adicionar atualização semanal */}
          {!user.isAdmin && selectedPlant.studentEmail === user.email && !showUpdateForm && (
            <button 
              className="btn btn-primary btn-block update-trigger-btn"
              onClick={() => {
                const lastPhoto = selectedPlant.photos[selectedPlant.photos.length - 1];
                const nextDay = lastPhoto ? lastPhoto.day + 7 : 7;
                setUpdateDay(nextDay);
                const presetIndex = Math.min(selectedPlant.photos.length, PHOTO_PRESETS.length - 1);
                setUpdatePhoto(PHOTO_PRESETS[presetIndex].url);
                setShowUpdateForm(true);
              }}
            >
              <Camera size={18} style={{ marginRight: 8 }} /> Registrar Foto Semanal
            </button>
          )}

          {/* FORMULÁRIO DE ATUALIZAÇÃO SEMANAL */}
          {showUpdateForm && (
            <form onSubmit={handleUpdatePlant} className="card-nature form-update animate-fade-in">
              <h3>Nova Atualização Semanal</h3>
              
              <div className="input-group">
                <label>Dia do Cultivo</label>
                <select 
                  value={updateDay} 
                  onChange={(e) => setUpdateDay(parseInt(e.target.value))}
                  className="select-custom"
                >
                  <option value={7}>Dia 7 (Uma Semana)</option>
                  <option value={14}>Dia 14 (Duas Semanas)</option>
                  <option value={21}>Dia 21 (Três Semanas)</option>
                  <option value={28}>Dia 28 (Quatro Semanas)</option>
                  <option value={35}>Dia 35 (Cinco Semanas)</option>
                </select>
              </div>

              {/* Botão de Câmera para Atualização Semanal */}
              <div className="input-group" style={{ marginBottom: '16px' }}>
                <label>Tirar Foto da Planta 📸</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '10px',
                      backgroundColor: 'var(--bg-app)',
                      border: '1px dashed var(--primary)',
                      cursor: 'pointer'
                    }}
                    onClick={() => document.getElementById('camera-update-input').click()}
                  >
                    <Camera size={18} /> Câmera / Tirar Foto
                  </button>
                  <input
                    id="camera-update-input"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => setUpdatePhoto(ev.target.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  {updatePhoto && (
                    <div style={{ textAlign: 'center', marginTop: '4px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Pré-visualização da captura:</span>
                      <img
                        src={updatePhoto}
                        alt="Preview evolução"
                        style={{ maxWidth: '100%', maxHeight: '160px', borderRadius: '8px', objectFit: 'cover', border: '2px solid var(--primary)' }}
                      />
                    </div>
                  )}
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Ou escolha um exemplo:</p>
                  <div className="preset-selector" style={{ marginTop: '4px' }}>
                    {PHOTO_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`preset-btn ${updatePhoto === preset.url ? 'active' : ''}`}
                        onClick={() => setUpdatePhoto(preset.url)}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="input-group">
                <label>Suas Anotações / Observações</label>
                <textarea
                  placeholder="Como está sua planta? Alguma folha nova? Como está a rega?"
                  value={updateNotes}
                  onChange={(e) => setUpdateNotes(e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowUpdateForm(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Salvar e Analisar <Send size={14} style={{ marginLeft: 6 }} />
                </button>
              </div>
            </form>
          )}

          {/* TIMELINE DE EVOLUÇÃO */}
          <div className="evolution-timeline">
            <h3>Linha do Tempo da Evolução</h3>
            
            {selectedPlant.photos.length === 0 ? (
              <p>Nenhuma foto registrada ainda.</p>
            ) : (
              <div className="timeline-list">
                {selectedPlant.photos.map((entry, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-badge-day">
                      <span>Dia</span>
                      <strong>{entry.day}</strong>
                    </div>

                    <div className="timeline-card card-nature">
                      <div className="timeline-card-image">
                        <img src={entry.url} alt={`Dia ${entry.day}`} referrerPolicy="no-referrer" />
                        <span className="stage-tag">{entry.stageName}</span>
                      </div>
                      
                      <div className="timeline-card-content">
                        <p className="date-small">Registrado em: {entry.date}</p>
                        <p className="notes-text">💬 <strong>Minha Anotação:</strong> "{entry.notes}"</p>
                        
                        {/* Caixa de Análise por IA */}
                        <div className="ai-analysis-box">
                          <div className="ai-header">
                            <Sparkles size={16} className="text-yellow" />
                            <h5>Análise Inteligente Cultiva</h5>
                          </div>
                          <p>{entry.analysis}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* 2. LISTAGEM GERAL DE PLANTAS NA GALERIA */
        <div>
          <div className="gallery-header-section">
            <div>
              <h2>Galeria Verde</h2>
              <p className="subtitle">
                {user.isAdmin 
                  ? "Veja o cultivo e acompanhamento de todos os estudantes da escola." 
                  : "Acompanhe suas plantinhas e registre fotos a cada 7 dias para análise."}
              </p>
            </div>
            
            {!user.isAdmin && (
              <button 
                className="btn btn-primary"
                onClick={() => setShowAddForm(true)}
              >
                <Plus size={18} style={{ marginRight: 4 }} /> Nova Planta
              </button>
            )}
          </div>

          {/* FORMULÁRIO PARA CADASTRAR NOVA PLANTA */}
          {showAddForm && (
            <form onSubmit={handleAddPlant} className="card-nature form-add-plant animate-slide-down">
              <h3>Iniciar Novo Cultivo 🌱</h3>
              
              <div className="input-group">
                <label htmlFor="plant-name">Nome da Planta</label>
                <input
                  id="plant-name"
                  type="text"
                  placeholder="Ex: Pepe, Pipoca, Verdejante"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="plant-species">Espécie / Tipo de Planta 🌿</label>
                <select
                  id="plant-species"
                  value={newSpecies}
                  onChange={(e) => setNewSpecies(e.target.value)}
                  className="select-custom"
                >
                  <optgroup label="🌱 Sementes Clássicas">
                    <option value="Feijão">Feijão 🫘</option>
                    <option value="Girassol">Girassol 🌻</option>
                  </optgroup>
                  <optgroup label="🥬 Hortaliças">
                    <option value="Alface">Alface 🥬</option>
                    <option value="Coentro">Coentro 🌿</option>
                    <option value="Cebolinha">Cebolinha 🧅</option>
                    <option value="Cebola">Cebola 🧅</option>
                    <option value="Manjericão">Manjericão 🌿</option>
                    <option value="Hortelã">Hortelã 🌱</option>
                  </optgroup>
                  <optgroup label="🍅 Frutas e Legumes">
                    <option value="Morango">Morango 🍓</option>
                    <option value="Tomate">Tomateiro 🍅</option>
                    <option value="Tomate-Cereja">Tomate-Cereja 🍒</option>
                    <option value="Pimentão">Pimentão 🫑</option>
                  </optgroup>
                </select>
              </div>

              {/* Botão de Câmera para Registrar Nova Planta */}
              <div className="input-group" style={{ marginBottom: '16px' }}>
                <label>Foto da Planta (Semente, Broto ou Vaso) 📸</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '10px',
                      backgroundColor: 'var(--bg-app)',
                      border: '1px dashed var(--primary)',
                      cursor: 'pointer'
                    }}
                    onClick={() => document.getElementById('camera-new-input').click()}
                  >
                    <Camera size={18} /> Câmera / Tirar Foto
                  </button>
                  <input
                    id="camera-new-input"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => setNewPhoto(ev.target.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  {newPhoto && (
                    <div style={{ textAlign: 'center', marginTop: '4px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Pré-visualização da captura:</span>
                      <img
                        src={newPhoto}
                        alt="Preview planta"
                        style={{ maxWidth: '100%', maxHeight: '160px', borderRadius: '8px', objectFit: 'cover', border: '2px solid var(--primary)' }}
                      />
                    </div>
                  )}
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Ou escolha um exemplo:</p>
                  <div className="preset-selector" style={{ marginTop: '4px' }}>
                    {PHOTO_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`preset-btn ${newPhoto === preset.url ? 'active' : ''}`}
                        onClick={() => setNewPhoto(preset.url)}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="plant-notes">Anotação Inicial</label>
                <textarea
                  id="plant-notes"
                  placeholder="Onde plantou? Como preparou a terra?"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Plantar!
                </button>
              </div>
            </form>
          )}

          {/* GRID DE CARTÕES DE PLANTAS */}
          {plants.length === 0 ? (
            <div className="empty-state card-nature">
              <Leaf size={48} className="empty-icon text-muted" />
              <h3>Nenhuma planta registrada</h3>
              <p>
                {user.isAdmin 
                  ? "Nenhum estudante registrou plantas ainda." 
                  : "Comece plantando sua primeira sementinha e registre-a no botão acima!"}
              </p>
            </div>
          ) : (
            <div className="plants-grid">
              {plants.map((plant) => {
                const lastPhoto = plant.photos[plant.photos.length - 1];
                return (
                  <div 
                    key={plant.id} 
                    className="plant-card card-nature"
                    onClick={() => setSelectedPlant(plant)}
                  >
                    <div className="plant-card-image">
                      <img src={lastPhoto?.url} alt={plant.name} referrerPolicy="no-referrer" />
                      <span className="stage-badge">{lastPhoto?.stageName || 'Semente'}</span>
                    </div>

                    <div className="plant-card-content">
                      <div className="plant-card-title-row">
                        <h4>{plant.name}</h4>
                        <span className="species-tag">{plant.species}</span>
                      </div>
                      
                      {user.isAdmin && (
                        <p className="student-owner">Aluno: <strong>{plant.studentName}</strong></p>
                      )}
                      
                      <div className="plant-card-stats">
                        <span>Atualizações: <strong>{plant.photos.length}</strong></span>
                        <span>Dia: <strong>{lastPhoto?.day || 1}</strong></span>
                      </div>
                      
                      <button className="btn btn-secondary btn-sm btn-block">
                        <Eye size={14} style={{ marginRight: 4 }} /> Ver Evolução
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
