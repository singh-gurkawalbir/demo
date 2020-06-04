import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import actions from '../../actions';
import CeligoPageBar from '../../components/CeligoPageBar';
import CeligoTable from '../../components/CeligoTable';
import CheckPermissions from '../../components/CheckPermissions';
import ResourceDrawer from '../../components/drawer/Resource';
import ShowMoreDrawer from '../../components/drawer/ShowMore';
import KeywordSearch from '../../components/KeywordSearch';
import LoadResources from '../../components/LoadResources';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';
import * as selectors from '../../reducers';
import { PERMISSIONS } from '../../utils/constants';
import infoText from '../ResourceList/infoText';
import metadata from './metadata';
import Loader from '../../components/Loader';
import Spinner from '../../components/Spinner';

const useStyles = makeStyles(theme => ({
  actions: {
    display: 'flex',
  },
  resultContainer: {
    padding: theme.spacing(3, 3, 12, 3),
  },
}));
const LoadingMask = () => (
  <Loader open>
    <Typography variant="h4">Restoring...</Typography>
    <Spinner color="primary" />
  </Loader>
);

export default function RecycleBin(props) {
  const history = useHistory();
  const defaultFilter = useMemo(
    () => ({ take: 10, sort: { orderBy: 'doc.name', order: 'asc' } }),
    []
  );
  const classes = useStyles();
  const dispatch = useDispatch();
  const filter =
    useSelector(state => selectors.filter(state, 'recycleBinTTL')) ||
    defaultFilter;
  const recycleBinFilterConfig = useMemo(
    () => ({
      type: 'recycleBinTTL',
      ...defaultFilter,
      ...filter,
    }),
    [defaultFilter, filter]
  );
  const list = useSelectorMemo(
    selectors.makeResourceListSelector,
    recycleBinFilterConfig
  );

  useEffect(() => {
    dispatch(actions.resource.requestCollection('recycleBinTTL'));
  }, [dispatch]);

  // redirect cleanup
  useEffect(() => () => dispatch(actions.recycleBin.restoreClear()), [
    dispatch,
  ]);

  const { status, redirectTo } = useSelector(state =>
    selectors.recycleBinState(state)
  );

  if (redirectTo) {
    history.push(redirectTo);
  }

  return (
    <>
      <CheckPermissions permission={PERMISSIONS.recyclebin.view}>
        {status === 'requested' && <LoadingMask />}
        <ResourceDrawer {...props} />
        <CeligoPageBar title="Recycle bin" infoText={infoText.recycleBin}>
          <div className={classes.actions}>
            <KeywordSearch
              filterKey="recycleBinTTL"
              defaultFilter={defaultFilter}
            />
          </div>
        </CeligoPageBar>
        <div className={classes.resultContainer}>
          <LoadResources required resources="recycleBinTTL">
            {list.count === 0 ? (
              <Typography>
                {list.total === 0
                  ? 'Recycle bin is empty.'
                  : 'Your search didn’t return any matching results. Try expanding your search criteria.'}
              </Typography>
            ) : (
              <CeligoTable
                data={list.resources}
                filterKey="recycleBinTTL"
                {...metadata}
                actionProps={{ resourceType: 'recycleBinTTL' }}
              />
            )}
          </LoadResources>
        </div>
        <ShowMoreDrawer
          filterKey="recycleBinTTL"
          count={list.count}
          maxCount={list.filtered}
        />
      </CheckPermissions>
    </>
  );
}
