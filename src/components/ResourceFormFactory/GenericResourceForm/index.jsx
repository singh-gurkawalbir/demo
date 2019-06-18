import { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DynaForm from '../../DynaForm';
import DynaSubmit from '../../../components/DynaForm/DynaSubmit';

@withStyles(theme => ({
  actions: {
    textAlign: 'right',
    padding: theme.spacing.unit / 2,
  },
  actionButton: {
    marginTop: theme.spacing.double,
    marginLeft: theme.spacing.double,
  },
}))
export default class GenericResourceForm extends Component {
  state = {
    formKey: 1,
  };

  handleFormMetaChange = () => {
    // We need to re-mount the react-forms-processor component
    // to reset the values back to defaults....
    const formKey = this.state.formKey + 1;

    this.setState({
      formKey,
    });
  };

  render() {
    const { formKey } = this.state;
    const {
      saveButtonLabel = 'Save',
      classes,
      resourceType,
      resource,
      handleSubmitForm,
      children: actionButtons,
      connection,
      optionsHandler,
      fieldMeta,
      disableButton,
      ...rest
    } = this.props;

    // console.log(fieldMeta);

    return (
      <DynaForm
        key={formKey}
        onMetaChange={this.handleFormMetaChange}
        {...rest}
        optionsHandler={optionsHandler}
        fieldMeta={fieldMeta}>
        <div className={classes.actions}>
          {actionButtons}

          <Button
            onClick={this.handleFormMetaChange}
            className={classes.actionButton}
            size="small"
            variant="contained">
            Cancel
          </Button>
          <DynaSubmit
            disabled={disableButton}
            onClick={handleSubmitForm}
            className={classes.actionButton}>
            {saveButtonLabel}
          </DynaSubmit>
        </div>
      </DynaForm>
    );
  }
}
