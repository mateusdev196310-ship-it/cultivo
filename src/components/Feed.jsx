import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, Send, Trash2, Loader2 } from 'lucide-react';
import { getPosts, toggleLikePost, addCommentToPost, deletePost, deleteComment, getUsers, formatDateBR, normalizeDbObject } from '../db';
import { supabase } from '../supabaseClient';

export default function Feed({ user }) {
  const [posts, setPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({}); // { [postId]: '' }
  const [loading, setLoading] = useState(true);

  // Estados do Toast
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const loadPosts = async () => {
    // Busca dados atualizados do servidor se estiver online
    if (supabase) {
      try {
        const [ { data: freshPosts }, { data: freshUsers } ] = await Promise.all([
          supabase.from('posts').select('*'),
          supabase.from('users').select('*')
        ]);
        if (freshPosts) {
          const normalizedPosts = normalizeDbObject(freshPosts);
          const localPosts = JSON.parse(localStorage.getItem('cultiva_posts') || '[]');
          const unsyncedPosts = localPosts.filter(lp => !normalizedPosts.some(sp => sp.id === lp.id));
          const sortedPosts = [...normalizedPosts, ...unsyncedPosts].sort((a, b) => b.id.localeCompare(a.id));
          localStorage.setItem('cultiva_posts', JSON.stringify(sortedPosts));
        }
        if (freshUsers) {
          const normalizedUsers = normalizeDbObject(freshUsers);
          localStorage.setItem('cultiva_users', JSON.stringify(normalizedUsers));
        }
      } catch (err) {
        console.warn('[Feed Sync] Erro ao buscar atualizações do Supabase:', err);
      }
    }

    const allPosts = getPosts();
    const allUsers = getUsers();
    
    // Mapeia o e-mail (em minúsculo e sem espaços) para o ID da turma
    const authorTurmaMap = {};
    allUsers.forEach(u => {
      if (u.email) {
        authorTurmaMap[u.email.trim().toLowerCase()] = u.turmaId;
      }
    });

    let filtered = [];
    if (user.isAdmin) {
      filtered = allPosts;
    } else {
      const currentUserEmail = (user.email || '').trim().toLowerCase();
      const currentUserTurmaId = user.turmaId;

      if (currentUserTurmaId) {
        // Aluno com turma vê apenas posts de alunos da mesma turma e seus próprios posts
        filtered = allPosts.filter(post => {
          const authorEmail = (post.studentEmail || '').trim().toLowerCase();
          return authorEmail === currentUserEmail || authorTurmaMap[authorEmail] === currentUserTurmaId;
        });
      } else {
        // Aluno sem turma vê apenas seus próprios posts para não misturar com outras turmas
        filtered = allPosts.filter(post => (post.studentEmail || '').trim().toLowerCase() === currentUserEmail);
      }
    }
    setPosts(filtered);
    setLoading(false);
  };

  // Carregar do cache imediatamente na inicialização
  useEffect(() => {
    const cachedPosts = getPosts();
    const allUsers = getUsers();
    
    const authorTurmaMap = {};
    allUsers.forEach(u => {
      if (u.email) {
        authorTurmaMap[u.email.trim().toLowerCase()] = u.turmaId;
      }
    });

    let initialPosts = [];
    if (user.isAdmin) {
      initialPosts = cachedPosts;
    } else {
      const currentUserEmail = (user.email || '').trim().toLowerCase();
      const currentUserTurmaId = user.turmaId;

      if (currentUserTurmaId) {
        initialPosts = cachedPosts.filter(post => {
          const authorEmail = (post.studentEmail || '').trim().toLowerCase();
          return authorEmail === currentUserEmail || authorTurmaMap[authorEmail] === currentUserTurmaId;
        });
      } else {
        initialPosts = cachedPosts.filter(post => (post.studentEmail || '').trim().toLowerCase() === currentUserEmail);
      }
    }
    setPosts(initialPosts);
    if (initialPosts.length > 0) {
      setLoading(false);
    }

    loadPosts();
  }, [user]);

  // Inscrição em Tempo Real para Notificar sobre novos Posts no Feed
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel('feed-new-posts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, (payload) => {
        const newPost = payload.new;
        if (!newPost) return;

        const currentUser = JSON.parse(localStorage.getItem('cultiva_user') || 'null');
        if (!currentUser) return;

        const authorEmail = (newPost.studentEmail || '').trim().toLowerCase();
        const currentUserEmail = (currentUser.email || '').trim().toLowerCase();

        // Não notifica se o autor do post for o próprio usuário
        if (authorEmail === currentUserEmail) return;

        // Verifica se é da mesma turma ou se é administrador
        const allUsers = JSON.parse(localStorage.getItem('cultiva_users') || '[]');
        const authorUser = allUsers.find(u => u.email && u.email.trim().toLowerCase() === authorEmail);
        const authorTurmaId = authorUser ? authorUser.turmaId : null;

        const isSameClass = currentUser.isAdmin || (currentUser.turmaId && currentUser.turmaId === authorTurmaId);

        if (isSameClass) {
          const notifEnabled = localStorage.getItem('cultiva_notif_enabled') === 'true';
          if (notifEnabled && Notification.permission === 'granted') {
            try {
              new Notification('🌿 Nova evolução no Feed!', {
                body: `${newPost.studentName} postou sobre ${newPost.plantName} (Dia ${newPost.day})!`,
                icon: '/favicon.svg',
                tag: 'cultiva-new-post-' + newPost.id,
              });
            } catch (e) {
              console.warn('[Realtime Notification] Erro ao disparar notificação:', e);
            }
          }
          // Recarrega em background para atualizar a lista
          loadPosts();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleLike = (postId) => {
    const updatedPost = toggleLikePost(postId, user.email);
    if (updatedPost) {
      setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
      const hasLiked = updatedPost.likes.includes(user.email);
      triggerToast(hasLiked ? "Você curtiu esta publicação! +5 XP 💖" : "Curtida removida.");
    }
  };

  const handleCommentSubmit = (e, postId) => {
    e.preventDefault();
    const commentText = commentInputs[postId];
    if (!commentText || !commentText.trim()) return;

    const updatedPost = addCommentToPost(postId, user.name, user.email, commentText.trim());
    if (updatedPost) {
      setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
      triggerToast("Comentário enviado! +10 XP 🌟");
    }
    
    // Limpar input do post correspondente
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const handleCommentChange = (postId, value) => {
    setCommentInputs(prev => ({ ...prev, [postId]: value }));
  };

  // Funções de moderação do Admin
  const handleDeletePost = (postId) => {
    if (window.confirm("Deseja realmente excluir esta postagem do feed?")) {
      deletePost(postId);
      setPosts(prev => prev.filter(p => p.id !== postId));
      triggerToast("Publicação excluída.");
    }
  };

  const handleDeleteComment = (postId, commentId) => {
    if (window.confirm("Deseja realmente excluir este comentário?")) {
      deleteComment(postId, commentId);
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments: p.comments.filter(c => c.id !== commentId)
          };
        }
        return p;
      }));
      triggerToast("Comentário excluído.");
    }
  };

  return (
    <div className="feed-container">
      <div className="feed-header-section">
        <h2>Feed Verde</h2>
        <p className="subtitle">Curta, comente e acompanhe o crescimento das plantas dos seus colegas de classe!</p>
      </div>

      <div className="posts-list">
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', gap: '12px' }}>
            <Loader2 className="spinner text-green" style={{ width: '36px', height: '36px', animation: 'spin 1.5s linear infinite', color: 'var(--primary)' }} />
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>Carregando publicações...</span>
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-state card-nature">
            <MessageSquare size={48} className="empty-icon text-muted" />
            <h3>O feed está vazio</h3>
            <p>Nenhum aluno publicou atualizações ainda. Registre ou atualize sua planta na Galeria para postar no feed!</p>
          </div>
        ) : (
          posts.map((post) => {
            const hasLiked = post.likes.includes(user.email);
            return (
              <div key={post.id} className="feed-post card-nature animate-slide-up">
                {/* Cabeçalho do Post */}
                <div className="post-header">
                  <div className="post-author-info">
                    <div className="author-avatar">
                      {post.studentName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <h4 style={{ margin: 0 }}>{post.studentName}</h4>
                        {post.day === 1 ? (
                          <span style={{ fontSize: '8px', backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '2px 6px', borderRadius: '8px', fontWeight: 800, textTransform: 'uppercase' }}>🌱 Novo Cultivo</span>
                        ) : (
                          <span style={{ fontSize: '8px', backgroundColor: '#fff3e0', color: '#e65100', padding: '2px 6px', borderRadius: '8px', fontWeight: 800, textTransform: 'uppercase' }}>📈 Evolução</span>
                        )}
                      </div>
                      <p className="post-meta" style={{ marginTop: '2px' }}>
                        Planta: <strong>{post.plantName}</strong> • Dia {post.day} • {formatDateBR(post.date)}
                      </p>
                    </div>
                  </div>

                  {/* Botão de Excluir Post (Moderação do Admin) */}
                  {user.isAdmin && (
                    <button 
                      className="btn-moderate" 
                      onClick={() => handleDeletePost(post.id)}
                      title="Excluir postagem"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                {/* Imagem do Post */}
                <div className="post-image">
                  <img src={post.url || "https://images.unsplash.com/photo-1532467411038-57680e4ded04?w=600&auto=format&fit=crop&q=60"} alt={post.plantName} />
                  <span className="post-stage-tag">{post.stageName}</span>
                </div>

                {/* Conteúdo / Legenda do Post */}
                <div className="post-body">
                  <p className="post-notes">
                    <strong>{post.studentName}:</strong> "{post.notes}"
                  </p>
                </div>

                {/* Rodapé do Post (Interações) */}
                <div className="post-actions">
                  <button 
                    className={`action-btn btn-like ${hasLiked ? 'liked' : ''}`}
                    onClick={() => handleLike(post.id)}
                  >
                    <Heart size={18} fill={hasLiked ? "currentColor" : "none"} />
                    <span>{post.likes.length} curtida{post.likes.length !== 1 ? 's' : ''}</span>
                  </button>

                  <div className="action-btn">
                    <MessageSquare size={18} />
                    <span>{post.comments.length} comentário{post.comments.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                {/* Comentários */}
                <div className="post-comments-section">
                  {post.comments.length > 0 && (
                    <div className="comments-list">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="comment-item">
                          <div className="comment-content">
                            <span className="comment-author">{comment.studentName}:</span>
                            <span className="comment-text"> {comment.text}</span>
                          </div>
                          
                          {/* Moderação de Comentário pelo Admin */}
                          {user.isAdmin && (
                            <button 
                              className="btn-moderate-small"
                              onClick={() => handleDeleteComment(post.id, comment.id)}
                              title="Excluir comentário"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Formulário de Novo Comentário */}
                  <form 
                    onSubmit={(e) => handleCommentSubmit(e, post.id)} 
                    className="comment-form"
                  >
                    <input
                      type="text"
                      placeholder="Escreva um comentário de incentivo..."
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => handleCommentChange(post.id, e.target.value)}
                      required
                    />
                    <button type="submit" className="btn-send-comment">
                      <Send size={16} />
                    </button>
                  </form>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Toast de Feedback */}
      <div className={`toast-notification ${showToast ? 'show' : ''}`}>
        <span>🌱</span>
        <span>{toastMessage}</span>
      </div>
    </div>
  );
}
