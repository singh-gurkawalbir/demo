import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import Icon from '../../../icons/DownloadIcon';
import IconButtonWithTooltip from '../../../IconButtonWithTooltip';

export default {
  component: function DownloadResources({ resourceType, resource }) {
    const dispatch = useDispatch();

    return (
      <IconButtonWithTooltip
        tooltipProps={{
          label: 'Download',
        }}
        data-test="downloadResourceFile"
        size="small"
        onClick={() => {
          dispatch(actions.resource.downloadFile(resource._id, resourceType));
        }}>
        <Icon />
      </IconButtonWithTooltip>
    );
  },
};
