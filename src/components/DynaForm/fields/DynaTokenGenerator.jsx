import React from 'react';
import { connect } from 'react-redux';
import { FieldWrapper } from 'react-forms-processor/dist';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import DynaSubmit from '../DynaSubmit';

const mapStateToProps = (state, ownProps) => {};
const mapDispatchToProps = (dispatch, { resourceId }) => ({
  handleGenerateToken: values =>
    dispatch(actions.resource.connections.generateToken(resourceId, values)),
});

function DynaTokenGenerator(props) {
  const { handleGenerateToken } = props;

  return (
    <DynaSubmit disabled={false} isValid onClick={handleGenerateToken}>
      Generate Token
    </DynaSubmit>
  );
}

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
