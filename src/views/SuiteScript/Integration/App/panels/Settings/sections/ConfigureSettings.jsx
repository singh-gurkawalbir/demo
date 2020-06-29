import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React, { useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import actions from '../../../../../../../actions';
import LoadSuiteScriptResources from '../../../../../../../components/SuiteScript/LoadResources';
import { FormStateManager } from '../../../../../../../components/SuiteScript/ResourceFormFactory';
import { integrationSettingsToDynaFormMetadata } from '../../../../../../../forms/utils';
import useSuiteScriptIAFormWithHandleClose from '../../../../../../../hooks/suiteScript/useSuiteScriptIAFormWithHandleClose';
import * as selectors from '../../../../../../../reducers';

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

export default function ConfigureDrawer({ ssLinkedConnectionId, integrationId, sectionId, parentUrl }) {
  const classes = useStyles();
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
    </LoadSuiteScriptResources>
  );
}
