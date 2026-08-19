import { useState } from 'react';

interface Options {
  initialPage?: number;
  initialLimit?: number;
}

export function usePagination({ initialPage = 1, initialLimit = 10 }: Options = {}) {
  const [page, setPage]   = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  return {
    page,
    limit,
    setLimit,
    goToPage: (n: number) => setPage(Math.max(1, n)),
    reset: () => setPage(initialPage),
  };
}
