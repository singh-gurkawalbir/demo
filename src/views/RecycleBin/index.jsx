import { Fragment, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import CeligoPageBar from '../../components/CeligoPageBar';
import infoText from '../ResourceList/infoText';
import * as selectors from '../../reducers';
import LoadResources from '../../components/LoadResources';
import CeligoTable from '../../components/CeligoTable';
import ResourceDrawer from '../../components/drawer/Resource';
import ShowMoreDrawer from '../../components/drawer/ShowMore';
import KeywordSearch from '../../components/KeywordSearch';
import metadata from './metadata';
import CheckPermissions from '../../components/CheckPermissions';
import { PERMISSIONS } from '../../utils/constants';
import actions from '../../actions';
import useResourceList from '../../hooks/useResourceList';

const useStyles = makeStyles(theme => ({
  actions: {
    display: 'flex',
  },
  resultContainer: {
    padding: theme.spacing(3, 3, 12, 3),
  },
}));

export default function RecycleBin(props) {
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
  const list = useResourceList(recycleBinFilterConfig);

  useEffect(() => {
    dispatch(actions.resource.requestCollection('recycleBinTTL'));
  }, [dispatch]);

  return (
    <Fragment>
      <CheckPermissions permission={PERMISSIONS.recyclebin.view}>
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
            <CeligoTable
              data={list.resources}
              filterKey="recycleBinTTL"
              {...metadata}
              actionProps={{ resourceType: 'recycleBinTTL' }}
            />
          </LoadResources>
        </div>
        <ShowMoreDrawer
          filterKey="recycleBinTTL"
          count={list.count}
          maxCount={list.filtered}
        />
      </CheckPermissions>
    </Fragment>
  );
}
