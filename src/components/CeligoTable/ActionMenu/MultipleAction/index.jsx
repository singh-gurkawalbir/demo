import { MenuItem, Tooltip } from '@material-ui/core';
import React from 'react';
import { useGetAllActionProps } from '../hooks';

const MultipleAction = ({rowData, handleMenuClose, setSelectedComponent, meta}) => {
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

  if (disabledActionTitle) {
    return (
      <Tooltip data-public title={disabledActionTitle} placement="bottom" >
        <div>
          <MenuItem data-test={key} disabled>
            {actionIcon}
            {label}
          </MenuItem>
        </div>
      </Tooltip>
    );
  }

  return (
    <MenuItem data-test={key} onClick={handleActionClick}>
      {actionIcon}
      {label}
    </MenuItem>
  );
};

export default MultipleAction;
