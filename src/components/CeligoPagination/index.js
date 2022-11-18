import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowRightIcon from '../icons/ArrowRightIcon';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';
import ArrowDownIcon from '../icons/ArrowDownIcon';
import Spinner from '../Spinner';
import { TextButton } from '../Buttons';
import useHandleNextAndPreviousPage from '../../hooks/useHandleNextAndPreviousPage';

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

export default function Pagination({
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
}) {
  const classes = useStyles();

  const {label, disableNextPage, handlePrevPage, handleNextPage} = useHandleNextAndPreviousPage({
    count,
    rowsPerPage,
    page,
    onChangePage,
    hasMore,
    loadMoreHandler,
  });

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
        <TextButton
          onClick={handlePrevPage}
          className={classes.arrowBtn}
          data-testid="prevPage"
          disabled={page === 0}
          startIcon={<ArrowLeftIcon />} />
        <span className={classes.label}>{label}</span>
        {loading ? (
          <div className={classes.spinnerWrapper}>
            <Spinner
              className={classes.spinner}
              />
          </div>

        ) : (
          <TextButton
            onClick={handleNextPage}
            className={clsx(classes.arrowBtn, classes.arrowBtnRight)}
            disabled={disableNextPage}
            data-testid="nextPage"
            startIcon={<ArrowRightIcon />} />
        )}
      </div>
    </div>
  );
}
