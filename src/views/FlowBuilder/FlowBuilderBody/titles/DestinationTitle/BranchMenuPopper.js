import React from 'react';
import { List, ListItem, ListItemText, Typography, makeStyles } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import ArrowPopper from '../../../../../components/ArrowPopper';
import { useFlowContext } from '../../Context';
import { getAllFlowBranches } from '../../lib';
import actions from '../../../../../actions';

const useStyles = makeStyles(theme => ({
  titleBox: {
    padding: theme.spacing(3, 3, 0, 3),
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  subTitle: {
    marginBottom: theme.spacing(1),
    color: theme.palette.secondary.light,
  },
  listItem: {
    paddingLeft: theme.spacing(5),
  },
}));

export default function AddNodeMenuPopper({ anchorEl, handleClose }) {
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
      <div className={classes.titleBox}>
        <Typography className={classes.title} variant="h6">
          Add destination/lookup to:
        </Typography>

        <Typography className={classes.subTitle} variant="subtitle2">
          End of branch:
        </Typography>
      </div>

      <List dense>
        {branches.map(({name, id}) => (
          <ListItem
            button
            className={classes.listItem}
            onClick={handleCallback(id)}
            key={name}>
            <ListItemText>{name}</ListItemText>
          </ListItem>
        ))}
      </List>

    </ArrowPopper>
  );
}
