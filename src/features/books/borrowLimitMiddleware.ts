import type { Middleware } from '@reduxjs/toolkit';
import { borrowBook, setBorrowWarning } from './booksSlice';

export const borrowLimitMiddleware: Middleware = (storeApi) => (next) => (action) => {
  if (borrowBook.match(action)) {
    const state = storeApi.getState() as { books: { borrowedBookIds: string[]; items: { id: string; availableCopies: number }[] } };
    const { borrowedBookIds, items } = state.books;
    const targetBookId = action.payload;

    if (borrowedBookIds.includes(targetBookId)) {
      storeApi.dispatch(setBorrowWarning('Bạn đã mượn cuốn sách này rồi, vui lòng kiểm tra danh sách sách đang mượn!'));
      return;
    }

    const targetBook = items.find((b) => b.id === targetBookId);
    if (targetBook && targetBook.availableCopies <= 0) {
      storeApi.dispatch(setBorrowWarning('Rất tiếc, cuốn sách này hiện đã hết bản trong thư viện!'));
      return;
    }

    if (borrowedBookIds.length >= 3) {
      storeApi.dispatch(
        setBorrowWarning('Mỗi sinh viên chỉ được mượn tối đa 3 cuốn cùng lúc! Vui lòng trả bớt sách trước khi mượn tiếp.')
      );
      return;
    }
  }

  return next(action);
};
