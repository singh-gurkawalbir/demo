import { useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import actions from '../../../../../actions';
import RunIcon from '../../../../icons/RunIcon';

export default {
  label: 'Run Flow',
  component: function Run({ resource }) {
    const dispatch = useDispatch();
    const handleRunFlowClick = () => {
      dispatch(actions.flow.run({ flowId: resource._id }));
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
  },
};
