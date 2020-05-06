import { Fragment, useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

export default {
  label: 'Edit retry ',
  component: function EditRetry({ resource }) {
    const match = useRouteMatch();
    const history = useHistory();
    const handleClick = useCallback(
      () => history.push(`${match.url}/details/${resource.errorId}/edit`),
      [history, match.url, resource.errorId]
    );

    return (
      <Fragment>
        <div data-test="editRetryData" onClick={handleClick}>
          Edit retry data
        </div>
      </Fragment>
    );
  },
};
