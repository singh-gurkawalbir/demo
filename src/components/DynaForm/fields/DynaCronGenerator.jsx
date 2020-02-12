import { Fragment, useCallback, useState } from 'react';
import { Button } from '@material-ui/core';
import CronBuilder from '../../CronBuilder';
import DynaText from './DynaText';

export default function DynaCronGenerator(props) {
  const { onFieldChange, id, value } = props;
  const [reset, setReset] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onChange = useCallback(
    (value, touched) => onFieldChange(id, value, touched),
    [id, onFieldChange]
  );

  return (
    <Fragment>
      <div>
        <DynaText {...props} disabled />
        <Button
          onClick={() => {
            setReset(true);
            onChange('');
          }}>
          Reset
        </Button>
      </div>
      <CronBuilder
        reset={reset}
        setReset={setReset}
        value={value}
        onChange={onChange}
      />
    </Fragment>
  );
}
