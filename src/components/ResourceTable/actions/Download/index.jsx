import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import DownloadIcon from '../../../icons/DownloadIcon';

export default {
  key: 'downloadResource',
  title: 'Download',
  icon: DownloadIcon,
  component: function DownloadResource({ resourceType, resource = {} }) {
    const { _id: resourceId } = resource;
    const dispatch = useDispatch();
    const downloadReference = useCallback(() => {
      dispatch(actions.resource.downloadFile(resourceId, resourceType));
    }, [dispatch, resourceId, resourceType]);

    useEffect(() => {
      downloadReference();
    }, [downloadReference]);

    return null;
  },
};
