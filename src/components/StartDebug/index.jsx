import React, { useCallback, useState } from 'react';
import { MenuItem, InputLabel, FormControl} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import TimeAgo from 'react-timeago';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../actions';
import { selectors } from '../../reducers';
import ArrowPopper from '../ArrowPopper';

import CeligoSelect from '../CeligoSelect';
import DebugIcon from '../icons/DebugIcon';
import IconTextButton from '../IconTextButton';
import ActionGroup from '../ActionGroup';
import FilledButton from '../Buttons/FilledButton';
import TextButton from '../Buttons/TextButton';

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
      <IconTextButton
        disabled={disabled}
        onClick={toggleClick}
        data-test="refreshResource">
        <DebugIcon />
        {debugUntil ? (
          <TimeAgo date={debugUntil} formatter={formatter} style={{marginLeft: 0 }} />
        ) : 'Start debug'}
      </IconTextButton>
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
                    Start debug log level for:
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

                </div>
              </div>
              <div className={classes.actions}>
                <ActionGroup>
                  <FilledButton onClick={handleSave}>
                    Apply
                  </FilledButton>
                  <TextButton onClick={handleClose}>
                    Cancel
                  </TextButton>
                </ActionGroup>
              </div>
            </div>
          </div>
        )}
      </ArrowPopper>
    </>
  );
}
