import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import RefreshIcon from '../../../../icons/RefreshIcon';
import actions from '../../../../../actions';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';

export default {
  key: 'refreshMetadata',
  component: function RefreshMetadata({ resource }) {
    const { type: resourceType, _id: resourceId } = resource;
    const dispatch = useDispatch();
    const handleClick = useCallback(() => {
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

    return (
      <IconButtonWithTooltip
        tooltipProps={{
          title: 'Refresh metadata',
        }}
        data-test="refreshConnectionMetadata"
        size="small"
        onClick={handleClick}>
        <RefreshIcon />
      </IconButtonWithTooltip>
    );
  },
};
