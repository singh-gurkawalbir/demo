import { Button, FormControl, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../actions';
import CeligoSelect from '../../components/CeligoSelect';
import useResourceList from '../../hooks/selectors/useResourceList';

const useStyles = makeStyles(theme => ({
  selectIntegration: {
    width: theme.spacing(50),
  },
  submit: {
    marginLeft: theme.spacing(10),
    marginTop: theme.spacing(2),
    marginRight: 'auto',
  },
}));
const integrationFilterConfig = { type: 'integrations' };

export default function GenerateZip({ onClose, invalid = 'invalid' }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const integrations = useResourceList(integrationFilterConfig).resources;
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
    <FormControl>
      <CeligoSelect
        id="integration"
        className={classes.selectIntegration}
        value={selectedIntegrationId}
        onChange={e => setSelectedIntegrationId(e.target.value)}
        margin="dense">
        <MenuItem key={invalid} value={invalid}>
          Select integration
        </MenuItem>
        {filteredIntegrations &&
          filteredIntegrations.map(integration => (
            <MenuItem key={integration._id} value={integration._id}>
              {integration.name}
            </MenuItem>
          ))}
      </CeligoSelect>
      <br />
      <Button
        data-test="generateTemplateZip"
        variant="contained"
        color="primary"
        type="submit"
        onClick={handleGenerateZipClick}
        className={classes.submit}>
        Generate template zip
      </Button>
    </FormControl>
  );
}
