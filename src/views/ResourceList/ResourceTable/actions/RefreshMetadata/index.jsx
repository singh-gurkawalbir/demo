import { useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import Icon from '../../../../../components/icons/CloseIcon';
import actions from '../../../../../actions';

export default function Delete({ resource }) {
  const dispatch = useDispatch();
  const handleClick = () => {
    if (resource.type === 'netsuite') {
      dispatch(
        actions.metadata.request(
          resource._id,
          'recordTypes',
          'suitescript',
          '',
          '',
          '',
          {
            refreshCache: true,
          }
        )
      );
      dispatch(
        actions.metadata.request(
          resource._id,
          'savedSearches',
          'suitescript',
          '',
          '',
          '',
          {
            refreshCache: true,
          }
        )
      );
      dispatch(
        actions.metadata.request(
          resource._id,
          'recordTypes',
          'webservices',
          '',
          '',
          '',
          {
            refreshCache: true,
            recordTypeOnly: true,
          }
        )
      );
    } else if (resource.type === 'salesforce') {
      dispatch(
        actions.metadata.request(
          resource._id,
          'sObjectTypes',
          'webservices',
          '',
          '',
          '',
          {
            refreshCache: true,
          }
        )
      );
    }
  };

  return (
    <IconButton size="small" onClick={handleClick}>
      <Icon />
    </IconButton>
  );
}
