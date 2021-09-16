import React from 'react';
import { makeStyles } from '@material-ui/core';

const path = 'https://www.celigo.com/wp-content/uploads/home-hero.svg';

const useStyles = makeStyles({
  heroImagesContainer: {
    background: `url(${path}) center center / 90% no-repeat`,
    padding: 16,
    height: '100%',
  },
});
export default function HeroImages() {
  const classes = useStyles();

  return (
    <div className={classes.heroImagesContainer}>
      {/* <iframe src="https://www.celigo.com/wp-content/uploads/home-hero.svg/" title="Celigo" /> */}
    </div>
  );
}
