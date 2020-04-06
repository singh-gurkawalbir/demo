import { checkConditions } from '.';

export const noneAreTrue = ({ value, allFields, message, conditions }) => {
  const allConditionsPass = conditions.some(condition =>
    checkConditions(condition, value, allFields, 'some')
  );

  return allConditionsPass ? message : undefined;
};

export const someAreTrue = ({ value, allFields, message, conditions }) => {
  const allConditionsPass = conditions.some(condition =>
    checkConditions(condition, value, allFields, 'some')
  );

  return allConditionsPass ? undefined : message;
};

export const allAreTrue = ({ value, allFields, message, conditions }) => {
  const allConditionsPass = conditions.every(condition =>
    checkConditions(condition, value, allFields, 'all')
  );

  return allConditionsPass ? undefined : message;
};
