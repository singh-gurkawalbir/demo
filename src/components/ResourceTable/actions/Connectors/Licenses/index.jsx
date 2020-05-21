import { Link } from 'react-router-dom';
import Icon from '../../../../icons/TokensApiIcon';
import getRoutePath from '../../../../../utils/routePaths';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';

export default {
  key: 'licenses',
  component: function Licenses({ resource }) {
    return (
      <Link to={getRoutePath(`/connectors/${resource._id}/connectorLicenses`)}>
        <IconButtonWithTooltip
          tooltipProps={{
            title: 'Licenses',
          }}
          size="small">
          <Icon />
        </IconButtonWithTooltip>
      </Link>
    );
  },
};
