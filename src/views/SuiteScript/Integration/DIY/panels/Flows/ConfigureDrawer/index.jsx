import React, { useMemo, useEffect } from 'react';
import clsx from 'clsx';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { Route, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import * as selectors from '../../../../../../../reducers';
import { integrationSettingsToDynaFormMetadata } from '../../../../../../../forms/utils';
import DrawerTitleBar from '../../../../../../../components/drawer/TitleBar';
import useSuiteScriptIAFormWithHandleClose from '../../../../../../../hooks/suiteScript/useSuiteScriptIAFormWithHandleClose';
import LoadSuiteScriptResources from '../../../../../../../components/SuiteScript/LoadResources';
import { FormStateManager } from '../../../../../../../components/SuiteScript/ResourceFormFactory';
import actions from '../../../../../../../actions';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    marginTop: theme.appBarHeight,
    paddingBottom: theme.appBarHeight,
    width: 1300,
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    boxShadow: '-4px 4px 8px rgba(0,0,0,0.15)',
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


export const SuiteScriptForm = (props) => {
  const dispatch = useDispatch();

  const {ssLinkedConnectionId, integrationId } = props;
  useEffect(() => {
    dispatch(actions.suiteScript.iaForm.initComplete(ssLinkedConnectionId, integrationId));
    return () => {
      dispatch(actions.suiteScript.iaForm.initClear(ssLinkedConnectionId, integrationId));
    };
  }, [dispatch, integrationId, ssLinkedConnectionId]);

  return (
    <FormStateManager
      {...props}
/>);
};

function ConfigureDrawer({ ssLinkedConnectionId, integrationId, sectionId, parentUrl }) {
  const classes = useStyles();
  const match = useRouteMatch();
  const section = useSelector(state => {
    const flowSections = selectors.suiteScriptIAFlowSections(state, integrationId, ssLinkedConnectionId);

    return flowSections.find(s => s.titleId === sectionId);
  });
  const flowSettingsMeta = useSelector(
    state =>
      selectors.suiteScriptIASectionMetadata(
        state,
        integrationId,
        ssLinkedConnectionId,
        sectionId,
      ),
    shallowEqual
  );
  const translatedMeta = useMemo(
    () => integrationSettingsToDynaFormMetadata(
      flowSettingsMeta,
      integrationId,
      true,
      {isSuiteScriptIntegrator: true},
      ssLinkedConnectionId
    ),
    [flowSettingsMeta, integrationId, ssLinkedConnectionId]
  );


  const { formState, handleClose } = useSuiteScriptIAFormWithHandleClose(
    integrationId, ssLinkedConnectionId,
    parentUrl
  );


  return (
    <LoadSuiteScriptResources
      required
      ssLinkedConnectionId={ssLinkedConnectionId}
      integrationId={integrationId}
      resources="flows">
      <Drawer
        // variant="persistent"
        anchor="right"
        open={!!match}
        classes={{
          paper: classes.drawerPaper,
        }}
        onClose={handleClose}>
        <DrawerTitleBar title={`Configure all ${section.title} flows`} />

        <SuiteScriptForm
          ssLinkedConnectionId={ssLinkedConnectionId}
          integrationId={integrationId}
          sectionId={sectionId}
          onSubmitComplete={handleClose}
          formState={formState}
          className={clsx(classes.configureDrawerform, {
            [classes.configureDrawerCamForm]: section.sections,
          })}
          fieldMeta={translatedMeta}
        />
      </Drawer>
    </LoadSuiteScriptResources>
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
