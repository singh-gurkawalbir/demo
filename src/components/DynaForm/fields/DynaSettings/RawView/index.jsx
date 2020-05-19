import { makeStyles, Button } from '@material-ui/core';
import EditorField from '../../DynaEditor';

const useStyles = makeStyles({
  editor: {
    height: 200,
  },
  // TODO: @Azhar, editor should be displayed as an enclosed box
  wrapper: {
    width: '100%',
  },
});

export default function RawView({ onToggleClick, ...rest }) {
  const classes = useStyles();

  // Only developers would ever see this raw settings view, so we can safely
  // render the toggle editor button with no other conditions.
  return (
    <div className={classes.wrapper}>
      <Button
        data-test="toggleEditor"
        variant="outlined"
        color="secondary"
        onClick={onToggleClick}>
        Launch form builder
      </Button>
      <EditorField
        {...rest}
        label="Settings"
        editorClassName={classes.editor}
        mode="json"
      />
    </div>
  );
}
