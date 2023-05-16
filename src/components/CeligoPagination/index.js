import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Spinner, TextButton } from '@celigo/fuse-ui';
import ArrowRightIcon from '../icons/ArrowRightIcon';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';
import ArrowDownIcon from '../icons/ArrowDownIcon';
import useHandleNextAndPreviousPage from '../../hooks/useHandleNextAndPreviousPage';

const useStyles = makeStyles(theme => ({
  label: {
    padding: theme.spacing(0, 1),
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
  spinnerWrapper: {
    width: 32,
    height: 27,
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
            variant="standard"
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
          sx={{
            padding: 0,
            minWidth: 24,
            maxWidth: 36,
            display: 'flex',
            ml: 0,
            '& > * svg': {
              ml: 1,
            },
          }}
          data-testid="prevPage"
          disabled={page === 0}
          startIcon={<ArrowLeftIcon />} />
        <span className={classes.label}>{label}</span>
        {loading ? (
          <div className={classes.spinnerWrapper}>
            <Spinner
              sx={{
                ml: 1,
                mr: 1,
              }}
              />
          </div>

        ) : (
          <TextButton
            onClick={handleNextPage}
            sx={{
              padding: 0,
              minWidth: 24,
              maxWidth: 36,
              display: 'flex',
              ml: 0,
              '& > * svg': {
                ml: 1,
              },
              '& > svg': {
                mr: 0,
              },
            }}
            disabled={disableNextPage}
            data-testid="nextPage"
            startIcon={<ArrowRightIcon />} />
        )}
      </div>
    </div>
  );
}
