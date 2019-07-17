import React, { Fragment } from 'react';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import colors from '../theme/colors';
import colorTiles from '../theme/colorstile';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: '20px',
    '& div': {
      marginRight: theme.spacing.quad * 2,
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
            paddingRight: theme.spacing.unit - 3,
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
const onClick = 'https://www.google.com';
const children = 'click to View Google page';

function ButtonNew({ onClick, children }) {
  return (
    <button onClick={onClick} type="button">
      {children}
    </button>
  );
}

ButtonNew(onClick, children);

const [{ celigoAccent }, { celigoNeutral }, { celigoOthers }] = colorTiles;
const celigoAccentColors = celigoAccent.map(item => (
  <div key={item.id}>
    <div
      style={{
        backgroundColor: item.hex,
      }}
    />
    <ul>
      <li key={item.name}>
        <span>NAME:</span> {item.name}
      </li>
      <li key={item.hex}>
        <span>HEX:</span> {item.hex}
      </li>
      <li key={item.rgb}>
        <span>RGB:</span> {item.rgb}
      </li>
    </ul>
  </div>
));
const celigoNeutralColors = celigoNeutral.map(item => (
  <div key={item.id}>
    <div
      style={{
        backgroundColor: item.hex,
      }}
    />
    <ul>
      <li key={item.name}>
        <span>NAME:</span> {item.name}
      </li>
      <li key={item.hex}>
        <span>HEX:</span> {item.hex}
      </li>
      <li key={item.rgb}>
        <span>RGB:</span> {item.rgb}
      </li>
    </ul>
  </div>
));
const celigoOtherColors = celigoOthers.map(item => (
  <div key={item.id}>
    <div style={{ backgroundColor: item.hex }} />
    <ul>
      <li key={item.name}>
        <span>NAME:</span> {item.name}
      </li>
      <li key={item.hex}>
        <span>HEX:</span> {item.hex}
      </li>
      <li key={item.rgb}>
        <span>RGB:</span> {item.rgb}
      </li>
    </ul>
  </div>
));

function CreateColorTile(props) {
  const { classes } = props;

  return (
    <Fragment>
      <Typography variant="h3" className={classes.title}>
        Celigo Accent Colors
      </Typography>
      <div className={classes.root} key="first">
        {celigoAccentColors}
      </div>
      <Typography variant="h3" className={classes.title}>
        Celigo Neutral Colors
      </Typography>
      <div className={classes.root} key="second">
        {celigoNeutralColors}
      </div>
      <Typography variant="h3" className={classes.title}>
        Celigo Other Colors
      </Typography>
      <div className={classes.root} key="third">
        {celigoOtherColors}
      </div>
    </Fragment>
  );
}

export default withStyles(styles)(CreateColorTile);
