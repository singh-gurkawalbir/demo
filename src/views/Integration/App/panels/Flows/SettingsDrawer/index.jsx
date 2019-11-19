import React from 'react';
import { useSelector } from 'react-redux';
import { Route, useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import * as selectors from '../../../../../../reducers';
import { integrationSettingsToDynaFormMetadata } from '../../../../../../forms/utils';
import { ActionsFactory } from '../../../../../../components/ResourceFormFactory';
import DrawerTitleBar from '../../../../../../components/drawer/TitleBar';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    marginTop: theme.appBarHeight,
    width: 660,
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    boxShadow: `-4px 4px 8px rgba(0,0,0,0.15)`,
    backgroundColor: theme.palette.background.default,
    zIndex: theme.zIndex.drawer + 1,
  },
  form: {
    maxHeight: `calc(100vh - 180px)`,
    // maxHeight: 'unset',
    padding: theme.spacing(2, 3),
  },
}));

function SettingsDrawer({ integrationId, storeId, sectionId }) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const { flowId } = match.params;
  const flow =
    useSelector(state => selectors.resource(state, 'flows', flowId)) || {};
  const flowName = flow.name || flow._Id;
  // TODO: Fix this convoluted way of getting settings for a specific flow.
  // the data layer should have a simple, clean, selector api, that, given a flowId,
  // returns the flow settings. Right now to look up this info, i need to
  // jump through hoops to accomplish a simple lookup. It was also a brutal task to
  // trace existing code and find the solution to this. There were SO many proxied
  // props (all of which would cause re-renders of deep component trees)
  // We have a data-layer for a reason. There is absolutely no reason to proxy data-layer
  // results deeply through many nested components.
  const formState = useSelector(state =>
    selectors.integrationAppSettingsFormState(state, integrationId, flowId)
  );
  const { flowSettings } = useSelector(state =>
    selectors.integrationAppFlowSettings(
      state,
      integrationId,
      sectionId,
      storeId
    )
  );
  const settings = flowSettings.find(f => f._id === flowId);
  // this data-layer is ridiculously bad.
  const anotherFlowSettings = {};

  if (settings.settings) {
    anotherFlowSettings.fields = settings.settings;
  } else if (settings.sections) {
    anotherFlowSettings.sections = settings.sections;
  }

  const fieldMeta = integrationSettingsToDynaFormMetadata(
    anotherFlowSettings,
    integrationId,
    true
  );
  const handleClose = () => {
    history.goBack();
  };

  return (
    <Drawer
      // variant="persistent"
      anchor="right"
      open={!!match}
      classes={{
        paper: classes.drawerPaper,
      }}
      onClose={handleClose}>
      <DrawerTitleBar title={`Configure flow: ${flowName}`} />

      {fieldMeta && (
        <ActionsFactory
          integrationId={integrationId}
          flowId={flowId}
          storeId={storeId}
          onSubmitComplete={handleClose}
          {...formState}
          fieldMeta={fieldMeta}
        />
      )}
    </Drawer>
  );
}

export default function SettingsDrawerRoute(props) {
  const match = useRouteMatch();

  return (
    <Route exact path={`${match.url}/:flowId/settings`}>
      <SettingsDrawer {...props} />
    </Route>
  );
}
