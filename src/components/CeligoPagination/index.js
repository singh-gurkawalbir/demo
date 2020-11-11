import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconTextButton from '../IconTextButton';
import ArrowRightIcon from '../icons/ArrowRightIcon';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';
import ArrowDownIcon from '../icons/ArrowDownIcon';
import Spinner from '../Spinner';

const useStyles = makeStyles(theme => ({
  label: {
    textAlign: 'center',
  },
  arrow: {
    paddingLeft: '0px',
    paddingRight: '0px',
  },
  resultsLabel: {
    display: 'flex',
    alignItems: 'center',
  },
  selectRowsPage: {
    paddingTop: 5,
    marginLeft: 5,
  },
  labelLeft: {
    color: theme.palette.secondary.main,
  },
}));

const getPaginationLabel = (page, rowsPerPage, count, hasMore) => {
  const start = page * rowsPerPage + 1;
  const end = (page + 1) * rowsPerPage;
  const total = `${count}${hasMore ? '+' : ''}`;

  return `${start} - ${end < count ? end : count} of ${total}`;
};

const getDisableNext = (page, rowsPerPage, count, hasMore) => {
  const end = (page + 1) * rowsPerPage;

  return (end >= count && !hasMore);
};
export default function Pagination(props) {
  const {
    className,
    count,
    rowsPerPageOptions = [],
    rowsPerPage,
    page,
    onChangePage,
    onChangeRowsPerPage,
    hasMore,
    loading,
    loadMoreHandler,
  } = props;
  const classes = useStyles();

  const label = getPaginationLabel(page, rowsPerPage, count, hasMore);
  const disableNextPage = getDisableNext(page, rowsPerPage, count, hasMore);

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
      const canNavigateToNextPage = startOfNextPage < count;

      if (shouldLoadMore && typeof loadMoreHandler === 'function') {
        loadMoreHandler();
      }

      if (canNavigateToNextPage && typeof onChangePage === 'function') {
        onChangePage(event, nextPage);
      }
    },
    [count, hasMore, loadMoreHandler, onChangePage, page, rowsPerPage]
  );

  return (
    <div className={className}>
      {rowsPerPageOptions.length > 1 ? (

        <div className={classes.resultsLabel}>
          <Typography className={classes.labelLeft}>Results per page:</Typography>
          <Select
            value={rowsPerPage}
            IconComponent={ArrowDownIcon}
            disableUnderline
            className={classes.selectRowsPage}
            displayEmpty
            onChange={onChangeRowsPerPage}>
            {rowsPerPageOptions.map(opt => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </Select>
        </div>
      ) : null}

      <IconTextButton
        onClick={handlePrevPage}
        className={classes.arrow}
        disabled={page === 0}>
        <ArrowLeftIcon />
      </IconTextButton>
      <span className={classes.label}>{label}</span>
      {loading ? (
        <Spinner size={24} />
      ) : (
        <IconTextButton
          onClick={handleNextPage}
          className={classes.arrow}
          disabled={disableNextPage}>
          <ArrowRightIcon />
        </IconTextButton>
      )}
    </div>
  );
}
