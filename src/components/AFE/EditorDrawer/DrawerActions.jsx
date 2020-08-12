import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
// TODO: Azhar, please fix these icons message.
import ViewRowIcon from '@material-ui/icons/HorizontalSplit';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ViewColumnIcon from '../../icons/LayoutTriVerticalIcon';
import ViewCompactIcon from '../../icons/LayoutLgLeftSmrightIcon';
import Help from '../../Help';

const useStyles = makeStyles(theme => ({
  toolbarContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  helpTextButton: {
    marginLeft: theme.spacing(1),
  },
  actionContainer: {
    margin: theme.spacing(0, 1),
    padding: theme.spacing(1),
    marginRight: theme.spacing(2),
    display: 'flex',
  },
  toggleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  editorToggleContainer: {
    marginRight: theme.spacing(2),
  },
}));

export default function DrawerActions(props) {
  const {
    action,
    toggleAction,
    showLayoutOptions,
    layout,
    handleLayoutChange,
    helpKey,
    helpTitle,
  } = props;

  const classes = useStyles();

  return (
    <div className={classes.toolbarContainer}>
      <div className={classes.actionContainer}>
        {/* it expects field to be a component to render */}
        {action}
      </div>
      <div className={classes.toggleContainer}>
        <div className={classes.editorToggleContainer}>
          {toggleAction}
        </div>
        {showLayoutOptions && (
          <ToggleButtonGroup
            value={layout}
            exclusive
            onChange={handleLayoutChange}>
            <ToggleButton data-test="editorColumnLayout" value="column">
              <ViewColumnIcon />
            </ToggleButton>
            <ToggleButton data-test="editorCompactLayout" value="compact">
              <ViewCompactIcon />
            </ToggleButton>
            <ToggleButton data-test="editorRowLayout" value="row">
              <ViewRowIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        )}
      </div>
      {helpKey && (
        <Help
          title={helpTitle}
          className={classes.helpTextButton}
          helpKey={helpKey}
          fieldId={helpKey}
            />
      )}
    </div>
  );
}
