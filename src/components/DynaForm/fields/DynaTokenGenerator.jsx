import React from 'react';
import { connect } from 'react-redux';
import { FieldWrapper } from 'react-forms-processor/dist';
import * as selectors from '../../../reducers';
import actions from '../../../actions';

const mapStateToProps = (state, ownProps) => {
  const { connectionId, resourceType, mode } = ownProps;

  selectors.commStatusByKey(`/${assistantType}/generate-token`);
  const { isLoadingData, options } = selectors.metadataOptionsAndResources(
    state,
    connectionId,
    mode,
    resourceType
  );

  return {
    isLoadingData,
    options,
  };
};

const mapDispatchToProps = (dispatch, { assistantType }) => ({
  //  https://staging.integrator.io/api/pitneybowes/generate-token

  onFetchToken: () =>
    dispatch(
      actions.api.request(
        `/${assistantType}/generate-token`,
        'POST',
        'Retrieving token',
        true
      )
    ),
});

function DynaTokenGenerator(props) {}

const ConnectedTokenGenerator = connect(
  mapStateToProps,
  mapDispatchToProps
)(DynaTokenGenerator);
const FieldWrappedTokenGenerator = props => (
  <FieldWrapper {...props}>
    <ConnectedTokenGenerator {...props.fieldOpts} />
  </FieldWrapper>
);

export default FieldWrappedTokenGenerator;
