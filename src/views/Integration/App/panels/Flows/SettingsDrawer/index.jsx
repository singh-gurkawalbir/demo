import React, { useMemo } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Route, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import clsx from 'clsx';
import { selectors } from '../../../../../../reducers';
import { integrationSettingsToDynaFormMetadata } from '../../../../../../forms/formFactory/utils';
import DrawerTitleBar from '../../../../../../components/drawer/TitleBar';
import LoadResources from '../../../../../../components/LoadResources';
import { IAFormStateManager, useActiveTab } from '..';
import useIASettingsStateWithHandleClose from '../../../../../../hooks/useIASettingsStateWithHandleClose';
import EditorDrawer from '../../../../../../components/AFE/Drawer';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    marginTop: theme.appBarHeight,
    // until we re-design the IA settings forms, we NEED this width to prevent
    // wrapping of some fields that makes the interface MUCH less usable.
    width: 1300,
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    boxShadow: '-4px 4px 8px rgba(0,0,0,0.15)',
    zIndex: theme.zIndex.drawer + 1,
    paddingBottom: theme.appBarHeight,
  },
  settingsDrawerForm: {
    overflowY: 'auto',
    padding: theme.spacing(2, 3),
    '& + div': {
      margin: theme.spacing(0, 3),
      paddingLeft: 0,
    },
    '& > * div.MuiTabs-vertical': {
      marginTop: theme.spacing(-2),
      marginLeft: theme.spacing(-3),
      marginRight: theme.spacing(2),
      '& > * button > span': {
        justifyContent: 'flex-start',
      },
    },
  },
  settingsDrawerCamForm: {
    '& > div': {
      height: '100%',
      '& > div': {
        paddingBottom: theme.spacing(3),
      },
    },
  },
  settingsDrawerDetails: {
    minHeight: 'calc(100% - 138px)',
  },
}));

function SettingsDrawer({ integrationId, childId, parentUrl }) {
  const classes = useStyles();
  const match = useRouteMatch();
  const { flowId } = match.params;
  const flow =
    useSelector(state => selectors.resource(state, 'flows', flowId)) || {};
  const flowName = flow.name || flow._id;
  // TODO: Fix this convoluted way of getting settings for a specific flow.
  // the data layer should have a simple, clean, selector api, that, given a flowId,
  // returns the flow settings. Right now to look up this info, i need to
  // jump through hoops to accomplish a simple lookup. It was also a brutal task to
  // trace existing code and find the solution to this. There were SO many proxied
  // props (all of which would cause re-renders of deep component trees)
  // We have a data-layer for a reason. There is absolutely no reason to proxy data-layer
  // results deeply through many nested components.
  const { settings: fields, sections } = useSelector(
    state => selectors.iaFlowSettings(state, integrationId, flowId, childId),
    shallowEqual

  );
  const flowSettingsMemo = useMemo(
    () =>
      integrationSettingsToDynaFormMetadata(
        { fields, sections },
        integrationId,
        true,
        {
          resource: flow,
          isFlow: true,
        }
      ),
    [fields, flow, integrationId, sections]
  );
  const { formState, handleClose } = useIASettingsStateWithHandleClose(
    integrationId,
    flowId,
    null,
    parentUrl
  );
  const activeTabProps = useActiveTab();

  // Todo: Sravan, we should use Rightdrawer here
  return (
    <Drawer
      // variant="persistent"
      anchor="right"
      open={!!match}
      classes={{
        paper: classes.drawerPaper,
      }}
      onClose={handleClose}>
      <DrawerTitleBar title={`Settings: ${flowName}`} />

      <IAFormStateManager
        {...activeTabProps}
        className={clsx(classes.settingsDrawerForm, {
          [classes.settingsDrawerCamForm]: sections,
          [classes.settingsDrawerDetails]: !sections,
        })}
        integrationId={integrationId}
        flowId={flowId}
        childId={childId}
        onSubmitComplete={handleClose}
        formState={formState}
        fieldMeta={flowSettingsMemo}

      />
    </Drawer>
  );
}

export default function SettingsDrawerRoute(props) {
  const match = useRouteMatch();

  return (
    <Route path={`${match.url}/:flowId/settings`}>
      <LoadResources required resources="exports,imports,flows,connections">
        <SettingsDrawer {...props} parentUrl={match.url} />
      </LoadResources>
      <EditorDrawer />
    </Route>
  );
}
