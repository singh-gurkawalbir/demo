
export function getFieldIdsInLayoutOrder(layout) {
  const fields = [];

  if (!layout) return fields;
  if (layout.fields?.length) {
    // add the fields in this layout to the list
    fields.push(...layout.fields);
  }
  if (layout.containers?.length) {
    // traverse through each container and fetch the fields
    layout.containers.forEach(container => {
      fields.push(...getFieldIdsInLayoutOrder(container));
    });
  }

  return fields;
}

export function removeFieldFromLayout(layout, fieldId) {
  if (!layout) return;
  if (layout.fields?.length) {
    if (layout.fields.includes(fieldId)) {
      const fieldIndex = layout.fields.indexOf(fieldId);

      layout.fields.splice(fieldIndex, 1);
    }
  }
  if (layout.containers?.length) {
    layout.containers.forEach(container => removeFieldFromLayout(container, fieldId));
  }
}

export function layoutHasField(layout, fieldId) {
  if (!layout) return false;
  if (layout.containers?.length) {
    return layout.containers.some(container => layoutHasField(container, fieldId));
  }
  if (layout.fields?.length) {
    return layout.fields.includes(fieldId);
  }
}
