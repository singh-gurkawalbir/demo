import { Fragment, useState } from 'react';
import { IconButton } from '@material-ui/core';
import Icon from '../../../../../components/icons/HookIcon';
import ResourceReferences from '../../../../../components/ResourceReferences';

export default function Delete({ resourceType, resource }) {
  const [show, setShow] = useState(false);

  return (
    <Fragment>
      {show && (
        <ResourceReferences
          type={resourceType}
          id={resource._id}
          onClose={() => setShow(false)}
        />
      )}
      <IconButton size="small" onClick={() => setShow(true)}>
        <Icon />
      </IconButton>
    </Fragment>
  );
}
