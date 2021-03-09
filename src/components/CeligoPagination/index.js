import React, { useCallback } from 'react';
import clsx from 'clsx';
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
    padding: theme.spacing(0, 1),
  },
  arrowBtn: {
    padding: 0,
    minWidth: theme.spacing(3),
    maxWidth: theme.spacing(4),
    display: 'flex',
    marginLeft: 0,
    '& > * svg': {
      marginLeft: theme.spacing(1),
    },
  },
  resultsLabel: {
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1),
    borderRight: `1px solid ${theme.palette.secondary.lightest}`,
    paddingRight: theme.spacing(1),
  },
  selectRowsPage: {
    marginLeft: 5,
  },
  pagesCountWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(3),
  },
  arrowBtnRight: {
    '& > svg': {
      marginRight: 0,
    },
  },
  spinnerWrapper: {
    width: 32,
    height: 27,
  },
  spinner: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

const getPaginationLabel = (page, rowsPerPage, count, hasMore) => {
  const start = page * rowsPerPage + 1;
  const end = (page + 1) * rowsPerPage;
  const total = `${count}${hasMore ? '+' : ''}`;

  return `${start} - ${end < count ? end : count} of ${total}`;
};

const isDisableNext = (page, rowsPerPage, count, hasMore) => {
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
    resultPerPageLabel = 'Results per page:',
  } = props;
  const classes = useStyles();

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
          <Typography variant="body2">{resultPerPageLabel}</Typography>
          <Select
            value={rowsPerPage}
            className={classes.selectRowsPage}
            IconComponent={ArrowDownIcon}
            disableUnderline
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
      <div className={classes.pagesCountWrapper}>
        <IconTextButton
          onClick={handlePrevPage}
          className={classes.arrowBtn}
          disabled={page === 0}>
          <ArrowLeftIcon />
        </IconTextButton>
        <span className={classes.label}>{label}</span>
        {loading ? (
          <div className={classes.spinnerWrapper}>
            <Spinner
              className={classes.spinner}
              size={24}
              color="primary"
              />
          </div>

        ) : (
          <IconTextButton
            onClick={handleNextPage}
            className={clsx(classes.arrowBtn, classes.arrowBtnRight)}
            disabled={disableNextPage}>
            <ArrowRightIcon />
          </IconTextButton>
        )}
      </div>
    </div>
  );
}
