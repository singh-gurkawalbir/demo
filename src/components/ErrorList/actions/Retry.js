import { Fragment, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../actions';

export default {
  label: 'Retry',
  component: function Retry({ flowId, resourceId, resource }) {
    const dispatch = useDispatch();
    const handleClick = useCallback(() => {
      dispatch(
        actions.errorManager.flowErrorDetails.retry({
          flowId,
          resourceId,
          errorIds: [resource.errorId],
        })
      );
    }, [dispatch, flowId, resource.errorId, resourceId]);

    return (
      <Fragment>
        <div data-test="retryError" onClick={handleClick}>
          Retry
        </div>
      </Fragment>
    );
  },
};
