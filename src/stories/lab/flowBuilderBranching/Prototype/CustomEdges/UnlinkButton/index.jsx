import React from 'react';
import { IconButton, makeStyles } from '@material-ui/core';
import UnLinkIcon from '../../../../../../components/icons/unLinkedIcon';
import actions from '../../reducer/actions';
import { useFlowContext } from '../../Context';

const useStyles = makeStyles(theme => ({
  addButton: {
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
  const { setState, flow } = useFlowContext();

  const handleDeleteEdge = () => {
    setState({type: actions.DELETE_EDGE, edgeId});
    setState({type: actions.SAVE, flowId: flow._id});
  };

  return (
    <IconButton
      className={classes.addButton}
      onClick={handleDeleteEdge}
    >
      <UnLinkIcon />
    </IconButton>
  );
}
