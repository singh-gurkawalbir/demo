import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const emptyObject = {};
export default {
  label: () => 'View',
  component: function ViewLogDetail({scriptId, flowId = '', rowData = emptyObject}) {
    const {index} = rowData;
    const location = useLocation();
    const history = useHistory();

    useEffect(() => {
      const detailPath = flowId ? `/scriptLog/${scriptId}/${flowId}/${index}` : `/scriptLog/${scriptId}/${index}`;

      history.push(
        `${location.pathname}${detailPath}`
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
  },
};
