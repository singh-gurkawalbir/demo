import React from 'react';
import { MenuItem, Typography, Divider } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ArrowPopper } from '@celigo/fuse-ui';
import { useFlowContext } from '../../Context';
import { getAllFlowBranches } from '../../lib';
import { buildDrawerUrl, drawerPaths } from '../../../../../utils/rightDrawer';
import actions from '../../../../../actions';
import { generateNewId } from '../../../../../utils/resource';

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
  const match = useRouteMatch();
  const history = useHistory();
  const dispatch = useDispatch();
  const { flowId, flow, elements } = useFlowContext();
  const open = Boolean(anchorEl);

  const branches = getAllFlowBranches(flow, elements);

  const handleCallback = branchId => () => {
    const branch = branches.find(s => s.id === branchId);

    dispatch(actions.flow.addNewPPStepInfo(flowId, { branchPath: branch.path }));
    const newTempProcessorId = generateNewId();
    const addPPUrl = buildDrawerUrl({
      path: drawerPaths.RESOURCE.ADD,
      baseUrl: match.url,
      params: { resourceType: 'pageProcessor', id: newTempProcessorId },
    });

    history.push(addPPUrl);
    handleClose();
  };

  return (
    <ArrowPopper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-end"
      onClose={handleClose}>
      <div className={classes.content}>
        <div className={classes.titleBox}>
          <Typography className={classes.title} variant="h6">
            Select branch to add to
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
    </ArrowPopper>
  );
}
