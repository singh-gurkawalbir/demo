import { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useGetTableContext } from '../../../CeligoTable/TableContext';

export default {
  key: 'viewLogDetail',
  useLabel: () => 'View',
  useOnClick: rowData => {
    const {index} = rowData;
    const {flowId, scriptId } = useGetTableContext();
    const location = useLocation();
    const history = useHistory();

    return useCallback(() => {
      const detailPath = flowId ? `/scriptLog/${scriptId}/${flowId}/${index}` : `/scriptLog/${scriptId}/${index}`;

      history.push(
        `${location.pathname}${detailPath}`
      );
    }, [flowId, history, index, location.pathname, scriptId]);
  },
};
