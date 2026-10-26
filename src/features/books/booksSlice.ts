import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Book } from '../../types/book';
import { isApiSuccess } from '../../types/book';
import { fetchBooksApi } from '../../api/booksApi';

export interface BooksState {
  items: Book[];
  borrowedBookIds: string[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  warningMessage: string | null;
}

export const initialBooksState: BooksState = {
  items: [],
  borrowedBookIds: [],
  status: 'idle',
  error: null,
  warningMessage: null,
};

export const fetchBooks = createAsyncThunk<Book[], boolean | void, { rejectValue: string }>(
  'books/fetchBooks',
  async (shouldFail = false, { rejectWithValue }) => {
    const response = await fetchBooksApi(Boolean(shouldFail));
    if (isApiSuccess(response)) {
      return response.data;
    }
    return rejectWithValue(response.error);
  }
);

export const booksSlice = createSlice({
  name: 'books',
  initialState: initialBooksState,
  reducers: {
    borrowBook: (state, action: PayloadAction<string>) => {
      const bookId = action.payload;
      const targetBook = state.items.find((b) => b.id === bookId);

      if (targetBook && targetBook.availableCopies > 0 && !state.borrowedBookIds.includes(bookId)) {
        targetBook.availableCopies -= 1;
        state.borrowedBookIds.push(bookId);
        state.warningMessage = null;
      }
    },
    returnBook: (state, action: PayloadAction<string>) => {
      const bookId = action.payload;
      const targetBook = state.items.find((b) => b.id === bookId);

      if (state.borrowedBookIds.includes(bookId)) {
        if (targetBook) {
          targetBook.availableCopies += 1;
        }
        state.borrowedBookIds = state.borrowedBookIds.filter((id) => id !== bookId);
        state.warningMessage = null;
      }
    },
    setBorrowWarning: (state, action: PayloadAction<string>) => {
      state.warningMessage = action.payload;
    },
    clearBorrowWarning: (state) => {
      state.warningMessage = null;
    },
    setBooks: (state, action: PayloadAction<Book[]>) => {
      state.items = action.payload;
      state.status = 'succeeded';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action: PayloadAction<Book[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Không thể tải danh sách sách từ máy chủ.';
      });
  },
});

export const { borrowBook, returnBook, setBorrowWarning, clearBorrowWarning, setBooks } = booksSlice.actions;

export default booksSlice.reducer;
