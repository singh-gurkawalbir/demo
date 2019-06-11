import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import actions from '../../../../actions';
import ResourceForm from '../../GenericResourceForm';

const mapDispatchToProps = (dispatch, ownProps) => {
  const { resourceType, resource } = ownProps;
  const resourceId = resource._id;

  return {
    handleSaveAndAuthorizeConnection: values => {
      dispatch(
        actions.resourceForm.saveAndAuthorize(resourceType, resourceId, values)
      );
    },
  };
};

class ConnectionForm extends Component {
  render() {
    const { handleSaveAndAuthorizeConnection, ...rest } = this.props;

    return (
      <Fragment>
        <ResourceForm
          {...rest}
          saveButtonLabel="Save and Authorize"
          handleSubmitForm={handleSaveAndAuthorizeConnection}
        />
      </Fragment>
    );
  }
}

export default connect(
  null,
  mapDispatchToProps
)(ConnectionForm);
