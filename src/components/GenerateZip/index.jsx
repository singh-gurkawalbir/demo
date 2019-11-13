import React, { useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MenuItem, Select, FormControl, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as selectors from '../../reducers';
import actions from '../../actions';

const useStyles = makeStyles(theme => ({
  selectIntegration: {
    width: theme.spacing(50),
  },
  form: {
    marginLeft: theme.spacing(3),
  },
  submit: {
    marginLeft: theme.spacing(10),
    marginTop: theme.spacing(4),
    marginRight: 'auto',
  },
}));

export default function GenerateZip(props) {
  const { onClose, invalid = 'invalid' } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { resources: integrations } = useSelector(state =>
    selectors.resourceList(state, { type: 'integrations' })
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
    <Fragment>
      <FormControl className={classes.form}>
        <Select
          id="integration"
          className={classes.selectIntegration}
          value={selectedIntegrationId}
          onChange={e => setSelectedIntegrationId(e.target.value)}
          margin="dense">
          <MenuItem key={invalid} value={invalid}>
            Select Integration
          </MenuItem>
          {integrations &&
            integrations.map(integration => (
              <MenuItem key={integration._id} value={integration._id}>
                {integration.name}
              </MenuItem>
            ))}
        </Select>
        <br />
        <Button
          data-test="generateTemplateZip"
          variant="contained"
          color="primary"
          type="submit"
          onClick={handleGenerateZipClick}
          className={classes.submit}>
          Generate Template Zip
        </Button>
      </FormControl>
    </Fragment>
  );
}
