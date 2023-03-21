import React, { useState, useCallback } from 'react';
import { Typography, makeStyles, Radio } from '@material-ui/core';
import RadioBtnUnselectedIcon from '../icons/RadioBtnUnselectedIcon';
import RadioBtnSelectedIcon from '../icons/RadioBtnSelectedIcon';
import CeligoTruncate from '../CeligoTruncate';

const useStyles = makeStyles(theme => ({
  apiListWrapper: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: theme.spacing(2),
  },
  apiItem: {
    border: `1px solid ${theme.palette.secondary.lightest}`,
    cursor: 'pointer',
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(2),
  },
  apiTitle: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(0.5),
  },
  apiDescription:{
    height: theme.spacing(7), // for content height
  },
  apiRadio: {
    width: 18,
    marginTop: theme.spacing(1),
    color: theme.palette.secondary.contrastText,
    '&:hover': {
      color: theme.palette.text.hint,
    },
    '& svg': {
      fontSize: 24,
    },
  },
}));

export default function MultiApiSelect({ items, value: val, onClick}) {
  const classes = useStyles();
  const [value, setValue] = useState(val);

  const handleClick = useCallback(e => {
    setValue(e.target.value);
    onClick(e.target.value);
  }, [onClick]);

  if (!items || !items.length) {
    return null;
  }

  return (
    <div className={classes.apiListWrapper}>
      {items.map(({ id, description, name }) => (
        <div
          key={id}
          className={classes.apiItem}
          data-test={name}
          onChange={handleClick}>
          <Typography variant="body2" className={classes.apiTitle}>{name}</Typography>
          <Typography variant="subtitle2" component="div" className={classes.apiDescription}>
            <CeligoTruncate lines={3}>
              {description}
            </CeligoTruncate>
          </Typography>
          <Radio
            color="default"
            checked={value === id}
            className={classes.apiRadio}
            value={id}
            icon={<RadioBtnUnselectedIcon />}
            checkedIcon={<RadioBtnSelectedIcon />} />
        </div>
      ))}
    </div>
  );
}
