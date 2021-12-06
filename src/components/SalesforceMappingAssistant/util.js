import { cloneDeep } from 'lodash';

export function generateLayoutColumns(layoutSection) {
  return layoutSection.map(sec => {
    const section = cloneDeep(sec);

    if (['System Information', 'Custom Links'].indexOf(section.heading) > -1) {
      return false;
    }

    // eslint-disable-next-line no-param-reassign
    section.myColumns = [];
    section.layoutRows.forEach(lr => {
      lr.layoutItems.forEach((li, liIndex) => {
        if (!section.myColumns[liIndex]) {
          section.myColumns.push([]);
        }

        li.layoutComponents.forEach(loc => {
          if (loc.components) {
            loc.components.forEach(comp => {
              if (comp.details && !comp.details.autoNumber) {
                // eslint-disable-next-line no-param-reassign
                comp.numItemsInRow = lr.numItems;
                // eslint-disable-next-line no-param-reassign
                comp.isAddressField = true;
                section.myColumns[liIndex].push(comp);
              }
            });
          } else if (loc.details && !loc.details.autoNumber) {
            if (li.label) {
              // eslint-disable-next-line no-param-reassign
              loc.details.label = li.label;
            }

            if (li.required) {
              // eslint-disable-next-line no-param-reassign
              loc.details.nillable = false;
            }

            // eslint-disable-next-line no-param-reassign
            loc.numItemsInRow = lr.numItems;
            section.myColumns[liIndex].push(loc);
          }
        });
      });
    });

    return section;
  });
}

