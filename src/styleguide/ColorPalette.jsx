import React, { Fragment } from 'react';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import colors from '../theme/colors';

// input: '#RRGGBB'
// output: 'rr, gg, bb'
const hexToRgb = hex => {
  const rgb = hex
    .replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (m, r, g, b) => `#${r}${r}${g}${g}${b}${b}`
    )
    .substring(1)
    .match(/.{2}/g)
    .map(x => parseInt(x, 16));

  return rgb.join(', ');
};

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: '20px',
    '& div': {
      marginRight: theme.spacing(8),
      color: colors.celigoNeutral6,
      '& div': {
        borderRadius: '4px',
        width: 100,
        height: 100,
      },
      '& ul': {
        listStyle: 'none',
        padding: 0,
        color: colors.celigoNeutral6,
        '& li': {
          lineHeight: '24px',
          textTransform: 'capitalize',
          fontWeight: 400,
          '& span': {
            paddingRight: theme.spacing(1) - 3,
            fontWeight: 600,
            textTransform: 'uppercase',
          },
        },
      },
    },
  },
  title: {
    marginBottom: '20px ',
  },
});
const other = {
  celigoWhite: colors.celigoWhite,
  celigoError: colors.celigoError,
  celigoSuccess: colors.celigoSuccess,
  celigoWarning: colors.celigoWarning,
};
const accent = {
  celigoAccent1: colors.celigoAccent1,
  celigoAccent2: colors.celigoAccent2,
  celigoAccent3: colors.celigoAccent3,
  celigoAccent4: colors.celigoAccent4,
};
const neutral = {
  celigoNeutral1: colors.celigoNeutral1,
  celigoNeutral2: colors.celigoNeutral2,
  celigoNeutral3: colors.celigoNeutral3,
  celigoNeutral4: colors.celigoNeutral4,
  celigoNeutral5: colors.celigoNeutral5,
  celigoNeutral6: colors.celigoNeutral6,
  celigoNeutral7: colors.celigoNeutral7,
  celigoNeutral8: colors.celigoNeutral8,
};
const Tiles = ({ colors }) =>
  Object.keys(colors).map(key => (
    <div key={key}>
      <div style={{ backgroundColor: colors[key] }} />
      <ul>
        <li>
          <span>NAME:</span> {key}
        </li>
        <li>
          <span>HEX:</span> {colors[key]}
        </li>
        <li>
          <span>RGB:</span> {hexToRgb(colors[key])}
        </li>
      </ul>
    </div>
  ));

function ColorPalette(props) {
  const { classes } = props;

  return (
    <Fragment>
      <Typography variant="h3" className={classes.title}>
        Celigo Accent Colors
      </Typography>
      <div className={classes.root}>
        <Tiles colors={accent} />
      </div>
      <Typography variant="h3" className={classes.title}>
        Celigo Neutral Colors
      </Typography>
      <div className={classes.root}>
        <Tiles colors={neutral} />
      </div>
      <Typography variant="h3" className={classes.title}>
        Celigo Other Colors
      </Typography>
      <div className={classes.root}>
        <Tiles colors={other} />
      </div>
    </Fragment>
  );
}

export default withStyles(styles)(ColorPalette);
