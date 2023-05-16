import React, { useCallback, useState } from 'react';
import { MenuItem, InputLabel, FormControl} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import moment from 'moment';
import TimeAgo from 'react-timeago';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowPopper, Box, OutlinedButton, TextButton} from '@celigo/fuse-ui';
import actions from '../../actions';
import { selectors } from '../../reducers';
import CeligoSelect from '../CeligoSelect';
import DebugIcon from '../icons/DebugIcon';
import ActionGroup from '../ActionGroup';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
  formControl: {
    wordBreak: 'break-word',
    width: '100%',
  },
  filter: {
    maxWidth: '350px',
  },
  wrapper: {
    display: 'grid',
    gridTemplateColumns: '1fr',
  },
  actions: {
    marginTop: theme.spacing(2),
  },
  formLabel: {
    fontSize: 15,
    position: 'relative',
  },
  row: {
    display: 'flex',
    flexDirection: 'column',
  },
  dropdown: {
    marginTop: '0px !important',
  },
}));

const debugOptions = [
  { label: 'Off', value: '0' },
  { label: 'Next 15 mins', value: '15' },
  { label: 'Next 30 mins', value: '30' },
  { label: 'Next 45 mins', value: '45' },
  { label: 'Next 60 mins', value: '60' },
];

const formatter = (value, unit, suffix) => {
  if (suffix === 'ago') {
    return 'Start debug';
  }
  let formattedUnit = '';

  if (unit === 'second') {
    formattedUnit = 's';
  } else if (unit === 'minute') {
    formattedUnit = 'm';
  } else {
    formattedUnit = unit;
  }

  return `${value}${formattedUnit} remaining`;
};

// there is a new enhanced component 'StartDebugEnhanced' which takes care
// of the improvements around this Debug button. Please use that, if needed
const defaultValue = 15;
export default function StartDebug({ resourceId, resourceType, disabled}) {
  const [value, setValue] = useState(defaultValue);
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();
  const dispatch = useDispatch();
  const debugUntil = useSelector(state => {
    const resource = selectors.resource(state, resourceType, resourceId);
    let debugUntil;

    if (resourceType === 'connections') {
      debugUntil = resource.debugDate;
    } else {
      debugUntil = resource.debugUntil;
    }
    if (!debugUntil || moment().isAfter(moment(debugUntil))) {
      return;
    }

    return debugUntil;
  });

  const toggleClick = useCallback(event => {
    if (anchorEl) {
      setValue(defaultValue);
    }
    setAnchorEl(state => (state ? null : event.currentTarget));
  }, [anchorEl]);

  const handleSave = useCallback(() => {
    if (resourceType === 'connections') {
      dispatch(actions.logs.connections.startDebug(resourceId, value));
    } else if (resourceType === 'scripts') {
      dispatch(actions.logs.scripts.startDebug(resourceId, value));
    }

    setAnchorEl(null);
  }, [dispatch, resourceId, resourceType, value]);

  const handleClose = useCallback(() => {
    setValue(defaultValue);
    setAnchorEl(null);
  }, []);

  const handleChange = useCallback(evt => {
    evt.stopPropagation();
    const {value} = evt.target;

    setValue(value);
  }, []);

  const MenuProps = {
    PaperProps: {
      style: {
        marginTop: 35,
      },
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  return (
    <>
      <TextButton
        disabled={disabled}
        startIcon={<DebugIcon />}
        onClick={toggleClick}
        data-test="refreshResource">
        {debugUntil ? (
          <TimeAgo date={debugUntil} formatter={formatter} style={{marginLeft: 0 }} />
        ) : 'Start debug'}
      </TextButton>
      <ArrowPopper
        disabled={disabled}
        open={!!anchorEl}
        anchorEl={anchorEl}
        preventOverflow={false}
        placement="bottom-end"
        onClose={toggleClick}>
        <Box display="flex" flexDirection="column" sx={{padding: 2}}>
          <div className={classes.filter}>
            <div className={classes.wrapper}>
              <div className={classes.row}>
                <InputLabel className={classes.formLabel}>
                  Start debug log level for:
                </InputLabel>
                <FormControl variant="standard" className={classes.formControl}>

                  <CeligoSelect
                    data-test="selectDebugInterval"
                    className={classes.dropdown}
                    onChange={handleChange}
                    value={value || ''}
                    MenuProps={MenuProps}
                  >
                    {debugOptions.map(opt => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </CeligoSelect>
                </FormControl>

              </div>
            </div>
            <div className={classes.actions}>
              <ActionGroup>
                <OutlinedButton onClick={handleSave}>
                  Apply
                </OutlinedButton>
                <TextButton onClick={handleClose}>
                  Cancel
                </TextButton>
              </ActionGroup>
            </div>
          </div>
        </Box>
      </ArrowPopper>
    </>
  );
}
