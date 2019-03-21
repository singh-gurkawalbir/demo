import { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import formFactory from '../../formsMetadata/formFactory';
import DynaForm from '../DynaForm';
import DynaSubmit from '../../components/DynaForm/DynaSubmit';
import { sanitizePatchSet } from '../../formsMetadata/utils';

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
export default class ResourceForm extends Component {
  state = {
    formKey: 1,
  };

  handleCancel = () => {
    // TODO: We need to re-mount the react-forms-processor Form component...
    // is there a better way than uing the "key" prop trick?
    const formKey = this.state.formKey + 1;

    // console.log('bumping form key to force remount: ', formKey);
    this.setState({
      formKey,
    });
  };

  render() {
    const { formKey } = this.state;
    const {
      classes,
      connection,
      resourceType,
      resource,
      handleSubmit,
      children,
      ...rest
    } = this.props;
    const { fieldMeta, formValueToPatchSetConverter } = formFactory({
      connection,
      resourceType,
      resource,
    });

    return (
      <DynaForm key={formKey} {...rest} fieldMeta={fieldMeta}>
        {children}
        <div className={classes.actions}>
          <Button
            onClick={this.handleCancel}
            className={classes.actionButton}
            size="small"
            variant="contained">
            Cancel
          </Button>
          <DynaSubmit
            onClick={value =>
              handleSubmit(
                sanitizePatchSet({
                  patchSet: formValueToPatchSetConverter(value),
                  fieldMeta,
                })
              )
            }
            className={classes.actionButton}>
            Save
          </DynaSubmit>
        </div>
      </DynaForm>
    );
  }
}
