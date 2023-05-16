import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import { FilledButton } from '@celigo/fuse-ui';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';

const useStyles = makeStyles(theme => ({
  linkWrapper: {
    marginBottom: theme.spacing(2),
  },
}));

const URL = '/app/site/hosting/scriptlet.nl?script=customscript_celigo_svb_dashboard&deploy=customdeploy_celigo_svb_dashboard';

function SiliconValleyDashboardLink({ssLinkedConnectionId, isSVBNSGeneralSection}) {
  const classes = useStyles();
  const connection = useSelector(state => selectors.resource(state, 'connections', ssLinkedConnectionId)
  );

  const systemDomainUrl = connection?.netsuite?.dataCenterURLs?.systemDomain;

  if (!systemDomainUrl || !isSVBNSGeneralSection) { return null; }

  return (
    <div className={classes.linkWrapper}>
      <a href={`${systemDomainUrl}${URL}`} rel="noreferrer" target="_blank">
        Go to Silicon Valley Bank Dashboard
      </a>
    </div>
  );
}

export default function SuiteScriptIASettingsSaveButton(props) {
  const {
    disabled = false,
    sectionId,
    ssLinkedConnectionId,
    integrationId,
    formKey,
  } = props;
  const dispatch = useDispatch();
  const saving = useSelector(state =>
    selectors.suiteScriptIAFormSaving(state, {
      ssLinkedConnectionId,
      integrationId,
    })
  );

  const values = useSelector(state => selectors.formValueTrimmed(state, formKey), shallowEqual);

  const isDirty = useSelector(state => selectors.isFormDirty(state, formKey));

  const onSave = useCallback(
    () => {
      dispatch(
        actions.suiteScript.iaForm.submit(ssLinkedConnectionId, integrationId, sectionId, values)
      );
    },
    [dispatch, integrationId, sectionId, ssLinkedConnectionId, values]
  );

  return (
    <>
      {/* SiliconValleyDashboardLink renders a hyperlink and it should be above the general settings save button  */}
      <SiliconValleyDashboardLink {...props} />
      <FilledButton
        disabled={disabled || !isDirty || saving}
        onClick={onSave}>
        {saving ? 'Saving...' : 'Save'}
      </FilledButton>
    </>
  );
}

