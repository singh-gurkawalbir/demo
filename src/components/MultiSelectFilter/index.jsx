import { FormControl, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import makeStyles from '@mui/styles/makeStyles';
import { isEqual } from 'lodash';
import React, { useCallback, useState, useMemo } from 'react';
import { ArrowPopper, Box } from '@celigo/fuse-ui';
import ActionButton from '../ActionButton';
import ArrowDownIcon from '../icons/ArrowDownIcon';
import ArrowUpIcon from '../icons/ArrowUpIcon';
import ChildDetails from './ChildDetails';
import { TextButton, FilledButton } from '../Buttons';
import ActionGroup from '../ActionGroup';
import OutlinedButton from '../Buttons/OutlinedButton';

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
  moreIcon: {
    marginTop: -theme.spacing(1),
  },
  heading: {
    fontWeight: 'bold',
    color: theme.palette.secondary.light,
    marginBottom: 5,
  },
  formGroup: {
    maxHeight: 380,
    overflowY: 'auto',
    display: 'unset',
    '& > label': {
      width: '100%',
    },
  },
  child: {
    flexBasis: '100%',
  },
  dateRangePickerWrapper: {
    padding: theme.spacing(2),
    maxWidth: 600,
    '&>div': {
      maxWidth: 'inherit',
    },
  },
  dateRangePopperBtn: {
    borderColor: theme.palette.secondary.lightest,
    minHeight: 36,
    color: theme.palette.secondary.main,
    fontFamily: 'source sans pro',
    fontSize: 15,
    justifyContent: 'space-between',
    '&:hover': {
      borderColor: theme.palette.primary.main,
      color: theme.palette.secondary.dark,
    },
  },
  actions: {
    marginTop: theme.spacing(2),
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
  checkAction: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    // justifyContent: 'flex-start',
    '& li:first-child': {
      minWidth: 30,
    },
    '& li': {
      maxWidth: 'calc(100% - 30px)',
    },
    '& li:only-child': {
      maxWidth: '100%',
    },
  },
}));

export default function MultiSelectFilter({ items = [], selected = [], onSave, Icon, onSelect, SelectedLabelImp, ButtonLabel, disabled}) {
  const [initialValue, setInitialValue] = useState(selected);
  const [checked, setChecked] = useState(selected);
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();
  const isChildExists = items?.find(i => i.children);

  const initialExpandedState = useMemo(() => {
    const initialState = {};
    let nodeExpanded;

    items.forEach(i => {
      nodeExpanded = false;
      if (i.children) {
        i.children.forEach(c => {
          if (selected.includes(c._id)) {
            nodeExpanded = true;
          }
        });
        initialState[i._id] = nodeExpanded;
      }
    });

    return initialState;
  }, [items, selected]);

  const [expanded, setExpanded] = useState(initialExpandedState);

  function handleExpandCollapseClick(newNode) {
    const result = {...expanded, [newNode]: !expanded[newNode]};

    setExpanded(result);
  }

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
  const handleChildSelect = useCallback((id, parentId) => event => {
    event.stopPropagation();

    setChecked(checked => {
      if (checked.includes(id)) {
        if (checked.includes(parentId)) {
          return checked.filter(i => i !== id && i !== parentId);
        }

        return checked.filter(i => i !== id);
      }
      if (checked.includes(parentId)) {
        return [...checked, id];
      }
      const parent = items.find(i => i._id === parentId);
      let allChildsSelected = true;

      parent?.children?.forEach(c => {
        if (c._id !== id && !checked.includes(c._id)) { allChildsSelected = false; }
      });

      if (allChildsSelected && parent?.children) {
        return [...checked, id, parentId].filter(c => c !== 'all');
      }

      return [...checked, id].filter(c => c !== 'all');
    });
  }, [items]);

  function RowIcon({expanded, node}) {
    return expanded[node] ? <ArrowUpIcon /> : <ArrowDownIcon />;
  }

  return (
    <>
      {ButtonLabel ? (
        <OutlinedButton
          disabled={disabled}
          onClick={toggleClick}
          endIcon={<ArrowDownIcon />}
          color="secondary"
          className={classes.dateRangePopperBtn}>
          {ButtonLabel}
        </OutlinedButton>
      ) : (
        <ActionButton disabled={disabled} onClick={toggleClick}>
          <Icon />
        </ActionButton>
      )}
      <ArrowPopper
        open={!!anchorEl}
        anchorEl={anchorEl}
        placement="bottom"
        preventOverflow={false}
        onClose={toggleClick}>
        {anchorEl && (
        <Box display="flex" flexDirection="column" className={classes.dateRangePickerWrapper}>
          <div className={classes.filter}>
            <div className={classes.wrapper}>
              <FormControl variant="standard" component="fieldset" className={classes.formControl}>
                <FormGroup className={classes.formGroup}>
                  {items.map(m => (
                    <ul key={m._id} className={classes.checkAction}>
                      {isChildExists && (
                      <li>
                        { m?.children?.length > 0 && (
                        <IconButton
                          data-test="toggleJobDetail"
                          className={classes.moreIcon}
                          size="small"
                          onClick={() => { handleExpandCollapseClick(m._id); }}>
                          <RowIcon expanded={expanded} node={m._id} />
                        </IconButton>
                        )}
                      </li>
                      )}
                      <li>
                        <FormControlLabel
                          className={classes.selectResourceItem}
                          control={(
                            <Checkbox
                              color="primary"
                              checked={checked.includes(m._id)}
                              onChange={handleSelect(m._id)}
                              value="required"
                              className={classes.selectResourceCheck} />
                                )}
                          label={SelectedLabelImp ? <SelectedLabelImp name={m.name} id={m._id} /> : m.name}
                          key={m._id} />
                        {expanded[m._id] && m.children && m.children.map(c => (
                          <ChildDetails
                            key={c._id} current={c} parentId={m._id} handleSelect={handleChildSelect}
                            checked={checked} />
                        ))}
                      </li>
                    </ul>
                  ))}
                </FormGroup>
              </FormControl>
            </div>
            <div className={classes.actions}>
              <ActionGroup>
                <FilledButton onClick={handleSave} disabled={isEqual(checked, initialValue)}>
                  Apply
                </FilledButton>
                <TextButton onClick={handleClose}>
                  Cancel
                </TextButton>
              </ActionGroup>
            </div>
          </div>
        </Box>
        )}
      </ArrowPopper>
    </>
  );
}
