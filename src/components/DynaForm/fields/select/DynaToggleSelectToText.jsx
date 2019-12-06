import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { useState, Fragment } from 'react';
import DynaText from '../DynaText';
import DynaSelect from '../DynaSelect';

const useStyles = makeStyles({
  btnDelta: {
    marginTop: 5,
  },
});

export default function DynaToggleSelectToText(props) {
  const classes = useStyles();
  const { isTextComponent } = props;
  const [isText, setIsText] = useState(isTextComponent);
  const { textHrefLabel, selectHrefLabel, ...rest } = props;

  return (
    <Fragment>
      {isText ? <DynaText {...rest} /> : <DynaSelect {...rest} />}
      <Button
        variant="outlined"
        color="secondary"
        className={classes.btnDelta}
        onClick={() => setIsText(state => !state)}>
        {isText ? textHrefLabel : selectHrefLabel}
      </Button>
    </Fragment>
  );
}
