import React, { useMemo } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Route, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import * as selectors from '../../../../../../reducers';
import { integrationSettingsToDynaFormMetadata } from '../../../../../../forms/utils';
import { FormStateManager } from '../../../../../../components/ResourceFormFactory';
import DrawerTitleBar from '../../../../../../components/drawer/TitleBar';
import LoadResources from '../../../../../../components/LoadResources';
import { useIASettingsStateWithHandleClose } from '..';

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
  const match = useRouteMatch();
  const section = useSelector(state => {
    const flowSections = selectors.integrationAppFlowSections(
      state,
      integrationId,
      storeId
    );

    return flowSections.find(s => s.titleId === sectionId);
  });
  const flowSettingsMeta = useSelector(
    state =>
      selectors.integrationAppSectionMetadata(
        state,
        integrationId,
        sectionId,
        storeId
      ),
    shallowEqual
  );
  const translatedMeta = useMemo(
    () =>
      integrationSettingsToDynaFormMetadata(
        flowSettingsMeta,
        integrationId,
        true
      ),
    [flowSettingsMeta, integrationId]
  );
  const { formState, handleClose } = useIASettingsStateWithHandleClose(
    integrationId,
    null,
    sectionId
  );

  return (
    <LoadResources
      required
      resources={['flows', 'exports', 'imports', 'connections']}>
      <Drawer
        // variant="persistent"
        anchor="right"
        open={!!match}
        classes={{
          paper: classes.drawerPaper,
        }}
        onClose={handleClose}>
        <DrawerTitleBar title={`Configure all ${section.title} flows`} />

        <FormStateManager
          onSubmitComplete={handleClose}
          formState={formState}
          className={classes.form}
          integrationId={integrationId}
          storeId={storeId}
          sectionId={sectionId}
          fieldMeta={translatedMeta}
        />
      </Drawer>
    </LoadResources>
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
