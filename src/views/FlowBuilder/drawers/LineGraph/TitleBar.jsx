import { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Typography, IconButton, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '../../../../components/icons/CloseIcon';
import LoadResources from '../../../../components/LoadResources';
import DynaMultiSelect from '../../../../components/DynaForm/fields/DynaMultiSelect';

const useStyles = makeStyles(theme => ({
  titleBar: {
    background: theme.palette.background.paper,
    display: 'flex',
    alignItems: 'center',
    padding: '14px 24px',
  },
  title: {
    flexGrow: 1,
  },
  divider: {
    height: theme.spacing(3),
    width: 1,
    marginRight: theme.spacing(1),
  },
  closeIcon: {
    padding: theme.spacing(0.5),
  },
}));

export default function DrawerTitleBar({ onClose, title, parentUrl }) {
  const classes = useStyles();
  const history = useHistory();
  const [measurements, setMeasurements] = useState(['success']);
  const handleClose = useCallback(() => {
    if (onClose && typeof onClose === 'function') {
      onClose();
    } else {
      history.push(parentUrl);
    }
  }, [history, onClose, parentUrl]);
  const handleMeasurementChange = useCallback((id, val) => {
    setMeasurements(val);
  }, []);

  return (
    <div className={classes.titleBar}>
      <LoadResources required resources="flows">
        <Typography variant="h3" className={classes.title}>
          {title}
        </Typography>

        <DynaMultiSelect
          name="attributes"
          value={measurements}
          hideLabel
          options={[
            {
              items: [
                { value: 'success', label: 'Flow: Success' },
                { value: 'errors', label: 'Flow: Errors' },
                { value: 'ignored', label: 'Flow: Ignored' },
                { value: 'averageTimeTaken', label: 'Average time taken' },
              ],
            },
          ]}
          onFieldChange={handleMeasurementChange}
        />

        <Divider orientation="veritical" className={classes.divider} />
        <IconButton
          data-test="closeCategoryMapping"
          aria-label="Close"
          onClick={handleClose}
          className={classes.closeIcon}>
          <CloseIcon />
        </IconButton>
      </LoadResources>
    </div>
  );
}
