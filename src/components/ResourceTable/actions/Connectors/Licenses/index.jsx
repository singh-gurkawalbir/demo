import { Link } from 'react-router-dom';
import Icon from '../../../../icons/TokensApiIcon';
import getRoutePath from '../../../../../utils/routePaths';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';

export default {
  label: 'Licenses',
  component: function Licenses({ tooltipLabel, resource }) {
    return (
      <Link to={getRoutePath(`/connectors/${resource._id}/connectorLicenses`)}>
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
