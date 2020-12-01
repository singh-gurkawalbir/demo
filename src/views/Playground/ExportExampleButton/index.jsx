import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions }
  from '@material-ui/core';
import shortid from 'shortid';
import { selectors } from '../../../reducers';
import CodeEditor from '../../../components/CodeEditor/editor';

const useStyles = makeStyles(theme => ({
  exportButton: {
    marginRight: theme.spacing(1),
  },
  dialogContent: {
    width: 700,
    height: 600,
    display: 'flex',
    flexDirection: 'column',
  },
}));

const emptyObj = {};

export default function ExportExampleButton({ editorId }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const canExport = useSelector(state => {
    if (!editorId) return false;
    const { developer, email = '' } = selectors.userProfile(state);

    // Only Celigo developers can use this feature (currently).
    return developer && email.endsWith('celigo.com');
  });

  const {processor: type, rule, data} = useSelector(state => canExport && open
    ? selectors._editor(state, editorId)
    : emptyObj);

  const handleOpen = () => { setOpen(true); };
  const handleClose = () => { setOpen(false); };

  const example = {
    type,
    key: `${type}-${shortid.generate()}`,
    name: 'node text in example tree',
    description: 'Not used yet.',
    rule,
    data,
  };

  if (!canExport) return null;

  return (
    <>
      <Button
        className={classes.exportButton}
        onClick={handleOpen}
        variant="text">
        Export example
      </Button>

      <Dialog open={open} onClose={handleClose} aria-labelledby="example-dialog" maxWidth="lg">
        <DialogTitle id="example-dialog">Export example</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <DialogContentText>
            Send this JSON snippet to dave@celigo.com.
          </DialogContentText>

          <CodeEditor readonly value={example} mode="json" />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
