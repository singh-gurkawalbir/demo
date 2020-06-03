import React from 'react';
import Field from './Field';

export default function Section({
  addRequiredInfo,
  section,
  onFieldClick,
  data,
}) {
  if (['System Information', 'Custom Links'].indexOf(section.heading) > -1) {
    return null;
  }

  let colLength = 0;

  section.myColumns.forEach(col => {
    colLength = Math.max(col.length, colLength);
  });

  const handleFieldClick = e => {
    const fieldMeta = { id: e.target.name };

    onFieldClick && onFieldClick(fieldMeta);
  };

  return (
    <>
      {section.useHeading && (
        <>
          <div className="brandTertiaryBgr pbSubheader tertiaryPalette">
            {addRequiredInfo && (
              <span className="pbSubExtra">
                <span className="requiredLegend brandTertiaryFgr">
                  <span className="requiredExampleOuter">
                    <span className="requiredExample">&nbsp;</span>
                  </span>
                  <span className="requiredMark">*</span>
                  <span className="requiredText"> = Required Information</span>
                </span>
              </span>
            )}
            <h3>{section.heading}</h3>
          </div>
        </>
      )}
      <div className="pbSubsection">
        <table
          className="detailList"
          border="0"
          cellPadding="0"
          cellSpacing="0">
          <tbody>
            {// eslint-disable-next-line prefer-spread
            Array.apply(null, { length: colLength }).map((val, index) => (
              // eslint-disable-next-line react/jsx-key
              <tr>
                {section.myColumns.map(col => (
                  // eslint-disable-next-line react/jsx-key
                  <Field
                    fieldMeta={col[index]}
                    onClick={handleFieldClick}
                    value={data && col[index] && data[col[index].details.name]}
                    isMapped={
                      data &&
                      col[index] &&
                      Object.hasOwnProperty.call(data, col[index].details.name)
                    }
                  />
                ))}
              </tr>
            ))
}
          </tbody>
        </table>
      </div>
    </>
  );
}
