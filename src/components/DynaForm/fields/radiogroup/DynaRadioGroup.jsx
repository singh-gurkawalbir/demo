import React from 'react';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import {
  FormControlLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
} from '@mui/material';
import FieldMessage from '../FieldMessage';
import RawHtml from '../../../RawHtml';
import WarningIcon from '../../../icons/WarningIcon';
import FieldHelp from '../../FieldHelp';
import isLoggableAttr from '../../../../utils/isLoggableAttr';

const useStyles = makeStyles(theme => ({
  columnFlexWrapper: {
    flexDirection: 'column',
  },
  radioGroupWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  warningLabelWrapper: {
    display: 'flex',
  },
  warning: {
    color: theme.palette.warning.main,
    height: theme.spacing(2),
  },
  radioGroupWrapperLabel: {
    display: 'flex',
    marginBottom: theme.spacing(0.5),
  },
  radioGroup: {
    flexDirection: 'column',
    '& label': {
      marginLeft: 0,
      marginRight: theme.spacing(3),
      fontSize: 14,
      marginBottom: theme.spacing(0.5),
    },
  },
  radioGroupLabel: {
    marginBottom: 0,
    marginRight: theme.spacing(0.5),
    fontSize: 14,
    '&:last-child': {
      marginRight: theme.spacing(0.5),
    },
    '&:empty': {
      display: 'none',
    },
    '&.Mui-focused': {
      color: 'inherit',
    },
  },
}));

const HTML_SPACING = '&#160&#160';

export default function DynaRadio(props) {
  const {
    id,
    name,
    options = [],
    defaultValue,
    required,
    value,
    disabled,
    className,
    // use showOptionsVertically to render vertically
    showOptionsVertically,
    label,
    isValid,
    onFieldChange,
    isLoggable,
  } = props;

  const classes = useStyles();

  const getLabel = item => {
    const customLabel = `${item.label}${HTML_SPACING}`;

    return (
      <div className={classes.warningLabelWrapper}>
        <RawHtml html={customLabel} options={{allowedTags: ['a', 'u'], escapeUnsecuredDomains: true}} />
        <span className={classes.warningLabelWrapper}>
          { item.isWarningMessage && <WarningIcon data-test="warningIcon" className={classes.warning} /> }
          <RawHtml data-test="description" html={item.description} options={{allowedTags: ['a', 'u'], escapeUnsecuredDomains: true}} />
        </span>
      </div>
    );
  };

  const items = options.reduce(
    (itemsSoFar, option) =>
      itemsSoFar.concat(
        option.items.map(item => {
          if (typeof item === 'string') {
            return (
              <FormControlLabel
                key={item}
                value={item}
                control={<Radio color="primary" />}
                label={item}
              />
            );
          }

          return (
            <FormControlLabel
              key={item.value}
              value={item.value}
              data-test={item.value}
              control={<Radio color="primary" />}
              label={item.description ? getLabel(item) : (item.label || item.value)}
            />
          );
        })
      ),
    []
  );

  return (
    <div>
      <FormControl variant="standard" component="fieldset" disabled={disabled}>
        <div className={clsx(classes.radioGroupWrapper, className)}>

          <div className={classes.radioGroupWrapperLabel}>
            <FormLabel
              required={required}
              error={!isValid}
              className={classes.radioGroupLabel}>
              {label ? `${label}` : ''}
            </FormLabel>
            <FieldHelp
              {...props}
            />
          </div>
          <RadioGroup
            {...isLoggableAttr(isLoggable)}
            data-test={id}
            aria-label={label}
            className={clsx(classes.radioGroup, {
              [classes.columnFlexWrapper]: showOptionsVertically,
            })}
            name={name}
            defaultValue={defaultValue}
            value={value}
            color="primary"
            onChange={evt => {
              onFieldChange(id, evt.target.value);
            }}>
            {items}
          </RadioGroup>

        </div>
      </FormControl>
      <FieldMessage {...props} />
    </div>
  );
}
