import { Fragment, useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

export default {
  label: 'View Error Details',
  component: function ViewErrorDetails({ resource }) {
    const match = useRouteMatch();
    const history = useHistory();
    const handleClick = useCallback(
      () => history.push(`${match.url}/details/${resource.errorId}/view`),
      [history, match.url, resource.errorId]
    );

    return (
      <Fragment>
        <div data-test="viewErrorDetails" onClick={handleClick}>
          View error details
        </div>
      </Fragment>
    );
  },
};
