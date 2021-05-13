import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(1),
  },
  swatchSet: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  swatchContainer: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    height: 150,
    width: 150,
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
    border: `solid 1px ${theme.palette.divider}`,
  },
  swatch: {
    flexGrow: 1,
    marginBottom: theme.spacing(0.5),
  },
}));

function Swatch({colorName, color}) {
  const classes = useStyles();

  return (
    <div className={classes.swatchContainer}>
      <div className={classes.swatch} style={{ backgroundColor: color}} />
      <Typography>{colorName}</Typography>
    </div>
  );
}

export default function SwatchSet({name, colors, whitelist}) {
  const classes = useStyles();
  const colorNames = whitelist?.length ? whitelist : Object.keys(colors);

  return (
    <div className={classes.root}>
      <Typography variant="h4">{name}</Typography>
      <div className={classes.swatchSet}>
        {
          colorNames.map(colorName => (
            <Swatch key={colorName} colorName={colorName} color={colors[colorName]} />
          ))
        }
      </div>
    </div>
  );
}
