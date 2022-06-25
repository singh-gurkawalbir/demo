import React from 'react';
import { IconButton, makeStyles } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import UnLinkIcon from '../../../../../components/icons/unLinkedIcon';
import { useFlowContext } from '../../Context';
import actions from '../../../../../actions';

const useStyles = makeStyles(theme => ({
  unlinkButton: {
    backgroundColor: theme.palette.common.white,
    border: `solid 1px ${theme.palette.secondary.lightest}`,
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

export default function UnlinkButton({edgeId}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { flowId } = useFlowContext();

  const handleDeleteEdge = () => {
    dispatch(actions.flow.deleteEdge(flowId, edgeId));
  };

  return (
    <IconButton
      className={classes.unlinkButton}
      onClick={handleDeleteEdge}
    >
      <UnLinkIcon />
    </IconButton>
  );
}
