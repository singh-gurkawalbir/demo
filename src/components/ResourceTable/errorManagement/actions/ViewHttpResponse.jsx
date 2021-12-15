import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { selectors } from '../../../../reducers';
import { useGetTableContext } from '../../../CeligoTable/TableContext';
import HttpIcon from '../../../icons/HttpIcon';

export default {
  key: 'HTTP response errors',
  useLabel: () => {
    const {resourceId} = useGetTableContext();

    const isResourceNetsuite = useSelector(state => selectors.isResourceNetsuite(state, resourceId));

    return isResourceNetsuite ? 'View response' : 'View HTTP response';
  },
  icon: HttpIcon,
  useOnClick: rowData => {
    const { errorId } = rowData;
    const history = useHistory();
    const match = useRouteMatch();
    const handleClick = useCallback(() => {
      history.push(`${match.url}/details/${errorId}/response`);
    }, [errorId, history, match.url]);

    return handleClick;
  },
};
