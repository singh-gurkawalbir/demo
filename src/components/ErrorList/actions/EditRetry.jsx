import { Fragment, useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
import Icon from '../../icons/EditIcon';

export default {
  label: 'Edit retry ',
  component: function EditRetry({ resource }) {
    const { errorId } = resource;
    const history = useHistory();
    const match = useRouteMatch();
    const handleClick = useCallback(() => {
      history.push(`${match.url}/details/${errorId}/edit`);
    }, [errorId, history, match.url]);

    return (
      <Fragment>
        <IconButton data-test="editRetry" size="small" onClick={handleClick}>
          <Icon />
        </IconButton>
      </Fragment>
    );
  },
};
