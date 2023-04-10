import { FormLabel, FormControlLabel, Checkbox } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import React, { useCallback, useState, useMemo } from 'react';
import { ArrowPopper, Box } from '@celigo/fuse-ui';
import ActionGroup from '../ActionGroup';
import { OutlinedButton, TextButton, FilledButton } from '../Buttons';
import ArrowDownIcon from '../icons/ArrowDownIcon';

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
    maxHeight: 240,
    overflowY: 'auto',
    padding: theme.spacing(2),
    width: '100%',
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
    margin: theme.spacing(3, 1, 2),
  },
  dateRangePopperBtn: {
    minHeight: 36,
    padding: [[0, 12]],
    color: theme.palette.secondary.main,
    fontSize: 15,
    lineHeight: 2,
  },
  selectResourceItem: {
    display: 'flex',
    alignItems: 'flex-start',
    textTransform: 'capitalize',
  },
  selectResourceCheck: {
    marginTop: theme.spacing(-0.5),
    marginRight: theme.spacing(0.5),
  },
  headerLabel: {
    fontWeight: 'bold',
    fontSize: 14,
    '& > span': {
      fontWeight: 'bold',
    },
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    wordBreak: 'break-word',
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    marginBottom: theme.spacing(1),
  },
}));

const emptySet = [];
export default function SelectDependentResource({resources = emptySet, selectedResources = emptySet, onSave}) {
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
    const filterChecked = Array.isArray(checked) ? checked.filter(item => resources.find(r => r.id === item.id)) : [];

    if (!checked || !filterChecked.length) {
      return 'Step';
    }
    if (filterChecked.length === 1) {
      return resources.find(r => r.id === filterChecked[0].id)?.name;
    }

    return `${filterChecked.length} resources selected`;
  }, [checked, resources]);

  const handleResourceToggle = useCallback(event => {
    event.stopPropagation();
    let newVal = [...checked];

    if (newVal.find(({id}) => id === event.target.id)) {
      newVal = newVal.filter(({id}) => id !== event.target.id);
    } else {
      const resourceToAdd = resources.find(({id}) => id === event.target.id);

      newVal = [...newVal, resourceToAdd];
    }
    setChecked(newVal);
  }, [checked, resources]);
  const toggleAllSelection = useCallback(event => {
    event.stopPropagation();
    if (checked.length !== resources.length) {
      setChecked(resources);
    } else setChecked([]);
  }, [checked.length, resources]);

  return (
    <>
      <OutlinedButton
        onClick={toggleClick}
        color="secondary"
        endIcon={<ArrowDownIcon />}
        className={classes.dateRangePopperBtn}>
        {buttonName}
      </OutlinedButton>
      <ArrowPopper
        open={!!anchorEl}
        anchorEl={anchorEl}
        preventOverflow={false}
        placement="bottom-end"
        onClose={toggleClick}>
        <Box display="flex" flexDirection="column">
          <div className={classes.filter}>
            <div className={classes.wrapper}>
              <div className={classes.row}>
                <FormControlLabel
                  className={clsx(classes.selectResourceItem, classes.headerLabel)}
                  control={(
                    <Checkbox
                      color="primary"
                      checked={!!(checked?.length && checked?.length === resources?.length)}
                      onChange={toggleAllSelection}
                      value="required"
                      className={classes.selectResourceCheck}
                          />
                      )}
                  label="Type"
                    />
                <FormLabel className={classes.headerLabel}>Name</FormLabel>
              </div>
              {resources.map(m => (
                <div className={classes.row} key={m.id}>
                  <FormControlLabel
                    className={classes.selectResourceItem}
                    id={m.id}
                    name={m.id}
                    control={(
                      <Checkbox
                        color="primary"
                        checked={checked.some(({id}) => id === m.id)}
                        id={m.id}
                        onChange={handleResourceToggle}
                        value="required"
                        className={classes.selectResourceCheck}
                          />
                      )}
                    label={m.type}
                    />
                  <FormLabel className={classes.label}>{m.name}</FormLabel>
                </div>
              ))}
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
