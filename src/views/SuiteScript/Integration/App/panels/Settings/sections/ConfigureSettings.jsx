import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import React, { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import { Spinner } from '@celigo/fuse-ui';
import actions from '../../../../../../../actions';
import LoadSuiteScriptResources from '../../../../../../../components/SuiteScript/LoadResources';
import { integrationSettingsToDynaFormMetadata } from '../../../../../../../forms/formFactory/utils';
import { selectors } from '../../../../../../../reducers';
import Loader from '../../../../../../../components/Loader';
import { ActionsPanel } from '../../../../../../Integration/App/panels/Flows';
import { FormStateManager } from '../../../../../../../components/ResourceFormFactory';
import useSelectorMemo from '../../../../../../../hooks/selectors/useSelectorMemo';
import { COMM_STATES } from '../../../../../../../reducers/comms/networkComms';

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
  },
  configureDrawerCamForm: {
    minHeight: '100%',
  },
}));

export const SavingMask = () => (
  <Loader open>
    <Typography variant="h4">Saving...</Typography>
    <Spinner />
  </Loader>
);

const SettingsForm = props => {
  const {formKey, fieldMeta, ...rest} = props;

  return (
    <>
      <FormStateManager {...props} formKey={formKey} />
      <ActionsPanel
        {...fieldMeta}
        actionProps={{...rest, formKey }}
  />
    </>
  );
};

const SuiteScriptForm = props => {
  const dispatch = useDispatch();

  const {ssLinkedConnectionId, integrationId } = props;

  useEffect(() => {
    dispatch(actions.suiteScript.iaForm.initComplete(ssLinkedConnectionId, integrationId));

    return () => {
      dispatch(actions.suiteScript.iaForm.initClear(ssLinkedConnectionId, integrationId));
    };
  }, [dispatch, integrationId, ssLinkedConnectionId]);

  const formState = useSelector(
    state =>
      selectors.suiteScriptIAFormState(
        state,
        {integrationId, ssLinkedConnectionId}
      ),
    shallowEqual
  );
  const status = formState?.status;
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (status === COMM_STATES.SUCCESS) setCount(count => count + 1);
  }, [status]);

  return (
    <>
      {status === COMM_STATES.LOADING && <SavingMask />}
      <SettingsForm
        key={count}
        formState={formState}
        {...props}
    />
    </>
  );
};
export default function ConfigureSettings({ ssLinkedConnectionId, integrationId, sectionId, id, integrationAppName}) {
  const classes = useStyles();
  const sections = useSelectorMemo(selectors.makeSuiteScriptIASections, integrationId, ssLinkedConnectionId);

  const section = sections.find(s => s.titleId === sectionId);

  const translatedMeta = useMemo(
    () => integrationSettingsToDynaFormMetadata(
      section,
      integrationId,
      true,
      {isSuiteScriptIntegrator: true, propsSpreadToFields: {sectionId: id}},
      ssLinkedConnectionId
    ),
    [id, integrationId, section, ssLinkedConnectionId]
  );

  return (
    <LoadSuiteScriptResources
      required
      ssLinkedConnectionId={ssLinkedConnectionId}
      integrationId={integrationId}
      resources="flows">
      <SuiteScriptForm
        isSVBNSGeneralSection={section?.title === 'General' && integrationAppName === 'svbns'}
        ssLinkedConnectionId={ssLinkedConnectionId}
        integrationId={integrationId}
        sectionId={id}
        className={clsx(classes.configureDrawerform, {
          [classes.configureDrawerCamForm]: section.sections,
        })}
        fieldMeta={translatedMeta}
        />
    </LoadSuiteScriptResources>
  );
}
