import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { makeStyles } from '@material-ui/core/styles';
import CopyIcon from '../../../../icons/CopyIcon';
import IconTextButton from '../../../../IconTextButton';

const useStyles = makeStyles(theme => ({
  clipBoardContainer: {
    maxWidth: 680,
    borderTop: `1px solid ${theme.palette.background.paper2}`,
    minHeight: theme.spacing(6),
    position: 'relative',
    padding: theme.spacing(1),
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  clipBoard: {
    float: 'right',
  },
}));

export default function ClipBoardPanel({ content }) {
  const classes = useStyles();
  const clipBoardText = typeof content !== 'string' ? JSON.stringify(content, null, 2) : content;

  return (
    <div className={classes.clipBoardContainer}>
      <CopyToClipboard
        text={clipBoardText}
        className={classes.clipBoard}>
        <IconTextButton
          data-test="copyToClipboard"
          title="Copy to clipboard"
          variant="text"
          color="primary">
          <CopyIcon />
          Copy
        </IconTextButton>
      </CopyToClipboard>
    </div>
  );
}
