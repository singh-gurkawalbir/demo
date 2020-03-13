import { makeStyles } from '@material-ui/core/styles';
import EditorField from './DynaEditor';

const useStyles = makeStyles({
  editor: {
    height: 250,
  },
});

export default function DynaSettings(props) {
  const classes = useStyles();

  return (
    <EditorField {...props} editorClassName={classes.editor} mode="json" />
  );
}
