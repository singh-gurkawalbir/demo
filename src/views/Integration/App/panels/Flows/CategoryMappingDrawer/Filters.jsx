import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  Checkbox,
  FormGroup,
  FormLabel,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { ArrowPopper } from '@celigo/fuse-ui';
import actions from '../../../../../../actions';
import { selectors } from '../../../../../../reducers';
import ArrowUpIcon from '../../../../../../components/icons/ArrowUpIcon';
import ArrowDownIcon from '../../../../../../components/icons/ArrowDownIcon';
import useSelectorMemo from '../../../../../../hooks/selectors/useSelectorMemo';
import { TextButton } from '../../../../../../components/Buttons';

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

export default function Filters({ integrationId, flowId, uiAssistant }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const { attributes = {}, mappingFilter = 'mapped' } = useSelectorMemo(selectors.mkCategoryMappingFilters, integrationId, flowId) || {};
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
      actions.integrationApp.settings.categoryMappings.setFilters(
        integrationId,
        flowId,
        { mappingFilter: e.target.value }
      )
    );
  };

  const handleAttributeChange = name => event => {
    dispatch(
      actions.integrationApp.settings.categoryMappings.setFilters(
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
    <>
      <TextButton onClick={handleMenu} className={classes.filter}>
        Filters
        {open ? <ArrowUpIcon /> : <ArrowDownIcon />}
      </TextButton>
      <ArrowPopper
        placement="bottom"
        id="categoryMappingFilters"
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}>
        <div className={classes.filter}>
          <div className={classes.wrapper}>
            <FormControl variant="standard" component="fieldset" className={classes.formControl}>
              <FormLabel component="legend" className={classes.heading}>
                {`${uiAssistant} attributes`}
              </FormLabel>
              <FormGroup className={classes.formGroup}>
                <FormControlLabel
                  control={(
                    <Checkbox
                      color="primary"
                      checked={!!attributes.required}
                      onChange={handleAttributeChange('required')}
                      value="required"
                      />
                    )}
                  label="Required"
                  />
                <FormControlLabel
                  control={(
                    <Checkbox
                      color="primary"
                      checked={!!attributes.preferred}
                      onChange={handleAttributeChange('preferred')}
                      value="preferred"
                      />
                    )}
                  label="Preferred"
                  />
                <FormControlLabel
                  control={(
                    <Checkbox
                      color="primary"
                      checked={!!attributes.conditional}
                      onChange={handleAttributeChange('conditional')}
                      value="conditional"
                      />
                    )}
                  label="Conditional"
                  />
                <FormControlLabel
                  control={(
                    <Checkbox
                      color="primary"
                      checked={!!attributes.optional}
                      onChange={handleAttributeChange('optional')}
                      value="optional"
                      />
                    )}
                  label="Optional"
                  />
              </FormGroup>
            </FormControl>

            <FormControl variant="standard" component="fieldset" className={classes.formControl}>
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
  );
}
