import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ActionGroup from '../../../../../../components/ActionGroup';
import CeligoSelect from '../../../../../../components/CeligoSelect';
import DateRangeSelector from '../../../../../../components/DateRangeSelector';
import {
  REVISION_STATUS_OPTIONS,
  REVISION_TYPE_OPTIONS,
  ROWS_PER_PAGE_OPTIONS,
} from '../../../../../../utils/revisions';
import useFetchIntegrationUsers from '../../../../../../hooks/useFetchIntegrationUsers';
import CeligoPagination from '../../../../../../components/CeligoPagination';
import { selectors } from '../../../../../../reducers';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
  },
  formControl: {
    marginRight: theme.spacing(1),
    minWidth: 150,
    maxWidth: theme.spacing(30),
    height: 36,
  },
  tablePaginationRoot: {
    display: 'flex',
  },
  filterContainer: {
    padding: theme.spacing(2, 0),
    border: `solid 1px ${theme.palette.secondary.lightest}`,
    borderWidth: [[1, 0]],
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    '& > *': {
      marginRight: 10,
      '&:first-child': {
        marginLeft: 10,
      },
    },
  },
}));

export default function RevisionFilters() {
  const classes = useStyles();
  const { integrationId } = useParams();
  const integrationUsers = useFetchIntegrationUsers(integrationId);
  const userInput = {
    name: 'byUser',
    id: 'byUser',
  };

  const totalRevisions = useSelector(state => (selectors.revisions(state, integrationId) || []).length);

  return (
    <div className={classes.filterContainer}>
      <form className={classes.root} autoComplete="off">
        <ActionGroup>
          <DateRangeSelector
            // disabled={!canDownloadLogs}
            primaryButtonLabel="Created date"
            placement="right"
            fixedPlaceholder="Created date"
            // clearValue={defaultRange}
            // onSave={handleDateFilter}
            // value={date}
         />
          <FormControl className={classes.formControl}>
            <CeligoSelect
              isLoggable={false}
              inputProps={userInput}
              onChange={() => {}}
              value="ALL"
            >
              <MenuItem key="ALL" value="ALL">
                Select status
              </MenuItem>
              {REVISION_STATUS_OPTIONS.map(opt => (
                <MenuItem key={opt.value} value={opt.value} data-private>
                  {opt.label}
                </MenuItem>
              ))}
            </CeligoSelect>
          </FormControl>
          <FormControl className={classes.formControl}>
            <CeligoSelect
              isLoggable={false}
              inputProps={userInput}
              onChange={() => {}}
              value="ALL"
            >
              <MenuItem key="ALL" value="ALL">
                Select type
              </MenuItem>
              {REVISION_TYPE_OPTIONS.map(opt => (
                <MenuItem key={opt.value} value={opt.value} data-private>
                  {opt.label}
                </MenuItem>
              ))}
            </CeligoSelect>
          </FormControl>
          <FormControl className={classes.formControl}>
            <CeligoSelect
              isLoggable={false}
              inputProps={userInput}
              onChange={() => {}}
              value="ALL"
            >
              <MenuItem key="ALL" value="ALL">
                Select user
              </MenuItem>
              {
                integrationUsers.map(user => (
                  <MenuItem key={user.sharedWithUser._id} value={user.sharedWithUser._id} data-private>
                    {user.sharedWithUser.name || user.sharedWithUser.email}
                  </MenuItem>
                ))
              }
            </CeligoSelect>
          </FormControl>
        </ActionGroup>
        <ActionGroup position="right">
          <CeligoPagination
            rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
            className={classes.tablePaginationRoot}
            count={totalRevisions}
            page={0}
            rowsPerPage={25}
            resultPerPageLabel="Results per page:"
            // onChangePage={handleChangePage}
            // onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </ActionGroup>
      </form>
    </div>
  );
}
