import React from 'react';
import DrawerHeader from '../../../drawer/Right/DrawerHeader';
import NoResultTypography from '../../../NoResultTypography';

export default function EmptyErrorDetails({classes}) {
  return (
    <>
      <DrawerHeader title="Error details" showCloseButton={false} className={classes.draweHeader} />
      <NoResultTypography>
        Click an error row to view its details
        or select the checkboxes for batch actions.
      </NoResultTypography>
    </>
  );
}
