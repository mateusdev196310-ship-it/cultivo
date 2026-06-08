import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, Send, Trash2, ShieldAlert } from 'lucide-react';
import { getPosts, toggleLikePost, addCommentToPost, deletePost, deleteComment, getUsers } from '../db';

export default function Feed({ user }) {
  const [posts, setPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({}); // { [postId]: '' }

  const loadPosts = () => {
    const allPosts = getPosts();
    if (user.isAdmin) {
      setPosts(allPosts);
    } else {
      const allUsers = getUsers();
      const authorTurmaMap = {};
      allUsers.forEach(u => {
        authorTurmaMap[u.email] = u.turmaId;
      });

      if (user.turmaId) {
        // Aluno agrupado vê apenas posts de alunos da mesma turma
        setPosts(allPosts.filter(post => authorTurmaMap[post.studentEmail] === user.turmaId));
      } else {
        // Aluno não agrupado vê todos os posts
        setPosts(allPosts);
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
                  <img src={post.url} alt={`Plant update day ${post.day}`} referrerPolicy="no-referrer" />
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
