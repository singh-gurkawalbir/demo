import { useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import actions from '../../../../actions';
import Icon from '../../../icons/DownloadIcon';

export default {
  label: 'Download',
  component: function DownloadResources({ resource }) {
    const dispatch = useDispatch();

    return (
      <IconButton
        size="small"
        onClick={dispatch(
          actions.resource.downloadFile(resource._id, 'flows')
        )}>
        <Icon />
      </IconButton>
    );
  },
};
