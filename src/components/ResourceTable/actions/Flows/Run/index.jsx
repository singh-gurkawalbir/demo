import { useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import getRoutePath from '../../../../../utils/routePaths';
import actions from '../../../../../actions';
import RunIcon from '../../../../icons/RunIcon';

export default {
  label: 'Run Flow',
  component: withRouter(({ resource, history }) => {
    const dispatch = useDispatch();
    const handleRunFlowClick = () => {
      dispatch(actions.flow.run({ flowId: resource._id }));
      history.push(
        getRoutePath(`integrations/${resource._integrationId}/dashboard`)
      );
    };

    return (
      <IconButton
        disabled={!resource.isRunnable}
        data-test="runFlow"
        size="small"
        onClick={handleRunFlowClick}>
        <RunIcon />
      </IconButton>
    );
  }),
};
