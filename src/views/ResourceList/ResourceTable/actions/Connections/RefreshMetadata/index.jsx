import { useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import Icon from '../../../../../../components/icons/CloseIcon';
import actions from '../../../../../../actions';

export default function RefreshMetadata({ resource }) {
  const dispatch = useDispatch();
  const handleClick = () => {
    if (resource.type === 'netsuite') {
      dispatch(
        actions.metadata.request({
          connectionId: resource._id,
          metadataType: 'recordTypes',
          mode: 'suitescript',
          addInfo: {
            refreshCache: true,
          },
        })
      );
      dispatch(
        actions.metadata.request({
          connectionId: resource._id,
          metadataType: 'savedSearches',
          mode: 'suitescript',
          addInfo: {
            refreshCache: true,
          },
        })
      );

      dispatch(
        actions.metadata.request({
          connectionId: resource._id,
          metadataType: 'recordTypes',
          mode: 'webservices',
          addInfo: {
            refreshCache: true,
            recordTypeOnly: true,
          },
        })
      );
    } else if (resource.type === 'salesforce') {
      dispatch(
        actions.metadata.request({
          connectionId: resource._id,
          metadataType: 'sObjectTypes',
          mode: 'webservices',
          addInfo: {
            refreshCache: true,
          },
        })
      );
    }
  };

  return (
    <IconButton size="small" onClick={handleClick}>
      <Icon />
    </IconButton>
  );
}
