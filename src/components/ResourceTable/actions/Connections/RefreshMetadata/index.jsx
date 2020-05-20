import { useDispatch } from 'react-redux';
import RefreshIcon from '../../../../icons/RefreshIcon';
import actions from '../../../../../actions';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';

export default {
  component: function RefreshMetadata({ resource }) {
    const dispatch = useDispatch();
    const handleClick = () => {
      if (resource.type === 'netsuite') {
        dispatch(
          actions.metadata.request(
            resource._id,
            `netsuite/metadata/suitescript/connections/${resource._id}/recordTypes`,
            {
              refreshCache: true,
            }
          )
        );
        dispatch(
          actions.metadata.request(
            resource._id,
            `netsuite/metadata/suitescript/connections/${resource._id}/savedSearches`,
            {
              refreshCache: true,
            }
          )
        );

        dispatch(
          actions.metadata.request(
            resource._id,
            `netsuite/metadata/webservices/connections/${resource._id}/recordTypes?recordTypeOnly=true`,
            {
              refreshCache: true,
            }
          )
        );
      } else if (resource.type === 'salesforce') {
        dispatch(
          actions.metadata.request(
            resource._id,
            `salesforce/metadata/connections/${resource._id}/sObjectTypes`,
            {
              refreshCache: true,
            }
          )
        );
      }
    };

    return (
      <IconButtonWithTooltip
        tooltipProps={{
          label: 'Refresh metadata',
        }}
        data-test="refreshConnectionMetadata"
        size="small"
        onClick={handleClick}>
        <RefreshIcon />
      </IconButtonWithTooltip>
    );
  },
};
