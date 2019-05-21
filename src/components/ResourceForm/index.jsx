import { Component } from 'react';
import { connect } from 'react-redux';
import ResourceForm from './GenericResourceForm';
import ConnectionForm from './ConnectionForm';
import factory from '../../forms/formFactory';
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
    // console.log(`request resource:`, resourceType, resource._id);
    dispatch(actions.dynaForm.submit(resourceType, resource._id, value));
  },
});
const getRelevantMeta = (resource, resourceType, connection, handleSubmit) => {
  let fieldMeta;
  let optionsHandler;

  // TODO: does custom forms support optionsHandler
  // and a converter function
  if (resource.customForm && resource.customForm.form) {
    // this resource has an embedded custom form.
    // TODO: will there be an associated connection for this custom form
    // because you create an export based on a connection
    fieldMeta = factory.getFieldsWithDefaults(
      resource.customForm.form,
      resourceType,
      resource
    );
  } else {
    // this is a stock UI form...
    const assets = factory.getResourceFormAssets({
      resourceType,
      resource,
      connection,
    });

    ({ optionsHandler } = assets);

    fieldMeta = factory.getFieldsWithDefaults(
      assets.fieldMeta,
      resourceType,
      resource
    );
  }

  return {
    fieldMeta,
    handleSubmit,
    optionsHandler,
  };
};

class ResourceFormFactory extends Component {
  render() {
    const { resource, resourceType, connection, handleSubmitForm } = this.props;
    const metaProps = getRelevantMeta(resource, resourceType, connection);

    if (resourceType === 'connections') {
      return (
        <ConnectionForm
          {...this.props}
          {...metaProps}
          handleSubmit={handleSubmitForm}
        />
      );
    }

    return (
      <ResourceForm
        {...this.props}
        {...metaProps}
        handleSubmit={handleSubmitForm}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResourceFormFactory);
