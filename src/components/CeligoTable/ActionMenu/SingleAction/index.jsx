import { IconButton, Tooltip } from '@material-ui/core';
import React from 'react';
import { useGetAllActionProps } from '../hooks';

const SingleAction = ({rowData, handleMenuClose, setSelectedComponent, meta}) => {
  const {key} = meta;

  const {
    handleActionClick,
    actionIcon,
    hasAccess,
    label,
    disabledActionTitle,
  } = useGetAllActionProps({meta, rowData, setSelectedComponent, handleMenuClose});

  if (!hasAccess) {
    return null;
  }
  const title = disabledActionTitle || label;

  if (title) {
    return (
      <Tooltip data-public title={title} placement="bottom" >
        {/* The <div> below seems to be redundant as it does not provide any presentation benefit.
              However, without this wrapper div, if the action is disabled, the <Tooltip> wrapper
              doesn't recognize the hover state and thus doesn't show the tooltip message.
          */}
        <div>
          <IconButton data-test={key} size="small" disabled={!!disabledActionTitle} onClick={handleActionClick}>
            {actionIcon}
          </IconButton>
        </div>
      </Tooltip>
    );
  }

  return (
    <IconButton data-test={key} size="small" onClick={handleActionClick}>
      {actionIcon}
    </IconButton>
  );
};

export default SingleAction;
