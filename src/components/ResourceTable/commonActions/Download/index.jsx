import { useCallback} from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import DownloadIcon from '../../../icons/DownloadIcon';
import { MODEL_PLURAL_TO_LABEL } from '../../../../utils/resource';
import { useGetTableContext } from '../../../CeligoTable/TableContext';

export default {
  key: 'download',
  useLabel: actionProps => {
    const tableContext = useGetTableContext();

    if (tableContext.resourceType === 'templates') {
      return 'Download template zip';
    }

    return `Download ${MODEL_PLURAL_TO_LABEL[actionProps?.resourceType]?.toLowerCase()}`;
  },

  icon: DownloadIcon,
  useOnClick: rowData => {
    const { _id: resourceId } = rowData;
    const dispatch = useDispatch();
    const {resourceType} = useGetTableContext();

    const downloadReference = useCallback(() => {
      dispatch(actions.resource.downloadFile(resourceId, resourceType));
    }, [dispatch, resourceId, resourceType]);

    return downloadReference;
  },
};
