import React, { useState, useEffect } from 'react';
import './App.css';
import { GALLERY_POSTS_INITIAL } from './mockData';

// Component Imports
import FeedTab from './components/FeedTab';
import ModulesTab from './components/ModulesTab';
import QuizTab from './components/QuizTab';
import GalleryTab from './components/GalleryTab';
import EnrollTab from './components/EnrollTab';
import ProfileScreen from './components/ProfileScreen';

const STUDENT_DEFAULT = {
  name: "Dr. Mateus Dev",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120",
  email: "mateus@developer.com.br"
};

// Initial progress state for the 10 modules
const INITIAL_PROGRESS = {};
for (let i = 1; i <= 10; i++) {
  INITIAL_PROGRESS[i] = {
    pdfRead: false,
    videoWatched: false,
    quizScore: null,
    percent: 0
  };
}

export default function App() {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('feed');
  const [selectedModuleForQuiz, setSelectedModuleForQuiz] = useState(null);
  
  const [studentInfo, setStudentInfo] = useState(STUDENT_DEFAULT);
  const [moduleProgress, setModuleProgress] = useState(INITIAL_PROGRESS);
  const [galleryPosts, setGalleryPosts] = useState(GALLERY_POSTS_INITIAL);
  const [toast, setToast] = useState(null);

  // Auto-register service worker trigger on load
  useEffect(() => {
    // We already do this in main.jsx, but keep as double check
  }, []);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // State modification handlers
  const handleMarkPdfRead = (moduleId) => {
    setModuleProgress(prev => {
      const current = prev[moduleId] || { pdfRead: false, videoWatched: false, quizScore: null, percent: 0 };
      const updatedPdf = true;
      const updatedPercent = (updatedPdf ? 30 : 0) + (current.videoWatched ? 30 : 0) + (current.quizScore !== null && current.quizScore >= 7 ? 40 : 0);
      return {
        ...prev,
        [moduleId]: {
          ...current,
          pdfRead: updatedPdf,
          percent: Math.min(updatedPercent, 100)
        }
      };
    });
  };

  const handleMarkVideoWatched = (moduleId) => {
    setModuleProgress(prev => {
      const current = prev[moduleId] || { pdfRead: false, videoWatched: false, quizScore: null, percent: 0 };
      const updatedVideo = true;
      const updatedPercent = (current.pdfRead ? 30 : 0) + (updatedVideo ? 30 : 0) + (current.quizScore !== null && current.quizScore >= 7 ? 40 : 0);
      return {
        ...prev,
        [moduleId]: {
          ...current,
          videoWatched: updatedVideo,
          percent: Math.min(updatedPercent, 100)
        }
      };
    });
    showToast(`Vídeo do Módulo ${moduleId} concluído!`, "success");
  };

  const handleCompleteQuiz = (moduleId, score) => {
    setModuleProgress(prev => {
      const current = prev[moduleId] || { pdfRead: false, videoWatched: false, quizScore: null, percent: 0 };
      const passed = score >= 7;
      
      // Calculate percent: if quiz passed, it contributes 40%
      const updatedScore = score;
      const updatedPercent = (current.pdfRead ? 30 : 0) + (current.videoWatched ? 30 : 0) + (passed ? 40 : 0);
      
      return {
        ...prev,
        [moduleId]: {
          ...current,
          quizScore: updatedScore,
          percent: Math.min(updatedPercent, 100)
        }
      };
    });
  };

  const handleEnrollComplete = () => {
    setIsEnrolled(true);
    // Auto unlock and set tab back to feed or modules
    setTimeout(() => {
      setActiveTab('modules');
    }, 1500);
  };

  const handleResetAccount = () => {
    setIsEnrolled(false);
    setModuleProgress(INITIAL_PROGRESS);
    setGalleryPosts(GALLERY_POSTS_INITIAL);
    setActiveTab('feed');
  };

  const handleStartQuiz = (module) => {
    setSelectedModuleForQuiz(module);
    setActiveTab('quiz');
  };

  // Total modules completed count (percent === 100)
  const completedCount = Object.values(moduleProgress).filter(p => p.percent === 100).length;

  return (
    <div id="app-container">
      {/* Toast Notification */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            {toast.type === 'success' && <span>✓</span>}
            {toast.type === 'error' && <span>✕</span>}
            {toast.type === 'info' && <span>⚡</span>}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Global Header (shown for study tabs: feed, modules, quiz, gallery) */}
      {(activeTab === 'feed' || activeTab === 'modules' || activeTab === 'quiz' || activeTab === 'gallery') && (
        <header className="app-header">
          <div className="header-top">
            <div className="header-greeting">
              <h4>Charles Aquino</h4>
              <h2>Curso APH Premium</h2>
            </div>
            
            <button 
              className="header-profile-btn" 
              onClick={() => setActiveTab('profile')}
              title="Meu Perfil"
            >
              <img src={studentInfo.avatar} alt="Profile" />
            </button>
          </div>

          <div className="header-progress">
            <div className="progress-info">
              <span>Progresso Geral do Curso</span>
              <strong>{completedCount} de 10 concluídos</strong>
            </div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${(completedCount / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        </header>
      )}

      {/* Screen Render Router */}
      <main className="app-content">
        {activeTab === 'feed' && (
          <FeedTab 
            studentInfo={studentInfo} 
            completedCount={completedCount} 
            onNavigateToProfile={() => setActiveTab('profile')} 
          />
        )}
        
        {activeTab === 'modules' && (
          <ModulesTab 
            isEnrolled={isEnrolled}
            moduleProgress={moduleProgress}
            onStartQuiz={handleStartQuiz}
            onMarkVideoWatched={handleMarkVideoWatched}
            onMarkPdfRead={handleMarkPdfRead}
            showToast={showToast}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizTab 
            isEnrolled={isEnrolled}
            selectedModule={selectedModuleForQuiz}
            moduleProgress={moduleProgress}
            onCompleteQuiz={handleCompleteQuiz}
            studentInfo={studentInfo}
            showToast={showToast}
            onNavigateToTab={(tab) => {
              setSelectedModuleForQuiz(null);
              setActiveTab(tab);
            }}
          />
        )}

        {activeTab === 'gallery' && (
          <GalleryTab 
            isEnrolled={isEnrolled}
            galleryPosts={galleryPosts}
            setGalleryPosts={setGalleryPosts}
            studentInfo={studentInfo}
            showToast={showToast}
          />
        )}

        {activeTab === 'enroll' && (
          <EnrollTab 
            isEnrolled={isEnrolled}
            onEnrollComplete={handleEnrollComplete}
            showToast={showToast}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileScreen 
            isEnrolled={isEnrolled}
            studentInfo={studentInfo}
            moduleProgress={moduleProgress}
            onResetAccount={handleResetAccount}
            showToast={showToast}
          />
        )}
      </main>

      {/* Bottom Sticky Tab Navigation */}
      <nav className="bottom-nav">
        <button 
          className={`nav-item ${activeTab === 'feed' ? 'active' : ''}`}
          onClick={() => { setSelectedModuleForQuiz(null); setActiveTab('feed'); }}
        >
          <svg viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span>Feed</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'modules' ? 'active' : ''}`}
          onClick={() => { setSelectedModuleForQuiz(null); setActiveTab('modules'); }}
        >
          <svg viewBox="0 0 24 24">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          <span>Módulos</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'quiz' ? 'active' : ''}`}
          onClick={() => { setSelectedModuleForQuiz(null); setActiveTab('quiz'); }}
        >
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <span>Quiz</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'gallery' ? 'active' : ''}`}
          onClick={() => { setSelectedModuleForQuiz(null); setActiveTab('gallery'); }}
        >
          <svg viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <span>Galeria</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'enroll' ? 'active' : ''}`}
          onClick={() => { setSelectedModuleForQuiz(null); setActiveTab('enroll'); }}
        >
          <svg viewBox="0 0 24 24">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          <span>Matrícula</span>
        </button>
      </nav>
    </div>
  );
}
