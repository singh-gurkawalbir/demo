import React, { useState, useCallback } from 'react';
import { FormLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FieldHelp from '../FieldHelp';
import DynaHook from './DynaHook_afe';
import ModalDialog from '../../ModalDialog';
import OutlinedButton from '../../Buttons/OutlinedButton';
import { FilledButton, TextButton } from '../../Buttons';
import ActionGroup from '../../ActionGroup';

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
          <ActionGroup>
            <FilledButton data-test="saveRoutingRules" onClick={handleClose}>
              Save
            </FilledButton>
            <TextButton data-test="cancelRoutingRules" onClick={handleClose}>
              Cancel
            </TextButton>
          </ActionGroup>
        </ModalDialog>
      )}
      <div className={classes.dynaRoutingRulesWrapper}>
        <div className={classes.dynaRoutingRulesLabelWrapper}>
          <FormLabel className={classes.dynaRoutingRulesLabel}>{label}</FormLabel>
          <FieldHelp {...props} />
        </div>
        <OutlinedButton
          data-test={id}
          className={classes.dynaRoutingRulesBtn}
          onClick={handleEditorClick}>
          Launch
        </OutlinedButton>
      </div>
    </>
  );
}
