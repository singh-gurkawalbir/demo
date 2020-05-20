import { makeStyles } from '@material-ui/core';
import EditorField from '../../DynaEditor';
import ActionButton from '../../../../ActionButton';
import ScriptsIcon from '../../../../icons/ScriptsIcon';

const useStyles = makeStyles(theme => ({
  editor: {
    height: 200,
  },
  rawViewWrapper: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
  },
  rawSettingsActionButton: {
    marginTop: theme.spacing(4),
  },
}));

export default function RawView({ onToggleClick, ...rest }) {
  const classes = useStyles();

  // Only developers would ever see this raw settings view, so we can safely
  // render the toggle editor button with no other conditions.
  return (
    <div className={classes.rawViewWrapper}>
      <EditorField
        {...rest}
        label="Settings"
        className={classes.rawViewWrapper}
        editorClassName={classes.editor}
        mode="json"
      />
      <ActionButton
        data-test="toggleEditor"
        variant="outlined"
        color="secondary"
        className={classes.rawSettingsActionButton}
        onClick={onToggleClick}>
        <ScriptsIcon />
      </ActionButton>
    </div>
  );
}
