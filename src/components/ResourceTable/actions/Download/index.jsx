import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import Icon from '../../../icons/DownloadIcon';
import IconButtonWithTooltip from '../../../IconButtonWithTooltip';

export default {
  key: 'downloadResource',
  component: function DownloadResource({ resourceType, resource = {} }) {
    const { _id: resourceId } = resource;
    const dispatch = useDispatch();
    const handleDownloadReferenceClick = useCallback(() => {
      dispatch(actions.resource.downloadFile(resourceId, resourceType));
    }, [dispatch, resourceId, resourceType]);

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
