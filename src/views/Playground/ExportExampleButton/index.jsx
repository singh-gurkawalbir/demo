import React, { useState, useEffect } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { TextButton } from '@celigo/fuse-ui';
import { generateId } from '../../../utils/string';
import { selectors } from '../../../reducers';
import CodeEditor from '../../../components/CodeEditor2/editor';

const useStyles = makeStyles(() => ({
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
  const [example, setExample] = useState();
  const canExport = useSelector(state => {
    if (!editorId) return false;
    const { developer, email = '' } = selectors.userProfile(state);

    // Only Celigo developers can use this feature (currently).
    return developer && email.endsWith('celigo.com');
  });

  const { type, rule, data } = useSelector(state => {
    let editorState = emptyObj;

    if (canExport && open) {
      const e = selectors.editor(state, editorId);

      editorState = {
        type: e.editorType,
        rule: e.rule,
        data: e.data,
      };
    }

    return editorState;
  }, shallowEqual);

  useEffect(() => {
    if (open) {
      setExample({
        type,
        key: `${type}-${generateId()}`,
        name: 'node text in example tree',
        description: 'Not used yet.',
        rule,
        data,
      });
    }
  // we ONLY want this to fire when the open flag changes, and
  // new state is true (open)...
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleOpen = () => { setOpen(true); };
  const handleClose = () => { setOpen(false); };
  const handleChange = v => { setExample(v); };

  if (!canExport) return null;

  return (
    <>
      <TextButton
        sx={{mr: 1}}
        onClick={handleOpen}>
        Export example
      </TextButton>

      <Dialog open={open} onClose={handleClose} aria-labelledby="example-dialog" maxWidth="lg">
        <DialogTitle id="example-dialog">Export example</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <CodeEditor onChange={handleChange} value={example} mode="json" />
        </DialogContent>

        <DialogActions>
          <TextButton onClick={handleClose}> Close </TextButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
