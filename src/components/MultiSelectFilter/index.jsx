import { Button, FormControl, FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { isEqual } from 'lodash';
import React, { useCallback, useState } from 'react';
import ArrowPopper from '../ArrowPopper';
import ButtonGroup from '../ButtonGroup';
import ActionButton from '../ActionButton';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
  formControl: {
    wordBreak: 'break-word',

  },
  filter: {
    maxWidth: 250,
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
  multiSelectFilterPopper: {
    left: '110px !important',
    top: '5px !important',
  },
  multiSelectFilterPopperArrow: {
    left: '150px !important',
  },
}));

export default function MultiSelectFilter(props) {
  const { items = [], selected = [], onSave, Icon, onSelect } = props;
  const [initialValue, setInitialValue] = useState(selected);
  const [checked, setChecked] = useState(selected);
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();

  const toggleClick = useCallback(event => {
    if (anchorEl) {
      setChecked(initialValue);
    }
    setAnchorEl(state => (state ? null : event.currentTarget));
  }, [anchorEl, initialValue]);

  const handleSave = useCallback(() => {
    setInitialValue(checked);
    onSave && onSave(checked);
    setAnchorEl(null);
  }, [onSave, checked]);

  const handleClose = useCallback(() => {
    setChecked(initialValue);
    setAnchorEl(null);
  }, [initialValue]);

  const handleSelect = id => event => {
    event.stopPropagation();
    if (onSelect) {
      setChecked(checked => onSelect(checked, id));
    } else {
      setChecked(checked => {
        if (checked.includes(id)) {
          return checked.filter(i => i !== id);
        }

        return [...checked, id];
      });
    }
  };

  return (
    <>
      <ActionButton onClick={toggleClick}>
        <Icon />
      </ActionButton>
      <ArrowPopper
        open={!!anchorEl}
        anchorEl={anchorEl}
        placement="bottom-end"
        restrictToParent={false}
        classes={{
          popper: classes.multiSelectFilterPopper,
          arrow: classes.multiSelectFilterPopperArrow,
        }}
        onClose={toggleClick}>
        {anchorEl && (
          <div className={classes.dateRangePickerWrapper}>
            <div className={classes.filter}>
              <div className={classes.wrapper}>
                <FormControl component="fieldset" className={classes.formControl}>
                  <FormGroup className={classes.formGroup}>
                    {items.map(m => (
                      <FormControlLabel
                        className={classes.selectResourceItem}
                        control={(
                          <Checkbox
                            color="primary"
                            checked={checked.includes(m._id)}
                            onChange={handleSelect(m._id)}
                            value="required"
                            className={classes.selectResourceCheck}
                            />
                          )}
                        label={m.name}
                        key={m._id}
                        />
                    ))}

                  </FormGroup>
                </FormControl>
              </div>
              <div className={classes.actions}>
                <ButtonGroup>
                  <Button variant="outlined" color="primary" onClick={handleSave} disabled={isEqual(checked, selected)}>
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
