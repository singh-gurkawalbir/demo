import React from 'react';
import { IconButton, makeStyles, Tooltip } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import Icon from '../../../../../components/icons/AdjustInventoryIcon';
import { useFlowContext } from '../../Context';
import actions from '../../../../../actions';

const useStyles = makeStyles(theme => ({
  unlinkButton: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.light,
    padding: 0,
    '& > span': {
      width: 18,
      height: 18,
      '& > svg': {
        width: '0.6em',
      },
    },
  },

}));

export default function SubFlowButton({edgeId}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { flowId } = useFlowContext();

  const handleSubFlowClose = () => {
    dispatch(actions.flow.toggleSubFlowView(flowId, false));
    dispatch(actions.flow.edgeUnhover(flowId));
  };

  return (
    <Tooltip title="Close SubFlow">
      <IconButton
        data-test={`subflow-${edgeId}`}
        className={classes.unlinkButton}
        onClick={handleSubFlowClose}
    >
        <Icon />
      </IconButton>
    </Tooltip>
  );
}
