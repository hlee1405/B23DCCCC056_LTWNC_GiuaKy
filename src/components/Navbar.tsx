import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAppSelector } from '../app/hooks';
import { BookMarked, Sun, Moon, BarChart2, Library } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const borrowedCount = useAppSelector((state) => state.books.borrowedBookIds.length);

  return (
    <header className="site-header">
      <div className="header-inner container">
        <div className="header-brand">
          <Link to="/" className="brand-logo" data-testid="brand-logo">
            <div className="logo-icon-bg">
              <Library size={22} className="logo-icon" />
            </div>
            <div className="brand-text">
              <span className="brand-title">Library</span>
            </div>
          </Link>
        </div>

        <nav className="header-nav">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            data-testid="nav-home"
          >
            <BookMarked size={16} />
            <span>Tra cứu & Mượn sách</span>
          </Link>

          <Link
            to="/stats"
            className={`nav-link ${location.pathname === '/stats' ? 'active' : ''}`}
            data-testid="nav-stats"
          >
            <BarChart2 size={16} />
            <span>Thống kê</span>
            <span className="borrowed-chip" data-testid="nav-borrowed-chip">
              {borrowedCount}/3
            </span>
          </Link>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="btn btn-theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Chuyển sang nền tối' : 'Chuyển sang nền sáng'}
            data-testid="theme-toggle-btn"
          >
            {theme === 'light' ? (
              <>
                <Moon size={18} className="theme-icon moon-icon" />
                <span className="theme-text">Tối</span>
              </>
            ) : (
              <>
                <Sun size={18} className="theme-icon sun-icon" />
                <span className="theme-text">Sáng</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
