import { Link } from 'react-router-dom';
import Icon from '../../../../icons/GroupOfUsersIcon';
import getRoutePath from '../../../../../utils/routePaths';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';

export default {
  key: 'installBase',
  component: function InstallBase({ resource }) {
    return (
      <Link to={getRoutePath(`/connectors/${resource._id}/installBase`)}>
        <IconButtonWithTooltip
          tooltipProps={{
            title: 'Install base',
          }}
          size="small">
          <Icon />
        </IconButtonWithTooltip>
      </Link>
    );
  },
};
