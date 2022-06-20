import React, { useMemo, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CollapsableContainer from '../../../../../components/CollapsableContainer';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import DynaForm from '../../../../../components/DynaForm';
import DynaSubmit from '../../../../../components/DynaForm/DynaSubmit';

const useStyles = makeStyles(theme => ({
  footer: {
    margin: theme.spacing(2, 2, 0, 0),
  },
  container: {
    margin: theme.spacing(2),
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

  const updateAccountSettings = useCallback(() => {
    // console.log(values);
  }, []);

  return (
    <CollapsableContainer title="Account settings" forceExpand>
      <div className={classes.container}>
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
      </div>
    </CollapsableContainer>
  );
}

