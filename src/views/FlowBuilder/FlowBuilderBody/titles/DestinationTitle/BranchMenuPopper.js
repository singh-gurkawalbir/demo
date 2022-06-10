import React from 'react';
import { MenuItem, Typography, makeStyles, Divider, ClickAwayListener } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import ArrowPopper from '../../../../../components/ArrowPopper';
import { useFlowContext } from '../../Context';
import { getAllFlowBranches } from '../../lib';
import actions from '../../../../../actions';

const useStyles = makeStyles(theme => ({
  titleBox: {
    padding: theme.spacing(2, 2, 1, 2),
  },
  title: {
    marginBottom: theme.spacing(1.5),
  },
  menuItem: {
    borderBottom: 0,
  },
  content: {
    maxWidth: 350,
  },
}));

export default function BranchMenuPopper({ anchorEl, handleClose }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { flow, elements } = useFlowContext();
  const open = Boolean(anchorEl);

  const branches = getAllFlowBranches(flow, elements);

  const handleCallback = branchId => () => {
    const branch = branches.find(s => s.id === branchId);

    dispatch(actions.flow.addNewPPStep(flow._id, branch.path));
    handleClose();
  };

  return (
    <ArrowPopper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-end"
      onClose={handleClose}>

      <ClickAwayListener onClickAway={handleClose}>
        <div className={classes.content}>
          <div className={classes.titleBox}>
            <Typography className={classes.title} variant="h6">
              Add destination/lookup to end of branch
            </Typography>

            <Divider />
          </div>

          {branches.map(({name, id}) => (
            <MenuItem
              button
              className={classes.menuItem}
              onClick={handleCallback(id)}
              key={name}>
              {name}
            </MenuItem>
          ))}
        </div>

      </ClickAwayListener>
    </ArrowPopper>
  );
}
