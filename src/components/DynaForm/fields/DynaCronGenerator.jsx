import { Fragment, useCallback } from 'react';
import { Button } from '@material-ui/core';
import CronBuilder from '../../CronBuilder';
import DynaText from './DynaText';

export default function DynaCronGenerator(props) {
  const { onFieldChange, id, value } = props;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onChange = useCallback(value => onFieldChange(id, value), [id]);

  console.log('check val ', value);

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
