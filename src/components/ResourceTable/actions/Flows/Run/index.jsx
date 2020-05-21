import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import getRoutePath from '../../../../../utils/routePaths';
import actions from '../../../../../actions';
import RunIcon from '../../../../icons/RunIcon';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';

export default {
  key: 'runFlow',
  component: withRouter(({ resource, history }) => {
    const dispatch = useDispatch();
    const handleRunFlowClick = () => {
      dispatch(actions.flow.run({ flowId: resource._id }));
      history.push(
        getRoutePath(`integrations/${resource._integrationId}/dashboard`)
      );
    };

    return (
      <IconButtonWithTooltip
        tooltipProps={{
          title: 'Run flow',
        }}
        disabled={!resource.isRunnable}
        data-test="runFlow"
        size="small"
        onClick={handleRunFlowClick}>
        <RunIcon />
      </IconButtonWithTooltip>
    );
  }),
};
