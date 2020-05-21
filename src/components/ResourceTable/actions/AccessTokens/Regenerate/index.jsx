import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import Icon from '../../../../../components/icons/RegenerateTokenIcon';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';

export default {
  key: 'regenerateAccessToken',
  component: function RegenerateAccessToken({ resource = {} }) {
    const { _id: resourceId } = resource;
    const dispatch = useDispatch();
    const handleRegenerateClick = useCallback(() => {
      dispatch(actions.accessToken.generateToken(resourceId));
    }, [dispatch, resourceId]);

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
