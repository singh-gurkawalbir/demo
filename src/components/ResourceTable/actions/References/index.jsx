import { Fragment, useState } from 'react';
import Icon from '../../../icons/ViewReferencesIcon';
import ResourceReferences from '../../../ResourceReferences';
import IconButtonWithTooltip from '../../../IconButtonWithTooltip';

// TODO: In case of monitor user, refernces shouldn't call accesstokens
export default {
  label: 'Used by',
  component: function References({ tooltipLabel, resourceType, resource }) {
    const [show, setShow] = useState(false);

    return (
      <Fragment>
        {show && (
          <ResourceReferences
            resourceType={resourceType}
            resourceId={resource._id}
            onClose={() => setShow(false)}
          />
        )}
        <IconButtonWithTooltip
          tooltipProps={{
            label: tooltipLabel,
          }}
          data-test="showReferences"
          size="small"
          onClick={() => setShow(true)}>
          <Icon />
        </IconButtonWithTooltip>
      </Fragment>
    );
  },
};
