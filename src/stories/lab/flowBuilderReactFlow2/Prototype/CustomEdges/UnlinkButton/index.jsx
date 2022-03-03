import React, { useMemo } from 'react';
import { IconButton, makeStyles } from '@material-ui/core';
import UnLinkIcon from '../../../../../../components/icons/unLinkedIcon';
import { useFlowContext } from '../../Context';
import { areMultipleEdgesConnectedToSameEdgeTarget } from '../../lib';
// import actions from '../../reducer/actions';
import { useHandleDeleteEdge } from '../../hooks';

const useStyles = makeStyles(theme => ({
  addButton: {
    backgroundColor: theme.palette.common.white,
    border: `solid 1px ${theme.palette.secondary.light}`,
    padding: 0,
  },
}));

export default function UnlinkButton({edgeId}) {
  const classes = useStyles();
  const { elements } = useFlowContext();
  const handleDeleteEdge = useHandleDeleteEdge(edgeId);
  const shouldShowLinkIcon = useMemo(() => areMultipleEdgesConnectedToSameEdgeTarget(edgeId, elements), [edgeId, elements]);

  if (!shouldShowLinkIcon) {
    return null;
  }

  return (
    <IconButton
      className={classes.addButton}
      onClick={handleDeleteEdge}
        >
      <UnLinkIcon />
    </IconButton>
  );
}
