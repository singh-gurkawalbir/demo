import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Tooltip } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback, useState, useMemo } from 'react';
import { ArrowPopper, Box } from '@celigo/fuse-ui';
import { emptyList } from '../../constants';
import ActionGroup from '../ActionGroup';
import { OutlinedButton, TextButton, FilledButton } from '../Buttons';

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
      borderColor: theme.palette.primary.main,
      color: theme.palette.secondary.dark,
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

  const validResources = useMemo(() => Array.isArray(checked) ? checked.filter(item => flowResources.find(r => r._id === item)) : emptyList,
    [checked, flowResources]);

  const buttonName = useMemo(() => {
    if (!checked || !validResources.length) {
      return 'No flows selected';
    }
    if (validResources.length === 1) {
      return flowResources.find(r => r._id === validResources[0])?.name;
    }

    return `${validResources.length} ${isFlow ? 'resources' : 'flows'} selected`;
  }, [checked, isFlow, flowResources, validResources]);

  const getTooltip = useCallback(id => {
    if (checked.includes(id) || isFlow || validResources.length < 8) {
      return '';
    }

    return 'Only 8 flows can be selected at the same time';
  }, [checked, isFlow, validResources]);
  const handleFlowSelect = id => event => {
    event.stopPropagation();
    setChecked(checked => {
      if (checked.includes(id)) {
        return validResources.filter(i => i !== id);
      }
      if (validResources.length < 8 || isFlow) {
        return [...validResources, id];
      }

      return checked;
    });
  };

  return (
    <>
      <OutlinedButton
        onClick={toggleClick}
        color="secondary"
        className={classes.dateRangePopperBtn}>
        {buttonName}
      </OutlinedButton>
      <ArrowPopper
        open={!!anchorEl}
        anchorEl={anchorEl}
        placement="bottom-end"
        onClose={toggleClick}>
        <Box display="flex" sx={{padding: 2}}>
          <div className={classes.filter}>
            <div className={classes.wrapper}>
              <FormControl variant="standard" component="fieldset" className={classes.formControl}>
                {!isFlow && (
                <FormLabel component="legend" className={classes.heading}>
                  Select up to 8 flows
                </FormLabel>
                )}
                <FormGroup className={classes.formGroup}>
                  {flowResources.map(m => (
                    <Tooltip key={m._id} title={getTooltip(m._id)} placement="left-start">
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
        </Box>
      </ArrowPopper>
    </>
  );
}
