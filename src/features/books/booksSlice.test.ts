import booksReducer, {
  initialBooksState,
  borrowBook,
  returnBook,
  setBorrowWarning,
  clearBorrowWarning,
  fetchBooks,
} from './booksSlice';
import type { BooksState } from './booksSlice';
import type { Book } from '../../types/book';

describe('booksSlice Reducer Tests', () => {
  const mockBooks: Book[] = [
    {
      id: 'b-01',
      title: 'Lập trình TypeScript',
      author: 'Nguyễn Văn A',
      category: 'CNTT',
      publishedYear: 2023,
      availableCopies: 2,
      totalCopies: 3,
    },
    {
      id: 'b-02',
      title: 'Kinh tế Quốc tế',
      author: 'Trần Thị B',
      category: 'Kinh tế',
      publishedYear: 2022,
      availableCopies: 0,
      totalCopies: 2,
    },
  ];

  it('Nên trả về initial state khi truyền action không xác định', () => {
    const state = booksReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialBooksState);
    expect(state.items).toEqual([]);
    expect(state.borrowedBookIds).toEqual([]);
    expect(state.status).toBe('idle');
  });

  it('Nên cập nhật items và status="succeeded" khi fetchBooks.fulfilled', () => {
    const prevState: BooksState = {
      ...initialBooksState,
      status: 'loading',
    };
    const action = {
      type: fetchBooks.fulfilled.type,
      payload: mockBooks,
    };
    const nextState = booksReducer(prevState, action);

    expect(nextState.status).toBe('succeeded');
    expect(nextState.items).toEqual(mockBooks);
    expect(nextState.error).toBeNull();
  });

  it('Nên cập nhật status="failed" và lưu error khi fetchBooks.rejected', () => {
    const prevState: BooksState = {
      ...initialBooksState,
      status: 'loading',
    };
    const errorMessage = 'Máy chủ thư viện quá tải!';
    const action = {
      type: fetchBooks.rejected.type,
      payload: errorMessage,
    };
    const nextState = booksReducer(prevState, action);

    expect(nextState.status).toBe('failed');
    expect(nextState.error).toBe(errorMessage);
  });

  it('Nên giảm số bản còn lại đi 1 và thêm vào danh sách đang mượn khi borrowBook thành công', () => {
    const prevState: BooksState = {
      ...initialBooksState,
      items: mockBooks,
      borrowedBookIds: [],
    };

    const nextState = booksReducer(prevState, borrowBook('b-01'));

    const updatedBook = nextState.items.find((b) => b.id === 'b-01');
    expect(updatedBook?.availableCopies).toBe(1);
    expect(nextState.borrowedBookIds).toContain('b-01');
    expect(nextState.warningMessage).toBeNull();
  });

  it('Không nên mượn nếu sách đã hết bản (availableCopies === 0)', () => {
    const prevState: BooksState = {
      ...initialBooksState,
      items: mockBooks,
      borrowedBookIds: [],
    };

    const nextState = booksReducer(prevState, borrowBook('b-02'));

    const targetBook = nextState.items.find((b) => b.id === 'b-02');
    expect(targetBook?.availableCopies).toBe(0);
    expect(nextState.borrowedBookIds).not.toContain('b-02');
  });

  it('Nên tăng số bản còn lại lên 1 và xoá khỏi danh sách đang mượn khi returnBook', () => {
    const prevState: BooksState = {
      ...initialBooksState,
      items: [
        {
          id: 'b-01',
          title: 'Lập trình TypeScript',
          author: 'Nguyễn Văn A',
          category: 'CNTT',
          publishedYear: 2023,
          availableCopies: 1,
          totalCopies: 3,
        },
      ],
      borrowedBookIds: ['b-01'],
    };

    const nextState = booksReducer(prevState, returnBook('b-01'));

    const updatedBook = nextState.items.find((b) => b.id === 'b-01');
    expect(updatedBook?.availableCopies).toBe(2);
    expect(nextState.borrowedBookIds).not.toContain('b-01');
  });

  it('Nên cập nhật và xoá cảnh báo mượn sách', () => {
    const stateWithWarning = booksReducer(
      initialBooksState,
      setBorrowWarning('Bạn đã mượn tối đa 3 cuốn!')
    );
    expect(stateWithWarning.warningMessage).toBe('Bạn đã mượn tối đa 3 cuốn!');

    const clearedState = booksReducer(stateWithWarning, clearBorrowWarning());
    expect(clearedState.warningMessage).toBeNull();
  });
});
