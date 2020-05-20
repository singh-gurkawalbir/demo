import { Link } from 'react-router-dom';
import Icon from '../../../../icons/GroupOfUsersIcon';
import getRoutePath from '../../../../../utils/routePaths';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';

export default {
  label: 'Install Base',
  component: function InstallBase({ tooltipLabel, resource }) {
    return (
      <Link to={getRoutePath(`/connectors/${resource._id}/installBase`)}>
        <IconButtonWithTooltip
          tooltipProps={{
            label: tooltipLabel,
          }}
          size="small">
          <Icon />
        </IconButtonWithTooltip>
      </Link>
    );
  },
};
