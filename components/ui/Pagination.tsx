"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Beautiful animated pagination component
 * Shows page numbers with smooth transitions
 */
export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Show pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <motion.div
      className="flex items-center justify-center gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Previous button */}
      <motion.button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          p-2.5 rounded-lg border transition-all duration-200
          ${currentPage === 1
            ? "border-border/30 text-muted-foreground/30 cursor-not-allowed"
            : "border-border/50 text-foreground hover:border-accent hover:text-accent hover:bg-accent/5"
          }
        `}
        whileHover={currentPage !== 1 ? { scale: 1.05 } : undefined}
        whileTap={currentPage !== 1 ? { scale: 0.95 } : undefined}
      >
        <FaChevronLeft size={14} />
      </motion.button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        <AnimatePresence mode="popLayout">
          {pageNumbers.map((page, index) => (
            <motion.div
              key={`${page}-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {page === "..." ? (
                <span className="w-10 h-10 flex items-center justify-center text-muted-foreground">
                  ···
                </span>
              ) : (
                <motion.button
                  onClick={() => onPageChange(page as number)}
                  className={`
                    relative w-10 h-10 rounded-lg font-medium text-sm transition-all duration-200
                    ${currentPage === page
                      ? "text-white"
                      : "text-foreground/70 hover:text-foreground hover:bg-accent/5"
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Active background */}
                  {currentPage === page && (
                    <motion.div
                      layoutId="activePageBg"
                      className="absolute inset-0 bg-gradient-to-br from-accent to-accent/80 rounded-lg shadow-lg shadow-accent/25"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{page}</span>
                </motion.button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Next button */}
      <motion.button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          p-2.5 rounded-lg border transition-all duration-200
          ${currentPage === totalPages
            ? "border-border/30 text-muted-foreground/30 cursor-not-allowed"
            : "border-border/50 text-foreground hover:border-accent hover:text-accent hover:bg-accent/5"
          }
        `}
        whileHover={currentPage !== totalPages ? { scale: 1.05 } : undefined}
        whileTap={currentPage !== totalPages ? { scale: 0.95 } : undefined}
      >
        <FaChevronRight size={14} />
      </motion.button>

      {/* Page info */}
      <motion.span
        className="ml-4 text-sm text-muted-foreground hidden sm:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Page {currentPage} of {totalPages}
      </motion.span>
    </motion.div>
  );
}

export default Pagination;
