import { useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import actions from '../../../../../actions';
import Icon from '../../../../icons/CloseIcon';

export default {
  label: 'Run Flow',
  component: function Run({ resource }) {
    const dispatch = useDispatch();
    const handleRunFlowClick = () => {
      dispatch(actions.flow.run({ flowId: resource._id }));
    };

    return (
      <IconButton size="small" onClick={handleRunFlowClick}>
        <Icon />
      </IconButton>
    );
  },
};
