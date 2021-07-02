import { Button, FormControl, FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import { isEqual } from 'lodash';
import React, { useCallback, useState } from 'react';
import ArrowPopper from '../ArrowPopper';
import ButtonGroup from '../ButtonGroup';
import ActionButton from '../ActionButton';
import ArrowDownIcon from '../icons/ArrowDownIcon';
import ArrowUpIcon from '../icons/ArrowUpIcon';
import ChildDetails from './ChildDetails';

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
    lineHeight: 2,
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
  multiSelectFilterPopper: {
    left: '110px !important',
    top: '5px !important',
  },
  multiSelectFilterPopperArrow: {
    left: '150px !important',
  },
  checkAction: {
    listStyle: 'none',
    // padding: 0,
    margin: 0,
    display: 'flex',
    // justifyContent: 'flex-start',
    '& li': {
      float: 'left',
      '&:empty': {
        marginLeft: 22,
      },
    },
  },
}));

export default function MultiSelectFilter(props) {
  const { items = [], selected = [], onSave, Icon, onSelect } = props;
  const [initialValue, setInitialValue] = useState(selected);
  const [checked, setChecked] = useState(selected);
  const [anchorEl, setAnchorEl] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const classes = useStyles();

  function handleExpandCollapseClick() {
    setExpanded(!expanded);
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
  const handleChildSelect = (id, parentId) => event => {
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
        return [...checked, id, parentId];
      }

      return [...checked, id];
    });
  };

  function RowIcon({expanded}) {
    return expanded ? <ArrowUpIcon /> : <ArrowDownIcon />;
  }

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
                      <>
                        <ul key={m._id} className={classes.checkAction}>
                          <li>
                            { m?.children?.length && (
                              <IconButton
                                data-test="toggleJobDetail"
                                className={classes.moreIcon}
                                onClick={handleExpandCollapseClick}>
                                <RowIcon expanded={expanded} childLoaded={m.children} />
                              </IconButton>
                          )}
                          </li>
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
                              label={m.name}
                              key={m._id} />
                          </li>
                        </ul>
                        {expanded && m.children && m.children.map(c => (
                          <ChildDetails
                            key={c._id} current={c} parentId={m._id} handleSelect={handleChildSelect}
                            checked={checked} />
                        ))}
                      </>
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
