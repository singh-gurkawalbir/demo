import React from 'react';
import { useTheme, makeStyles, Typography } from '@material-ui/core';

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
  },
}));

const SwatchSet = ({name, colors}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h4">{name}</Typography>
      <div className={classes.swatchSet}>
        {
        Object.keys(colors).map(colorName => (
          <div key={colorName} className={classes.swatchContainer}>
            <div className={classes.swatch} style={{ backgroundColor: colors[colorName]}} />
            <Typography>{colorName}</Typography>
          </div>
        ))
      }
      </div>
    </div>
  );
};

export default function PaletteSwatch() {
  const theme = useTheme();

  return (
    <>
      <Typography variant="h3">Celigo Theme</Typography>
      <SwatchSet name="Primary" colors={theme.palette.primary} />
      <SwatchSet name="Secondary" colors={theme.palette.secondary} />
      <SwatchSet name="Background" colors={theme.palette.background} />
      <SwatchSet name="Text" colors={theme.palette.text} />
      <SwatchSet name="Info" colors={theme.palette.info} />
      <SwatchSet name="Error" colors={theme.palette.error} />
      <SwatchSet name="Warning" colors={theme.palette.warning} />
      <SwatchSet name="Success" colors={theme.palette.success} />
    </>
  );
}
