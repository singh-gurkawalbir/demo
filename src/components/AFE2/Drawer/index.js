import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, Button } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { selectors } from '../../../reducers';
import RightDrawer from '../../drawer/Right';
import DrawerHeader from '../../drawer/Right/DrawerHeader';
import DrawerContent from '../../drawer/Right/DrawerContent';
import DrawerFooter from '../../drawer/Right/DrawerFooter';
import ButtonGroup from '../../ButtonGroup';
import Spinner from '../../Spinner';
import Editor from '../Editor';
import editorMetadata from '../Editor/metadata';

const useStyles = makeStyles(
  {
    spaceBetween: { flexGrow: 100 },
  });

function RouterWrappedContent(props) {
  const classes = useStyles();
  const { editorId } = useParams();
  let editor = useSelector(state => selectors.editor(state, editorId));

  // hardcode editor for now until data layer is connected..
  editor = { type: 'formBuilder', mode: 'json' };

  const {type} = editor;
  const { label } = editorMetadata[type];

  return (
    <>
      <DrawerHeader title={label} {...props} />

      <DrawerContent>
        <Editor editorId={editorId} />
      </DrawerContent>

      <DrawerFooter>
        <ButtonGroup>
          <Button variant="contained" color="primary"> OK </Button>
          <Button variant="text" color="primary"> Cancel </Button>
        </ButtonGroup>

        <div className={classes.spaceBetween} />

        <Button variant="contained" color="secondary"> Preview </Button>
      </DrawerFooter>
    </>
  );
}

export default function EditorDrawer() {
  return (
    <RightDrawer height="tall" width="large" path="editor/:editorId">
      <RouterWrappedContent />
    </RightDrawer>
  );
}
