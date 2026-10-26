export type BookCategory = 'CNTT' | 'Kinh tế' | 'Ngoại ngữ';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  publishedYear: number;
  availableCopies: number;
  totalCopies: number;
  description?: string;
  coverColor?: string;
}

export interface ApiSuccess<T> {
  ok: true;
  data: T;
}

export interface ApiError {
  ok: false;
  error: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export function isApiSuccess<T>(response: ApiResponse<T>): response is ApiSuccess<T> {
  return response.ok === true;
}

export function isApiError<T>(response: ApiResponse<T>): response is ApiError {
  return response.ok === false;
}

export type BookPreview = Pick<Book, 'id' | 'title' | 'author' | 'category'>;
export type CreateBookPayload = Omit<Book, 'id'>;
export type CategoryBookCount = Record<BookCategory, number>;
export type ReadonlyBook = Readonly<Book>;
export type BookFilterCriteria = Partial<Pick<Book, 'category' | 'author' | 'publishedYear'>>;
