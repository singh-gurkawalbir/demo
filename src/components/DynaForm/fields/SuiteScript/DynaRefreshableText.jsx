import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../actions';
import * as selectors from '../../../../reducers';
import RefreshGenericResource from '../DynaRefreshableSelect/RefreshGenericResource';
import DynaText from '../DynaText';


export default function DynaRefreshableText(props) {
  const {id, field: fieldId, _integrationId: integrationId, ssLinkedConnectionId, onFieldChange, sectionId} = props;
  const dispatch = useDispatch();
  const commMetaPath = `suitescript/connections/${ssLinkedConnectionId}/integrations/${integrationId}/settings/refreshMetadata?field=${sectionId}.${id}&type=${fieldId}`;
  const { data, status, errorMessage } = useSelector(state =>
    selectors.metadataOptionsAndResources({
      state,
      connectionId: ssLinkedConnectionId,
      commMetaPath,
      filterKey: 'raw'
    })
  );

  useEffect(() => {
    if (status === 'received') {
      onFieldChange(id, data?.value);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, status, id]);


  const onRefresh = useCallback(() => {
    dispatch(
      actions.metadata.request(
        ssLinkedConnectionId,
        commMetaPath,
      )
    );
  }, [commMetaPath, dispatch, ssLinkedConnectionId]);

  return (

    <RefreshGenericResource
      onRefresh={onRefresh}
      fieldStatus={status || 'received'}
      fieldData="dummyData"
      fieldError={errorMessage}
      {...props}

    >
      <DynaText {...props} />

    </RefreshGenericResource>
  );
}
