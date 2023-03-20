import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { MenuItem, InputLabel, FormControl} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import moment from 'moment';
import TimeAgo from 'react-timeago';
import { useSelector, shallowEqual } from 'react-redux';
import { selectors } from '../../reducers';
import ArrowPopper from '../ArrowPopper';
import CeligoSelect from '../CeligoSelect';
import DebugIcon from '../icons/DebugIcon';
import CancelIcon from '../icons/CancelIcon';
import {TextButton, OutlinedButton} from '../Buttons/index';
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
    display: 'flex',
    flexDirection: 'column',
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
  dateRangePopper: {
    zIndex: 1300,
    left: '45px !important',
    top: '5px !important',
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
  debugButton: {
    marginRight: '0px !important',
  },
  stopDebugButton: {
    '& > * svg': {
      fontSize: 18,
    },
  },
  dateRangePopperArrow: {
    left: '110px !important',
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

  return <>
    <TextButton
      disabled={disabled}
      onClick={toggleClick}
      startIcon={<DebugIcon />}
      className={classes.debugButton}
      data-test="refreshResource">
      {activeDebugUntil ? (
        <TimeAgo date={activeDebugUntil} formatter={formatter} style={{marginLeft: 0 }} />
      ) : 'Start debug'}
    </TextButton>

    {!!activeDebugUntil && (
    <TextButton
      disabled={disabled}
      startIcon={<CancelIcon />}
      className={clsx(classes.debugButton, classes.stopDebugButton)}
      onClick={handleStopDebug} >
      Stop debug
    </TextButton>
    )}
    <ArrowPopper
      disabled={disabled}
      open={!!anchorEl}
      anchorEl={anchorEl}
      restrictToParent={false}
      classes={{
        popper: classes.dateRangePopper,
        arrow: classes.dateRangePopperArrow,
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
        </div>
      )}
    </ArrowPopper>
  </>;
}

StartDebugEnhanced.propTypes = {
  resourceId: PropTypes.string.isRequired,
  resourceType: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  startDebugHandler: PropTypes.func,
  stopDebugHandler: PropTypes.func,
};
