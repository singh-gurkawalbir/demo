import { Typography } from '@material-ui/core';
import { useState, Fragment } from 'react';
import DynaText from '../DynaText';
import DynaSelect from '../DynaSelect';

export default function DynaToggleSelectToText(props) {
  const [isText, setIsText] = useState(false);
  const { textHrefLabel, selectHrefLabel, ...rest } = props;

  return (
    <Fragment>
      {isText ? <DynaText {...rest} /> : <DynaSelect {...rest} />}
      <Typography onClick={() => setIsText(state => !state)}>
        {isText ? textHrefLabel : selectHrefLabel}
      </Typography>
    </Fragment>
  );
}
