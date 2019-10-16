import { makeStyles } from '@material-ui/core/styles';
import { Typography, IconButton } from '@material-ui/core';
import { RightDrawer } from '../RightDrawer';
import DynaForm from '../../../../components/DynaForm';
import DynaSubmit from '../../../../components/DynaForm/DynaSubmit';
import CloseIcon from '../../../../components/icons/CloseIcon';

const useStyles = makeStyles(theme => ({
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  title: {},
  formRoot: {
    paddingTop: theme.spacing(3, 0),
  },
}));

export default function WizardDrawer({ flowId, match, history, ...props }) {
  const handleSubmit = formValues => console.log(formValues);
  const classes = useStyles();
  const open = !flowId;
  const fieldMeta = {
    fieldMap: {
      sourceApps: {
        id: 'sourceApps',
        name: 'sourceApps',
        label: 'Choose one or more source apps',
        isMulti: true,
        type: 'selectapplication',
        placeholder: 'search...',
        defaultValue: '',
        required: true,
      },
      destinationApps: {
        id: 'destinationApps',
        name: 'destinationApps',
        label: 'Choose one or more destination apps',
        isMulti: true,
        type: 'selectapplication',
        placeholder: 'search...',
        defaultValue: '',
        required: true,
      },
    },
    layout: {
      fields: ['sourceApps', 'destinationApps'],
    },
  };

  return (
    <RightDrawer {...props} open={open}>
      <div className={classes.titleContainer}>
        <Typography variant="h5" className={classes.title}>
          Choose apps for your flow
        </Typography>
        <IconButton
          size="small"
          data-test="cancelFbWizard"
          onClick={() => history.goBack()}>
          <CloseIcon />
        </IconButton>
      </div>
      <DynaForm className={classes.formRoot} fieldMeta={fieldMeta}>
        <DynaSubmit data-test="submitFbWizard" onClick={handleSubmit}>
          Set up your connections
        </DynaSubmit>
      </DynaForm>
    </RightDrawer>
  );
}
