import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import getRoutePath from '../../../../../utils/routePaths';
import actions from '../../../../../actions';
import RunIcon from '../../../../icons/RunIcon';

export default {
  label: 'Run flow',
  icon: RunIcon,
  component: withRouter(({ resource, history }) => {
    const dispatch = useDispatch();
    const runFlow = useCallback(() => {
      dispatch(actions.flow.run({ flowId: resource._id }));
      history.push(
        getRoutePath(`integrations/${resource._integrationId}/dashboard`)
      );
    }, [dispatch, history, resource._id, resource._integrationId]);

    useEffect(() => {
      runFlow();
    }, [runFlow]);

    return null;
  }),
};
