import { Fragment, useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
import Icon from '../../icons/RevokeTokenIcon';

export default {
  label: 'View error details',
  component: function ViewErrorDetails({ resource }) {
    const { errorId } = resource;
    const history = useHistory();
    const match = useRouteMatch();
    const handleClick = useCallback(() => {
      history.push(`${match.url}/details/${errorId}/view`);
    }, [errorId, history, match.url]);

    return (
      <Fragment>
        <IconButton data-test="viewDetails" size="small" onClick={handleClick}>
          <Icon />
        </IconButton>
      </Fragment>
    );
  },
};
