import { Component } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import { Typography } from '@material-ui/core';

@withStyles(theme => ({
  button: {
    color: theme.palette.text.disabled,
    display: 'block',
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 6.5,
    '&:before': {
      // border: `solid ${theme.palette.text.secondary} 1px`,
      position: 'absolute',
      top: 0,
      left: '50%',
      marginLeft: -theme.spacing.triple,
      backgroundSize: theme.spacing.triple,
      padding: theme.spacing.triple,
      content: '""',
      backgroundColor: theme.appBar.iconBackground,
      // opacity: '0.6',
      borderRadius: '50%',
      backgroundImage: `url(${process.env.CDN_BASE_URI}icons/icon/flow.png)`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    },
    '&:hover': {
      color: theme.palette.text.primary,
    },
    '&:hover::before': {
      // opacity: '1',
      backgroundColor: theme.palette.secondary.light,
      // eslint-disable-next-line prettier/prettier
      backgroundImage: `url(${process.env.CDN_BASE_URI}icons/icon/flow-white.png)`,
    },
  },
}))
export default class WaffleButton extends Component {
  render() {
    const { classes, to, title, onClick } = this.props;

    return (
      <ButtonBase
        onClick={onClick}
        component={Link}
        to={to}
        className={classes.button}>
        <Typography color="inherit" variant="subtitle2">
          {title}
        </Typography>
      </ButtonBase>
    );
  }
}
