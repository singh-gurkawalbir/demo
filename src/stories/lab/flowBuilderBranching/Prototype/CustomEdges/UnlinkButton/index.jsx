import React from 'react';
import { IconButton, makeStyles } from '@material-ui/core';
import UnLinkIcon from '../../../../../../components/icons/unLinkedIcon';
import { useHandleDeleteEdge } from '../../hooks';

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
  const handleDeleteEdge = useHandleDeleteEdge(edgeId);

  return (
    <IconButton
      className={classes.addButton}
      onClick={handleDeleteEdge}
    >
      <UnLinkIcon />
    </IconButton>
  );
}
