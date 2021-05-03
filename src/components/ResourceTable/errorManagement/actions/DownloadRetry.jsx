import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import DownloadIcon from '../../../icons/DownloadIcon';

export default {
  useLabel: () => 'Download retry data',
  icon: DownloadIcon,
  disabledActionText: ({isFlowDisabled}) => {
    if (isFlowDisabled) {
      return 'Enable the flow to download retry data';
    }
  },
  component: function DownloadRetry({rowData = {}, flowId, resourceId}) {
    const { retryDataKey } = rowData;
    const dispatch = useDispatch();

    const handleClick = useCallback(() => {
      dispatch(actions.errorManager.retryData.download({flowId, resourceId, retryDataKey}));
    }, [dispatch, flowId, resourceId, retryDataKey]);

    useEffect(() => {
      handleClick();
    }, [handleClick]);

    return null;
  },
};
