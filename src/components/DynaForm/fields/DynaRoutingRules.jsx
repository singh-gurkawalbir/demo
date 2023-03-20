import React, { useState, useCallback } from 'react';
import { FormLabel } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useSelector } from 'react-redux';
import FieldHelp from '../FieldHelp';
import DynaHook from './DynaHook_afe';
import ModalDialog from '../../ModalDialog';
import { OutlinedButton, FilledButton, TextButton } from '../../Buttons';
import ActionGroup from '../../ActionGroup';
import { selectors } from '../../../reducers';
import { useSelectorMemo } from '../../../hooks';
import { emptyObject } from '../../../constants';

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
    resourceId,
    resourceType,
    isVanConnector = false,
  } = props;
  const [showEditor, setShowEditor] = useState(false);
  const handleEditorClick = useCallback(() => {
    setShowEditor(!showEditor);
  }, [showEditor]);
  const resource = useSelectorMemo(
    selectors.makeResourceDataSelector,
    resourceType,
    resourceId
  )?.merged || emptyObject;

  const licenseActionDetails = useSelector(state =>
    selectors.platformLicenseWithMetadata(state)
  );
  const isVanLicenseAbsent = (isVanConnector && (licenseActionDetails.van === false));

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
          color="primary"
          className={classes.dynaRoutingRulesBtn}
          onClick={handleEditorClick}
          disabled={resource.type === 'van' && isVanLicenseAbsent}
          >
          Launch
        </OutlinedButton>
      </div>
    </>
  );
}
