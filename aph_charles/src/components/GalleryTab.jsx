import React, { useState } from 'react';
import { MODULES_DATA } from '../mockData';

// Simulated photo templates that students can choose to publish
const SAMPLE_TRAINING_IMAGES = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600",
    label: "Treino de Sutura"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600",
    label: "Treino de RCP"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600",
    label: "Aparato Hemostático"
  }
];

// Teacher comment replies pool to choose from when a student comments
const CHARLES_ANSWERS = [
  "Parabéns pelo comprometimento! A técnica correta salva vidas no primeiro atendimento.",
  "Muito bom! Lembre-se sempre de garantir a biossegurança antes de aplicar a bandagem.",
  "Excelente! Estabilizar a articulação distal e proximal é a chave de uma boa imobilização.",
  "Estou gostando de ver a dedicação. A prática constante gera a memória muscular necessária no trauma!",
  "Excelente aplicação da técnica descrita na diretriz do PHTLS!"
];

export default function GalleryTab({ isEnrolled, galleryPosts, setGalleryPosts, studentInfo, showToast }) {
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [isPostingModalOpen, setIsPostingModalOpen] = useState(false);
  
  // Post photo form states
  const [selectedSampleImg, setSelectedSampleImg] = useState(SAMPLE_TRAINING_IMAGES[0].url);
  const [postModuleId, setPostModuleId] = useState(1);
  const [postCaption, setPostCaption] = useState("");

  const handleLikePost = (postId, e) => {
    e.stopPropagation();
    setGalleryPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isLiked = post.likedByMe;
        return {
          ...post,
          likes: isLiked ? post.likes - 1 : post.likes + 1,
          likedByMe: !isLiked
        };
      }
      return post;
    }));
  };

  const handleDetailLike = (postId) => {
    setGalleryPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isLiked = post.likedByMe;
        const updated = {
          ...post,
          likes: isLiked ? post.likes - 1 : post.likes + 1,
          likedByMe: !isLiked
        };
        // update currently open modal state
        setSelectedPost(updated);
        return updated;
      }
      return post;
    }));
  };

  // Publish comment
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      user: studentInfo.name,
      avatar: studentInfo.avatar,
      text: commentText,
      date: "Agora mesmo"
    };

    const updatedPost = {
      ...selectedPost,
      comments: [...selectedPost.comments, newComment]
    };

    setGalleryPosts(prev => prev.map(p => p.id === selectedPost.id ? updatedPost : p));
    setSelectedPost(updatedPost);
    setCommentText("");
    showToast("Comentário publicado!", "success");

    // Trigger Charles Aquino feedback after 1.5 seconds
    setTimeout(() => {
      const randomCharlesReply = CHARLES_ANSWERS[Math.floor(Math.random() * CHARLES_ANSWERS.length)];
      const charlesComment = {
        id: Date.now() + 1,
        user: "Charles Aquino",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
        text: `@${studentInfo.name.split(' ')[0]} ${randomCharlesReply}`,
        date: "Agora mesmo",
        isCharles: true
      };

      setGalleryPosts(prev => prev.map(p => {
        if (p.id === selectedPost.id) {
          const withTeacherComment = {
            ...p,
            comments: [...p.comments, charlesComment]
          };
          // Sync open modal if it is still looking at this post
          setSelectedPost(prevOpen => prevOpen && prevOpen.id === p.id ? withTeacherComment : prevOpen);
          return withTeacherComment;
        }
        return p;
      }));
      showToast("Charles Aquino respondeu sua publicação!", "info");
    }, 1500);
  };

  // Publish new post
  const handlePublishPost = (e) => {
    e.preventDefault();
    if (!isEnrolled) {
      showToast("Matricule-se para compartilhar fotos na galeria!", "error");
      return;
    }

    const selectedModule = MODULES_DATA.find(m => m.id === Number(postModuleId));

    const newPost = {
      id: Date.now(),
      studentName: studentInfo.name,
      studentAvatar: studentInfo.avatar,
      moduleIndex: selectedModule.number,
      moduleTitle: `Módulo ${selectedModule.number}: ${selectedModule.title.split(':')[0]}`,
      image: selectedSampleImg,
      caption: postCaption || "Treinamento prático de APH na cena!",
      likes: 0,
      likedByMe: false,
      comments: []
    };

    setGalleryPosts(prev => [newPost, ...prev]);
    setIsPostingModalOpen(false);
    setPostCaption("");
    showToast("Foto da aula prática publicada com sucesso!", "success");

    // Auto teacher reply to the newly created post after 3 seconds
    setTimeout(() => {
      const charlesWelcomeComment = {
        id: Date.now() + 2,
        user: "Charles Aquino",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
        text: `Parabéns pela dedicação ao treinamento do Módulo ${selectedModule.number}, @${studentInfo.name.split(' ')[0]}! A prática com atenção aos detalhes é o diferencial na emergência.`,
        date: "Agora mesmo",
        isCharles: true
      };

      setGalleryPosts(prev => prev.map(p => {
        if (p.id === newPost.id) {
          const postWithTeacher = {
            ...p,
            comments: [charlesWelcomeComment]
          };
          if (selectedPost && selectedPost.id === newPost.id) {
            setSelectedPost(postWithTeacher);
          }
          return postWithTeacher;
        }
        return p;
      }));
    }, 3000);
  };

  return (
    <div className="gallery-container">
      <div className="section-title">
        <span>Mural da Turma</span>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          Aulas Práticas
        </span>
      </div>

      <div className="gallery-grid">
        {galleryPosts.map(post => (
          <div 
            key={post.id} 
            className="gallery-card"
            onClick={() => setSelectedPost(post)}
          >
            <div className="gallery-img-wrapper">
              <img src={post.image} alt="Prática" />
              <span className="gallery-card-module-tag">Mód. {post.moduleIndex}</span>
            </div>
            
            <div className="gallery-card-body">
              <div className="gallery-card-student">
                <img className="student-avatar-small" src={post.studentAvatar} alt={post.studentName} />
                <span className="student-name-small">{post.studentName}</span>
              </div>
              
              <p className="gallery-card-caption">{post.caption}</p>
              
              <div className="gallery-card-footer">
                <div 
                  className={`gallery-like-indicator ${post.likedByMe ? 'active' : ''}`}
                  onClick={(e) => handleLikePost(post.id, e)}
                  style={{ cursor: 'pointer' }}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    width="12" 
                    height="12" 
                    fill={post.likedByMe ? "var(--error)" : "none"} 
                    stroke={post.likedByMe ? "var(--error)" : "currentColor"} 
                    strokeWidth="2.5"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <span>{post.likes}</span>
                </div>
                
                <span>💬 {post.comments.length}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button to Post */}
      <button 
        className="gallery-post-float-btn"
        onClick={() => {
          if (!isEnrolled) {
            showToast("Você precisa estar matriculado para postar!", "error");
          } else {
            setIsPostingModalOpen(true);
          }
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>

      {/* Post photo modal form */}
      {isPostingModalOpen && (
        <div className="gallery-post-modal">
          <div className="gallery-detail-header">
            <button className="back-btn" onClick={() => setIsPostingModalOpen(false)}>
              ✕ Cancelar
            </button>
            <h4 style={{ fontFamily: 'var(--font-title)', fontWeight: 900, fontSize: '1.1rem', color: 'var(--blue-deep)' }}>
              Nova Publicação
            </h4>
            <div style={{ width: '40px' }}></div>
          </div>

          <form className="gallery-post-form" onSubmit={handlePublishPost}>
            <div className="form-group">
              <label className="form-label">1. Escolha a foto da sua aula prática</label>
              <div className="image-picker-container">
                {SAMPLE_TRAINING_IMAGES.map((img) => (
                  <div 
                    key={img.id}
                    className={`image-picker-option ${selectedSampleImg === img.url ? 'selected' : ''}`}
                    onClick={() => setSelectedSampleImg(img.url)}
                  >
                    <img src={img.url} alt={img.label} />
                    {selectedSampleImg === img.url && (
                      <div style={{ position: 'absolute', top: 4, right: 4, background: 'var(--primary)', color: 'white', borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>✓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">2. Módulo Correspondente</label>
              <select 
                className="form-select"
                value={postModuleId}
                onChange={(e) => setPostModuleId(e.target.value)}
              >
                {MODULES_DATA.map(m => (
                  <option key={m.id} value={m.id}>Módulo {m.number}: {m.title.split(' - ')[0]}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">3. Legenda da Publicação</label>
              <textarea 
                className="form-textarea"
                rows="4"
                placeholder="Escreva como foi o treinamento das manobras práticas, cite aprendizados e marque o professor se quiser!"
                value={postCaption}
                onChange={(e) => setPostCaption(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="form-publish-btn">
              Publicar no Mural da Turma
            </button>
          </form>
        </div>
      )}

      {/* Post detail modal view */}
      {selectedPost && (
        <div className="gallery-detail-overlay">
          <div className="gallery-detail-header">
            <button className="back-btn" onClick={() => setSelectedPost(null)}>
              ❮ Voltar
            </button>
            <h4 style={{ fontFamily: 'var(--font-title)', fontWeight: 900, fontSize: '1rem', color: 'var(--blue-deep)' }}>
              Publicação de {selectedPost.studentName.split(' ')[0]}
            </h4>
            <div style={{ width: '40px' }}></div>
          </div>

          <div className="gallery-detail-body">
            {/* Big photo */}
            <div className="gallery-detail-image-box">
              <img src={selectedPost.image} alt="Prática" />
            </div>

            {/* Student info */}
            <div className="gallery-detail-student-row">
              <div className="gallery-detail-student">
                <img className="student-avatar-md" src={selectedPost.studentAvatar} alt={selectedPost.studentName} />
                <div>
                  <div className="student-name-md">{selectedPost.studentName}</div>
                  <div className="student-module-md">{selectedPost.moduleTitle}</div>
                </div>
              </div>

              {/* Heart Likes */}
              <button 
                className={`like-detail-btn ${selectedPost.likedByMe ? 'active' : ''}`}
                onClick={() => handleDetailLike(selectedPost.id)}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  width="26" 
                  height="26" 
                  fill={selectedPost.likedByMe ? "var(--error)" : "none"} 
                  stroke={selectedPost.likedByMe ? "var(--error)" : "var(--text-light)"} 
                  strokeWidth="2"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)', textAlign: 'center', marginTop: '2px' }}>{selectedPost.likes}</div>
              </button>
            </div>

            {/* Legend text */}
            <div className="gallery-detail-caption-box">
              <p className="gallery-detail-caption">{selectedPost.caption}</p>
            </div>

            {/* Comments list */}
            <div className="gallery-comments-section">
              <div className="comments-title">Comentários ({selectedPost.comments.length})</div>
              
              <div className="comments-list">
                {selectedPost.comments.length === 0 ? (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', textAlign: 'center', margin: '20px 0' }}>Nenhum comentário ainda. Seja o primeiro a comentar!</p>
                ) : (
                  selectedPost.comments.map(c => (
                    <div key={c.id} className={`comment-item ${c.isCharles || c.user === "Charles Aquino" ? 'charles' : ''}`}>
                      <img className="comment-user-avatar" src={c.avatar} alt={c.user} />
                      <div className="comment-content">
                        <div className="comment-header-row">
                          <span className={`comment-user-name ${c.isCharles || c.user === "Charles Aquino" ? 'charles-tag' : ''}`}>
                            {c.user} {(c.isCharles || c.user === "Charles Aquino") && <span style={{ fontSize: '0.6rem', background: 'var(--primary)', color: 'white', padding: '1px 5px', borderRadius: '4px', fontWeight: 'bold' }}>PROFESSOR</span>}
                          </span>
                          <span className="comment-date">{c.date}</span>
                        </div>
                        <p className="comment-text">{c.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Add comment input */}
            <form className="comment-input-row" onSubmit={handleAddComment}>
              <input 
                type="text" 
                className="comment-input" 
                placeholder="Adicione um comentário..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button 
                type="submit" 
                className="comment-send-btn"
                disabled={!commentText.trim()}
              >
                ➔
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
