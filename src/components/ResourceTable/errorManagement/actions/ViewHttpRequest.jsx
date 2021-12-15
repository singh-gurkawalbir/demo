import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { selectors } from '../../../../reducers';
import { useGetTableContext } from '../../../CeligoTable/TableContext';
import HttpIcon from '../../../icons/HttpIcon';

export default {
  key: 'HTTP request errors',
  useLabel: () => {
    const {resourceId} = useGetTableContext();

    const isResourceNetsuite = useSelector(state => selectors.isResourceNetsuite(state, resourceId));

    return isResourceNetsuite ? 'View request' : 'View HTTP request';
  },
  icon: HttpIcon,
  useOnClick: rowData => {
    const { errorId } = rowData;
    const history = useHistory();
    const match = useRouteMatch();
    const handleClick = useCallback(() => {
      history.push(`${match.url}/details/${errorId}/request`);
    }, [errorId, history, match.url]);

    return handleClick;
  },
};
