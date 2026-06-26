import React from 'react';
import { BookOpen, Camera, Share2, Shield, LogOut, Trophy } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, user, onLogout }) {
  return (
    <nav className="bottom-nav">
      <button 
        className={`nav-item ${activeTab === 'learn' ? 'active' : ''}`}
        onClick={() => setActiveTab('learn')}
      >
        <BookOpen size={20} />
        <span>Aprender</span>
      </button>

      <button 
        className={`nav-item ${activeTab === 'gallery' ? 'active' : ''}`}
        onClick={() => setActiveTab('gallery')}
      >
        <Camera size={20} />
        <span>Galeria</span>
      </button>

      <button 
        className={`nav-item ${activeTab === 'feed' ? 'active' : ''}`}
        onClick={() => setActiveTab('feed')}
      >
        <Share2 size={20} />
        <span>Feed Verde</span>
      </button>

      <button 
        className={`nav-item ${activeTab === 'ranking' ? 'active' : ''}`}
        onClick={() => setActiveTab('ranking')}
      >
        <Trophy size={20} />
        <span>Ranking</span>
      </button>

      {user.isAdmin && (
        <button 
          className={`nav-item ${activeTab === 'admin' ? 'active' : ''}`}
          onClick={() => setActiveTab('admin')}
        >
          <Shield size={20} />
          <span>Painel ADM</span>
        </button>
      )}

      <button 
        className="nav-item logout-btn"
        onClick={onLogout}
        title="Sair"
      >
        <LogOut size={20} />
        <span>Sair</span>
      </button>
    </nav>
  );
}
