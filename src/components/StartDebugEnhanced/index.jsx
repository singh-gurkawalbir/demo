import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { MenuItem, InputLabel, FormControl} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import moment from 'moment';
import TimeAgo from 'react-timeago';
import { useSelector, shallowEqual } from 'react-redux';
import { ArrowPopper, Box, TextButton, OutlinedButton} from '@celigo/fuse-ui';
import { selectors } from '../../reducers';
import CeligoSelect from '../CeligoSelect';
import DebugIcon from '../icons/DebugIcon';
import CancelIcon from '../icons/CancelIcon';
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
  dateRangePickerWrapper: {
    padding: theme.spacing(2),
    minWidth: 224,
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
  lastDebug: {
    fontSize: '13px',
    lineHeight: '16px',
    marginTop: theme.spacing(1),
    color: theme.palette.secondary.light,
  },
}));

const MenuProps = {
  PaperProps: {
    style: {
      marginTop: 35,
    },
  },
};

const debugOptions = [
  { label: 'Next 15 minutes', value: '15' },
  { label: 'Next 30 minutes', value: '30' },
  { label: 'Next 45 minutes', value: '45' },
  { label: 'Next 60 minutes', value: '60' },
];

const getFormattedUnit = unit => {
  if (unit === 'second') {
    return 's';
  } if (unit === 'minute') {
    return 'm';
  }

  return unit;
};

const formatter = (value, unit, suffix) => {
  if (suffix === 'ago') {
    return 'Start debug';
  }

  return `${value}${getFormattedUnit(unit)} remaining`;
};
const lastRunFormatter = (value, unit, suffix, epochSeconds, nextFormatter) => {
  if (suffix === 'ago') {
    return `${value}${getFormattedUnit(unit)} ago`;
  }

  // we use the default formatter for all other units.
  return nextFormatter();
};

const defaultValue = 15;
export default function StartDebugEnhanced({
  resourceId,
  resourceType,
  disabled = false,
  startDebugHandler,
  stopDebugHandler,
}) {
  const [value, setValue] = useState(defaultValue);
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();
  const { activeDebugUntil, pastDebugUntil } = useSelector(state => {
    const resource = selectors.resource(state, resourceType, resourceId);
    const {debugUntil} = resource || {};

    if (!debugUntil) {
      return {};
    }
    if (moment().isAfter(moment(debugUntil))) {
      return {pastDebugUntil: debugUntil};
    }

    return {activeDebugUntil: debugUntil};
  }, shallowEqual);

  const toggleClick = useCallback(event => {
    if (anchorEl) {
      setValue(defaultValue);
    }
    setAnchorEl(state => (state ? null : event.currentTarget));
  }, [anchorEl]);

  const updateTimeHandler = useCallback(() => {
    startDebugHandler?.(value);

    setAnchorEl(null);
  }, [startDebugHandler, value]);

  const handleStopDebug = useCallback(() => {
    stopDebugHandler?.();
  }, [stopDebugHandler]);

  const handleClose = useCallback(() => {
    setValue(defaultValue);
    setAnchorEl(null);
  }, []);

  const handleChange = useCallback(evt => {
    evt.stopPropagation();
    setValue(evt.target.value);
  }, []);

  return (
    <>
      <TextButton
        disabled={disabled}
        onClick={toggleClick}
        startIcon={<DebugIcon />}
        sx={{
          mr: '0px !important',
        }}
        data-test="refreshResource">
        {activeDebugUntil ? (
          <TimeAgo date={activeDebugUntil} formatter={formatter} style={{marginLeft: 0 }} />
        ) : 'Start debug'}
      </TextButton>

      {!!activeDebugUntil && (
      <TextButton
        disabled={disabled}
        startIcon={<CancelIcon />}
        sx={{
          mr: '0px !important',
          '& > * svg': {
            fontSize: '18px',
          },
        }}
        onClick={handleStopDebug} >
        Stop debug
      </TextButton>
      )}
      <ArrowPopper
        disabled={disabled}
        open={!!anchorEl}
        anchorEl={anchorEl}
        preventOverflow={false}
        placement="bottom-end"
        onClose={toggleClick}>
        <Box display="flex" flexDirection="column" className={classes.dateRangePickerWrapper}>
          <div className={classes.filter}>
            <div className={classes.wrapper}>
              <div className={classes.row}>
                <InputLabel className={classes.formLabel}>
                  Capture debug logs:
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
                {!!pastDebugUntil && (
                <div className={classes.lastDebug}>
                  Last debug: <TimeAgo date={pastDebugUntil} formatter={lastRunFormatter} />
                </div>
                )}

              </div>
            </div>
            <div className={classes.actions}>
              <ActionGroup>
                <OutlinedButton onClick={updateTimeHandler}>
                  Apply
                </OutlinedButton>
                <TextButton onClick={handleClose}>
                  Close
                </TextButton>
              </ActionGroup>
            </div>
          </div>
        </Box>
      </ArrowPopper>
    </>
  );
}

StartDebugEnhanced.propTypes = {
  resourceId: PropTypes.string.isRequired,
  resourceType: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  startDebugHandler: PropTypes.func,
  stopDebugHandler: PropTypes.func,
};
