import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography } from '@material-ui/core';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import { DynaGenericSelect } from './DynaRefreshableSelect/RefreshGenericResource';
import { hashCode } from '../../../utils/string';

function DynaExportSelect(props) {
  const { resource, resourceContext } = props;
  const resourceContextType = resourceContext && resourceContext.resourceType;
  const resourceContextId = resourceContext && resourceContext.resourceId;
  const resourceConnId = useSelector(state => {
    const t = selectors.resource(state, resourceContextType, resourceContextId);

    return t && t._connectionId;
  });
  const virtual = resource && resource.virtual;
  const kind = 'virtual';
  const fieldRes = {
    _connectionId: virtual._connectionId || resourceConnId,
    ...virtual,
  };
  const identifier = String(hashCode(fieldRes, true));
  const { status, data, errorMessage } = useSelector(state =>
    selectors.exportData(state, identifier)
  );
  const dispatch = useDispatch();
  const onFetch = useCallback(() => {
    dispatch(actions.exportData.request(kind, identifier, fieldRes));
  }, [dispatch, fieldRes, identifier]);

  return (
    <DynaGenericSelect
      resourceToFetch={identifier}
      onFetch={onFetch}
      onRefresh={onFetch}
      fieldStatus={status}
      fieldData={data}
      fieldError={errorMessage}
      {...props}
    />
  );
}

const DynaExportSelectCreator = props => {
  if (!props.resource || !props.resource.virtual) {
    return (
      <>
        <Typography>{`Field id=${props.id}, type=${props.type}`}</Typography>
        <Typography>requires virtual export.</Typography>
      </>
    );
  }

  return <DynaExportSelect {...props} />;
};

export default DynaExportSelectCreator;
