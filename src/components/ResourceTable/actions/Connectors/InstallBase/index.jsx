import { Link } from 'react-router-dom';
import Icon from '../../../../icons/GroupOfUsersIcon';
import getRoutePath from '../../../../../utils/routePaths';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';

export default {
  component: function InstallBase({ resource }) {
    return (
      <Link to={getRoutePath(`/connectors/${resource._id}/installBase`)}>
        <IconButtonWithTooltip
          tooltipProps={{
            label: 'Install Base',
          }}
          size="small">
          <Icon />
        </IconButtonWithTooltip>
      </Link>
    );
  },
};
