import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookCard from './BookCard';
import type { Book } from '../../../types/book';

describe('BookCard Component Tests', () => {
  const sampleBook: Book = {
    id: 'book-999',
    title: 'Học Máy và Trí Tuệ Nhân Tạo',
    author: 'TS. Lê Hoàng',
    category: 'CNTT',
    publishedYear: 2024,
    availableCopies: 3,
    totalCopies: 5,
    description: 'Tài liệu nhập môn học máy hiện đại.',
  };

  const outOfStockBook: Book = {
    id: 'book-888',
    title: 'Kinh Tế Lượng Ứng Dụng',
    author: 'PGS. Trần Mai',
    category: 'Kinh tế',
    publishedYear: 2021,
    availableCopies: 0,
    totalCopies: 2,
  };

  it('Hiển thị đúng các thông tin: tên sách, tác giả, thể loại, năm xuất bản, số bản còn lại', () => {
    const mockBorrow = jest.fn();
    const mockReturn = jest.fn();

    render(
      <BookCard
        book={sampleBook}
        isBorrowed={false}
        onBorrow={mockBorrow}
        onReturn={mockReturn}
      />
    );

    expect(screen.getByTestId('book-title')).toHaveTextContent('Học Máy và Trí Tuệ Nhân Tạo');
    expect(screen.getByTestId('book-author')).toHaveTextContent('TS. Lê Hoàng');
    expect(screen.getByTestId('book-category')).toHaveTextContent('CNTT');
    expect(screen.getByTestId('book-year')).toHaveTextContent('2024');
    expect(screen.getByTestId('copies-count-number')).toHaveTextContent('3 / 5');
  });

  it('Click nút "Mượn" gọi đúng hàm onBorrow với đúng tham số id', async () => {
    const user = userEvent.setup();
    const mockBorrow = jest.fn();
    const mockReturn = jest.fn();

    render(
      <BookCard
        book={sampleBook}
        isBorrowed={false}
        onBorrow={mockBorrow}
        onReturn={mockReturn}
      />
    );

    const borrowButton = screen.getByTestId('borrow-button');
    expect(borrowButton).toBeEnabled();

    await user.click(borrowButton);

    expect(mockBorrow).toHaveBeenCalledTimes(1);
    expect(mockBorrow).toHaveBeenCalledWith('book-999');
    expect(mockReturn).not.toHaveBeenCalled();
  });

  it('Nút "Mượn" bị vô hiệu hoá khi sách đã hết bản', () => {
    const mockBorrow = jest.fn();
    const mockReturn = jest.fn();

    render(
      <BookCard
        book={outOfStockBook}
        isBorrowed={false}
        onBorrow={mockBorrow}
        onReturn={mockReturn}
      />
    );

    const borrowButton = screen.getByTestId('borrow-button');
    expect(borrowButton).toBeDisabled();
    expect(borrowButton).toHaveTextContent('Mượn sách');
  });

  it('Hiển thị nút "Trả sách" khi sách đang được mượn và click gọi onReturn', async () => {
    const user = userEvent.setup();
    const mockBorrow = jest.fn();
    const mockReturn = jest.fn();

    render(
      <BookCard
        book={sampleBook}
        isBorrowed={true}
        onBorrow={mockBorrow}
        onReturn={mockReturn}
      />
    );

    const returnButton = screen.getByTestId('return-button');
    expect(returnButton).toBeInTheDocument();
    expect(returnButton).toHaveTextContent('Trả sách');

    await user.click(returnButton);

    expect(mockReturn).toHaveBeenCalledTimes(1);
    expect(mockReturn).toHaveBeenCalledWith('book-999');
    expect(mockBorrow).not.toHaveBeenCalled();
  });
});
