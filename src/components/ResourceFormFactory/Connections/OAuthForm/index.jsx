import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import actions from '../../../../actions';
import ResourceForm from '../../GenericResourceForm';

const mapDispatchToProps = (dispatch, ownProps) => {
  const { resource } = ownProps;
  const resourceId = resource._id;

  return {
    handleSaveAndAuthorizeConnection: values => {
      dispatch(
        actions.resource.connections.saveAndAuthorize(resourceId, values)
      );
    },
  };
};

class OAuthForm extends Component {
  render() {
    const { handleSaveAndAuthorizeConnection, ...rest } = this.props;

    return (
      <Fragment>
        <ResourceForm
          {...rest}
          saveButtonLabel="Save & Authorize"
          handleSubmitForm={handleSaveAndAuthorizeConnection}
        />
      </Fragment>
    );
  }
}

export default connect(
  null,
  mapDispatchToProps
)(OAuthForm);
