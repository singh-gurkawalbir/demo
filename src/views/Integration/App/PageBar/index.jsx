import { MenuItem, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback} from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import actions from '../../../../actions';
import CeligoPageBar from '../../../../components/CeligoPageBar';
import ChipInput from '../../../../components/ChipInput';
import AddIcon from '../../../../components/icons/AddIcon';
import ArrowDownIcon from '../../../../components/icons/ArrowDownIcon';
import CopyIcon from '../../../../components/icons/CopyIcon';
import IconTextButton from '../../../../components/IconTextButton';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../../reducers';
import integrationAppUtil, { getIntegrationAppUrlName } from '../../../../utils/integrationApps';
import getRoutePath from '../../../../utils/routePaths';
import StatusCircle from '../../../../components/StatusCircle';
import { USER_ACCESS_LEVELS } from '../../../../utils/constants';

const useStyles = makeStyles(theme => ({
  tag: {
    marginLeft: theme.spacing(1),
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
  },
  // TODO: (Azhar) make all pagebar dropdown same without border.
  storeSelect: {
    fontFamily: 'Roboto500',
    fontSize: 13,
    transition: theme.transitions.create('background-color'),
    paddingLeft: theme.spacing(1),
    height: 'unset',
    '&:hover': {
      backgroundColor: theme.palette.background.default,
      borderRadius: theme.spacing(0.5),
    },
    '& > div': {
      paddingTop: theme.spacing(1),
    },
  },
  storeErrorStatus: {
    display: 'grid',
    minWidth: 250,
    width: '100%',
    gridColumnGap: '10px',
    gridTemplateColumns: '70% 30%',
    '& > div:first-child': {
      wordBreak: 'break-word',
    },
  },
}));

