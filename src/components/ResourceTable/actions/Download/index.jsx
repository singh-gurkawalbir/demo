import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import DownloadIcon from '../../../icons/DownloadIcon';
import { MODEL_PLURAL_TO_LABEL } from '../../../../utils/resource';

export default {
  label: (rowData, actionProps) => {
    if (actionProps.resourceType === 'templates') {
      return 'Download file';
    }
    return `Download ${actionProps && MODEL_PLURAL_TO_LABEL[actionProps.resourceType].toLowerCase()}`;
  },

  icon: DownloadIcon,
  component: function DownloadResource({ resourceType, rowData = {} }) {
    const { _id: resourceId } = rowData;
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
