import { create } from 'zustand';
import type { BookCategory } from '../types/book';

export type CategoryFilter = 'All' | BookCategory;
export type ViewMode = 'grid' | 'list';

interface FilterState {
  searchQuery: string;
  category: CategoryFilter;
  viewMode: ViewMode;
  setSearchQuery: (query: string) => void;
  setCategory: (category: CategoryFilter) => void;
  setViewMode: (mode: ViewMode) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  searchQuery: '',
  category: 'All',
  viewMode: 'grid',
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setCategory: (category) => set({ category }),
  setViewMode: (viewMode) => set({ viewMode }),
  resetFilters: () => set({ searchQuery: '', category: 'All' }),
}));
