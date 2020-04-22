import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import AddIcon from '../../components/icons/AddIcon';
import CeligoPageBar from '../../components/CeligoPageBar';
import { MODEL_PLURAL_TO_LABEL, generateNewId } from '../../utils/resource';
import infoText from './infoText';
import IconTextButton from '../../components/IconTextButton';
import * as selectors from '../../reducers';
import LoadResources from '../../components/LoadResources';
import ResourceTable from '../../components/ResourceTable';
import ResourceDrawer from '../../components/drawer/Resource';
import ShowMoreDrawer from '../../components/drawer/ShowMore';
import KeywordSearch from '../../components/KeywordSearch';
import CheckPermissions from '../../components/CheckPermissions';
import { PERMISSIONS } from '../../utils/constants';
import { connectorFilter } from './util';
import actions from '../../actions';

const useStyles = makeStyles(theme => ({
  actions: {
    display: 'flex',
  },
  resultContainer: {
    padding: theme.spacing(3, 3, 12, 3),
  },
}));
const defaultFilter = { take: 10 };

function ResourceList(props) {
  const { match, location } = props;
  const { resourceType } = match.params;
  const dispatch = useDispatch();
  const classes = useStyles();
  const filter =
    useSelector(state => selectors.filter(state, resourceType)) ||
    defaultFilter;
  const list = useSelector(state =>
    selectors.resourceList(state, {
      type: resourceType,
      filter: connectorFilter(resourceType),
      ...{ ...defaultFilter, ...filter },
    })
  );
  const resourceName = MODEL_PLURAL_TO_LABEL[resourceType] || '';

  useEffect(() => {
    let int;

    dispatch(actions.resource.connections.refreshStatus());

    // TODO: discus with team how to best handle this feature (and as future feature pattern)...
    // This works file for this single connection list, but what about other places where we may show a
    // list of connections.  I think we are probably safe in the FB connection list. I could be wrong, but
    // i think it uses the child resourceTable component, not this view... also what about future
    // features where we show lists of connections and may also show/filter on status?
    // instead of littering our presentation codebase with "refresh logic", should we not instead have
    // sone data-layer saga controlling this? possibly with a refresh fall-off policy, or track
    // user activity and stop polling if there is none, etc?
    // For connections resource table, we need to poll the connection status and queueSize
    if (resourceType === 'connections') {
      int = setInterval(() => {
        dispatch(actions.resource.connections.refreshStatus());
      }, 10 * 1000);
    }

    return () => {
      clearInterval(int);
    };
  }, [dispatch, resourceType]);

  return (
    <CheckPermissions
      permission={
        PERMISSIONS &&
        PERMISSIONS[resourceType] &&
        PERMISSIONS[resourceType].view
      }>
      <ResourceDrawer {...props} />
      <CeligoPageBar
        title={`${resourceName}s`}
        infoText={infoText[resourceType]}>
        <div className={classes.actions}>
          <KeywordSearch
            filterKey={resourceType}
            defaultFilter={defaultFilter}
          />
          <IconTextButton
            data-test="addNewResource"
            component={Link}
            to={`${location.pathname}/add/${resourceType}/${generateNewId()}`}
            variant="text"
            color="primary">
            <AddIcon /> Create {resourceName.toLowerCase()}
          </IconTextButton>
        </div>
      </CeligoPageBar>
      <div className={classes.resultContainer}>
        <LoadResources required resources={resourceType}>
          {list.count === 0 ? (
            <Typography>
              {list.total === 0
                ? `You don't have any ${resourceName.toLowerCase()}s.`
                : 'Your search didn’t return any matching results. Try expanding your search criteria.'}
            </Typography>
          ) : (
            <ResourceTable
              resourceType={resourceType}
              resources={list.resources}
            />
          )}
        </LoadResources>
      </div>
      <ShowMoreDrawer
        filterKey={resourceType}
        count={list.count}
        maxCount={list.filtered}
      />
    </CheckPermissions>
  );
}

export default withRouter(ResourceList);
