import React, {useCallback} from 'react';
import { IconButton, makeStyles } from '@material-ui/core';
import UnLinkIcon from '../../../../../../components/icons/unLinkedIcon';
import { useFlowContext } from '../../Context';
import actions from '../../reducer/actions';

const useStyles = makeStyles(theme => ({
  addButton: {
    backgroundColor: theme.palette.common.white,
    border: `solid 1px ${theme.palette.secondary.light}`,
    padding: 0,
    '& > span': {
      width: 20,
      height: 20,
      '& > svg': {
        width: '0.7em',
      },
    },
  },
}));

export default function UnlinkButton({edgeId}) {
  const classes = useStyles();
  const { dispatchFlowUpdate } = useFlowContext();

  const handleDeleteEdge = useCallback(() => {
    dispatchFlowUpdate({type: actions.DELETE_EDGE, edgeId});
  }, [dispatchFlowUpdate, edgeId]);

  return (
    <IconButton
      className={classes.addButton}
      onClick={handleDeleteEdge}
        >
      <UnLinkIcon />
    </IconButton>
  );
}