const AllStoreItem = ({integrationId, storeLabel}) => {
  const classes = useStyles();
  const integrationErrorsPerStore = useSelector(state =>
    selectors.integrationErrorsPerStore(state, integrationId),
  shallowEqual
  );
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );
  const totalCount = Object.values(integrationErrorsPerStore).reduce(
    (total, count) => total + count,
    0);

  if (!isUserInErrMgtTwoDotZero) {
    return (
      <MenuItem value="">
        All {storeLabel}s
      </MenuItem>
    );
  }

  if (totalCount === 0) {
    return (
      <MenuItem value="" className={classes.storeErrorStatus}>
        <div> All {storeLabel}s</div>
        <div>
          <StatusCircle size="mini" variant="success" />
        </div>
      </MenuItem>
    );
  }

  return (
    <MenuItem value="" className={classes.storeErrorStatus}>
      <div> All {storeLabel}s</div>
      <div>
        <StatusCircle size="mini" variant="error" />
        <span>{totalCount > 9999 ? '9999+' : totalCount}</span>
      </div>
    </MenuItem>
  );
};
// TODO Surya : StoreMenuItems to go into the ArrowPopper.
const StoreMenuItems = ({ integration, integrationId }) => {
  const classes = useStyles();
  const integrationErrorsPerStore = useSelector(state =>
    selectors.integrationErrorsPerStore(state, integrationId),
  shallowEqual
  );
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );

  return integration?.stores?.map(store => {
    if (!isUserInErrMgtTwoDotZero) {
      return (
        <MenuItem key={store.value} value={store.value}>
          {store.label}
        </MenuItem>
      );
    }
    const storeErrorCount = integrationErrorsPerStore[store.value];

    if (storeErrorCount === 0) {
      return (
        <MenuItem key={store.value} value={store.value} className={classes.storeErrorStatus}>
          <div> {store.label}</div>
          <div>
            <StatusCircle size="mini" variant="success" />
          </div>
        </MenuItem>
      );
    }

    return (
      <MenuItem key={store.value} value={store.value} className={classes.storeErrorStatus}>
        <div> {store.label}</div>
        <div>
          <StatusCircle size="mini" variant="error" />
          <span>{storeErrorCount > 9999 ? '9999+' : storeErrorCount}</span>
        </div>
      </MenuItem>
    );
  });
};
export default function PageBar() {
  const history = useHistory();
  const classes = useStyles();
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const { integrationId, storeId, tab } = match.params;

  // TODO: Note this selector should return undefined/null if no
  // integration exists. not a stubbed out complex object.
  const integration = useSelectorMemo(selectors.mkIntegrationAppSettings, integrationId) || {};

  const integrationAppName = getIntegrationAppUrlName(integration?.name);
  const accessLevel = useSelector(
    state =>
      selectors.resourcePermissions(state, 'integrations', integrationId)?.accessLevel
  );
  const { supportsMultiStore, storeLabel } = integration?.settings || {};

  const isCloningSupported =
  integration &&
  integrationAppUtil.isCloningSupported(
    integration._connectorId,
    integration.name
  ) && accessLevel !== 'monitor';
  const handleTagChangeHandler = useCallback(
    tag => {
      const patchSet = tag ? [{ op: 'replace', path: '/tag', value: tag }] : [{ op: 'remove', path: '/tag'}];

      dispatch(actions.resource.patch('integrations', integrationId, patchSet));
    },
    [dispatch, integrationId]
  );
  const handleStoreChange = useCallback(
    e => {
      const newStoreId = e.target.value;

      if (newStoreId) {
        // Redirect to current tab of new store
        history.push(
          getRoutePath(
            `integrationapps/${integrationAppName}/${integrationId}/child/${newStoreId}/${tab}`
          )
        );
      } else {
        history.push(
          getRoutePath(
            `integrationapps/${integrationAppName}/${integrationId}/${tab}`
          )
        );
      }
    },
    [history, integrationAppName, integrationId, tab]
  );
  const handleAddNewStoreClick = useCallback(() => {
    history.push(
      getRoutePath(`/integrationapps/${integrationAppName}/${integrationId}/install/addNewStore`)
    );
  }, [history, integrationAppName, integrationId]);

  const renderStoreLabel = useCallback(selectedStoreId => {
    if (selectedStoreId === '') {
      return `All ${storeLabel}s`;
    }

    return integration.stores?.find(store => store.value === selectedStoreId)?.label || selectedStoreId;
  },
  [integration.stores, storeLabel]);

  const storeItems = StoreMenuItems({ integration, integrationId });
  const allStoreItem = AllStoreItem({integrationId, storeLabel});

  return (
    <CeligoPageBar
      title={integration.name}
      titleTag={(
        <ChipInput
          disabled={![USER_ACCESS_LEVELS.ACCOUNT_ADMIN, USER_ACCESS_LEVELS.ACCOUNT_MANAGE, USER_ACCESS_LEVELS.ACCOUNT_OWNER].includes(accessLevel)}
          value={integration.tag || 'tag'}
          className={classes.tag}
          variant="outlined"
          onChange={handleTagChangeHandler}
          />
        )}
      infoText={integration.description}>
      {isCloningSupported && integration && !supportsMultiStore && (
      <IconTextButton
        component={Link}
        to={getRoutePath(`/clone/integrations/${integration._id}/preview`)}
        variant="text"
        data-test="cloneIntegrationApp">
        <CopyIcon /> Clone integration
      </IconTextButton>
      )}
      {supportsMultiStore && (
      <div className={classes.actions}>
        {([USER_ACCESS_LEVELS.ACCOUNT_ADMIN, USER_ACCESS_LEVELS.ACCOUNT_MANAGE, USER_ACCESS_LEVELS.ACCOUNT_OWNER].includes(accessLevel)) && (
        <IconTextButton
          variant="text"
          color="primary"
          data-test={`add${storeLabel}`}
          onClick={handleAddNewStoreClick}>
          <AddIcon /> Add {storeLabel}
        </IconTextButton>
        )}
        <Select
          data-public
          displayEmpty
          data-test={`select${storeLabel}`}
          className={classes.storeSelect}
          onChange={handleStoreChange}
          renderValue={renderStoreLabel}
          IconComponent={ArrowDownIcon}
          value={storeId || ''}>
          {allStoreItem}
          {storeItems}
        </Select>
      </div>
      )}
    </CeligoPageBar>

  );
}
