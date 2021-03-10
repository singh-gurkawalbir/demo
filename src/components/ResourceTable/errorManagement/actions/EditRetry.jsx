import { useCallback, useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import EditIcon from '../../../icons/EditIcon';

export default {
  label: 'Edit retry data',
  icon: EditIcon,
  disabledActionText: ({isFlowDisabled}) => {
    if (isFlowDisabled) {
      return 'Enable the flow to edit retry data';
    }
  },
  component: function EditRetry({rowData = {}}) {
    const { errorId } = rowData;
    const history = useHistory();
    const match = useRouteMatch();
    const handleClick = useCallback(() => {
      history.push(`${match.url}/details/${errorId}/editRetry`);
    }, [errorId, history, match.url]);

    useEffect(() => {
      handleClick();
    }, [handleClick]);

    return null;
  },
};
