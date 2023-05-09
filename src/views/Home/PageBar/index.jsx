import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { selectors } from '../../../reducers';
import CeligoPageBar from '../../../components/CeligoPageBar';
import { generateNewId } from '../../../utils/resource';
import ActionGroup from '../../../components/ActionGroup';
// import CeligoDivider from '../../../components/CeligoDivider';
import TilesViewIcon from '../../../components/icons/TilesViewIcon';
import ListViewIcon from '../../../components/icons/ListViewIcon';
import IconButtonWithTooltip from '../../../components/IconButtonWithTooltip';
import KeywordSearch from '../../../components/KeywordSearch';
import actions from '../../../actions';
import { FILTER_KEY, LIST_VIEW, TILE_VIEW } from '../../../utils/home';
import { buildDrawerUrl, drawerPaths } from '../../../utils/rightDrawer';
import PillButtonWithMenu from '../../../components/Buttons/PillButtonWithMenu';
import FlowsIcon from '../../../components/icons/FlowsIcon';
import ConnectionsIcon from '../../../components/icons/ConnectionsIcon';
import FolderIcon from '../../../components/icons/FolderIcon';
import DownloadIntegrationIcon from '../../../components/icons/DownloadIntegrationIcon';

const useStyles = makeStyles(theme => ({
  viewIcon: {
    position: 'relative',
    marginLeft: theme.spacing(2),
    color: theme.palette.secondary.main,
    '&:hover': {
      background: 'none',
      color: theme.palette.primary.main,
    },
    '&:last-child': {
      marginLeft: -parseInt(theme.spacing(0.5), 10),
    },
  },
  viewsWrapper: {
    borderLeft: `1px solid ${theme.palette.secondary.lightest}`,
    paddingLeft: parseInt(theme.spacing(3), 10),
  },
  activeView: {
    color: theme.palette.primary.main,
    '&:after': {
      position: 'absolute',
      content: '""',
      width: '100%',
      borderBottom: `2px solid ${theme.palette.primary.main}`,
      bottom: -parseInt(theme.spacing(0.5), 10),
      left: 0,
    },
  },
  buttonWrapper: {
    marginRight: theme.spacing(2),
  },
  homePillButton: {
    padding: '6px 12px',
    marginRight: 6,
    '& .MuiButton-endIcon': {
      marginLeft: 0,
    },
  },
}));

const emptyObject = {};

export default function IntegrationCeligoPageBar() {
  const location = useLocation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [tempConnId, setTempConnId] = useState(generateNewId());
  const isConnectionCreated = useSelector(state => selectors.createdResourceId(state, tempConnId));

  const permission = useSelector(state => {
    const {create, install} = selectors.resourcePermissions(state, 'integrations');

    return {create, install};
  }, shallowEqual);
  const homePreferences = useSelector(state => selectors.userPreferences(state).dashboard || emptyObject, shallowEqual);
  const isListView = useSelector(state => selectors.isHomeListView(state));
  const uploadActions = [
    {
      label: 'Integration',
      description: 'Upload an existing integration',
      dataTestId: 'installZip',
      link: buildDrawerUrl({
        path: drawerPaths.INSTALL.INTEGRATION,
        baseUrl: location.pathname,
      }),
      Icon: DownloadIntegrationIcon,
    },
  ];
  const createActions = [
    {
      label: 'Flow',
      dataTestId: 'createFlow',
      description: 'Sync data between apps',
      link: '/integrations/none/flowBuilder/new',
      Icon: FlowsIcon,
    },
    {
      label: 'Connection',
      description: 'Access data for an app',
      dataTestId: 'createConnection',
      Icon: ConnectionsIcon,
      link: buildDrawerUrl({
        path: drawerPaths.RESOURCE.ADD,
        baseUrl: location.pathname,
        params: { resourceType: 'connections', id: tempConnId },
      }),
    },
    {
      label: 'Integration',
      description: 'Organize flows in a folder',
      dataTestId: 'newIntegration',
      link: buildDrawerUrl({
        path: drawerPaths.RESOURCE.ADD,
        baseUrl: location.pathname,
        params: { resourceType: 'integrations', id: generateNewId() },
      }),
      Icon: FolderIcon,
    },
  ];

  useEffect(() => {
    if (isConnectionCreated) {
      history.push('/connections');
      setTempConnId(generateNewId());
    }
  }, [history, isConnectionCreated]);

  return (
    <CeligoPageBar title="My integrations" contentId="home">
      <KeywordSearch filterKey={FILTER_KEY} placeholder="Search integrations & flows" />

      <ActionGroup>
        <div className={classes.buttonWrapper}>
          {permission.create && (
          <PillButtonWithMenu
            label="Create" data-test="createResource" menuTitle="CREATE" className={classes.homePillButton}
            fill
            actionsMenu={createActions} />
          )}
          {permission.install && (
          <PillButtonWithMenu
            label="Upload" data-test="uploadZip" menuTitle="UPLOAD" className={classes.homePillButton}
            actionsMenu={uploadActions} />
          )}
        </div>
        <ActionGroup className={classes.viewsWrapper}>
          <IconButtonWithTooltip
            data-test="tileView"
            className={clsx(classes.viewIcon, {[classes.activeView]: !isListView})}
            onClick={() => dispatch(actions.user.preferences.update({ dashboard: {...homePreferences, view: TILE_VIEW}}))}
            tooltipProps={{title: 'Tile view', placement: 'bottom'}}
            buttonSize={{size: 'small'}}>
            <TilesViewIcon />
          </IconButtonWithTooltip>

          <IconButtonWithTooltip
            data-test="listView"
            className={clsx(classes.viewIcon, {[classes.activeView]: isListView})}
            onClick={() => dispatch(actions.user.preferences.update({ dashboard: {...homePreferences, view: LIST_VIEW} }))}
            tooltipProps={{title: 'List view', placement: 'bottom'}}
            buttonSize={{size: 'small'}}>
            <ListViewIcon />
          </IconButtonWithTooltip>
        </ActionGroup>
      </ActionGroup>
    </CeligoPageBar>
  );
}
