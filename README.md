# BÀI THI GIỮA KỲ: MINI LIBRARY — TRA CỨU & MƯỢN/TRẢ SÁCH CHUYÊN NGÀNH

- **Môn học:** Lập trình Web Nâng Cao (LTWNC)
- **Mã sinh viên:** B23DCCCC056
- **Tên dự án:** Mini Library
- **Công nghệ chính:** React 19, TypeScript, Vite, Redux Toolkit, Zustand, Context API, Jest, React Testing Library.

---

## 1. TỔNG HỢP NỘI DUNG VẬN DỤNG THEO ĐỀ BÀI

### Buổi 1 — TypeScript nâng cao
- **Generic API Response:** `ApiResponse<T> = ApiSuccess<T> | ApiError` tại `src/types/book.ts`.
- **Type Guards:** `isApiSuccess<T>()` và `isApiError<T>()` tại `src/types/book.ts` để phân biệt an toàn kết quả trả về từ API mà không dùng ép kiểu mạo hiểm.
- **Utility Types (5 loại):**
  - `Pick<Book, 'id' | 'title' | 'author' | 'category'>` (BookPreview)
  - `Omit<Book, 'id'>` (CreateBookPayload)
  - `Record<BookCategory, number>` (CategoryBookCount)
  - `Readonly<Book>` (ReadonlyBook)
  - `Partial<Pick<Book, ...>>` (BookFilterCriteria)
- **Strict Mode:** Khai báo kiểu tường minh cho toàn bộ dữ liệu, **tuyệt đối không sử dụng `any`**.

### Buổi 2 — Design pattern React
- **Generic Custom Hook:** `useDebounce<T>(value: T, delay: number = 300): T` tại `src/hooks/useDebounce.ts`.
- **Custom Hook:** `useTheme()` kết hợp Context API kiểm tra phạm vi Provider.

### Buổi 3 — Redux Toolkit + TypeScript
- **Cấu trúc Feature-based:** Thư mục `src/features/books/` đóng gói slice, middleware, selector, test và component liên quan.
- **Typed Hooks:** `useAppDispatch` và `useAppSelector` chuẩn hóa tại `src/app/hooks.ts`.
- **`createAsyncThunk` (`fetchBooks`):** Xử lý đầy đủ 3 trạng thái:
  - `pending`: Hiển thị "Đang tải danh sách sách từ thư viện..."
  - `fulfilled`: Nạp danh sách sách thành công vào Redux Store
  - `rejected`: Hiển thị thông báo lỗi thân thiện kèm nút "Thử lại".
- **Reducer nghiệp vụ:** Quản lý `items`, `borrowedBookIds`, `borrowBook` (giảm 1 bản), `returnBook` (tăng 1 bản), `warningMessage`.

### Buổi 4 — Zustand, Context nâng cao, Middleware Redux
- **Redux Middleware tự viết (`borrowLimitMiddleware`):**
  - Đặt tại `src/features/books/borrowLimitMiddleware.ts`.
  - Bắt chặn action `borrowBook` nếu sinh viên đã mượn $\ge 3$ cuốn cùng lúc, chặn không cho đưa vào reducer và tự động dispatch cảnh báo `setBorrowWarning`.
  - Chặn mượn sách trùng lặp hoặc sách đã hết bản.
- **Zustand Filter Store (`useFilterStore`):**
  - Đặt tại `src/store/filterStore.ts`.
  - Quản lý từ khóa tìm kiếm (`searchQuery`) và thể loại (`category`: Tất cả / CNTT / Kinh tế / Ngoại ngữ).
- **Theme Context Sáng/Tối:**
  - Đặt tại `src/context/ThemeContext.tsx`.
  - Tối ưu với `useMemo` cho giá trị `{ theme, toggleTheme }`.
  - Tự động đồng bộ hóa `data-theme` trên thẻ `<html>` và lưu trữ `localStorage`.

### Buổi 5 — Tối ưu hiệu năng
- **`useMemo` lọc danh sách:** Tính toán `filteredBooks` dựa trên từ khóa tìm kiếm (không phân biệt hoa/thường) và thể loại.
- **`React.memo` cho component sách:** `BookCard` được bọc bằng `React.memo` để tránh re-render không cần thiết.
- **`useCallback` cho event handlers:** `handleBorrow`, `handleReturn`, `handleRetry`, `handleCloseWarning` được memoize trước khi truyền xuống component con.
- **Key danh sách không dùng index:** Toàn bộ danh sách sách sử dụng `key={book.id}` duy nhất.
- **Code splitting với `React.lazy` + `Suspense`:** Trang Thống kê (`/stats`) được tách bundle riêng biệt (lazy chunk) và nạp theo nhu cầu với giao diện fallback mượt mà.
- **Debounce 300ms:** Ô nhập tìm kiếm debounce 300ms bằng hook generic `useDebounce`.

