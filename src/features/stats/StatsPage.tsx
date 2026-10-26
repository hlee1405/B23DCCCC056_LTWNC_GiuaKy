import React, { useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { returnBook } from '../books/booksSlice';
import type { BookCategory, CategoryBookCount } from '../../types/book';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  BookMarked,
  Layers,
  CheckCircle2,
  Library,
  BookOpenCheck,
} from 'lucide-react';

export const StatsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, borrowedBookIds } = useAppSelector((state) => state.books);

  const categoryStats = useMemo(() => {
    const counts: CategoryBookCount = {
      'CNTT': 0,
      'Kinh tế': 0,
      'Ngoại ngữ': 0,
    };

    items.forEach((book) => {
      if (counts[book.category] !== undefined) {
        counts[book.category] += 1;
      }
    });

    return counts;
  }, [items]);

  const borrowedBooksList = useMemo(() => {
    return items.filter((book) => borrowedBookIds.includes(book.id));
  }, [items, borrowedBookIds]);

  const totalTitles = items.length;
  const totalCopies = items.reduce((acc, curr) => acc + curr.totalCopies, 0);
  const totalAvailable = items.reduce((acc, curr) => acc + curr.availableCopies, 0);

  const categories: BookCategory[] = ['CNTT', 'Kinh tế', 'Ngoại ngữ'];

  return (
    <div className="stats-page-container" data-testid="stats-page">
      <div className="stats-header">
        <div className="stats-title-group">
          <h2>
            <BarChart3 className="stats-icon text-primary" size={26} />
            <span>Báo Cáo & Thống Kê Thư Viện</span>
          </h2>
          <p className="stats-subtitle">
            Tổng quan dữ liệu đầu sách chuyên ngành và tình trạng sinh viên mượn/trả
          </p>
        </div>
      </div>

      <div className="stats-metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-wrap bg-blue-subtle">
            <Library size={24} className="text-blue" />
          </div>
          <div className="metric-data">
            <span className="metric-label">Tổng số đầu sách</span>
            <span className="metric-value" data-testid="stat-total-titles">
              {totalTitles}
            </span>
            <span className="metric-hint">{totalCopies} bản lưu trữ</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap bg-emerald-subtle">
            <BookMarked size={24} className="text-emerald" />
          </div>
          <div className="metric-data">
            <span className="metric-label">Số sách đang mượn</span>
            <span className="metric-value highlight-borrowed" data-testid="stat-borrowed-count">
              {borrowedBookIds.length} <small>/ 3</small>
            </span>
            <span className="metric-hint">Tối đa 3 cuốn/sinh viên</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap bg-purple-subtle">
            <BookOpenCheck size={24} className="text-purple" />
          </div>
          <div className="metric-data">
            <span className="metric-label">Số bản còn sẵn sàng</span>
            <span className="metric-value" data-testid="stat-available-copies">
              {totalAvailable}
            </span>
            <span className="metric-hint">Có thể mượn ngay</span>
          </div>
        </div>
      </div>

      <section className="stats-section category-breakdown-section">
        <h3 className="section-title">
          <Layers size={18} className="text-primary" />
          <span>Số đầu sách theo từng thể loại</span>
        </h3>

        <div className="category-stats-grid">
          {categories.map((cat) => {
            const count = categoryStats[cat];
            const percentage = totalTitles > 0 ? Math.round((count / totalTitles) * 100) : 0;

            return (
              <div
                key={cat}
                className="category-stat-card"
                data-testid={`category-stat-${cat}`}
              >
                <div className="card-top">
                  <span className="cat-name">{cat}</span>
                  <span className="cat-count">
                    <strong>{count}</strong> đầu sách
                  </span>
                </div>
                <div className="progress-bar-track">
                  <div
                    className={`progress-bar-fill fill-${cat.toLowerCase().replace(/\s+/g, '')}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="cat-percentage">Chiếm {percentage}% tổng số sách thư viện</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="stats-section borrowed-list-section">
        <h3 className="section-title">
          <CheckCircle2 size={18} className="text-emerald" />
          <span>Danh sách sách bạn đang mượn ({borrowedBookIds.length}/3)</span>
        </h3>

        {borrowedBooksList.length === 0 ? (
          <div className="empty-borrowed-box">
            <BookMarked size={36} className="text-muted" />
            <p>Hiện tại bạn chưa mượn cuốn sách nào từ thư viện khoa.</p>
            <Link to="/" className="btn btn-primary btn-sm">
              Mượn sách ngay
            </Link>
          </div>
        ) : (
          <div className="borrowed-table-wrap">
            <table className="borrowed-table" data-testid="borrowed-books-table">
              <thead>
                <tr>
                  <th>Tên sách</th>
                  <th>Tác giả</th>
                  <th>Thể loại</th>
                  <th>Năm XB</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {borrowedBooksList.map((book) => (
                  <tr key={book.id} data-testid={`borrowed-row-${book.id}`}>
                    <td className="font-semibold">{book.title}</td>
                    <td>{book.author}</td>
                    <td>
                      <span className="category-badge-pill">{book.category}</span>
                    </td>
                    <td>{book.publishedYear}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-return btn-sm"
                        onClick={() => dispatch(returnBook(book.id))}
                        data-testid={`return-from-stats-${book.id}`}
                      >
                        Trả sách
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default StatsPage;
