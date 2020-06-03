import React, { useMemo } from 'react';
import clsx from 'clsx';
import { useSelector, shallowEqual } from 'react-redux';
import { Route, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import * as selectors from '../../../../../../reducers';
import { integrationSettingsToDynaFormMetadata } from '../../../../../../forms/utils';
import DrawerTitleBar from '../../../../../../components/drawer/TitleBar';
import LoadResources from '../../../../../../components/LoadResources';
import { IAFormStateManager } from '..';
import useIASettingsStateWithHandleClose from '../../../../../../hooks/useIASettingsStateWithHandleClose';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    marginTop: theme.appBarHeight,
    paddingBottom: theme.appBarHeight,
    width: 1300,
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    boxShadow: `-4px 4px 8px rgba(0,0,0,0.15)`,
    zIndex: theme.zIndex.drawer + 1,
  },
  configureDrawerform: {
    padding: theme.spacing(2, 3),
    '& + div': {
      padding: theme.spacing(2, 0),
      margin: theme.spacing(0, 3),
    },
    '& > * div.MuiTabs-vertical': {
      marginTop: theme.spacing(-2),
      marginLeft: theme.spacing(-3),
    },
    '& > div[class*= "fieldsContainer"]': {
      height: '100%',
      '& > div[class*= "makeStyles-root"]': {
        height: '100%',
        '& > div[class*= "panelContainer"]': {
          paddingBottom: theme.spacing(5),
        },
      },
    },
  },
  configureDrawerCamForm: {
    minHeight: '100%',
  },
}));

function ConfigureDrawer({ integrationId, storeId, sectionId, parentUrl }) {
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
    sectionId,
    parentUrl
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

        <IAFormStateManager
          onSubmitComplete={handleClose}
          formState={formState}
          className={clsx(classes.configureDrawerform, {
            [classes.configureDrawerCamForm]: section.sections,
          })}
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
      <ConfigureDrawer {...props} parentUrl={match.url} />
    </Route>
  );
}
