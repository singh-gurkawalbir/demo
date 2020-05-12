import { Button, FormControl, FormLabel, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../actions';
import CeligoSelect from '../../components/CeligoSelect';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';
import * as selectors from '../../reducers';

const useStyles = makeStyles(theme => ({
  selectIntegration: {
    width: '100%',
  },
  submit: {
    marginTop: theme.spacing(2),
    marginRight: 'auto',
  },
  fieldWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  dynaSelectWrapper: {
    width: '100%',
  },
}));
const integrationFilterConfig = { type: 'integrations' };

export default function GenerateZip({ onClose, invalid = 'invalid' }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const integrations = useSelectorMemo(
    selectors.makeResourceListSelector,
    integrationFilterConfig
  ).resources;
  const filteredIntegrations = useMemo(
    () => integrations.filter(i => !i._connectorId && !i.isShared),
    [integrations]
  );
  const [selectedIntegrationId, setSelectedIntegrationId] = useState(invalid);
  const handleGenerateZipClick = () => {
    if (selectedIntegrationId === invalid) {
      return false;
    }

    dispatch(actions.template.generateZip(selectedIntegrationId));

    if (onClose) {
      onClose();
    }
  };

  return (
    <div className={classes.dynaSelectWrapper}>
      <div className={classes.fieldWrapper}>
        <FormLabel>Select integration</FormLabel>
      </div>
      <FormControl className={classes.selectIntegration}>
        <CeligoSelect
          id="integration"
          className={classes.selectIntegration}
          value={selectedIntegrationId}
          onChange={e => setSelectedIntegrationId(e.target.value)}
          margin="dense">
          <MenuItem key={invalid} value={invalid}>
            Please select
          </MenuItem>
          {filteredIntegrations &&
            filteredIntegrations.map(integration => (
              <MenuItem key={integration._id} value={integration._id}>
                {integration.name}
              </MenuItem>
            ))}
        </CeligoSelect>
        <Button
          data-test="generateTemplateZip"
          variant="outlined"
          color="secondary"
          type="submit"
          onClick={handleGenerateZipClick}
          className={classes.submit}>
          Generate template zip
        </Button>
      </FormControl>
    </div>
  );
}
