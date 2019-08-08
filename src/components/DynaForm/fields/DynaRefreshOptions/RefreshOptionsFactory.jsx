import { useCallback } from 'react';
import { FieldWrapper } from 'react-forms-processor/dist';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import RefreshGenericResource from './RefreshGenericResource';

function DynaSelectOptionsGenerator(props) {
  const { connectionId, resourceType, mode, options, filterKey } = props;
  const dispatch = useDispatch();
  const fieldOptions = useSelector(state =>
    selectors.metadataOptionsAndResources(
      state,
      connectionId,
      mode,
      (options && options.resourceToFetch) || resourceType,
      filterKey
    )
  );
  const handleFetchResource = useCallback(
    ({ onload }) => {
      const resource = (options && options.resourceToFetch) || resourceType;

      // Dispatches request action onload / onRefresh
      if (resource && (!onload || (onload && !fieldOptions))) {
        dispatch(
          actions.metadata.request(connectionId, resource, mode, filterKey)
        );
      }
    },
    [
      connectionId,
      dispatch,
      fieldOptions,
      filterKey,
      mode,
      options,
      resourceType,
    ]
  );

  return (
    <FieldWrapper {...props}>
      <RefreshGenericResource
        resourceToFetch={props.options.resourceToFetch}
        resetValue={props.options.resetValue}
        handleFetchResource={handleFetchResource}
        fieldStatus={fieldOptions && fieldOptions.status}
        fieldData={fieldOptions && fieldOptions.data}
        {...props}
      />
    </FieldWrapper>
  );
}

export default DynaSelectOptionsGenerator;
