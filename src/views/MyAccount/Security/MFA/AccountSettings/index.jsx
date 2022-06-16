import React, { useMemo, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
// TODO: Update once MR branch is merged
import CollapsableContainer from '../../../../../components/ResourceDiffVisualizer/CollapsableContainer';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import DynaForm from '../../../../../components/DynaForm';
import DynaSubmit from '../../../../../components/DynaForm/DynaSubmit';

const useStyles = makeStyles(theme => ({
  footer: {
    margin: theme.spacing(2),
    marginLeft: 0,
  },
}));

export default function AccountSettings() {
  const classes = useStyles();
  const fieldMeta = useMemo(
    () => ({
      fieldMap: {
        allowTrust: {
          id: 'allowTrust',
          name: 'allowTrust',
          label: 'Do not allow trusted devices',
          type: 'checkbox',
          noApi: true,
          isLoggable: false,
        },
        days: {
          id: 'days',
          name: 'days',
          type: 'text',
          label: 'Number of days until MFA is required again for trusted devices',
          noApi: true,
          isLoggable: false,
        },
      },
    }),
    []
  );

  const formKey = useFormInitWithPermissions({ fieldMeta });

  const updateAccountSettings = useCallback(values => {
    console.log(values);
  }, []);

  return (
    <CollapsableContainer title="Account settings" forceExpand>
      <DynaForm formKey={formKey} className={classes.ssoFormContainer} />
      <div className={classes.footer}>
        <DynaSubmit
          formKey={formKey}
          className={classes.saveConfig}
        // disabled={disableSave}
          onClick={updateAccountSettings}>
          Save
        </DynaSubmit>
      </div>
    </CollapsableContainer>
  );
}

