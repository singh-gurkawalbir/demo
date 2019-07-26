import { withStyles } from '@material-ui/core/styles';
import DynaForm from '../../DynaForm';
import DynaSubmit from '../../../components/DynaForm/DynaSubmit';

const styles = theme => ({
  actions: {
    textAlign: 'right',
    padding: theme.spacing.unit / 2,
  },
  actionButton: {
    marginTop: theme.spacing.double,
    marginLeft: theme.spacing.double,
  },
});

function NewResourceForm(props) {
  const {
    submitButtonLabel = 'Next',
    classes,
    resourceType,
    handleSubmitForm,
    handleInitForm,
    children: actionButtons,
    optionsHandler,
    fieldMeta,
    disableButton,
    ...rest
  } = props;

  // console.log(fieldMeta);

  return (
    <DynaForm {...rest} optionsHandler={optionsHandler} fieldMeta={fieldMeta}>
      <div className={classes.actions}>
        {actionButtons}

        <DynaSubmit
          disabled={disableButton}
          onClick={handleSubmitForm}
          className={classes.actionButton}>
          {submitButtonLabel}
        </DynaSubmit>
      </div>
    </DynaForm>
  );
}

export default withStyles(styles)(NewResourceForm);
