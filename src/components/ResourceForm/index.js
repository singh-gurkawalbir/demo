import { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import factory from '../../formsMetadata/formFactory';
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
      classes,
      connection,
      resourceType,
      resource,
      handleSubmit,
      children,
      ...rest
    } = this.props;
    let fieldMeta;
    let handleClick;

    if (resource.customForm && resource.customForm.form) {
      // this resource has an embedded custom form.
      fieldMeta = factory.getFieldsWithDefaults(
        resource.customForm.form,
        resourceType,
        resource
      );
      handleClick = value => {
        // eslint-disable-next-line no-console
        console.log('values passed to custom form submit handler: ', value);
      };
    } else {
      // this is a stock UI form...
      const assets = factory.getResourceFormAssets({
        connection,
        resourceType,
        resource,
      });

      fieldMeta = factory.getFieldsWithDefaults(
        assets.fieldMeta,
        resourceType,
        resource
      );
      handleClick = value =>
        handleSubmit(
          sanitizePatchSet({
            patchSet: assets.converter(value),
            fieldMeta,
          })
        );
    }

    // console.log(fieldMeta);

    return (
      <DynaForm
        key={formKey}
        onMetaChange={this.handleFormMetaChange}
        {...rest}
        fieldMeta={fieldMeta}>
        {children}
        <div className={classes.actions}>
          <Button
            onClick={this.handleFormMetaChange}
            className={classes.actionButton}
            size="small"
            variant="contained">
            Cancel
          </Button>
          <DynaSubmit onClick={handleClick} className={classes.actionButton}>
            Save
          </DynaSubmit>
        </div>
      </DynaForm>
    );
  }
}
