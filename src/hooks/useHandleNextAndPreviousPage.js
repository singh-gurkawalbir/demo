import { useCallback } from 'react';
import { getPaginationLabel, isDisableNext } from '../utils/pagination';

export default function useHandeNextAndPreviousPage({
  count,
  rowsPerPage,
  page,
  onChangePage,
  hasMore,
  loadMoreHandler,
}) {
  const label = getPaginationLabel(page, rowsPerPage, count, hasMore);
  const disableNextPage = isDisableNext(page, rowsPerPage, count, hasMore);

  const handlePrevPage = useCallback(
    event => {
      if (typeof onChangePage === 'function') {
        onChangePage(event, page - 1);
      }
    },
    [onChangePage, page]
  );
  const handleNextPage = useCallback(
    event => {
      const nextPage = page + 1;
      const startOfNextPage = nextPage * rowsPerPage + 1;
      const endOfNextPage = (nextPage + 1) * rowsPerPage;
      const shouldLoadMore = hasMore && endOfNextPage > count;
      const canNavigateToNextPage = startOfNextPage <= count;

      if (shouldLoadMore && typeof loadMoreHandler === 'function') {
        loadMoreHandler();
      }

      if (canNavigateToNextPage && typeof onChangePage === 'function') {
        onChangePage(event, nextPage);
      }
    },
    [count, hasMore, loadMoreHandler, onChangePage, page, rowsPerPage]
  );

  return {handlePrevPage, handleNextPage, label, disableNextPage};
}
