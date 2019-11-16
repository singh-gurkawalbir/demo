import React from 'react';
import { useSelector } from 'react-redux';
import { Route, useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import * as selectors from '../../../../../../reducers';
import { integrationSettingsToDynaFormMetadata } from '../../../../../../forms/utils';
import { ActionsFactory } from '../../../../../../components/ResourceFormFactory';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    marginTop: theme.appBarHeight,
    width: 475,
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    boxShadow: `-4px 4px 8px rgba(0,0,0,0.15)`,
    backgroundColor: theme.palette.background.default,
    zIndex: theme.zIndex.drawer + 1,
  },
}));

function ConfigureDrawer({ integrationId, storeId, sectionId }) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const flowSettings = useSelector(state =>
    selectors.integrationAppFlowSettings(
      state,
      integrationId,
      sectionId,
      storeId
    )
  );
  const translatedMeta = integrationSettingsToDynaFormMetadata(
    flowSettings,
    integrationId
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
      <ActionsFactory
        integrationId={integrationId}
        storeId={storeId}
        fieldMeta={translatedMeta}
      />
      {integrationId}, {storeId}, {sectionId}
    </Drawer>
  );
}

export default function ConfigureDrawerRoute(props) {
  const match = useRouteMatch();

  return (
    <Route exact path={`${match.url}/configure`}>
      <ConfigureDrawer {...props} />
    </Route>
  );
}
