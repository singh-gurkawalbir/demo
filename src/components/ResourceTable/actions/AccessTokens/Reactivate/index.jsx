import { IconButton } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import Icon from '../../../../../components/icons/RegenerateTokenIcon';

export default {
  label: 'Reactivate token',
  component: function AccessTokens({ resourceType, resource }) {
    const dispatch = useDispatch();

    function handleReactivateClick() {
      const patchSet = [
        {
          op: 'replace',
          path: '/revoked',
          value: false,
        },
      ];

      dispatch(actions.resource.patchStaged(resource._id, patchSet, 'value'));
      dispatch(
        actions.resource.commitStaged(resourceType, resource._id, 'value')
      );
    }

    return (
      <IconButton
        data-test="reactivateAccessToken"
        size="small"
        onClick={() => handleReactivateClick()}>
        <Icon />
      </IconButton>
    );
  },
};
