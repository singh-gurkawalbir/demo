import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import Icon from '../../../../../components/icons/RegenerateTokenIcon';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';

export default {
  component: function AccessTokens({ resource }) {
    const dispatch = useDispatch();

    function handleRegenerateClick() {
      dispatch(actions.accessToken.generateToken(resource._id));
    }

    return (
      <IconButtonWithTooltip
        tooltipProps={{
          title: 'Regenerate token',
        }}
        data-test="regenerateToken"
        size="small"
        onClick={handleRegenerateClick}>
        <Icon />
      </IconButtonWithTooltip>
    );
  },
};
