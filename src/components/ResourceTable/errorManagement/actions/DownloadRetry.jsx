import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import { useGetTableContext } from '../../../CeligoTable/TableContext';
import DownloadIcon from '../../../icons/DownloadIcon';

export default {
  useLabel: () => 'Download retry data',
  icon: DownloadIcon,
  useDisabledActionText: () => {
    const {isFlowDisabled} = useGetTableContext();

    if (isFlowDisabled) {
      return 'Enable the flow to download retry data';
    }
  },
  useOnClick: rowData => {
    const { retryDataKey } = rowData;
    const dispatch = useDispatch();

    const {flowId, resourceId } = useGetTableContext();

    const handleClick = useCallback(() => {
      dispatch(actions.errorManager.retryData.download({flowId, resourceId, retryDataKey}));
    }, [dispatch, flowId, resourceId, retryDataKey]);

    return handleClick;
  },
};
