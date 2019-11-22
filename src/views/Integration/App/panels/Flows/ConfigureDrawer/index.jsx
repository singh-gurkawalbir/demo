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

function ConfigureDrawer({ integrationId, storeId, sectionId }) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const flowSections = useSelector(state =>
    selectors.integrationAppFlowSections(state, integrationId, storeId)
  );
  const flowSettings = useSelector(state =>
    selectors.integrationAppFlowSettings(
      state,
      integrationId,
      sectionId,
      storeId
    )
  );
  const section = flowSections.find(s => s.titleId === sectionId);
  const translatedMeta = integrationSettingsToDynaFormMetadata(
    flowSettings,
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
      <DrawerTitleBar title={`Configure all ${section.title} flows`} />

      <ActionsFactory
        className={classes.form}
        integrationId={integrationId}
        storeId={storeId}
        fieldMeta={translatedMeta}
      />
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
