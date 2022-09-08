export default {
  fieldMap: {
    groupByFields: {
      fieldId: 'groupByFields',
      defaultValue: r => r.groupByFields,
      resourceSubType: 'rdbms',
      visibleWhenAll: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
    },
  },
  layout: { fields: ['groupByFields'] },
};
