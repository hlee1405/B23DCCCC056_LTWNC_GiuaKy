import React from 'react';
import type { Book } from '../../../types/book';
import { Calendar, CheckCircle2, Bookmark } from 'lucide-react';

export interface BookCardProps {
  book: Book;
  isBorrowed: boolean;
  onBorrow: (bookId: string) => void;
  onReturn: (bookId: string) => void;
  viewMode?: 'grid' | 'list';
}

export const BookCard: React.FC<BookCardProps> = React.memo(({
  book,
  isBorrowed,
  onBorrow,
  onReturn,
  viewMode = 'grid',
}) => {
  const isOutOfStock = book.availableCopies <= 0;

  const getCategoryBadgeClass = (category: Book['category']) => {
    switch (category) {
      case 'CNTT':
        return 'badge-cntt';
      case 'Kinh tế':
        return 'badge-kinhte';
      case 'Ngoại ngữ':
        return 'badge-ngoaingu';
      default:
        return '';
    }
  };

  if (viewMode === 'list') {
    return (
      <article
        className={`book-card book-card-list ${isBorrowed ? 'borrowed-highlight' : ''}`}
        data-testid={`book-card-${book.id}`}
      >
        <div className="list-col-left">
          <div className="list-details">
            <div className="list-meta-top">
              <span
                className={`category-badge ${getCategoryBadgeClass(book.category)}`}
                data-testid="book-category"
              >
                {book.category}
              </span>
              <span className="publish-year" data-testid="book-year">
                <Calendar size={13} className="icon-subtle" />
                {book.publishedYear}
              </span>
            </div>

            <h3 className="book-title list-title" data-testid="book-title" title={book.title}>
              {book.title}
            </h3>

            <p className="book-author list-author" data-testid="book-author">
              Tác giả: <strong>{book.author}</strong>
            </p>

            {book.description && (
              <p className="book-desc list-desc" title={book.description}>
                {book.description}
              </p>
            )}
          </div>
        </div>

        <div className="list-col-right">
          <div className="copies-status list-copies" data-testid="book-copies">
            <span className="copies-label">Số bản còn:</span>
            <span
              className={`copies-count ${isOutOfStock ? 'copies-zero' : 'copies-available'}`}
              data-testid="copies-count-number"
            >
              {book.availableCopies} / {book.totalCopies}
            </span>
          </div>

          <div className="book-actions">
            {isBorrowed ? (
              <button
                type="button"
                className="btn btn-return btn-sm"
                onClick={() => onReturn(book.id)}
                aria-label={`Trả sách ${book.title}`}
                data-testid="return-button"
              >
                <CheckCircle2 size={16} />
                <span>Trả sách</span>
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-borrow btn-sm"
                onClick={() => onBorrow(book.id)}
                disabled={isOutOfStock}
                aria-label={`Mượn sách ${book.title}`}
                data-testid="borrow-button"
              >
                <Bookmark size={16} />
                <span>Mượn sách</span>
              </button>
            )}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`book-card book-card-grid ${isBorrowed ? 'borrowed-highlight' : ''}`}
      data-testid={`book-card-${book.id}`}
    >
      <div className="book-card-header">
        <span
          className={`category-badge ${getCategoryBadgeClass(book.category)}`}
          data-testid="book-category"
        >
          {book.category}
        </span>
        <div className="publish-year" data-testid="book-year">
          <Calendar size={13} className="icon-subtle" />
          <span>{book.publishedYear}</span>
        </div>
      </div>

      <div className="card-grid-body">
        <h3 className="book-title" data-testid="book-title" title={book.title}>
          {book.title}
        </h3>

        <p className="book-author" data-testid="book-author">
          Tác giả: <strong>{book.author}</strong>
        </p>

        {book.description && (
          <p className="book-desc" title={book.description}>
            {book.description}
          </p>
        )}
      </div>

      <div className="book-card-footer">
        <div className="copies-status" data-testid="book-copies">
          <span className="copies-label">Số bản còn lại:</span>
          <span
            className={`copies-count ${isOutOfStock ? 'copies-zero' : 'copies-available'}`}
            data-testid="copies-count-number"
          >
            {book.availableCopies} / {book.totalCopies}
          </span>
        </div>

        <div className="book-actions">
          {isBorrowed ? (
            <button
              type="button"
              className="btn btn-return"
              onClick={() => onReturn(book.id)}
              aria-label={`Trả sách ${book.title}`}
              data-testid="return-button"
            >
              <CheckCircle2 size={16} />
              <span>Trả sách</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-borrow"
              onClick={() => onBorrow(book.id)}
              disabled={isOutOfStock}
              aria-label={`Mượn sách ${book.title}`}
              data-testid="borrow-button"
            >
              <Bookmark size={16} />
              <span>Mượn sách</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
});

BookCard.displayName = 'BookCard';

export default BookCard;
