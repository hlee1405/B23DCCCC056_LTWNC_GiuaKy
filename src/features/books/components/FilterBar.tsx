import React, { useState, useEffect } from 'react';
import { useFilterStore } from '../../../store/filterStore';
import type { CategoryFilter } from '../../../store/filterStore';
import { useDebounce } from '../../../hooks/useDebounce';
import { Search, X, Filter } from 'lucide-react';

const CATEGORIES: CategoryFilter[] = ['All', 'CNTT', 'Kinh tế', 'Ngoại ngữ'];

export const FilterBar: React.FC = () => {
  const { searchQuery, category, setSearchQuery, setCategory, resetFilters } = useFilterStore();
  const [inputValue, setInputValue] = useState(searchQuery);

  const debouncedSearch = useDebounce(inputValue, 300);

  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  const handleClearSearch = () => {
    setInputValue('');
    setSearchQuery('');
  };

  const getCategoryLabel = (cat: CategoryFilter) => {
    if (cat === 'All') return 'Tất cả thể loại';
    return cat;
  };

  return (
    <div className="filter-bar-container">
      <div className="search-input-wrapper">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Tìm kiếm theo tên sách hoặc tác giả..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          aria-label="Tìm kiếm sách"
          data-testid="search-input"
        />
        {inputValue && (
          <button
            type="button"
            className="clear-search-btn"
            onClick={handleClearSearch}
            aria-label="Xoá tìm kiếm"
            data-testid="clear-search-btn"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="category-filters" role="group" aria-label="Bộ lọc thể loại">
        <span className="filter-label">
          <Filter size={16} />
          <span>Thể loại:</span>
        </span>
        <div className="category-chips">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`chip-button ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
              data-testid={`category-filter-${cat}`}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>

        {(category !== 'All' || inputValue !== '') && (
          <button
            type="button"
            className="reset-filter-btn"
            onClick={() => {
              setInputValue('');
              resetFilters();
            }}
            data-testid="reset-filters-btn"
          >
            Đặt lại bộ lọc
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
