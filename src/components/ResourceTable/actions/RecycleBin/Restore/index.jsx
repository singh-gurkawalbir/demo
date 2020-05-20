import { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Icon from '../../../../icons/RestoreIcon';
import actions from '../../../../../actions';
import getRoutePath from '../../../../../utils/routePaths';
import { RESOURCE_TYPE_LABEL_TO_SINGULAR } from '../../../../../constants/resource';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';

export default {
  label: 'Restore',
  component: function Restore({ tooltipLabel, resource }) {
    const dispatch = useDispatch();
    const handleClick = () => {
      dispatch(
        actions.recycleBin.restore(
          `${RESOURCE_TYPE_LABEL_TO_SINGULAR[resource.model]}s`,
          resource.doc && resource.doc._id
        )
      );
    };

    return (
      <Fragment>
        <IconButtonWithTooltip
          tooltipProps={{
            label: tooltipLabel,
          }}
          size="small"
          onClick={handleClick}
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
