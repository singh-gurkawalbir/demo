import React from 'react';
import { connect } from 'react-redux';
import { FieldWrapper } from 'react-forms-processor/dist';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import RefreshGenericResource from './RefreshGenericResource';

const mapStateToProps = (state, ownProps) => {
  const { connectionId, resourceType, mode } = ownProps;
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

const mapDispatchToProps = (
  dispatch,
  { connectionId, resourceType, mode }
) => ({
  onFetchResource: () =>
    dispatch(actions.metadata.request(connectionId, resourceType, mode)),
});

class DynaSelectOptionsGenerator extends React.Component {
  render() {
    const { onFetchResource, options, isLoadingData, ...rest } = this.props;

    return (
      <RefreshGenericResource
        onFetchResource={onFetchResource}
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
    <ConnectedSelectOptionsGenerator />
  </FieldWrapper>
);

export default FieldWrappedSelectedOptionsGenerator;
