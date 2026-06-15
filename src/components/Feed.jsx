import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, Send, Trash2, ShieldAlert } from 'lucide-react';
import { getPosts, toggleLikePost, addCommentToPost, deletePost, deleteComment, getUsers } from '../db';
import { supabase } from '../supabaseClient';

export default function Feed({ user }) {
  const [posts, setPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({}); // { [postId]: '' }

  const loadPosts = async () => {
    // Busca dados atualizados do servidor se estiver online
    if (supabase) {
      try {
        const [ { data: freshPosts }, { data: freshUsers } ] = await Promise.all([
          supabase.from('posts').select('*'),
          supabase.from('users').select('*')
        ]);
        if (freshPosts) {
          const sortedPosts = [...freshPosts].sort((a, b) => b.id.localeCompare(a.id));
          localStorage.setItem('cultiva_posts', JSON.stringify(sortedPosts));
        }
        if (freshUsers) {
          localStorage.setItem('cultiva_users', JSON.stringify(freshUsers));
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

    if (user.isAdmin) {
      setPosts(allPosts);
    } else {
      const currentUserEmail = (user.email || '').trim().toLowerCase();
      const currentUserTurmaId = user.turmaId;

      if (currentUserTurmaId) {
        // Aluno com turma vê apenas posts de alunos da mesma turma e seus próprios posts
        setPosts(allPosts.filter(post => {
          const authorEmail = (post.studentEmail || '').trim().toLowerCase();
          return authorEmail === currentUserEmail || authorTurmaMap[authorEmail] === currentUserTurmaId;
        }));
      } else {
        // Aluno sem turma vê apenas seus próprios posts para não misturar com outras turmas
        setPosts(allPosts.filter(post => (post.studentEmail || '').trim().toLowerCase() === currentUserEmail));
      }
    }
  };

  useEffect(() => {
    loadPosts();
  }, [user]);

  const handleLike = (postId) => {
    toggleLikePost(postId, user.email);
    loadPosts();
  };

  const handleCommentSubmit = (e, postId) => {
    e.preventDefault();
    const commentText = commentInputs[postId];
    if (!commentText || !commentText.trim()) return;

    addCommentToPost(postId, user.name, user.email, commentText.trim());
    
    // Limpar input do post correspondente
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    loadPosts();
  };

  const handleCommentChange = (postId, value) => {
    setCommentInputs(prev => ({ ...prev, [postId]: value }));
  };

  // Funções de moderação do Admin
  const handleDeletePost = (postId) => {
    if (window.confirm("Deseja realmente excluir esta postagem do feed?")) {
      deletePost(postId);
      loadPosts();
    }
  };

  const handleDeleteComment = (postId, commentId) => {
    if (window.confirm("Deseja realmente excluir este comentário?")) {
      deleteComment(postId, commentId);
      loadPosts();
    }
  };

  return (
    <div className="feed-container">
      <div className="feed-header-section">
        <h2>Feed Verde</h2>
        <p className="subtitle">Curta, comente e acompanhe o crescimento das plantas dos seus colegas de classe!</p>
      </div>

      <div className="posts-list">
        {posts.length === 0 ? (
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
                      <h4>{post.studentName}</h4>
                      <p className="post-meta">
                        Planta: <strong>{post.plantName}</strong> • Dia {post.day} • {post.date}
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
    </div>
  );
}
