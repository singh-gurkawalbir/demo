import React from 'react';
import { connect } from 'react-redux';
import { FieldWrapper } from 'react-forms-processor/dist';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import RefreshGenericResource from './RefreshGenericResource';

const mapStateToProps = (state, ownProps) => {
  const { connectionId, resourceType, mode } = ownProps;
  const {
    applicationType,
    commResourcePath,
    isLoadingData,
    options,
  } = selectors.metadataOptionsAndResources(
    state,
    connectionId,
    mode,
    resourceType
  );

  return {
    applicationType,
    commResourcePath,
    isLoadingData,
    options,
  };
};

const mapDispatchToProps = dispatch => ({
  onFetchResource: stateProps => {
    const {
      commResourcePath,
      applicationType,
      connectionId,
      resourceType,
      mode,
    } = stateProps;

    return dispatch(
      actions.metadata.requestCollection(
        commResourcePath,
        applicationType,
        connectionId,
        resourceType,
        mode
      )
    );
  },
});

class DynaSelectOptionsGenerator extends React.Component {
  render() {
    const { onFetchResource, options, isLoadingData, ...rest } = this.props;

    return (
      <RefreshGenericResource
        place
        onFetchResource={() => onFetchResource(this.props)}
        isLoading={isLoadingData}
        options={options}
        {...rest}
      />
    );
  }
}

const ConnectedSelectOptionsGenerator = connect(
  mapStateToProps,
  mapDispatchToProps
)(DynaSelectOptionsGenerator);
const FieldWrappedSelectedOptionsGenerator = props => (
  <FieldWrapper {...props}>
    <ConnectedSelectOptionsGenerator {...props.fieldOpts} />
  </FieldWrapper>
);

export default FieldWrappedSelectedOptionsGenerator;
