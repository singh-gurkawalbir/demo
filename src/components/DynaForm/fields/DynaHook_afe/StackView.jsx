/* eslint-disable camelcase */
import React, {useMemo} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import DynaSelect from '../DynaSelect';
import { selectors } from '../../../../reducers';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';

const useStyles = makeStyles(theme => ({
  field: {
    width: '50%',
    paddingRight: theme.spacing(1),
    overflow: 'hidden',
    '& >.MuiFormControl-root': {
      width: '100%',
    },
    '&:last-child': {
      paddingRight: 0,
    },
  },
}));

const stacksFilterConfig = { type: 'stacks' };
const emptyList = [];

export default function StackView({
  disabled,
  required,
  stackId,
  isValidHookField,
  handleFieldChange,
  dataPublic,
}) {
  const classes = useStyles();

  const allStacks = useSelectorMemo(
    selectors.makeResourceListSelector,
    stacksFilterConfig
  ).resources;

  const options = useMemo(() => [{ items: allStacks.map(stack => ({
    label: stack.name,
    value: stack._id,
  })) || emptyList }], [allStacks]);

  return (

    <div className={classes.field}>
      <FormControl>
        <InputLabel htmlFor="stackId">Stack</InputLabel>
        <DynaSelect
          id="stackId"
          label="Stacks"
          value={stackId}
          placeholder="None"
          disabled={disabled}
          dataPublic={dataPublic}
          required={required}
          isValid={isValidHookField('_stackId')}
          onFieldChange={handleFieldChange('_stackId')}
          options={options}
                />
      </FormControl>
    </div>
  );
}
