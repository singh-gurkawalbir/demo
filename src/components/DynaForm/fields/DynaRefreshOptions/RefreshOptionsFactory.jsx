import React from 'react';
import { connect } from 'react-redux';
import { FieldWrapper } from 'react-forms-processor/dist';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import RefreshGenericResource from './RefreshGenericResource';

const mapStateToProps = (state, ownProps) => {
  const { connectionId, resourceType, netsuiteSpecificResource } = ownProps;
  const {
    applicationType,
    commResourcePath,
    isLoadingData,
    options: computedOptions,
  } = selectors.metadataOptionsAndResources(
    state,
    connectionId,
    netsuiteSpecificResource,
    resourceType
  );

  return {
    applicationType,
    commResourcePath,
    isLoadingData,
    computedOptions,
  };
};

const mapDispatchToProps = dispatch => ({
  onFetchResource: stateProps => {
    const {
      commResourcePath,
      applicationType,
      connectionId,
      resourceType,
      netsuiteSpecificResource,
    } = stateProps;

    return dispatch(
      actions.metadata.requestCollection(
        commResourcePath,
        applicationType,
        connectionId,
        resourceType,
        netsuiteSpecificResource
      )
    );
  },
});

class DynaSelectOptionsGenerator extends React.Component {
  render() {
    const {
      onFetchResource,
      computedOptions,
      isLoadingData,
      ...rest
    } = this.props;

    return (
      <RefreshGenericResource
        onFetchResource={() => onFetchResource(this.props)}
        resourceIsLoading={isLoadingData}
        computedOptions={computedOptions}
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
