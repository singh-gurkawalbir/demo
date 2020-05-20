import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import Icon from '../../../../../components/icons/RegenerateTokenIcon';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';

export default {
  label: 'Regenerate token',
  component: function AccessTokens({ tooltipLabel, resource }) {
    const dispatch = useDispatch();

    function handleRegenerateClick() {
      dispatch(actions.accessToken.generateToken(resource._id));
    }

    return (
      <IconButtonWithTooltip
        tooltipProps={{
          label: tooltipLabel,
        }}
        data-test="regenerateToken"
        size="small"
        onClick={() => handleRegenerateClick()}>
        <Icon />
      </IconButtonWithTooltip>
    );
  },
};
