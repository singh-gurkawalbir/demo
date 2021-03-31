import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import actions from '../../actions';
import CeligoPageBar from '../../components/CeligoPageBar';
import ResourceTable from '../../components/ResourceTable';
import CheckPermissions from '../../components/CheckPermissions';
import ResourceDrawer from '../../components/drawer/Resource';
import ShowMoreDrawer from '../../components/drawer/ShowMore';
import KeywordSearch from '../../components/KeywordSearch';
import LoadResources from '../../components/LoadResources';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../reducers';
import { PERMISSIONS } from '../../utils/constants';
import infoText from '../ResourceList/infoText';
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

export const LoadingMask = ({message}) => (
  <Loader open>
    <Typography variant="h4">{message}</Typography>
    <Spinner />
  </Loader>
);
const defaultFilter = {
  take: parseInt(process.env.DEFAULT_TABLE_ROW_COUNT, 10) || 10,
  sort: { orderBy: 'doc.name', order: 'asc' },
};

export default function RecycleBin(props) {
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const filterKey = 'recycleBinTTL';
  const filter =
    useSelector(state =>
      selectors.filter(state, filterKey));
  const recycleBinFilterConfig = useMemo(
    () => ({
      type: 'recycleBinTTL',
      ...(filter || {}),
    }),
    [filter]
  );

  useEffect(() => {
    dispatch(actions.patchFilter(filterKey, defaultFilter));
  },
  [dispatch]);
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
        {status === 'requested' && <LoadingMask message="Restoring..." />}
        <ResourceDrawer {...props} />
        <CeligoPageBar title="Recycle bin" infoText={infoText.recycleBin}>
          <div className={classes.actions}>
            <KeywordSearch
              filterKey={filterKey}
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
              <ResourceTable resources={list.resources} resourceType="recycleBinTTL" />
            )}
          </LoadResources>
        </div>
        <ShowMoreDrawer
          filterKey={filterKey}
          count={list.count}
          maxCount={list.filtered}
        />
      </CheckPermissions>
    </>
  );
}
