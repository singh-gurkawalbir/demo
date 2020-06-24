import React, { useState, } from 'react';
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
    helpKey,
  } = props;
  const [showEditor, setShowEditor] = useState(false);
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const handleClose = () => {
    handleEditorClick();
  };

  return (
    <>
      {showEditor && (
        <ModalDialog onClose={handleClose} show>
          <span>Routing rules editor</span>
          <DynaHook
            {...props} />
          <div>
            <Button data-test="saveOperandSettings" onClick={handleClose}>
              Save
            </Button>
            <Button data-test="cancelOperandSettings" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </ModalDialog>
      )}
      <div className={classes.dynaRoutingRulesWrapper}>
        <FormLabel className={classes.dynaRoutingRulesLabel}>Routing rules editor:</FormLabel>
        <Button
          data-test={id}
          variant="outlined"
          color="secondary"
          className={classes.dynaRoutingRulesBtn}
          onClick={handleEditorClick}>
          Launch
        </Button>

        <FieldHelp {...props} helpKey={helpKey} />
      </div>
    </>
  );
}
