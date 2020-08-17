import { ButtonGroup, Button, makeStyles } from '@material-ui/core';
import React, { useEffect, useCallback } from 'react';
import useFormContext from '../../../Form/FormContext';

const useStyles = makeStyles({
  buttonGroup: {
    flexDirection: 'row',
  },
});
const wrapIndex = 5;

export default function GroupedButton(props) {
  const {
    id,
    value,
    onFieldChange,
    clearFields,
    options,
    formKey,
  } = props;
  const form = useFormContext(formKey);
  const { fields } = form || {};
  const classes = useStyles();
  const finalValues =
    value.includes('/') || value.includes('*') ? [] : value && value.split(',');
  const handleChange = useCallback(
    item => () => {
      let res;

      if (finalValues.includes(item.value)) {
        res = finalValues.filter(val => val !== item.value);
      } else {
        res = [...finalValues, item.value];
      }

      onFieldChange(id, !res.length ? '*' : res.sort().join(','));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [finalValues, id, onFieldChange]
  );

  useEffect(() => {
    clearFields.forEach(id => {
      Object.values(fields).some(field => field.id === id) &&
        onFieldChange(id, '');
    });

    if (!finalValues.length) {
      onFieldChange(id, '*');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      {options &&
        options[0] &&
        options[0].items &&
        [...Array(parseInt(options[0].items.length / 5, 10) + 1).keys()].map(
          groupIndex => (
            <div key={groupIndex} className={classes.buttonGroup}>
              <ButtonGroup color="primary">
                {options &&
                  options[0].items
                    .filter(
                      (val, index) =>
                        index >= groupIndex * wrapIndex &&
                        index < (groupIndex + 1) * wrapIndex
                    )
                    .map(item => (
                      <Button
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
              </ButtonGroup>
            </div>
          )
        )}
    </>
  );
}
