import { IconButton } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import Icon from '../../../../../components/icons/HookIcon';

export default {
  label: 'Regenerate token',
  component: function AccessTokens({ resource }) {
    const dispatch = useDispatch();

    function handleRegenerateClick() {
      dispatch(actions.accessToken.generateToken(resource._id));
    }

    return (
      <IconButton size="small" onClick={() => handleRegenerateClick()}>
        <Icon />
      </IconButton>
    );
  },
};
