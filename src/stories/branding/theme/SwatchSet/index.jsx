import React from 'react';
import { Typography } from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(3),
  },
  swatchSet: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  swatchContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: 150,
    width: 225,
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
    border: `solid 1px ${theme.palette.divider}`,
    borderRadius: theme.spacing(0.5),
    padding: 4,
  },
  swatch: {
    flexGrow: 1,
    borderRadius: theme.spacing(0.5),
    background: props => props.color || '',
    marginBottom: theme.spacing(1),
  },
  heading: {
    marginBottom: theme.spacing(1),
  },
  colorHex: {
    fontFamily: 'source sans pro semibold',
  },
}));

function Swatch(props) {
  const {colorName, color} = props;
  const classes = useStyles(props);

  return (
    <div className={classes.swatchContainer}>
      <div className={classes.swatch} />
      <div className={classes.swatchDetails}>
        <Typography>{colorName}</Typography>
        <Typography className={classes.colorHex}>{color}</Typography>
      </div>
    </div>
  );
}

export default function SwatchSet({name, colors, whitelist}) {
  const classes = useStyles();
  const colorNames = whitelist?.length ? whitelist : Object.keys(colors);

  return (
    <div className={classes.root}>
      <Typography variant="h4" className={classes.heading}>{name}</Typography>
      <div className={classes.swatchSet}>
        {
          colorNames.map(colorName => (
            <Swatch key={colorName} colorName={`${name} ${colorName}`} color={colors[colorName]} />
          ))
        }
      </div>
    </div>
  );
}
