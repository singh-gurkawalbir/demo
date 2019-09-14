import { useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import actions from '../../../../../../actions';
import Icon from '../../../../../../components/icons/CloseIcon';

export default {
  label: 'Download Flow',
  component: function DownLoadFlows({ resource }) {
    const dispatch = useDispatch();
    const handleDownloadZipFileClick = () => {
      dispatch(actions.flow.downloadZipFile(resource._id));
    };

    return (
      <IconButton size="small" onClick={handleDownloadZipFileClick}>
        <Icon />
      </IconButton>
    );
  },
};
