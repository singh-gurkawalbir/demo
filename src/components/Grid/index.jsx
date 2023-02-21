import React, { useState, useCallback } from 'react';
import { Grid, Typography, makeStyles, Radio } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  wrapper: {
    width: '100%',
  },
  gridItem: {
    border: '1px solid',
    cursor: 'pointer',
    maxWidth: '238px',
    borderRadius: theme.spacing(0.5),
    borderColor: theme.palette.secondary.lightest,
    padding: theme.spacing(2),
    margin: theme.spacing(0, 1, 1, 0),
    textAlign: 'left',
  },
  name: {
    fontWeight: 'bold',
    fontFamily: 'source sans pro semibold',
  },
  description: {
    maxHeight: '75px',
    overflowY: 'auto',
    padding: theme.spacing(1, 0),
    fontFamily: 'source sans pro',
    wordBreak: 'break-word',
  },
  radioSize: {
    '& svg': {
      fontSize: 24,
    },
  },
}));

export default function GridSelect({ items, value: val, onClick, rowSize = 3}) {
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
    <div className={clsx(classes.wrapper)}>
      <Grid container elevation={1}>
        {items.map(({ id, description, name }) => (
          <Grid
            item
            md={(12 / rowSize)}
            key={id}
            className={classes.gridItem}
            data-test={name}
            onChange={handleClick}
            >
            <Typography variant="subtitle2" className={classes.name}>{name}</Typography>
            <Typography variant="subtitle2" className={classes.description}>{description}</Typography>
            <Radio
              color="default"
              checked={value === id}
              className={classes.radioSize}
              value={id}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
