import React from 'react';
import { useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import PanelHeader from '../../../../../../../components/PanelHeader';
import ResourceForm from '../../../../../../../components/SuiteScript/ResourceFormFactory';
import { selectors } from '../../../../../../../reducers';

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

  return (
    <>
      <PanelHeader title="General" />
      <div className={classes.formContainer}>
        <ResourceForm
          ssLinkedConnectionId={ssLinkedConnectionId}
          className={classes.form}
          variant="edit"
          resourceType="integrations"
          resourceId={integrationId}
          submitButtonLabel="Save"
          disabled={!canEdit}
          // TODO: update in ActionsFactory
          isGeneralSettings
        />
      </div>
    </>
  );
}
