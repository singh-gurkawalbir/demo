import { Button, makeStyles } from '@material-ui/core';
import React, { useCallback } from 'react';

const useStyles = makeStyles(theme => ({
  groupedButton: {
    padding: theme.spacing(1),
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  button: {
    padding: theme.spacing(1),
    borderRadius: '0px',
  },
}));
const wrapIndex = 5;

export const splitGroupedValuesAr = value => !value || value.includes('/') || value.includes('*') ? [] : value && value.split(',');
export default function GroupedButton(props) {
  const {
    value,
    onFieldChange,
    options,
    // formKey,
  } = props;
  //   const fields = useFormContext(formKey)?.fields;
  const classes = useStyles();
  const finalValues = splitGroupedValuesAr(value);
  const handleChange = useCallback(
    item => () => {
      let res;

      if (finalValues.includes(item.value)) {
        res = finalValues.filter(val => val !== item.value);
      } else {
        res = [...finalValues, item.value];
      }

      onFieldChange(!res.length ? '*' : res.sort().join(','));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [finalValues, onFieldChange]
  );

  return (
    <div className={classes.groupedButton}>
      {options &&
        options[0] &&
        options[0].items &&
        [...Array(parseInt(options[0].items.length / 5, 10) + 1).keys()].map(
          groupIndex => (
            <div key={groupIndex} className={classes.buttonGroup}>
              <>
                {options &&
                  options[0].items
                    .filter(
                      (val, index) =>
                        index >= groupIndex * wrapIndex &&
                        index < (groupIndex + 1) * wrapIndex
                    )
                    .map(item => (
                      <Button
                        className={classes.button}
                        key={item.label}
                        color="primary"
                        onClick={handleChange(item)}
                        variant={
                          finalValues.includes(item.value)
                            ? 'contained'
                            : 'text'
                        }>
                        {item.label}
                      </Button>
                    ))}
              </>
            </div>
          )
        )}
    </div>
  );
}
