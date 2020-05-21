import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import Icon from '../../../../../components/icons/ReactivateTokenIcon';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';

export default {
  component: function AccessTokens({ resourceType, resource = {} }) {
    const { _id: resourceId } = resource;
    const dispatch = useDispatch();
    const handleReactivateClick = useCallback(() => {
      const patchSet = [
        {
          op: 'replace',
          path: '/revoked',
          value: false,
        },
      ];

      dispatch(actions.resource.patchStaged(resourceId, patchSet, 'value'));
      dispatch(
        actions.resource.commitStaged(resourceType, resourceId, 'value')
      );
    }, [dispatch, resourceId, resourceType]);

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
