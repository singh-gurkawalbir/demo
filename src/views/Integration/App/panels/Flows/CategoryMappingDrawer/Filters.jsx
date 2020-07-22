import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  ClickAwayListener,
  makeStyles,
  Checkbox,
  Button,
  FormGroup,
  FormLabel,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import actions from '../../../../../../actions';
import * as selectors from '../../../../../../reducers';
import ArrowPopper from '../../../../../../components/ArrowPopper';
import ArrowUpIcon from '../../../../../../components/icons/ArrowUpIcon';
import ArrowDownIcon from '../../../../../../components/icons/ArrowDownIcon';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(2),
    wordBreak: 'break-word',
  },
  filter: {
    maxWidth: '350px',
  },
  wrapper: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
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
}));

function Filters({ integrationId, flowId, uiAssistant }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const { attributes = {}, mappingFilter = 'mapped' } =
    useSelector(state =>
      selectors.categoryMappingFilters(state, integrationId, flowId)
    ) || {};
  const handleMenu = useCallback(
    event => {
      if (anchorEl) {
        setAnchorEl(null);
      } else {
        setAnchorEl(event.currentTarget);
      }
    },
    [anchorEl]
  );
  const handleChange = e => {
    dispatch(
      actions.integrationApp.settings.setCategoryMappingFilters(
        integrationId,
        flowId,
        { mappingFilter: e.target.value }
      )
    );
  };

  const handleAttributeChange = name => event => {
    dispatch(
      actions.integrationApp.settings.setCategoryMappingFilters(
        integrationId,
        flowId,
        {
          attributes: {
            ...attributes,
            [name]: event.target.checked,
          },
        }
      )
    );
  };

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);
  const open = !!anchorEl;

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <>
        <Button variant="text" onClick={handleMenu} className={classes.filter}>
          Filters
          {open ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </Button>
        <ArrowPopper
          placement="bottom"
          id="categoryMappingFilters"
          open={open}
          anchorEl={anchorEl}>
          <div className={classes.filter}>
            <div className={classes.wrapper}>
              <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend" className={classes.heading}>
                  {`${uiAssistant} attributes`}
                </FormLabel>
                <FormGroup className={classes.formGroup}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={!!attributes.required}
                        onChange={handleAttributeChange('required')}
                        value="required"
                      />
                    }
                    label="Required"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={!!attributes.preferred}
                        onChange={handleAttributeChange('preferred')}
                        value="preferred"
                      />
                    }
                    label="Preferred"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={!!attributes.conditional}
                        onChange={handleAttributeChange('conditional')}
                        value="conditional"
                      />
                    }
                    label="Conditional"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={!!attributes.optional}
                        onChange={handleAttributeChange('optional')}
                        value="optional"
                      />
                    }
                    label="Optional"
                  />
                </FormGroup>
              </FormControl>

              <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend" className={classes.heading}>
                  Field mappings
                </FormLabel>
                <RadioGroup
                  aria-label="mappings"
                  name="mappings"
                  value={mappingFilter}
                  onChange={handleChange}
                  className={classes.formGroup}>
                  <FormControlLabel
                    value="all"
                    control={<Radio color="primary" />}
                    label="All"
                  />
                  <FormControlLabel
                    value="mapped"
                    control={<Radio color="primary" />}
                    label="Mapped"
                  />
                  <FormControlLabel
                    value="unmapped"
                    control={<Radio color="primary" />}
                    label="Unmapped"
                  />
                </RadioGroup>
              </FormControl>
            </div>
          </div>
        </ArrowPopper>
      </>
    </ClickAwayListener>
  );
}

export default Filters;
