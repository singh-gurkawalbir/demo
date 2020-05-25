import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import RefreshIcon from '../../../../icons/RefreshIcon';

export default {
  title: 'Refresh metadata',
  icon: RefreshIcon,
  component: function RefreshMetadata({ resource }) {
    const { type: resourceType, _id: resourceId } = resource;
    const dispatch = useDispatch();
    const refreshMetadata = useCallback(() => {
      if (resourceType === 'netsuite') {
        dispatch(
          actions.metadata.request(
            resourceId,
            `netsuite/metadata/suitescript/connections/${resourceId}/recordTypes`,
            {
              refreshCache: true,
            }
          )
        );
        dispatch(
          actions.metadata.request(
            resourceId,
            `netsuite/metadata/suitescript/connections/${resourceId}/savedSearches`,
            {
              refreshCache: true,
            }
          )
        );

        dispatch(
          actions.metadata.request(
            resourceId,
            `netsuite/metadata/webservices/connections/${resourceId}/recordTypes?recordTypeOnly=true`,
            {
              refreshCache: true,
            }
          )
        );
      } else if (resourceType === 'salesforce') {
        dispatch(
          actions.metadata.request(
            resourceId,
            `salesforce/metadata/connections/${resourceId}/sObjectTypes`,
            {
              refreshCache: true,
            }
          )
        );
      }
    }, [dispatch, resourceId, resourceType]);

    useEffect(() => {
      refreshMetadata();
    }, [refreshMetadata]);

    return null;
  },
};
