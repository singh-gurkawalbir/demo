import React, { useState, useCallback } from 'react';
import { FormLabel, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FieldHelp from '../../FieldHelp';
import DynaHook from '../DynaHook';
import ModalDialog from '../../../ModalDialog';


const useStyles = makeStyles({
  dynaRoutingRulesWrapper: {
    width: '100%',
  },
  dynaRoutingRulesBtn: {
    maxWidth: 100,
  },
  dynaRoutingRulesLabel: {
    marginBottom: 6,
  },
  dynaRoutingRulesLabelWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
});

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

  const handleClose = useCallback(() => {
    handleEditorClick();
  }, [handleEditorClick]);

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
        <div className={classes.dynaRoutingRulesLabelWrapper}>
          <FormLabel className={classes.dynaRoutingRulesLabel}>{label}</FormLabel>
          <FieldHelp {...props} />
        </div>
        <Button
          data-test={id}
          variant="outlined"
          color="secondary"
          className={classes.dynaRoutingRulesBtn}
          onClick={handleEditorClick}>
          Launch
        </Button>
      </div>
    </>
  );
}
