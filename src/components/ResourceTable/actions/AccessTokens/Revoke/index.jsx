import { Fragment, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import Icon from '../../../../../components/icons/RevokeTokenIcon';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';

export default {
  key: 'revokeAccessToken',
  component: function RevokeAccessToken({ resourceType, resource = {} }) {
    const { _id: resourceId } = resource;
    const dispatch = useDispatch();
    const handleRevokeClick = useCallback(() => {
      const patchSet = [
        {
          op: 'replace',
          path: '/revoked',
          value: true,
        },
      ];

      dispatch(actions.resource.patchStaged(resourceId, patchSet, 'value'));
      dispatch(
        actions.resource.commitStaged(resourceType, resourceId, 'value')
      );
    }, [dispatch, resourceId, resourceType]);

    return (
      <Fragment>
        <IconButtonWithTooltip
          tooltipProps={{
            title: 'Revoke token',
          }}
          data-test="revokeAccessToken"
          size="small"
          onClick={handleRevokeClick}>
          <Icon />
        </IconButtonWithTooltip>
      </Fragment>
    );
  },
};
