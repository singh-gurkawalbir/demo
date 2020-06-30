import { makeStyles } from '@material-ui/core/styles';
import React, { useMemo } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import PanelHeader from '../../../../../../../components/PanelHeader';
import { integrationSettingsToDynaFormMetadata } from '../../../../../../../forms/utils';
import * as selectors from '../../../../../../../reducers';
import { SuiteScriptForm } from '../../../../App/panels/Settings/sections/ConfigureSettings';

const useStyles = makeStyles(theme => ({
  formContainer: {
    padding: theme.spacing(3),
    borderColor: 'rgb(0,0,0,0.1)',
    borderStyle: 'solid',
    borderWidth: '1px 0 0 0',
  },
  form: {
    width: '100%',
    padding: 0,
  },
}));
export default function GeneralSection({
  ssLinkedConnectionId,
  integrationId,
}) {
  const classes = useStyles();
  const isManageLevelUser = useSelector(state => selectors.userHasManageAccessOnSuiteScriptAccount(state, ssLinkedConnectionId));
  const integration = useSelector(
    state =>
      selectors.suiteScriptResource(state, {
        resourceType: 'integrations',
        id: integrationId,
        ssLinkedConnectionId,
      })
  );
  const canEdit = isManageLevelUser && integration && !integration.isNotEditable;


  const flowSettingsMeta = useSelector(
    state =>
      selectors.suiteScriptGeneralSettings(
        state,
        integrationId,
        ssLinkedConnectionId,
      ),
    shallowEqual
  );
  const translatedMeta = useMemo(
    () => integrationSettingsToDynaFormMetadata(
      flowSettingsMeta || {},
      integrationId,
      true,
      {},
      ssLinkedConnectionId
    ),
    [flowSettingsMeta, integrationId, ssLinkedConnectionId]
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
    <>
      <PanelHeader title="General" />
      <div className={classes.formContainer}>
        <SuiteScriptForm
          fieldMeta={translatedMeta}
          formState={formState}
          integrationId={integrationId}
          ssLinkedConnectionId={ssLinkedConnectionId}
          className={classes.form}
          variant="edit"
          resourceType="integrations"
          resourceId={integrationId}
          submitButtonLabel="Save"
          disabled={!canEdit}
        />
      </div>
    </>
  );
}
