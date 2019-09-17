import { useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import actions from '../../../../../../actions';
import Icon from '../../../../../../components/icons/CloseIcon';

export default {
  label: 'Detach Flow',
  component: function DetachFlow({ resource }) {
    const dispatch = useDispatch();
    const handleDetachFlow = () => {
      const patchSet = [
        {
          op: 'replace',
          path: '/_integrationId',
          value: undefined,
        },
      ];

      dispatch(actions.resource.patchStaged(resource._id, patchSet, 'value'));
      dispatch(actions.resource.commitStaged('flows', resource._id, 'value'));
    };

    return (
      <IconButton size="small" onClick={handleDetachFlow}>
        <Icon />
      </IconButton>
    );
  },
};
