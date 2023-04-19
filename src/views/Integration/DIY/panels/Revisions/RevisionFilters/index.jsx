import React, { useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import makeStyles from '@mui/styles/makeStyles';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ActionGroup from '../../../../../../components/ActionGroup';
import { getRevisionFilterKey, DEFAULT_REVISION_FILTERS } from '../../../../../../utils/revisions';
import { selectors } from '../../../../../../reducers';
import actions from '../../../../../../actions';
import UserFilter from './UserFilter';
import PaginationFilter from './PaginationFilter';
import CreatedAtFilter from './CreatedAtFilter';
import RevisionStatusFilter from './RevisionStatusFilter';
import RevisionTypeFilter from './RevisionTypeFilter';

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
  const dispatch = useDispatch();
  const { integrationId } = useParams();
  const filterKey = getRevisionFilterKey(integrationId);
  const totalRevisions = useSelector(state => (selectors.revisions(state, integrationId) || []).length);

  const hasEmptyFilters = useSelector(state => {
    const { user, type, status, paging, createdAt } = selectors.filter(state, filterKey);

    return !(user || type || status || paging || createdAt);
  });

  useEffect(() => {
    if (hasEmptyFilters) {
      dispatch(actions.patchFilter(filterKey, DEFAULT_REVISION_FILTERS));
    }
  }, [dispatch, hasEmptyFilters, filterKey]);

  if (!totalRevisions) {
    return null;
  }

  return (
    <div className={classes.filterContainer}>
      <form className={classes.root} autoComplete="off">
        <ActionGroup>
          <CreatedAtFilter />
          <FormControl variant="standard" className={classes.formControl}>
            <RevisionStatusFilter />
          </FormControl>
          <FormControl variant="standard" className={classes.formControl}>
            <RevisionTypeFilter />
          </FormControl>
          <FormControl variant="standard" className={classes.formControl}>
            <UserFilter />
          </FormControl>
        </ActionGroup>
        <ActionGroup position="right">
          <PaginationFilter />
        </ActionGroup>
      </form>
    </div>
  );
}
