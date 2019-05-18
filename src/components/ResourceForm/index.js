import { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import factory from '../../formsMetadata/formFactory';
import DynaForm from '../DynaForm';
import DynaSubmit from '../../components/DynaForm/DynaSubmit';
// import { sanitizePatchSet } from '../../formsMetadata/utils';
import actions from '../../actions';
// import * as selectors from '../../reducers';

const mapStateToProps = () =>
  // const mapStateToProps = (state, { resource }) => {
  // const formStatus = selectors.formStatus(state, 'submit', resource._id);
  ({
    formStatus: {},
  });
const mapDispatchToProps = (dispatch, { resourceType, resource }) => ({
  handleSubmitForm: value => {
    // console.log(`request resource "${resource}"`);
    dispatch(actions.dynaForm.submit(resourceType, resource._id, value));
  },
});

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
class ResourceForm extends Component {
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
      resourceType,
      resource,
      // handleSubmit,
      handleSubmitForm,
      children,
      runHook,
      ...rest
    } = this.props;
    let fieldMeta;
    // We load the defaults because even custom forms may use the
    // stock handlers...
    const defaultFormAssets = factory.getResourceFormAssets({
      resourceType,
      resource,
    });
    // this is the default save form handler.
    // even with custom forms, the default handler can be used,
    // provided the shape of the form value arg doesn't change.
    // const handleClick = value =>
    //  handleSubmit(
    //    sanitizePatchSet({
    //      patchSet: defaultFormAssets.converter(value),
    //      fieldMeta,
    //      resource,
    //    })
    //  );

    if (resource.customForm && resource.customForm.form) {
      // this resource has an embedded custom form.
      const { form, submit } = resource.customForm;

      fieldMeta = factory.getFieldsWithDefaults(form, resourceType, resource);

      // only override the default handler if a custom submit handler if present
      if (submit) {
        // handleClick = value => {
        //   // eslint-disable-next-line no-console
        //   console.log('args passed to custom form submit hook: ', value);
        //   runHook(value);
        // };
      }
    } else {
      // this is a stock UI form...
      fieldMeta = factory.getFieldsWithDefaults(
        defaultFormAssets.fieldMeta,
        resourceType,
        resource
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
          <DynaSubmit
            onClick={handleSubmitForm}
            className={classes.actionButton}>
            Save
          </DynaSubmit>
        </div>
      </DynaForm>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResourceForm);
