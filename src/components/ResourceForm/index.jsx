import { Component } from 'react';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import GenericResourceForm from './GenericResourceForm';
import ConnectionForm from './ConnectionForm';
import actions from '../../actions';
import * as selectors from '../../reducers';

const mapStateToProps = (state, { resourceType, resource }) => {
  const formState = selectors.resourceFormState(
    state,
    resourceType,
    resource._id
  );

  return {
    formState,
  };
};

const mapDispatchToProps = (
  dispatch,
  { resourceType, resource, connection }
) => ({
  handleSubmitForm: value => {
    // console.log(`request resource:`, resourceType, resource._id, connection);
    dispatch(
      actions.resourceForm.submit(resourceType, resource._id, connection, value)
    );
  },
  handleInitForm: () => {
    dispatch(actions.resourceForm.init(resourceType, resource._id));
  },
});

class ResourceFormFactory extends Component {
  componentDidMount() {
    this.props.handleInitForm();
  }

  render() {
    const { resourceType, handleSubmitForm, formState } = this.props;

    if (!formState.initComplete) {
      return <Typography>Initializing Form</Typography>;
    }

    let Form;

    if (resourceType === 'connections') {
      Form = ConnectionForm;
    } else {
      Form = GenericResourceForm;
    }

    return (
      <Form
        {...this.props}
        fieldMeta={formState.fieldMeta}
        optionsHandler={formState.optionsHandler}
        handleSubmit={handleSubmitForm}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResourceFormFactory);
