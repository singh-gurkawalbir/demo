import React, { useState, useCallback } from 'react';
import { FormLabel, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FieldHelp from '../../FieldHelp';
import DynaHook from '../DynaHook';
import ModalDialog from '../../../ModalDialog';


const useStyles = makeStyles(theme => ({
  dynaRoutingRulesWrapper: {
    flexDirection: 'row !important',
    width: '100%',
    alignItems: 'center',
  },
  dynaRoutingRulesBtn: {
    marginRight: theme.spacing(0.5),
  },
  dynaRoutingRulesLabel: {
    marginBottom: 0,
    marginRight: 12,
    maxWidth: '50%',
    wordBreak: 'break-word',
  },
}));

export default function DynaRoutingRules(props) {
  const classes = useStyles();
  const {
    id,
    label,
    title,
  } = props;
  const [showEditor, setShowEditor] = useState(false);
  const handleEditorClick = useCallback(() => {
    setShowEditor(!showEditor);
  }, [showEditor]);

  const handleClose = () => {
    handleEditorClick();
  };

  return (
    <>
      {showEditor && (
        <ModalDialog onClose={handleClose} show>
          <span>Routing rules editor</span>
          <DynaHook
            {...props}
            label={title} />
          <div>
            <Button data-test="saveRoutingRules" onClick={handleClose}>
              Save
            </Button>
            <Button data-test="cancelRoutingRules" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </ModalDialog>
      )}
      <div className={classes.dynaRoutingRulesWrapper}>
        <FormLabel className={classes.dynaRoutingRulesLabel}>{label}</FormLabel>
        <Button
          data-test={id}
          variant="outlined"
          color="secondary"
          className={classes.dynaRoutingRulesBtn}
          onClick={handleEditorClick}>
          Launch
        </Button>
        <FieldHelp {...props} />
      </div>
    </>
  );
}
