import React, { useCallback, useState } from 'react';
import { Button, MenuItem, InputLabel, FormControl} from '@material-ui/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import TimeAgo from 'react-timeago';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../actions';
import { selectors } from '../../reducers';
import ArrowPopper from '../ArrowPopper';
import ButtonGroup from '../ButtonGroup';
import CeligoSelect from '../CeligoSelect';
import DebugIcon from '../icons/DebugIcon';
import IconTextButton from '../IconTextButton';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
  formControl: {
    wordBreak: 'break-word',

  },
  filter: {
    maxWidth: '350px',
  },
  wrapper: {
    display: 'grid',
    gridTemplateColumns: '1fr',
  },
  heading: {
    fontWeight: 'bold',
    color: theme.palette.secondary.light,
    marginBottom: 5,
  },
  formGroup: {
    maxHeight: 380,
    overflowY: 'auto',
    '& > label': {
      width: '100%',
    },
  },
  child: {
    flexBasis: '100%',
  },
  dateRangePickerWrapper: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
  },
  actions: {
    marginTop: theme.spacing(2),
  },
  dateRangePopperBtn: {
    borderColor: theme.palette.secondary.lightest,
    minHeight: 36,
    color: theme.palette.secondary.main,
    fontFamily: 'source sans pro',
    fontSize: 15,
    '&:hover': {
      borderColor: theme.palette.secondary.lightest,
      color: theme.palette.secondary.light,
    },
  },
  selectResourceItem: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(2),
    '& > .MuiFormControlLabel-label': {
      fontSize: theme.spacing(2),
    },
  },
  selectResourceCheck: {
    marginTop: theme.spacing(-0.5),
    marginRight: theme.spacing(0.5),
  },
  headerLabel: {

  },
  row: {
    display: 'flex',
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
const defaultValue = 15;
export default function StartDebug({ resourceId, resourceType}) {
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

  return (
    <>
      <IconTextButton
        onClick={toggleClick}
        data-test="refreshResource">
        <DebugIcon />
        {debugUntil ? (
          <TimeAgo date={debugUntil} formatter={formatter} />
        ) : 'Start debug'}
      </IconTextButton>
      <ArrowPopper
        open={!!anchorEl}
        anchorEl={anchorEl}
        placement="bottom-end"
        onClose={toggleClick}>
        {anchorEl && (
          <div className={classes.dateRangePickerWrapper}>
            <div className={classes.filter}>
              <div className={classes.wrapper}>
                <div className={classes.row}>
                  <FormControl className={classes.formControl}>
                    <InputLabel>
                      Start debug level for:
                    </InputLabel>

                    {/* <FormLabel className={classes.headerLabel}>Start debug level for:</FormLabel> */}
                    <CeligoSelect
                      data-test="selectDebugInterval"
                      className={classes.xyz}
                      onChange={handleChange}
                      value={value || ''}
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
                <ButtonGroup>
                  <Button variant="outlined" color="primary" onClick={handleSave}>
                    Apply
                  </Button>
                  <Button variant="text" color="primary" onClick={handleClose}>
                    Cancel
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
