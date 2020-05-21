import { Fragment, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Icon from '../../../../icons/RestoreIcon';
import actions from '../../../../../actions';
import getRoutePath from '../../../../../utils/routePaths';
import { RESOURCE_TYPE_LABEL_TO_SINGULAR } from '../../../../../constants/resource';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';

export default {
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
          onClick={handleRestoreClick}
          component={Link}
          to={getRoutePath(
            `/${RESOURCE_TYPE_LABEL_TO_SINGULAR[resource.model]}s`
          )}>
          <Icon />
        </IconButtonWithTooltip>
      </Fragment>
    );
  },
};
