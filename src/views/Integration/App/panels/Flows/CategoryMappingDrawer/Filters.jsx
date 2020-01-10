import { useState, Fragment, useCallback } from 'react';
import {
  ClickAwayListener,
  makeStyles,
  Checkbox,
  Button,
  Grid,
} from '@material-ui/core';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ArrowPopper from '../../../../../../components/ArrowPopper';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(3),
  },
  filter: {
    maxWidth: '400px',
  },
}));

function Filters({
  amazonAttributes,
  fieldMappingFilter,
  handleAmazonAttributeChange,
  handleFieldMappingsFilterChange,
}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mappingFilter, setMappingFilter] = useState(fieldMappingFilter);
  const [attributes, setAttributes] = useState(amazonAttributes);
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
    if (mappingFilter !== e.target.value) setMappingFilter(e.target.value);
    handleFieldMappingsFilterChange(e.target.value);
  };

  const handleAttributeChange = name => event => {
    setAttributes({ ...attributes, [name]: event.target.checked });
    handleAmazonAttributeChange({
      ...attributes,
      [name]: event.target.checked,
    });
  };

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);
  const open = !!anchorEl;

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Fragment>
        <Button variant="text" onClick={handleMenu} className={classes.filter}>
          Filters
          {open ? <ExpandLess /> : <ExpandMore />}
        </Button>
        <ArrowPopper
          placement="bottom"
          id="categoryMappingFilters"
          open={open}
          anchorEl={anchorEl}>
          <div className={classes.filter}>
            <Grid container direction="row">
              <Grid item>
                <FormControl
                  component="fieldset"
                  className={classes.formControl}>
                  <FormLabel component="legend">Amazon attributes</FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={attributes.required}
                          onChange={handleAttributeChange('required')}
                          value="required"
                        />
                      }
                      label="Required"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={attributes.preferred}
                          onChange={handleAttributeChange('preferred')}
                          value="preferred"
                        />
                      }
                      label="Preferred"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={attributes.conditional}
                          onChange={handleAttributeChange('conditional')}
                          value="conditional"
                        />
                      }
                      label="Conditional"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={attributes.optional}
                          onChange={handleAttributeChange('optional')}
                          value="optional"
                        />
                      }
                      label="Optional"
                    />
                  </FormGroup>
                </FormControl>
              </Grid>
              <Grid item>
                <FormControl
                  component="fieldset"
                  className={classes.formControl}>
                  <FormLabel component="legend">Field mappings</FormLabel>
                  <RadioGroup
                    aria-label="mappings"
                    name="mappings"
                    value={mappingFilter}
                    onChange={handleChange}>
                    <FormControlLabel
                      value="all"
                      control={<Radio />}
                      label="All"
                    />
                    <FormControlLabel
                      value="mapped"
                      control={<Radio />}
                      label="Mapped"
                    />
                    <FormControlLabel
                      value="unmapped"
                      control={<Radio />}
                      label="Unmapped"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </div>
        </ArrowPopper>
      </Fragment>
    </ClickAwayListener>
  );
}

export default Filters;
