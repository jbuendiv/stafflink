import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAnglesLeft,
  faAngleLeft,
  faAngleRight,
  faAnglesRight,
} from '@fortawesome/free-solid-svg-icons';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Ventana de páginas visibles alrededor de la página actual */
  windowSize?: number;
  /** Accessible label for the nav element */
  ariaLabel?: string;
}

interface PageWindow {
  pages: number[];
  showLeftEllipsis: boolean;
  showRightEllipsis: boolean;
}

function getPageWindow(
  current: number,
  total: number,
  windowSize: number,
): PageWindow {
  const half = Math.floor(windowSize / 2);

  let start = Math.max(1, current - half);
  let end = Math.min(total, current + half);

  // Adjust window if near edges so it always shows `windowSize` pages when possible
  if (end - start + 1 < windowSize) {
    if (start === 1) {
      end = Math.min(total, start + windowSize - 1);
    } else {
      start = Math.max(1, end - windowSize + 1);
    }
  }

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return {
    pages,
    showLeftEllipsis: start > 1,
    showRightEllipsis: end < total,
  };
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const BASE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36,
  border: 'none',
  borderRadius: 8,
  background: 'transparent',
  color: '#374151',
  fontSize: 14,
  fontFamily: 'inherit',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'background 0.15s, color 0.15s',
  userSelect: 'none',
  flexShrink: 0,
} as React.CSSProperties;

const ACTIVE: React.CSSProperties = {
  ...BASE,
  background: '#6366f1',
  color: '#fff',
  cursor: 'default',
};

const ARROW: React.CSSProperties = {
  ...BASE,
  color: '#6366f1',
  fontSize: 13,
};

const ARROW_DISABLED: React.CSSProperties = {
  ...ARROW,
  color: '#d1d5db',
  cursor: 'default',
  pointerEvents: 'none',
} as React.CSSProperties;

const ELLIPSIS: React.CSSProperties = {
  ...BASE,
  cursor: 'default',
  color: '#9ca3af',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function NavButton({
  onClick,
  disabled,
  ariaLabel,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <button
      style={disabled ? ARROW_DISABLED : ARROW}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function PageButton({
  page,
  isActive,
  onClick,
}: {
  page: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = React.useState(false);

  const style: React.CSSProperties = isActive
    ? ACTIVE
    : hovered
    ? { ...BASE, background: '#f3f4f6' }
    : BASE;

  return (
    <button
      style={style}
      onClick={onClick}
      aria-label={`Página ${page}`}
      aria-current={isActive ? 'page' : undefined}
      onMouseEnter={() => !isActive && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {page}
    </button>
  );
}

function Ellipsis() {
  return <span style={ELLIPSIS}>…</span>;
}

// ─── Main component ───────────────────────────────────────────────────────────

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  windowSize = 5,
  ariaLabel = 'Paginación',
}: PaginationProps) {
  if (totalPages === 0) return null;

  const { pages, showLeftEllipsis, showRightEllipsis } = getPageWindow(
    currentPage,
    totalPages,
    windowSize,
  );

  const atFirst = currentPage === 1;
  const atLast = currentPage === totalPages;

  return (
    <nav
      aria-label={ariaLabel}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        padding: '12px 0',
      }}
    >
      {/* << First */}
      {!atFirst && (
        <NavButton
          onClick={() => onPageChange(1)}
          disabled={false}
          ariaLabel="Primera página"
        >
          <FontAwesomeIcon icon={faAnglesLeft} />
        </NavButton>
      )}

      {/* < Prev */}
      {!atFirst && (
        <NavButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={false}
          ariaLabel="Página anterior"
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </NavButton>
      )}

      {/* Left ellipsis */}
      {showLeftEllipsis && <Ellipsis />}

      {/* Page window */}
      {pages.map(page => (
        <PageButton
          key={page}
          page={page}
          isActive={page === currentPage}
          onClick={() => page !== currentPage && onPageChange(page)}
        />
      ))}

      {/* Right ellipsis */}
      {showRightEllipsis && <Ellipsis />}

      {/* > Next */}
      {!atLast && (
        <NavButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={false}
          ariaLabel="Página siguiente"
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </NavButton>
      )}

      {/* >> Last */}
      {!atLast && (
        <NavButton
          onClick={() => onPageChange(totalPages)}
          disabled={false}
          ariaLabel="Última página"
        >
          <FontAwesomeIcon icon={faAnglesRight} />
        </NavButton>
      )}
    </nav>
  );
}