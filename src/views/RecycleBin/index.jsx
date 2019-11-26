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

const useStyles = makeStyles(theme => ({
  actions: {
    display: 'flex',
  },
  resultContainer: {
    padding: theme.spacing(3, 3, 12, 3),
  },
}));

export default function RecycleBin(props) {
  const defaultFilter = useMemo(() => ({ take: 5 }), []);
  const classes = useStyles();
  const dispatch = useDispatch();
  const filter =
    useSelector(state => selectors.filter(state, 'recycleBinTTL')) ||
    defaultFilter;
  const list = useSelector(state =>
    selectors.resourceListWithPermissions(state, {
      type: 'recycleBinTTL',
      ...{ ...defaultFilter, ...filter },
    })
  );

  useEffect(() => {
    dispatch(actions.resource.requestCollection('recycleBinTTL'));
  }, [dispatch]);

  return (
    <Fragment>
      <CheckPermissions
        permission={
          PERMISSIONS && PERMISSIONS.recyclebin && PERMISSIONS.recyclebin.view
        }>
        <ResourceDrawer {...props} />
        <CeligoPageBar title="Recycle Bin" infoText={infoText.recycleBin}>
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
