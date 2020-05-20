import { Link } from 'react-router-dom';
import Icon from '../../../icons/CopyIcon';
import getRoutePath from '../../../../utils/routePaths';
import IconButtonWithTooltip from '../../../IconButtonWithTooltip';

export default {
  label: 'Clone',
  component: function Clone({ tooltipLabel, resourceType, resource }) {
    return (
      <Link to={getRoutePath(`clone/${resourceType}/${resource._id}/preview`)}>
        <IconButtonWithTooltip
          tooltipProps={{
            label: tooltipLabel,
          }}
          data-test="cloneResource"
          size="small">
          <Icon />
        </IconButtonWithTooltip>
      </Link>
    );
  },
};
