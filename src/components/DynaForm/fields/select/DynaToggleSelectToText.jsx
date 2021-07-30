import { makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import DynaText from '../DynaText';
import DynaSelect from '../DynaSelect';
import { OutlinedButton } from '../../../Buttons';

const useStyles = makeStyles(theme => ({
  dynaToggleTextWrapper: {
    flexDirection: 'row !important',
    display: 'flex',
  },
  dynabtn: {
    marginTop: 26,
    whiteSpace: 'nowrap',
    marginLeft: theme.spacing(1),
  },
}));

export default function DynaToggleSelectToText(props) {
  const classes = useStyles();
  const { isTextComponent } = props;
  const [isText, setIsText] = useState(isTextComponent);
  const { textHrefLabel, selectHrefLabel, ...rest } = props;

  return (
    <div className={classes.dynaToggleTextWrapper}>
      {isText ? <DynaText {...rest} /> : <DynaSelect {...rest} />}
      <div className={classes.dynabtn}>
        <OutlinedButton
          color="secondary"
          onClick={() => setIsText(state => !state)}>
          {isText ? textHrefLabel : selectHrefLabel}
        </OutlinedButton>
      </div>
    </div>
  );
}
