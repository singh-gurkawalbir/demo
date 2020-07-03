export function generateLayoutColumns(layoutSection) {
  layoutSection.forEach(section => {
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
  });

  return layoutSection;
}

export function generateFieldHTML(loc) {
  const html = [];

  if (!loc || !loc.details) {
    return '<td></td><td></td>';
  }

  html.push('<td class="labelCol">');
  html.push(`<label>${loc.details.label}</label>`);
  html.push('</td>');

  if (loc.numItemsInRow === 1) {
    html.push('<td class="data2Col">');
  } else {
    html.push('<td class="dataCol col02">');
  }

  html.push('<div class="requiredInput">');

  if (loc.details.type !== 'boolean' && !loc.details.nillable) {
    if (
      loc.details.type !== 'reference' ||
      loc.details.referenceTo.indexOf('User') === -1
    ) {
      html.push('<div class="requiredBlock"></div>');
    }
  }

  if (loc.details.type === 'boolean') {
    html.push(`<input type="checkbox" name="${loc.details.name}"/>`);
  } else if (loc.details.type === 'picklist') {
    html.push(`<span><select name="${loc.details.name}">`);
    html.push('<option value="">--None--</option>');
    loc.details.picklistValues.forEach(plv => {
      html.push(`<option value="${plv.value}">${plv.label}</option>`);
    });
    html.push('</select></span>');
  } else if (loc.details.type === 'date') {
    html.push(`<input name="${loc.details.name}" size="12"/>`);
  } else if (loc.details.type === 'textarea') {
    if (loc.isAddressField) {
      html.push(
        `<textarea name="${loc.details.name}" cols="27" rows="2"></textarea>`
      );
    } else {
      const fieldLength = loc.details.length;

      if (fieldLength <= 50) {
        html.push(`<input name="${loc.details.name}" size="20"/>`);
      } else if (fieldLength <= 255) {
        html.push(
          `<textarea name="${
            loc.details.name
          }" cols="40" rows="${loc.displayLines || 1}"></textarea>`
        );
      } else if (loc.details.htmlFormatted) {
        html.push(
          `<textarea name="${
            loc.details.name
          }" cols="40" rows="${loc.displayLines || 1}"></textarea>`
        );
      } else {
        html.push(
          `<textarea name="${
            loc.details.name
          }" cols="75" rows="${loc.displayLines || 1}"></textarea>`
        );
      }
    }
  } else if (
    loc.details.type === 'reference' &&
    loc.details.referenceTo.indexOf('User') > -1
  ) {
    html.push('Current User');
  } else {
    html.push(`<input name="${loc.details.name}" size="20"/>`);
  }

  html.push('</div>');

  html.push('</td>');

  return html.join('');
}

export function generateSectionHTML(section) {
  const html = [];
  let colLength = 0;
  let i = 0;

  if (['System Information', 'Custom Links'].indexOf(section.heading) > -1) {
    return html.join('');
  }

  if (section.useHeading) {
    html.push('<div class="brandTertiaryBgr pbSubheader tertiaryPalette">');

    if (section.addRequiredInfo) {
      html.push(
        '<span class="pbSubExtra"><span class="requiredLegend brandTertiaryFgr"><span class="requiredExampleOuter"><span class="requiredExample">&nbsp;</span></span><span class="requiredMark">*</span><span class="requiredText"> = Required Information</span></span></span>'
      );
    }

    html.push(`<h3>${section.heading}</h3>`);
    html.push('</div>');
  }

  html.push('<div class="pbSubsection">');
  html.push(
    '<table class="detailList" border="0" cellpadding="0" cellspacing="0">'
  );
  html.push('<tbody>');

  section.myColumns.forEach(col => {
    colLength = Math.max(col.length, colLength);
  });

  for (i = 0; i < colLength; i += 1) {
    html.push('<tr>');
    // eslint-disable-next-line no-loop-func
    section.myColumns.forEach(col => {
      html.push(generateFieldHTML(col[i]));
    });
    html.push('</tr>');
  }

  html.push('</tbody>');
  html.push('</table>');
  html.push('</div>');

  return html.join('');
}

export function generateHTML(sObjectLabel, layout) {
  generateLayoutColumns(layout.editLayoutSections);

  const html = [];

  html.push('<div id="salesforceMappingFormMainDiv" class="salesforce-form">');
  html.push(
    `<h2 class="pageDescription"> New ${sObjectLabel} --- Click in a field below to select ---</h2>`
  );
  html.push('<div class="pbBody">');
  html.push('<form>');
  layout.editLayoutSections.forEach((section, i) => {
    if (['System Information', 'Custom Links'].indexOf(section.heading) > -1) {
      return false;
    }

    if (i === 0) {
      // eslint-disable-next-line no-param-reassign
      section.addRequiredInfo = true;
    }

    html.push(generateSectionHTML(section));
  });
  html.push('</form>');
  html.push('</div>');
  html.push('</div>');
  html.push('</body>');
  html.push('</html>');

  return html.join('');
}
