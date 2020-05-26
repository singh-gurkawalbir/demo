import { Fragment, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import { RESOURCE_TYPE_LABEL_TO_SINGULAR } from '../../../../../constants/resource';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';
import Icon from '../../../../icons/RestoreIcon';

export default {
  key: 'restore',
  component: function Restore({ resource }) {
    const dispatch = useDispatch();
    const handleRestoreClick = useCallback(() => {
      dispatch(
        actions.recycleBin.restore(
          `${RESOURCE_TYPE_LABEL_TO_SINGULAR[resource.model]}s`,
          resource.doc && resource.doc._id
        )
      );
    }, [dispatch, resource.doc, resource.model]);

    return (
      <Fragment>
        <IconButtonWithTooltip
          tooltipProps={{
            title: 'Restore',
          }}
          size="small"
          onClick={handleRestoreClick}>
          <Icon />
        </IconButtonWithTooltip>
      </Fragment>
    );
  },
};
