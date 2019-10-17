import { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, IconButton } from '@material-ui/core';
import DynaForm from '../../../../../components/DynaForm';
import DynaSubmit from '../../../../../components/DynaForm/DynaSubmit';
import CloseIcon from '../../../../../components/icons/CloseIcon';

const useStyles = makeStyles(theme => ({
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  formRoot: {
    paddingTop: theme.spacing(3, 0),
  },
}));

export default function WizardDrawer({
  sourceApps,
  destinationApps,
  history,
  onSubmit,
}) {
  const classes = useStyles();
  const fieldMeta = {
    fieldMap: {
      sourceApps: {
        id: 'sourceApps',
        name: 'sourceApps',
        label: 'Choose one or more source apps',
        isMulti: true,
        type: 'selectapplication',
        placeholder: 'search...',
        defaultValue: sourceApps,
        required: true,
      },
      destinationApps: {
        id: 'destinationApps',
        name: 'destinationApps',
        label: 'Choose one or more destination apps',
        isMulti: true,
        type: 'selectapplication',
        placeholder: 'search...',
        defaultValue: destinationApps,
        required: true,
      },
    },
    layout: {
      fields: ['sourceApps', 'destinationApps'],
    },
  };

  return (
    <Fragment>
      <div className={classes.titleContainer}>
        <Typography variant="h5">Choose apps for your flow</Typography>
        <IconButton
          size="small"
          data-test="cancelFbWizard"
          onClick={() => history.goBack()}>
          <CloseIcon />
        </IconButton>
      </div>
      <DynaForm className={classes.formRoot} fieldMeta={fieldMeta}>
        <DynaSubmit data-test="submitFbWizard" onClick={onSubmit}>
          Set up your connections
        </DynaSubmit>
      </DynaForm>
    </Fragment>
  );
}
