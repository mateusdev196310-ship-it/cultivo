import React, { useState } from 'react';
import { FEED_POSTS } from '../mockData';

export default function FeedTab({ studentInfo, completedCount, onNavigateToProfile }) {
  const [posts, setPosts] = useState(FEED_POSTS);

  const handleLike = (id) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        const isLiked = p.likedByMe;
        return {
          ...p,
          likes: isLiked ? p.likes - 1 : p.likes + 1,
          likedByMe: !isLiked
        };
      }
      return p;
    }));
  };

  return (
    <div className="feed-container">
      {/* Header Inside Content */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'var(--font-title)', fontWeight: 900, fontSize: '1.6rem', color: 'var(--blue-deep)' }}>
          Olá, {studentInfo.name.split(' ')[0]}! 👋
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Bem-vindo de volta ao seu painel de estudos.
        </p>
      </div>

      {/* Announcements Section */}
      <h3 className="section-title">
        <span>Últimas Atualizações</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', background: 'rgba(244,123,32,0.1)', padding: '4px 10px', borderRadius: '100px' }}>
          Charles Aquino
        </span>
      </h3>

      {posts.map((post) => (
        <div key={post.id} className="card">
          <div className="card-header">
            <span className="card-tag">{post.tag}</span>
            <span className="card-date">{post.date}</span>
          </div>
          <h4 className="card-title">{post.title}</h4>
          <p className="card-text">{post.text}</p>
          
          <div className="card-footer">
            <div className="card-author">
              <div className="author-avatar">CA</div>
              <span>{post.author}</span>
            </div>
            
            <div className="card-actions">
              <button 
                className="card-action-btn" 
                onClick={() => handleLike(post.id)}
                style={{ color: post.likedByMe ? 'var(--primary)' : 'var(--text-muted)', fontWeight: post.likedByMe ? '700' : '500' }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  width="16" 
                  height="16" 
                  fill={post.likedByMe ? "var(--primary)" : "none"} 
                  stroke={post.likedByMe ? "var(--primary)" : "currentColor"} 
                  strokeWidth="2.5"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span>{post.likes}</span>
              </button>
              
              <div className="card-action-btn">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  width="16" 
                  height="16" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <span>{post.commentsCount}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
