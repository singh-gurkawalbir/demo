import { Button, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import React, { useCallback, useState, useMemo } from 'react';
import ArrowPopper from '../ArrowPopper';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
  formControl: {
    margin: theme.spacing(2),
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
    background: theme.palette.background.default,
  },
  actions: {
    paddingBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  dateRangePopperBtn: {
    borderColor: theme.palette.secondary.lightest,
    minHeight: 38,
    color: theme.palette.secondary.light,
    fontFamily: 'source sans pro',
    fontSize: 15,
    '&:hover': {
      borderColor: theme.palette.secondary.lightest,
      color: theme.palette.secondary.light,
    },
  },
}));

export default function DateRangeSelector(props) {
  const { flowResources = [], selectedResources = [], onSave, isFlow } = props;
  const [checked, setChecked] = useState(selectedResources);
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();
  const toggleClick = useCallback(event => {
    if (anchorEl) {
      onSave(checked);
    }
    setAnchorEl(state => (state ? null : event.currentTarget));
  }, [anchorEl, checked, onSave]);

  const buttonName = useMemo(() => {
    if (!checked || !checked.length) {
      return 'No flows selected';
    }
    if (checked.length === 1) {
      return flowResources.find(r => r._id === checked[0])?.name;
    }

    return `${checked.length} ${isFlow ? 'resources' : 'flows'} selected`;
  }, [checked, isFlow, flowResources]);

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
                    Please select up to 8 flows
                  </FormLabel>
                  )}
                  <FormGroup className={classes.formGroup}>
                    {flowResources.map(m => (
                      <FormControlLabel
                        key={m.id}
                        control={(
                          <Checkbox
                            color="primary"
                            checked={checked.includes(m._id)}
                            onChange={handleFlowSelect(m._id)}
                            value="required"
                      />
                    )}
                        label={m.name}
                  />
                    ))}

                  </FormGroup>
                </FormControl>
              </div>
            </div>
          </div>
        )}
      </ArrowPopper>
    </>
  );
}
