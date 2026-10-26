import React, { useMemo, useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { borrowBook, returnBook, clearBorrowWarning, fetchBooks } from '../booksSlice';
import { useFilterStore } from '../../../store/filterStore';
import BookCard from './BookCard';
import FilterBar from './FilterBar';
import {
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  BookCheck,
  Inbox,
  LayoutGrid,
  List as ListIcon,
} from 'lucide-react';

export const BookList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, borrowedBookIds, status, error, warningMessage } = useAppSelector(
    (state) => state.books
  );
  const { searchQuery, category, viewMode, setViewMode } = useFilterStore();

  useEffect(() => {
    if (!warningMessage) return;

    const timer = window.setTimeout(() => {
      dispatch(clearBorrowWarning());
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [warningMessage, dispatch]);

  const handleBorrow = useCallback(
    (bookId: string) => {
      dispatch(borrowBook(bookId));
    },
    [dispatch]
  );

  const handleReturn = useCallback(
    (bookId: string) => {
      dispatch(returnBook(bookId));
    },
    [dispatch]
  );

  const handleRetry = useCallback(() => {
    dispatch(fetchBooks(false));
  }, [dispatch]);

  const handleCloseWarning = useCallback(() => {
    dispatch(clearBorrowWarning());
  }, [dispatch]);

  const filteredBooks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return items.filter((book) => {
      const matchesCategory = category === 'All' || book.category === category;
      const matchesQuery =
        query === '' ||
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });
  }, [items, searchQuery, category]);

  return (
    <div className="book-list-section">
      {warningMessage && (
        <div className="alert-banner warning-banner" role="alert" data-testid="borrow-warning">
          <div className="alert-content">
            <AlertTriangle className="alert-icon" size={20} />
            <span>{warningMessage}</span>
          </div>
          <button
            type="button"
            className="alert-close-btn"
            onClick={handleCloseWarning}
            aria-label="Đóng cảnh báo"
            data-testid="close-warning-btn"
          >
            ×
          </button>
        </div>
      )}

      <FilterBar />

      {status === 'loading' && (
        <div className="state-container loading-state" data-testid="loading-indicator">
          <div className="spinner" />
          <p className="state-message">Đang tải danh sách sách từ thư viện...</p>
        </div>
      )}

      {status === 'failed' && (
        <div className="state-container error-state" role="alert" data-testid="error-container">
          <AlertCircle size={40} className="error-icon" />
          <h3>Không thể tải dữ liệu</h3>
          <p className="state-message">{error}</p>
          <button
            type="button"
            className="btn btn-primary retry-btn"
            onClick={handleRetry}
            data-testid="retry-btn"
          >
            <RefreshCw size={16} />
            <span>Thử lại</span>
          </button>
        </div>
      )}

      {status === 'succeeded' && (
        <>
          <div className="list-meta-bar">
            <div className="meta-left-group">
              <span className="meta-results">
                Hiển thị <strong>{filteredBooks.length}</strong> / {items.length} đầu sách
              </span>
              <div className="meta-borrowed-count" data-testid="header-borrowed-summary">
                <BookCheck size={16} className="text-primary" />
                <span>
                  Đang mượn: <strong>{borrowedBookIds.length}</strong> / 3 cuốn
                </span>
              </div>
            </div>

            <div className="view-mode-toggle" role="group" aria-label="Chế độ hiển thị">
              <button
                type="button"
                className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Dạng Lưới"
                aria-label="Dạng Lưới"
                data-testid="view-mode-grid"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                type="button"
                className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="Dạng Danh sách"
                aria-label="Dạng Danh sách"
                data-testid="view-mode-list"
              >
                <ListIcon size={16} />
              </button>
            </div>
          </div>

          {filteredBooks.length === 0 ? (
            <div className="state-container empty-state" data-testid="empty-state">
              <Inbox size={48} className="empty-icon" />
              <h3>Không tìm thấy cuốn sách nào phù hợp</h3>
              <p>Hãy thử tìm từ khoá khác hoặc đặt lại bộ lọc thể loại.</p>
            </div>
          ) : (
            <div
              className={`books-container ${viewMode === 'list' ? 'book-list-layout' : 'book-grid'}`}
              data-testid="book-grid"
            >
              {filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  isBorrowed={borrowedBookIds.includes(book.id)}
                  onBorrow={handleBorrow}
                  onReturn={handleReturn}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookList;
