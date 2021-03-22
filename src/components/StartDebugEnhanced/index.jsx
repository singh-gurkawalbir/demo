import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, MenuItem, InputLabel, FormControl} from '@material-ui/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import TimeAgo from 'react-timeago';
import { useSelector, shallowEqual } from 'react-redux';
import { selectors } from '../../reducers';
import ArrowPopper from '../ArrowPopper';
import ButtonGroup from '../ButtonGroup';
import CeligoSelect from '../CeligoSelect';
import DebugIcon from '../icons/DebugIcon';
import CancelIcon from '../icons/CancelIcon';
import IconTextButton from '../IconTextButton';

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
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
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
  dateRangePopper: {
    zIndex: 1300,
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
  { label: 'Next 15 mins', value: '15' },
  { label: 'Next 30 mins', value: '30' },
  { label: 'Next 45 mins', value: '45' },
  { label: 'Next 60 mins', value: '60' },
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
  disabled,
  startDebugHandler,
  stopDebugHandler,
}) {
  const [value, setValue] = useState(defaultValue);
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();
  const { activeDebugUntil, pastDebugUntil } = useSelector(state => {
    const resource = selectors.resource(state, resourceType, resourceId);
    const {debugUntil} = resource;

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
    const {value} = evt.target;

    setValue(value);
  }, []);

  return (
    <>
      <IconTextButton
        disabled={disabled}
        onClick={toggleClick}
        data-test="refreshResource">
        <DebugIcon />
        {activeDebugUntil ? (
          <TimeAgo date={activeDebugUntil} formatter={formatter} style={{marginLeft: 0 }} />
        ) : 'Start debug'}
      </IconTextButton>
      {activeDebugUntil && (
      <IconTextButton
        onClick={handleStopDebug} >
        <CancelIcon />
        Stop debug
      </IconTextButton>
      )}
      <ArrowPopper
        disabled={disabled}
        open={!!anchorEl}
        anchorEl={anchorEl}
        restrictToParent={false}
        classes={{
          popper: classes.dateRangePopper,
        }}
        placement="bottom-end"
        onClose={toggleClick}>
        {anchorEl && (
          <div className={classes.dateRangePickerWrapper}>
            <div className={classes.filter}>
              <div className={classes.wrapper}>
                <div className={classes.row}>
                  <InputLabel className={classes.formLabel}>
                    Capture debug logs:
                  </InputLabel>
                  <FormControl className={classes.formControl}>

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
                  {pastDebugUntil && (
                    <div className={classes.lastDebug}>
                      Last debug: <TimeAgo date={pastDebugUntil} formatter={lastRunFormatter} />
                    </div>
                  )}

                </div>
              </div>
              <div className={classes.actions}>
                <ButtonGroup>
                  <Button variant="outlined" color="primary" onClick={updateTimeHandler}>
                    Apply
                  </Button>
                  <Button variant="text" color="primary" onClick={handleClose}>
                    Close
                  </Button>
                </ButtonGroup>
              </div>
            </div>
          </div>
        )}
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
