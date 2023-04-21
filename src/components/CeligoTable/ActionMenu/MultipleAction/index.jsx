import { MenuItem, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import clsx from 'clsx';
import { useGetAllActionProps } from '../hooks';
import { DELETE_ACTION_KEYS } from '../../../../constants';

const useStyles = makeStyles(theme => ({
  deleteWrapper: {
    color: theme.palette.error.dark,
  },
}));

const MultipleAction = ({rowData, handleMenuClose, setSelectedComponent, meta}) => {
  const classes = useStyles();
  const {key} = meta;
  const {
    handleActionClick,
    actionIcon,
    hasAccess,
    label,
    disabledActionTitle,
    disabled,
  } = useGetAllActionProps({meta, rowData, setSelectedComponent, handleMenuClose});

  if (!hasAccess) {
    return null;
  }

  if (disabledActionTitle) {
    return (
      <Tooltip title={disabledActionTitle} placement="bottom" >
        <div>
          <MenuItem data-test={key} disabled>
            {actionIcon}{label}
          </MenuItem>
        </div>
      </Tooltip>
    );
  }

  return (
    <MenuItem className={clsx({[classes.deleteWrapper]: DELETE_ACTION_KEYS.includes(key)})} data-test={key} onClick={handleActionClick} disabled={disabled}>
      {actionIcon}{label}
    </MenuItem>
  );
};

export default MultipleAction;
