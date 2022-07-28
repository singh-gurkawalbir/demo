import React from 'react';
import { MenuItem, Typography, makeStyles, Divider, ClickAwayListener } from '@material-ui/core';
import { useHistory, useRouteMatch } from 'react-router-dom';
import ArrowPopper from '../../../../../components/ArrowPopper';
import { useFlowContext } from '../../Context';
import { getAllFlowBranches } from '../../lib';
import { buildDrawerUrl, drawerPaths } from '../../../../../utils/rightDrawer';
import { BranchPathRegex } from '../../../../../constants';
import { shortId } from '../../../../../utils/string';

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
  const { flow, elements } = useFlowContext();
  const open = Boolean(anchorEl);

  const branches = getAllFlowBranches(flow, elements);

  const handleCallback = branchId => () => {
    const branch = branches.find(s => s.id === branchId);
    const [, routerIndex, branchIndex] = BranchPathRegex.exec(branch.path);

    const newTempProcessorId = `new-${shortId()}_${routerIndex}_${branchIndex}`;
    const addPPUrl = buildDrawerUrl({
      path: drawerPaths.RESOURCE.ADD,
      baseUrl: match.url,
      params: { resourceType: 'pageProcessor', id: newTempProcessorId, path: branch.path },
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

      <ClickAwayListener onClickAway={handleClose}>
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

      </ClickAwayListener>
    </ArrowPopper>
  );
}
