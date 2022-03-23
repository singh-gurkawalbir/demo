import React from 'react';
import { List, ListItem, ListItemText, makeStyles } from '@material-ui/core';
import { useStoreState } from 'react-flow-renderer';
import { FB_SOURCE_COLUMN_WIDTH } from '../constants';
import Title from './Title';
import ArrowPopper from '../../../../../components/ArrowPopper';
import { useFlowContext } from '../Context';
import { generateId, getAllPPNodes } from '../lib';
import actions from '../reducer/actions';
import { getSomeImport, getSomePpImport } from '../nodeGeneration';

const useStyles = makeStyles(theme => ({
  sourceTitle: {
    left: ({xOffset}) => xOffset,
    background: `radial-gradient(circle at center, ${theme.palette.background.paper}, 80%, transparent)`,
  },
}));

const AddNodeMenuPopper = ({ anchorEl, handleClose }) => {
  const classes = useStyles();
  const open = Boolean(anchorEl);
  const { flow, elements, setState } = useFlowContext();

  const allPPSteps = getAllPPNodes(flow, elements);
  const id = `new-${generateId()}`;
  const flowNode = getSomePpImport(id);
  const resourceNode = getSomeImport(id);

  const handleCallback = stepId => () => {
    const step = allPPSteps.find(s => s.id === stepId);

    setState({
      type: actions.ADD_NEW_STEP,
      resourceType: 'imports',
      path: step.path,
      flowNode,
      resourceNode,
      flowId: flow._id,
    });
    handleClose();
  };

  return (
    <ArrowPopper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-end"
      onClose={handleClose}
    >
      <List
        dense className={classes.listWrapper}>
        {allPPSteps.map(({name, id}) => (
          <ListItem
            button
            onClick={handleCallback(id)}
            key={name}>
            <ListItemText >{name}</ListItemText>
          </ListItem>
        ))}
      </List>
    </ArrowPopper>
  );
};

export default function DestinationTitle() {
  // we dont care about the y axis since we always want 100% y axis coverage,
  // regardless of pan or zoom settings.
  const [x,, scale] = useStoreState(s => s.transform);
  const columnWidth = Math.max(0, FB_SOURCE_COLUMN_WIDTH * scale + x);
  const xOffset = columnWidth + 20;

  const classes = useStyles({xOffset});
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenMenu = event => {
    event && setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <Title onClick={handleOpenMenu} className={classes.sourceTitle}>
        DESTINATIONS & LOOKUPS
      </Title>
      <AddNodeMenuPopper
        anchorEl={anchorEl}
        handleClose={handleCloseMenu}
      />
    </>
  );
}
