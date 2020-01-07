import { Fragment, useCallback } from 'react';
import { Button } from '@material-ui/core';
import CronBuilder from '../../CronBuilder';
import DynaText from './DynaText';

export default function DynaCronGenerator(props) {
  const { onFieldChange, id, value } = props;
  const onChange = useCallback(value => onFieldChange(id, value), [
    id,
    onFieldChange,
  ]);

  return (
    <Fragment>
      <div>
        <DynaText {...props} disabled />
        <Button onClick={() => onChange('')}> Reset </Button>
      </div>
      <CronBuilder value={value} onChange={onChange} />
    </Fragment>
  );
}
