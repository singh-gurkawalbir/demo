import { Fragment, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import actions from '../../../actions';
import Icon from '../../../components/icons/RevokeTokenIcon';

export default {
  label: 'Resolve',
  component: function Resolve({ flowId, resourceId, resource }) {
    const dispatch = useDispatch();
    const handleClick = useCallback(() => {
      dispatch(
        actions.errorManager.flowErrorDetails.resolve({
          flowId,
          resourceId,
          errorIds: [resource.errorId],
        })
      );
    }, [dispatch, flowId, resource.errorId, resourceId]);

    return (
      <Fragment>
        <IconButton data-test="resolve" size="small" onClick={handleClick}>
          <Icon />
        </IconButton>
      </Fragment>
    );
  },
};
