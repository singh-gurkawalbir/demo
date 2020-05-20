import { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import Icon from '../../../../../components/icons/RevokeTokenIcon';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';

export default {
  label: 'Revoke token',
  component: function AccessTokens({ tooltipLabel, resourceType, resource }) {
    const dispatch = useDispatch();

    function handleRevokeClick() {
      const patchSet = [
        {
          op: 'replace',
          path: '/revoked',
          value: true,
        },
      ];

      dispatch(actions.resource.patchStaged(resource._id, patchSet, 'value'));
      dispatch(
        actions.resource.commitStaged(resourceType, resource._id, 'value')
      );
    }

    return (
      <Fragment>
        <IconButtonWithTooltip
          tooltipProps={{
            label: tooltipLabel,
          }}
          data-test="revokeAccessToken"
          size="small"
          onClick={() => handleRevokeClick()}>
          <Icon />
        </IconButtonWithTooltip>
      </Fragment>
    );
  },
};
