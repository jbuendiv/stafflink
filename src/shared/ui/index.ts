// ─── Shared UI components ────────────────────────────────────────────────────
// Import from this barrel instead of from individual files so that
// a single change here is enough to update every consumer.

// ── Primitives ───────────────────────────────────────────────────────────────
export { SectionCard } from './SectionCard';
export type { SectionCardProps } from './SectionCard';

export { BaseModal } from './BaseModal';
export type { BaseModalProps } from './BaseModal';

export { ConfirmDialog } from './ConfirmDialog';
export type { ConfirmDialogProps } from './ConfirmDialog';

export { EmptyState } from './EmptyState';
export type { EmptyStateProps } from './EmptyState';

export { SearchInput } from './SearchInput';
export type { SearchInputProps } from './SearchInput';

export { StatusChip } from './StatusChip';
export { ResultsCount } from './ResultsCount';

// ── Page-level scaffolding ────────────────────────────────────────────────────
export { PageContainer } from './PageContainer';
export { PageHeader } from './PageHeader';
export type { PageAction } from './PageHeader';
export { FilterPanel } from './FilterPanel';

// ── Data display ─────────────────────────────────────────────────────────────
export { DataTable } from './DataTable';
export type { Column, TablePaginationProps } from './DataTable';

export { Pagination } from './Pagination';
export type { PaginationProps } from './Pagination';

// -- EmployeeTable is a more opinionated table specifically for displaying employee data,
// with built-in support for pagination and row interactions.
export { EmployeeTable } from './EmployeeTable';
export type { EmployeeTableProps, EmployeeRow } from './EmployeeTable';

// ── Form components ───────────────────────────────────────────────────────────
export {
  TextInput,
  SelectField,
  MultiSelectField,
  SearchableMultiSelectField,
} from './form-components';

// ── Layout helpers ────────────────────────────────────────────────────────────
export { FormRow } from './layout/FormRow';
