import { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconTextButton from '../../../components/IconTextButton';
import ArrowRightIcon from '../../../components/icons/ArrowRightIcon';
import ArrowLeftIcon from '../../../components/icons/ArrowLeftIcon';
import Spinner from '../../../components/Spinner';

const useStyles = makeStyles(() => ({
  label: {
    textAlign: 'center',
  },
  arrow: {
    paddingLeft: '0px',
    paddingRight: '0px',
  },
}));

export default function Pagination(props) {
  const {
    className,
    count,
    // rowsPerPageOptions,
    rowsPerPage,
    page,
    onChangePage,
    // onChangeRowsPerPage,
    hasMore,
    loading,
    loadMoreHandler,
  } = props;
  const classes = useStyles();
  const [label, setLabel] = useState();

  useEffect(() => {
    const start = page * rowsPerPage + 1;
    const end = (page + 1) * rowsPerPage;
    const total = `${count}${hasMore ? '+' : ''}`;

    setLabel(`${start} - ${end < count ? end : count} of ${total}`);
  }, [count, hasMore, page, rowsPerPage]);

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
      const endOfNextPage = (nextPage + 1) * rowsPerPage;
      const shouldLoadMore = hasMore && endOfNextPage > count;

      if (shouldLoadMore && typeof loadMoreHandler === 'function') {
        loadMoreHandler();
      }

      if (typeof onChangePage === 'function') {
        onChangePage(event, nextPage);
      }
    },
    [count, hasMore, loadMoreHandler, onChangePage, page, rowsPerPage]
  );

  return (
    <div className={className}>
      <IconTextButton
        onClick={handlePrevPage}
        className={classes.arrow}
        disabled={page === 0}>
        <ArrowLeftIcon />
      </IconTextButton>
      <span className={classes.label}>{label}</span>
      {loading ? (
        <Spinner />
      ) : (
        <IconTextButton onClick={handleNextPage} className={classes.arrow}>
          <ArrowRightIcon />
        </IconTextButton>
      )}
    </div>
  );
}
