import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React, { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import actions from '../../../../../../../actions';
import LoadSuiteScriptResources from '../../../../../../../components/SuiteScript/LoadResources';
import { ActionsFactory } from '../../../../../../../components/SuiteScript/ResourceFormFactory';
import { integrationSettingsToDynaFormMetadata } from '../../../../../../../forms/utils';
import * as selectors from '../../../../../../../reducers';
import Loader from '../../../../../../../components/Loader';
import Spinner from '../../../../../../../components/Spinner';


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


const SavingMask = () => (
  <Loader open>
    <Typography variant="h4">Saving...</Typography>
    <Spinner color="primary" />
  </Loader>);

export const SuiteScriptForm = (props) => {
  const dispatch = useDispatch();

  const {ssLinkedConnectionId, integrationId } = props;
  useEffect(() => {
    dispatch(actions.suiteScript.iaForm.initComplete(ssLinkedConnectionId, integrationId));
    return () => {
      dispatch(actions.suiteScript.iaForm.initClear(ssLinkedConnectionId, integrationId));
    };
  }, [dispatch, integrationId, ssLinkedConnectionId]);

  const {status} = useSelector(state => selectors.suiteScriptIAFormState(state, {
    ssLinkedConnectionId,
    integrationId,
  }));

  const [count, setCount] = useState(0);
  useEffect(() => {
    if (status === 'success') setCount(count => count + 1);
  }, [status]);
  return (
    <>
      {status === 'saving' && <SavingMask />}
      <ActionsFactory
        key={count}
        {...props}
    />
    </>
  );
};

export default function ConfigureSettings({ ssLinkedConnectionId, integrationId, sectionId, id }) {
  const classes = useStyles();
  const section = useSelector(state => {
    const sections = selectors.suiteScriptIASections(state, integrationId, ssLinkedConnectionId);

    return sections.find(s => s.titleId === sectionId);
  }, shallowEqual);

  const translatedMeta = useMemo(
    () => integrationSettingsToDynaFormMetadata(
      section,
      integrationId,
      true,
      {isSuiteScriptIntegrator: true},
      ssLinkedConnectionId
    ),
    [integrationId, section, ssLinkedConnectionId]
  );

  const formState = useSelector(
    state =>
      selectors.suiteScriptIAFormState(
        state,
        {integrationId, ssLinkedConnectionId}
      ),
    shallowEqual
  );

  return (
    <LoadSuiteScriptResources
      required
      ssLinkedConnectionId={ssLinkedConnectionId}
      integrationId={integrationId}
      resources="flows">
      <SuiteScriptForm
        isGeneralSection={section?.title === 'General'}
        ssLinkedConnectionId={ssLinkedConnectionId}
        integrationId={integrationId}
        sectionId={id}
        formState={formState}
        className={clsx(classes.configureDrawerform, {
          [classes.configureDrawerCamForm]: section.sections,
        })}
        fieldMeta={translatedMeta}
        />
    </LoadSuiteScriptResources>
  );
}
