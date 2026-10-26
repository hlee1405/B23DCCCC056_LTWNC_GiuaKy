import { configureStore } from '@reduxjs/toolkit';
import booksReducer, { borrowBook, setBooks } from './booksSlice';
import { borrowLimitMiddleware } from './borrowLimitMiddleware';
import type { Book } from '../../types/book';

describe('borrowLimitMiddleware Tests', () => {
  const createMockStore = () => {
    return configureStore({
      reducer: {
        books: booksReducer,
      },
      middleware: (getDefault) => getDefault().concat(borrowLimitMiddleware),
    });
  };

  const sampleBooks: Book[] = [
    { id: 'b1', title: 'Sách 1', author: 'TG 1', category: 'CNTT', publishedYear: 2020, availableCopies: 2, totalCopies: 2 },
    { id: 'b2', title: 'Sách 2', author: 'TG 2', category: 'CNTT', publishedYear: 2020, availableCopies: 2, totalCopies: 2 },
    { id: 'b3', title: 'Sách 3', author: 'TG 3', category: 'CNTT', publishedYear: 2020, availableCopies: 2, totalCopies: 2 },
    { id: 'b4', title: 'Sách 4', author: 'TG 4', category: 'CNTT', publishedYear: 2020, availableCopies: 2, totalCopies: 2 },
  ];

  it('Cho phép mượn tối đa 3 cuốn sách', () => {
    const store = createMockStore();
    store.dispatch(setBooks(sampleBooks));

    store.dispatch(borrowBook('b1'));
    store.dispatch(borrowBook('b2'));
    store.dispatch(borrowBook('b3'));

    expect(store.getState().books.borrowedBookIds).toEqual(['b1', 'b2', 'b3']);
    expect(store.getState().books.warningMessage).toBeNull();
  });

  it('Chặn và hiển thị cảnh báo khi cố mượn cuốn thứ 4', () => {
    const store = createMockStore();
    store.dispatch(setBooks(sampleBooks));

    store.dispatch(borrowBook('b1'));
    store.dispatch(borrowBook('b2'));
    store.dispatch(borrowBook('b3'));
    store.dispatch(borrowBook('b4'));

    expect(store.getState().books.borrowedBookIds).toEqual(['b1', 'b2', 'b3']);
    expect(store.getState().books.warningMessage).toContain('Mỗi sinh viên chỉ được mượn tối đa 3 cuốn');
  });

  it('Chặn và cảnh báo khi mượn trùng cuốn sách đã mượn', () => {
    const store = createMockStore();
    store.dispatch(setBooks(sampleBooks));

    store.dispatch(borrowBook('b1'));
    store.dispatch(borrowBook('b1'));

    expect(store.getState().books.borrowedBookIds).toEqual(['b1']);
    expect(store.getState().books.warningMessage).toContain('Bạn đã mượn cuốn sách này rồi');
  });
});
