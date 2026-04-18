// App.jsx - Main React Component with Firebase + Google OAuth
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import './App.css';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHzCgezkU_1ZzKvl__BxbOzvOFL1wSuFE",
  authDomain: "muka-tenders.firebaseapp.com",
  projectId: "muka-tenders",
  storageBucket: "muka-tenders.firebasestorage.app",
  messagingSenderId: "206677375315",
  appId: "1:206677375315:web:8b61253998fd08e14349a6",
  measurementId: "G-HSDXQSJJTG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  hd: 'mukatrade.com',
  prompt: 'select_account'
});

export { auth, firestore, googleProvider };

// ============================================
// LOGIN PAGE
// ============================================
function LoginPage({ onLoginSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Verify user is from mukatrade.com
      if (!user.email.endsWith('@mukatrade.com')) {
        await signOut(auth);
        setError('Please use your @mukatrade.com email address');
        return;
      }

      onLoginSuccess(user);
    } catch (err) {
      setError('Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🚀 Muka Tenders Dashboard</h1>
        <p>Tender Sourcing & Management Platform</p>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="login-button"
        >
          {loading ? 'Signing in...' : '🔐 Sign in with Google'}
        </button>

        {error && <div className="error-message">{error}</div>}

        <p className="login-note">
          Please sign in with your @mukatrade.com account
        </p>
      </div>
    </div>
  );
}

// ============================================
// DASHBOARD LAYOUT
// ============================================
function DashboardLayout({ user, children, onLogout }) {
  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>📊 Muka Tenders</h1>
          <p>Tender Pipeline Management</p>
        </div>
        <div className="header-right">
          <span className="user-email">{user.email}</span>
          <button onClick={onLogout} className="logout-button">Logout</button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <a href="/" className="nav-item">📈 Dashboard</a>
        <a href="/tenders" className="nav-item">📋 All Tenders</a>
        <a href="/sourcing" className="nav-item">🔍 Sourcing</a>
        <a href="/settings" className="nav-item">⚙️ Settings</a>
      </nav>

      <main className="dashboard-main">
        {children}
      </main>
    </div>
  );
}

// ============================================
// MAIN APP COMPONENT
// ============================================
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Monitor authentication state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email.endsWith('@mukatrade.com')) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {!user ? (
          <Route path="*" element={<LoginPage onLoginSuccess={setUser} />} />
        ) : (
          <Route path="*" element={
            <DashboardLayout user={user} onLogout={handleLogout}>
              <Dashboard user={user} />
            </DashboardLayout>
          } />
        )}
      </Routes>
    </BrowserRouter>
  );
}

// ============================================
// DASHBOARD COMPONENT
// ============================================
function Dashboard({ user }) {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTenders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchTenders = async () => {
    try {
      const { collection, query, where, orderBy, getDocs } = await import('firebase/firestore');

      // Query tenders assigned to user
      const q = query(
        collection(firestore, 'tenders'),
        where('assigned_to', '==', user.email),
        orderBy('deadline', 'asc')
      );

      const snapshot = await getDocs(q);
      const tendersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setTenders(tendersList);
    } catch (error) {
      console.error('Error fetching tenders:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePriority = (deadline) => {
    const today = new Date();
    const daysLeft = Math.floor((new Date(deadline) - today) / (1000 * 60 * 60 * 24));

    if (daysLeft <= 3) return { color: 'red', label: 'URGENT' };
    if (daysLeft <= 7) return { color: 'orange', label: 'MEDIUM' };
    return { color: 'green', label: 'PLANNING' };
  };

  const groupedTenders = {
    red: [],
    orange: [],
    green: []
  };

  tenders.forEach(tender => {
    const priority = calculatePriority(tender.deadline);
    groupedTenders[priority.color].push(tender);
  });

  if (loading) return <div className="loading">Loading tenders...</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-stats">
        <div className="stat">
          <div className="stat-value">{tenders.length}</div>
          <div className="stat-label">Active Tenders</div>
        </div>
        <div className="stat">
          <div className="stat-value" style={{color: '#d32f2f'}}>{groupedTenders.red.length}</div>
          <div className="stat-label">🔴 Urgent</div>
        </div>
        <div className="stat">
          <div className="stat-value" style={{color: '#ff9800'}}>{groupedTenders.orange.length}</div>
          <div className="stat-label">🟠 Medium</div>
        </div>
        <div className="stat">
          <div className="stat-value" style={{color: '#4caf50'}}>{groupedTenders.green.length}</div>
          <div className="stat-label">🟢 Planning</div>
        </div>
      </div>

      {groupedTenders.red.length > 0 && (
        <div className="tender-section">
          <h2>🔴 URGENT - Due within 3 days ({groupedTenders.red.length})</h2>
          <div className="tender-list">
            {groupedTenders.red.map(tender => (
              <TenderCard key={tender.id} tender={tender} priority="red" />
            ))}
          </div>
        </div>
      )}

      {groupedTenders.orange.length > 0 && (
        <div className="tender-section">
          <h2>🟠 MEDIUM - Due within 7 days ({groupedTenders.orange.length})</h2>
          <div className="tender-list">
            {groupedTenders.orange.map(tender => (
              <TenderCard key={tender.id} tender={tender} priority="orange" />
            ))}
          </div>
        </div>
      )}

      {groupedTenders.green.length > 0 && (
        <div className="tender-section">
          <h2>🟢 PLANNING - Due in 8+ days ({groupedTenders.green.length})</h2>
          <div className="tender-list">
            {groupedTenders.green.map(tender => (
              <TenderCard key={tender.id} tender={tender} priority="green" />
            ))}
          </div>
        </div>
      )}

      {tenders.length === 0 && (
        <div className="empty-state">
          <p>No tenders found. Check back soon! ⏳</p>
        </div>
      )}
    </div>
  );
}

// ============================================
// TENDER CARD COMPONENT
// ============================================
function TenderCard({ tender, priority }) {
  const priorityColors = {
    red: '#d32f2f',
    orange: '#ff9800',
    green: '#4caf50'
  };

  return (
    <div className="tender-card" style={{borderLeftColor: priorityColors[priority]}}>
      <div className="tender-header">
        <div>
          <h3>{tender.title}</h3>
          <p className="tender-location">{tender.embassy} ({tender.country})</p>
        </div>
        <div className="tender-number">{tender.tender_number}</div>
      </div>

      <div className="tender-details">
        <div className="detail-item">
          <span className="detail-label">Type:</span>
          <span>{tender.tender_type || 'RFQ'}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Deadline:</span>
          <span>{new Date(tender.deadline).toLocaleDateString()}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Items:</span>
          <span>{tender.items_count || '?'} items</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Status:</span>
          <span className="status-badge">{tender.status || 'Sourcing'}</span>
        </div>
      </div>

      <div className="tender-footer">
        <a href={tender.tender_url} target="_blank" rel="noopener noreferrer" className="tender-link">
          View Tender →
        </a>
        <button className="action-button">Review Details</button>
      </div>
    </div>
  );
}