import { Fragment, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../actions';

export default {
  label: 'Resolve',
  component: function Resolve({ flowId, resourceId, resource }) {
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
        <div data-test="resolveError" onClick={handleClick}>
          Resolve
        </div>
      </Fragment>
    );
  },
};
