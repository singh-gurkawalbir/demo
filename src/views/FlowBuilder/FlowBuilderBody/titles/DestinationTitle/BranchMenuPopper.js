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
  subTitle: {
    marginBottom: theme.spacing(1),
    color: theme.palette.secondary.light,
    fontStyle: 'italic',
  },
  menuItem: {
    borderBottom: 0,
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
        <div>
          <div className={classes.titleBox}>
            <Typography gutterBottom variant="h6">
              Add destination/lookup
            </Typography>

            <Typography className={classes.subTitle} variant="body2">
              Add to end of branch
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
