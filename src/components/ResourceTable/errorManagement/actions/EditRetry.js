import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useGetTableContext } from '../../../CeligoTable/TableContext';
import EditIcon from '../../../icons/EditIcon';

export default {
  key: 'editRetryData',
  useLabel: () => 'Edit retry data',
  icon: EditIcon,
  useDisabledActionText: () => {
    const {isFlowDisabled} = useGetTableContext();

    if (isFlowDisabled) {
      return 'Enable the flow to edit retry data';
    }
  },
  useOnClick: rowData => {
    const { errorId } = rowData;
    const history = useHistory();
    const match = useRouteMatch();
    const handleClick = useCallback(() => {
      history.push(`${match.url}/details/${errorId}/editRetry`);
    }, [errorId, history, match.url]);

    return handleClick;
  },
};
