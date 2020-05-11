import { Fragment, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import actions from '../../../actions';
import Icon from '../../../components/icons/RefreshIcon';

export default {
  label: 'Retry',
  component: function Retry({ flowId, resourceId, resource, isResolved }) {
    const dispatch = useDispatch();
    const handleClick = useCallback(() => {
      dispatch(
        actions.errorManager.flowErrorDetails.retry({
          flowId,
          resourceId,
          retryIds: [resource.retryDataKey],
          isResolved,
        })
      );
    }, [dispatch, flowId, isResolved, resource.retryDataKey, resourceId]);

    return (
      <Fragment>
        <IconButton data-test="retry" size="small" onClick={handleClick}>
          <Icon />
        </IconButton>
      </Fragment>
    );
  },
};
