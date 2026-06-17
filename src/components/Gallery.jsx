import React, { useState, useEffect } from 'react';
import { Plus, Camera, Sparkles, Calendar, ArrowLeft, Leaf, Eye, Send, Trash2 } from 'lucide-react';
import { getPlants, addPlant, updatePlantPhoto, compressImage, deletePlantPhoto, formatDateBR } from '../db';

const PHOTO_PRESETS = [
  { label: "Semente/Plantio", url: "https://images.unsplash.com/photo-1532467411038-57680e4ded04?w=600&auto=format&fit=crop&q=60" },
  { label: "Broto Inicial", url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop&q=60" },
  { label: "Primeiras Folhas", url: "https://images.unsplash.com/photo-1525498128493-380d1990a112?w=600&auto=format&fit=crop&q=60" },
  { label: "Planta Crescida", url: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&auto=format&fit=crop&q=60" }
];

export default function Gallery({ user, dbUpdateTick }) {
  const [plants, setPlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  
  // Estados de formulários
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  
  // Campos do novo registro
  const [newName, setNewName] = useState('');
  const [newSpecies, setNewSpecies] = useState('Feijão');
  const [newPhoto, setNewPhoto] = useState(PHOTO_PRESETS[0].url);
  const [newStageName, setNewStageName] = useState("Semente/Plantio");
  const [newNotes, setNewNotes] = useState('');

  // Campos de atualização semanal
  const [updateDay, setUpdateDay] = useState(7);
  const [updatePhoto, setUpdatePhoto] = useState(PHOTO_PRESETS[1].url);
  const [updateStageName, setUpdateStageName] = useState("Broto Inicial");
  const [updateNotes, setUpdateNotes] = useState('');

  // Campos do Diário Geral
  const [showDiaryForm, setShowDiaryForm] = useState(false);
  const [selectedDiaryPlantId, setSelectedDiaryPlantId] = useState('');
  const [diaryDay, setDiaryDay] = useState(1);
  const [diaryPhoto, setDiaryPhoto] = useState(PHOTO_PRESETS[1].url);
  const [diaryStageName, setDiaryStageName] = useState("Broto Inicial");
  const [diaryNotes, setDiaryNotes] = useState('');

  // Estado para exibir análise pós-publicação
  const [publishedAnalysis, setPublishedAnalysis] = useState(null);

  // Carregar plantas do DB
  const loadPlants = () => {
    // Alunos comuns vêem apenas suas plantas. Administrador vê tudo.
    const allPlants = getPlants();
    let studentPlants = [];
    if (user.isAdmin) {
      studentPlants = allPlants;
    } else {
      studentPlants = allPlants.filter(p => p.studentEmail === user.email);
    }
    setPlants(studentPlants);
    if (studentPlants.length > 0) {
      setSelectedDiaryPlantId(prev => prev || studentPlants[0].id);
    }
  };

  useEffect(() => {
    loadPlants();
  }, [user, dbUpdateTick]);

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
      newNotes.trim() || `Iniciei o cultivo de ${newName}!`,
      newStageName
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
      updateNotes.trim() || `Registro de acompanhamento da planta no Dia ${updateDay}.`,
      updateStageName
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

  const handleDeletePhoto = (plantId, day) => {
    if (!window.confirm("Deseja realmente remover esta foto da galeria? O post correspondente no feed também será removido.")) return;
    deletePlantPhoto(plantId, day);
    // Recarregar os dados
    const allPlants = getPlants();
    if (user.isAdmin) {
      setPlants(allPlants);
      const updated = allPlants.find(p => p.id === plantId);
      setSelectedPlant(updated || null);
    } else {
      const filtered = allPlants.filter(p => p.studentEmail === user.email);
      setPlants(filtered);
      const updated = filtered.find(p => p.id === plantId);
      setSelectedPlant(updated || null);
    }
  };

  const handleDiarySubmit = (e) => {
    e.preventDefault();
    if (!selectedDiaryPlantId) return;

    const plantToUpdate = plants.find(p => p.id === selectedDiaryPlantId);
    if (!plantToUpdate) return;

    const updated = updatePlantPhoto(
      selectedDiaryPlantId,
      diaryDay,
      diaryPhoto,
      diaryNotes.trim() || `Registro diário de ${plantToUpdate.name} no Dia ${diaryDay}.`,
      diaryStageName
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

    // Limpar e fechar
    setDiaryNotes('');
    setShowDiaryForm(false);
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
              <span>Início em: {formatDateBR(selectedPlant.startDate)}</span>
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
                const days = Math.max(1, Math.floor((new Date() - new Date(selectedPlant.startDate)) / (1000 * 60 * 60 * 24)) + 1);
                setUpdateDay(days);
                const presetIndex = Math.min(selectedPlant.photos.length, PHOTO_PRESETS.length - 1);
                setUpdatePhoto(PHOTO_PRESETS[presetIndex].url);
                setUpdateStageName(PHOTO_PRESETS[presetIndex].label);
                setShowUpdateForm(true);
              }}
            >
              <Camera size={18} style={{ marginRight: 8 }} /> 📖 Registrar no Diário
            </button>
          )}

          {/* FORMULÁRIO DE ATUALIZAÇÃO SEMANAL */}
          {showUpdateForm && (
            <form onSubmit={handleUpdatePlant} className="card-nature form-update animate-fade-in">
              <h3>📖 Novo Registro no Diário</h3>
              
              <div className="input-group">
                <label htmlFor="update-day-input">Dia do Cultivo</label>
                <input 
                  id="update-day-input"
                  type="number" 
                  min="1"
                  value={updateDay} 
                  onChange={(e) => setUpdateDay(parseInt(e.target.value) || 1)}
                  className="input-custom"
                  style={{
                    padding: '10px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    width: '100%'
                  }}
                  required
                />
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
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        try {
                          const compressed = await compressImage(file);
                          setUpdatePhoto(compressed);
                        } catch (err) {
                          console.error("Erro ao compactar foto:", err);
                        }
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
                  <p style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--primary-dark)', margin: '8px 0 4px 0' }}>❓ Em que fase está sua plantinha?</p>
                  <div className="preset-selector" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                    {PHOTO_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`preset-btn ${updateStageName === preset.label ? 'active' : ''}`}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: 600,
                          border: updateStageName === preset.label ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                          backgroundColor: updateStageName === preset.label ? 'var(--primary-light)' : 'white',
                          color: updateStageName === preset.label ? 'var(--primary-dark)' : 'var(--text-muted)',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          setUpdateStageName(preset.label);
                          // Se o usuário ainda não tirou uma foto própria (não é base64), atualiza para o preset correspondente
                          if (!updatePhoto || !updatePhoto.startsWith('data:')) {
                            setUpdatePhoto(preset.url);
                          }
                        }}
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
                        <img src={entry.url} alt={`Dia ${entry.day}`} />
                        <span className="stage-tag">{entry.stageName}</span>
                      </div>
                      
                      <div className="timeline-card-content">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <p className="date-small" style={{ margin: 0 }}>Registrado em: {formatDateBR(entry.date)}</p>
                          {user.isAdmin && (
                            <button
                              type="button"
                              onClick={() => handleDeletePhoto(selectedPlant.id, entry.day)}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#c62828',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '2px',
                                borderRadius: '4px'
                              }}
                              title="Remover esta foto do histórico"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
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
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {plants.length > 0 && (
                  <button 
                    className="btn btn-secondary animate-fade-in"
                    onClick={() => {
                      setSelectedDiaryPlantId(plants[0].id);
                      const days = Math.max(1, Math.floor((new Date() - new Date(plants[0].startDate)) / (1000 * 60 * 60 * 24)) + 1);
                      setDiaryDay(days);
                      setDiaryPhoto(PHOTO_PRESETS[1].url);
                      setDiaryStageName("Broto Inicial");
                      setShowDiaryForm(true);
                      setShowAddForm(false);
                    }}
                  >
                    📖 Diário da Planta
                  </button>
                )}
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    setNewPhoto(PHOTO_PRESETS[0].url);
                    setNewStageName("Semente/Plantio");
                    setShowAddForm(true);
                    setShowDiaryForm(false);
                  }}
                >
                  <Plus size={18} style={{ marginRight: 4 }} /> Nova Planta
                </button>
              </div>
            )}
          </div>

          {/* FORMULÁRIO DO DIÁRIO GERAL */}
          {showDiaryForm && (
            <form onSubmit={handleDiarySubmit} className="card-nature form-add-plant animate-slide-down">
              <h3>📖 Registrar no Diário da Planta</h3>
              
              <div className="input-group">
                <label htmlFor="diary-plant-select">Selecione qual Planta atualizar</label>
                <select
                  id="diary-plant-select"
                  value={selectedDiaryPlantId}
                  onChange={(e) => {
                    const plantId = e.target.value;
                    setSelectedDiaryPlantId(plantId);
                    const selected = plants.find(p => p.id === plantId);
                    if (selected) {
                      const days = Math.max(1, Math.floor((new Date() - new Date(selected.startDate)) / (1000 * 60 * 60 * 24)) + 1);
                      setDiaryDay(days);
                    }
                  }}
                  className="select-custom"
                  required
                >
                  {plants.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.species})</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="diary-day-input">Dia do Cultivo</label>
                <input
                  id="diary-day-input"
                  type="number"
                  min="1"
                  value={diaryDay}
                  onChange={(e) => setDiaryDay(parseInt(e.target.value) || 1)}
                  className="input-custom"
                  style={{
                    padding: '10px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    width: '100%'
                  }}
                  required
                />
              </div>

              {/* Botão de Câmera para Registrar no Diário */}
              <div className="input-group" style={{ marginBottom: '16px' }}>
                <label>Foto da Planta 📸</label>
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
                    onClick={() => document.getElementById('camera-diary-input').click()}
                  >
                    <Camera size={18} /> Câmera / Tirar Foto
                  </button>
                  <input
                    id="camera-diary-input"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    style={{ display: 'none' }}
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        try {
                          const compressed = await compressImage(file);
                          setDiaryPhoto(compressed);
                        } catch (err) {
                          console.error("Erro ao compactar foto:", err);
                        }
                      }
                    }}
                  />
                  {diaryPhoto && (
                    <div style={{ textAlign: 'center', marginTop: '4px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Pré-visualização da captura:</span>
                      <img
                        src={diaryPhoto}
                        alt="Preview diário"
                        style={{ maxWidth: '100%', maxHeight: '160px', borderRadius: '8px', objectFit: 'cover', border: '2px solid var(--primary)' }}
                      />
                    </div>
                  )}
                  <p style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--primary-dark)', margin: '8px 0 4px 0' }}>❓ Em que fase está sua plantinha?</p>
                  <div className="preset-selector" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                    {PHOTO_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`preset-btn ${diaryStageName === preset.label ? 'active' : ''}`}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: 600,
                          border: diaryStageName === preset.label ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                          backgroundColor: diaryStageName === preset.label ? 'var(--primary-light)' : 'white',
                          color: diaryStageName === preset.label ? 'var(--primary-dark)' : 'var(--text-muted)',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          setDiaryStageName(preset.label);
                          if (!diaryPhoto || !diaryPhoto.startsWith('data:')) {
                            setDiaryPhoto(preset.url);
                          }
                        }}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="diary-notes-input">Suas Anotações / Observações</label>
                <textarea
                  id="diary-notes-input"
                  placeholder="Como está sua planta hoje? Alguma novidade?"
                  value={diaryNotes}
                  onChange={(e) => setDiaryNotes(e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDiaryForm(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Registrar Diário 📖
                </button>
              </div>
            </form>
          )}

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
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        try {
                          const compressed = await compressImage(file);
                          setNewPhoto(compressed);
                        } catch (err) {
                          console.error("Erro ao compactar foto:", err);
                        }
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
                  <p style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--primary-dark)', margin: '8px 0 4px 0' }}>❓ Em que fase está sua plantinha?</p>
                  <div className="preset-selector" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                    {PHOTO_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`preset-btn ${newStageName === preset.label ? 'active' : ''}`}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: 600,
                          border: newStageName === preset.label ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                          backgroundColor: newStageName === preset.label ? 'var(--primary-light)' : 'white',
                          color: newStageName === preset.label ? 'var(--primary-dark)' : 'var(--text-muted)',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          setNewStageName(preset.label);
                          // Se o usuário ainda não tirou uma foto própria (não é base64), atualiza para o preset correspondente
                          if (!newPhoto || !newPhoto.startsWith('data:')) {
                            setNewPhoto(preset.url);
                          }
                        }}
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
                      <img src={lastPhoto?.url} alt={plant.name} />
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
