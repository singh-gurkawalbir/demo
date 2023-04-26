import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import PanelHeader from '../../../../../../../components/PanelHeader';
import ResourceForm from '../../../../../../../components/SuiteScript/ResourceFormFactory';

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

export default function LegacySection({ ssLinkedConnectionId }) {
  const classes = useStyles();

  return (
    <>
      <PanelHeader title="Legacy Control Panel1" />
      <div className={classes.formContainer}>
        <ResourceForm
          ssLinkedConnectionId={ssLinkedConnectionId}
          className={classes.form}
          variant="edit"
          resourceType="refreshlegacycontrolpanel"
          resourceId="something"
          submitButtonLabel="Save"
        />
      </div>
    </>
  );
}
