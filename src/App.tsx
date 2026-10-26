import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAppDispatch } from './app/hooks';
import { fetchBooks } from './features/books/booksSlice';
import Navbar from './components/Navbar';
import BookList from './features/books/components/BookList';
import { Loader2 } from 'lucide-react';

const StatsPage = lazy(() => import('./features/stats/StatsPage'));

const PageFallback: React.FC = () => (
  <div className="state-container loading-state" data-testid="suspense-fallback">
    <Loader2 className="spinner" size={36} />
    <p className="state-message">Đang nạp dữ liệu thống kê...</p>
  </div>
);

export const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchBooks(false));
  }, [dispatch]);

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content container">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="*" element={<BookList />} />
          </Routes>
        </Suspense>
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <p>
            <strong>Library</strong> — Hệ thống Quản lý Mượn/Trả Sách Chuyên Ngành
          </p>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
