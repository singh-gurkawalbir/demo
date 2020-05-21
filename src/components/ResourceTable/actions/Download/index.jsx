import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import Icon from '../../../icons/DownloadIcon';
import IconButtonWithTooltip from '../../../IconButtonWithTooltip';

export default {
  component: function DownloadResources({ resourceType, resource }) {
    const dispatch = useDispatch();
    const handleDownloadReferenceClick = useCallback(() => {
      dispatch(actions.resource.downloadFile(resource._id, resourceType));
    }, [dispatch, resource._id, resourceType]);

    return (
      <IconButtonWithTooltip
        tooltipProps={{
          title: 'Download',
        }}
        data-test="downloadResourceFile"
        size="small"
        onClick={handleDownloadReferenceClick}>
        <Icon />
      </IconButtonWithTooltip>
    );
  },
};
