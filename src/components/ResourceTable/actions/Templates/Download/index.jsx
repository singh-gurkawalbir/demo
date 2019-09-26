import { useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import Icon from '../../../../../components/icons/DownloadIcon';
import actions from '../../../../../actions';

export default {
  label: 'Download',
  component: function Download({ resource }) {
    const dispatch = useDispatch();
    const handleDownloadClick = () => {
      dispatch(actions.template.downloadZip(resource._id));
    };

    return (
      <IconButton size="small" onClick={handleDownloadClick}>
        <Icon />
      </IconButton>
    );
  },
};
