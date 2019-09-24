import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  DialogContent,
  Dialog,
  MenuItem,
  IconButton,
  Select,
  FormControl,
  Button,
  DialogTitle,
  Divider,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import actions from '../../actions';

const styles = theme => ({
  title: {
    marginLeft: theme.spacing(4),
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
  },
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
});

function GenerateTemplateZip(props) {
  const { integrations, onClose, classes, invalid = 'invalid' } = props;
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState(invalid);
  const handleGenerateZipClick = e => {
    e.preventDefault();

    if (selectedOption === invalid) {
      return false;
    }

    dispatch(actions.template.generateZip(selectedOption));
    onClose();
  };

  return (
    <Dialog open onClose={onClose} aria-labelledby="generate-template-zip">
      <IconButton
        aria-label="Close"
        onClick={onClose}
        className={classes.closeButton}>
        <CloseIcon />
      </IconButton>
      <DialogTitle id="generate-template-zip" className={classes.title}>
        Generate Template Zip
      </DialogTitle>
      <Divider variant="middle" />
      <DialogContent>
        <FormControl className={classes.form}>
          <Select
            id="integration"
            className={classes.selectIntegration}
            value={selectedOption}
            onChange={e => setSelectedOption(e.target.value)}
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
            variant="contained"
            color="primary"
            type="submit"
            onClick={handleGenerateZipClick}
            className={classes.submit}>
            Generate Template Zip
          </Button>
        </FormControl>
      </DialogContent>
    </Dialog>
  );
}

export default withStyles(styles)(GenerateTemplateZip);
