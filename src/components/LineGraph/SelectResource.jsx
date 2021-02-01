import { Button, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Tooltip } from '@material-ui/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import React, { useCallback, useState, useMemo } from 'react';
import ArrowPopper from '../ArrowPopper';
import ButtonGroup from '../ButtonGroup';

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
}));

export default function SelectResource(props) {
  const { flowResources = [], selectedResources = [], onSave, isFlow } = props;
  const [initalValue, setInitialValue] = useState(selectedResources);
  const [checked, setChecked] = useState(selectedResources);
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();

  const toggleClick = useCallback(event => {
    if (anchorEl) {
      setChecked(initalValue);
    }
    setAnchorEl(state => (state ? null : event.currentTarget));
  }, [anchorEl, initalValue]);

  const handleSave = useCallback(() => {
    setInitialValue(checked);
    onSave && onSave(checked);
    setAnchorEl(null);
  }, [onSave, checked]);

  const handleClose = useCallback(() => {
    setChecked(initalValue);
    setAnchorEl(null);
  }, [initalValue]);

  const buttonName = useMemo(() => {
    const filterChecked = Array.isArray(checked) ? checked.filter(item => flowResources.find(r => r._id === item)) : [];

    if (!checked || !filterChecked.length) {
      return 'No flows selected';
    }
    if (filterChecked.length === 1) {
      return flowResources.find(r => r._id === filterChecked[0])?.name;
    }

    return `${filterChecked.length} ${isFlow ? 'resources' : 'flows'} selected`;
  }, [checked, isFlow, flowResources]);

  const getTooltip = useCallback(id => {
    if (checked.includes(id) || isFlow || checked.length < 8) {
      return '';
    }

    return 'Only 8 flows can be selected at the same time';
  }, [checked, isFlow]);
  const handleFlowSelect = id => event => {
    event.stopPropagation();
    setChecked(checked => {
      if (checked.includes(id)) {
        return checked.filter(i => i !== id);
      }
      if (checked.length < 8 || isFlow) {
        return [...checked, id];
      }

      return checked;
    });
  };

  return (
    <>
      <Button
        onClick={toggleClick}
        variant="outlined"
        color="secondary"
        className={classes.dateRangePopperBtn}>
        {buttonName}
      </Button>
      <ArrowPopper
        open={!!anchorEl}
        anchorEl={anchorEl}
        placement="bottom-end"
        onClose={toggleClick}>
        {anchorEl && (
          <div className={classes.dateRangePickerWrapper}>
            <div className={classes.filter}>
              <div className={classes.wrapper}>
                <FormControl component="fieldset" className={classes.formControl}>
                  {!isFlow && (
                  <FormLabel component="legend" className={classes.heading}>
                    Select up to 8 flows
                  </FormLabel>
                  )}
                  <FormGroup className={classes.formGroup}>
                    {flowResources.map(m => (
                      <Tooltip data-public key={m._id} title={getTooltip(m._id)} placement="left-start">
                        <FormControlLabel
                          className={classes.selectResourceItem}
                          control={(
                            <Checkbox
                              color="primary"
                              checked={checked.includes(m._id)}
                              onChange={handleFlowSelect(m._id)}
                              value="required"
                              className={classes.selectResourceCheck}
                            />
                          )}
                          label={m.name}
                        />
                      </Tooltip>
                    ))}

                  </FormGroup>
                </FormControl>
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
