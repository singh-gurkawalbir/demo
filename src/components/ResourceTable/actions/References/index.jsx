import { Fragment, useState, useCallback } from 'react';
import Icon from '../../../icons/ViewReferencesIcon';
import ResourceReferences from '../../../ResourceReferences';
import IconButtonWithTooltip from '../../../IconButtonWithTooltip';

// TODO: In case of monitor user, refernces shouldn't call accesstokens
export default {
  component: function References({ resourceType, resource }) {
    const [show, setShow] = useState(false);
    const showReferences = useCallback(() => {
      setShow(true);
    }, []);
    const handleReferencesClose = useCallback(() => {
      setShow(false);
    }, []);

    return (
      <Fragment>
        {show && (
          <ResourceReferences
            resourceType={resourceType}
            resourceId={resource._id}
            onClose={handleReferencesClose}
          />
        )}
        <IconButtonWithTooltip
          tooltipProps={{
            title: 'Used by',
          }}
          data-test="showReferences"
          size="small"
          onClick={showReferences}>
          <Icon />
        </IconButtonWithTooltip>
      </Fragment>
    );
  },
};
