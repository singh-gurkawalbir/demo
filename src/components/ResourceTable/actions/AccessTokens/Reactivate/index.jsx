import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import Icon from '../../../../../components/icons/ReactivateTokenIcon';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';

export default {
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
      <IconButtonWithTooltip
        tooltipProps={{
          title: 'Reactivate token',
        }}
        data-test="reactivateAccessToken"
        size="small"
        onClick={handleReactivateClick}>
        <Icon />
      </IconButtonWithTooltip>
    );
  },
};
