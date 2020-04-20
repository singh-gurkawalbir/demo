import { Fragment } from 'react';
import { makeStyles, Button } from '@material-ui/core';
import EditorField from '../../DynaEditor';

const useStyles = makeStyles({
  editor: {
    height: 200,
  },
});

export default function RawView(onToggleClick, ...rest) {
  const classes = useStyles();

  // Only developers would ever see this raw settings view, so we can safely
  // render the toggle editor button with no other conditions.
  return (
    <Fragment>
      <Button onClick={onToggleClick}>Toggle form editor</Button>
      <EditorField
        {...rest}
        label="Settings"
        editorClassName={classes.editor}
        mode="json"
      />
    </Fragment>
  );
}
