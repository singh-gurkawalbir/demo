import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import DynaAction from '../../../DynaForm/DynaAction';

const useStyles = makeStyles(theme => ({
  actionButton: {
    marginTop: theme.spacing.double,
    marginLeft: theme.spacing.double,
  },
}));

const URL = '/app/site/hosting/scriptlet.nl?script=customscript_celigo_svb_dashboard&deploy=customdeploy_celigo_svb_dashboard';

function SiliconValleyDashboardLink({ssLinkedConnectionId, isSVBNSGeneralSection}) {
  const connection = useSelector(state => selectors.resource(state, 'connections', ssLinkedConnectionId)
  );

  const systemDomainUrl = connection?.netsuite?.dataCenterURLs?.systemDomain;

  if (!systemDomainUrl || !isSVBNSGeneralSection) { return null; }

  return (
    <div>
      <a href={`${systemDomainUrl}${URL}`} rel="noreferrer" target="_blank">
        Go to Silicon Valley Bank Dashboard
      </a>
    </div>
  );
}

const SuiteScriptIASettingsSaveButton = props => {
  const {
    submitButtonLabel = 'Save',
    disabled = false,
    sectionId,
    ssLinkedConnectionId,
    integrationId,
    ...rest
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const saving = useSelector(state =>
    selectors.suiteScriptIAFormSaving(state, {
      ssLinkedConnectionId,
      integrationId,
    })
  );
  const onSave = useCallback(
    values => {
      dispatch(
        actions.suiteScript.iaForm.submit(ssLinkedConnectionId, integrationId, sectionId, values)
      );
    },
    [dispatch, integrationId, sectionId, ssLinkedConnectionId]
  );

  return (
    <>
      {/* SiliconValleyDashboardLink renders a hyperlink and it should be above the general settings save button  */}
      <SiliconValleyDashboardLink {...props} />
      <DynaAction
        {...rest}
        className={classes.actionButton}
        disabled={disabled || saving}
        onClick={onSave}>
        {saving ? 'Saving' : submitButtonLabel}
      </DynaAction>
    </>
  );
};

export default SuiteScriptIASettingsSaveButton;
