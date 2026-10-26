import type { ApiResponse, Book } from '../types/book';

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'b-001',
    title: 'Lập trình Web Nâng Cao với React & TypeScript',
    author: 'TS. Nguyễn Văn Toàn',
    category: 'CNTT',
    publishedYear: 2024,
    availableCopies: 3,
    totalCopies: 5,
    description: 'Giáo trình chi tiết về kiến trúc Redux Toolkit, Zustand, Custom Hooks và kiểm thử Jest.',
    coverColor: '#2563eb',
  },
  {
    id: 'b-002',
    title: 'Thiết kế Hệ thống Phân tán & Microservices',
    author: 'Martin Kleppmann',
    category: 'CNTT',
    publishedYear: 2023,
    availableCopies: 1,
    totalCopies: 4,
    description: 'Các nguyên lý cốt lõi về tính nhất quán dữ liệu, khả năng chịu lỗi và mở rộng quy mô lớn.',
    coverColor: '#1d4ed8',
  },
  {
    id: 'b-003',
    title: 'Cấu trúc Dữ liệu và Giải thuật Hiện đại',
    author: 'Robert Sedgewick',
    category: 'CNTT',
    publishedYear: 2022,
    availableCopies: 0,
    totalCopies: 3,
    description: 'Phân tích độ phức tạp thuật toán và kỹ thuật tối ưu hóa trong phát triển phần mềm.',
    coverColor: '#0284c7',
  },
  {
    id: 'b-004',
    title: 'Trí tuệ Nhân tạo & Ứng dụng Học sâu',
    author: 'Ian Goodfellow, Yoshua Bengio',
    category: 'CNTT',
    publishedYear: 2024,
    availableCopies: 2,
    totalCopies: 4,
    description: 'Kiến trúc mạng nơ-ron sâu, mô hình ngôn ngữ lớn (LLM) và ứng dụng thực tiễn.',
    coverColor: '#4f46e5',
  },
  {
    id: 'b-005',
    title: 'Kinh tế Vi mô Ứng dụng trong Chuyển đổi số',
    author: 'GS. N. Gregory Mankiw',
    category: 'Kinh tế',
    publishedYear: 2023,
    availableCopies: 4,
    totalCopies: 6,
    description: 'Cơ chế thị trường số, định giá sản phẩm công nghệ và hành vi người tiêu dùng trực tuyến.',
    coverColor: '#059669',
  },
  {
    id: 'b-006',
    title: 'Quản trị Tài chính Doanh nghiệp & Startup',
    author: 'Richard A. Brealey',
    category: 'Kinh tế',
    publishedYear: 2022,
    availableCopies: 2,
    totalCopies: 3,
    description: 'Chiến lược phân bổ vốn, quản trị rủi ro thanh khoản và định giá doanh nghiệp công nghệ.',
    coverColor: '#10b981',
  },
  {
    id: 'b-007',
    title: 'Digital Marketing & Growth Hacking Thực chiến',
    author: 'Philip Kotler',
    category: 'Kinh tế',
    publishedYear: 2024,
    availableCopies: 3,
    totalCopies: 5,
    description: 'Xây dựng phễu chuyển đổi số, tối ưu hóa ROI và chiến lược tiếp thị đa kênh tự động.',
    coverColor: '#0d9488',
  },
  {
    id: 'b-008',
    title: 'Tiếng Anh Chuyên ngành Khoa học Máy tính',
    author: 'Eric H. Glendinning',
    category: 'Ngoại ngữ',
    publishedYear: 2023,
    availableCopies: 2,
    totalCopies: 4,
    description: 'Từ vựng, mẫu câu và thuật ngữ kỹ thuật chuyên sâu dùng trong viết tài liệu và làm việc quốc tế.',
    coverColor: '#d97706',
  },
  {
    id: 'b-009',
    title: 'IELTS Academic Writing & Speaking Masterclass',
    author: 'Pauline Cullen',
    category: 'Ngoại ngữ',
    publishedYear: 2024,
    availableCopies: 1,
    totalCopies: 3,
    description: 'Phương pháp đạt Band 7.5+ với chiến lược phân tích đề bài học thuật và cấu trúc câu nâng cao.',
    coverColor: '#ea580c',
  },
  {
    id: 'b-010',
    title: 'Tiếng Nhật Thương mại & Giao tiếp Doanh nghiệp',
    author: 'Bùi Thị Lan Anh',
    category: 'Ngoại ngữ',
    publishedYear: 2022,
    availableCopies: 0,
    totalCopies: 2,
    description: 'Kính ngữ Keigo, quy tắc viết thư điện tử và văn hóa ứng xử trong công ty IT Nhật Bản.',
    coverColor: '#b45309',
  },
];

export const fetchBooksApi = (shouldFail: boolean = false): Promise<ApiResponse<Book[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (shouldFail) {
        resolve({
          ok: false,
          error: 'Lỗi kết nối máy chủ thư viện! Không thể tải danh mục sách.',
        });
      } else {
        const clonedData: Book[] = JSON.parse(JSON.stringify(INITIAL_BOOKS));
        resolve({
          ok: true,
          data: clonedData,
        });
      }
    }, 500);
  });
};
