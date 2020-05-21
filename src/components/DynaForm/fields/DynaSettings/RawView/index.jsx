import { makeStyles } from '@material-ui/core';
import EditorField from '../../DynaEditor';

const useStyles = makeStyles({
  editor: {
    height: 200,
  },
  rawViewWrapper: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
  },
});

export default function RawView({ props }) {
  const classes = useStyles();

  // Only developers would ever see this raw settings view, so we can safely
  // render the toggle editor button with no other conditions.
  return (
    <EditorField
      {...props}
      label="Settings"
      className={classes.rawViewWrapper}
      editorClassName={classes.editor}
      mode="json"
    />
  );
}