### Buổi 6 — Kiểm thử tự động (Jest + React Testing Library)
- Chạy toàn bộ test suites với câu lệnh:
  ```bash
  npm test
  ```
- **Kết quả 100% xanh (16/16 tests passed):**
  1. `booksSlice.test.ts` (7 tests - vượt mức tối thiểu 4 tests):
     - Trả về initial state khi truyền action lạ
     - Xử lý `fetchBooks.pending`, `fulfilled`, `rejected`
     - Mượn sách thành công: giảm 1 bản còn lại, thêm vào danh sách đang mượn
     - Chặn mượn khi sách đã hết bản (`availableCopies === 0`)
     - Trả sách: tăng 1 bản còn lại, loại bỏ khỏi danh sách đang mượn
     - Cập nhật và xóa thông báo cảnh báo.
  2. `BookCard.test.tsx` (4 tests - vượt mức tối thiểu 3 tests bằng RTL + `userEvent`):
     - Hiển thị đầy đủ tên sách, tác giả, thể loại, năm xuất bản, số bản còn lại
     - Click nút "Mượn" gọi đúng hàm với đúng ID cuốn sách
     - Nút "Mượn" bị vô hiệu hóa (`disabled`) khi sách hết bản
     - Hiển thị nút "Trả sách" khi sách đang được mượn.
  3. `useDebounce.test.ts` (2 tests dùng fake timers):
     - Trì hoãn cập nhật giá trị sau đúng 300ms
     - Reset timer khi giá trị thay đổi liên tục trước thời hạn.
  4. `borrowLimitMiddleware.test.ts` (3 tests):
     - Kiểm thử chặn mượn vượt quá 3 cuốn từ middleware Redux
     - Kiểm thử chặn mượn sách trùng lặp.

---

## 2. HƯỚNG DẪN CÀI ĐẶT & CHẠY ỨNG DỤNG

### Cài đặt dependencies
```bash
cd B23DCCCC056_LTWNC_GiuaKy
npm install
```

### Chạy môi trường phát triển (Dev Server)
```bash
npm run dev
```
Truy cập ứng dụng tại: `http://localhost:5173/`

### Chạy kiểm thử tự động (Jest)
```bash
npm test
```

### Build kiểm tra đóng gói sản phẩm
```bash
npm run build
```

---

## 3. CẤU TRÚC THƯ MỤC DỰ ÁN

```
B23DCCCC056_LTWNC_GiuaKy/
├── public/
│   └── favicon.svg
├── src/
│   ├── __mocks__/
│   │   └── fileMock.js
│   ├── api/
│   │   └── booksApi.ts               # API giả lập độ trễ 500ms & cờ lỗi
│   ├── app/
│   │   ├── hooks.ts                  # Typed hooks useAppDispatch, useAppSelector
│   │   └── store.ts                  # Redux store kết nối borrowLimitMiddleware
│   ├── components/
│   │   └── Navbar.tsx                # Thanh điều hướng, đếm sách mượn, toggle theme
│   ├── context/
│   │   └── ThemeContext.tsx          # Theme sáng/tối dùng Context + useMemo + useTheme
│   ├── features/
│   │   ├── books/
│   │   │   ├── components/
│   │   │   │   ├── BookCard.tsx      # Bọc React.memo, hiển thị sách & nút mượn/trả
│   │   │   │   ├── BookCard.test.tsx # RTL + userEvent tests
│   │   │   │   ├── BookList.tsx      # useMemo lọc danh sách, useCallback handlers
│   │   │   │   └── FilterBar.tsx     # Zustand + useDebounce 300ms
│   │   │   ├── booksSlice.ts         # createSlice, createAsyncThunk 3 trạng thái
│   │   │   ├── booksSlice.test.ts    # Reducer unit tests
│   │   │   ├── borrowLimitMiddleware.ts      # Middleware Redux giới hạn 3 cuốn
│   │   │   └── borrowLimitMiddleware.test.ts # Tests cho middleware
│   │   └── stats/
│   │       └── StatsPage.tsx         # Trang thống kê (Route /stats, Lazy loaded)
│   ├── hooks/
│   │   ├── useDebounce.ts            # Custom hook generic useDebounce<T>
│   │   └── useDebounce.test.ts       # Test với Jest fake timers
│   ├── types/
│   │   └── book.ts                   # Types, Generic API, Type guards, Utility types
│   ├── App.tsx                       # React Router & React.lazy + Suspense
│   ├── index.css                     # Thiết kế thẩm mỹ cao cấp, CSS variables, dark mode
│   ├── main.tsx                      # Mount Redux Provider & ThemeProvider
│   └── setupTests.ts                 # Import @testing-library/jest-dom
├── jest.config.cjs                   # Cấu hình Jest + ts-jest
├── package.json
├── tsconfig.json
└── vite.config.ts
```
