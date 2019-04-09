const elementsToBeStrippedFromPath = ['[*]', '_crypt', '[*].name'];
const helpKeyPath = (path, resource) => `${resource}.${path}`;
const idGeneration = (pathWithoutResource, resource) => {
  const path = helpKeyPath(pathWithoutResource, resource);
  const subPaths = path.split('.');
  const reducedString = subPaths
    .map((path, index) => {
      // except for the first subPath upper case the remaining
      if (index === 0) return path;

      return `${path[0].toUpperCase()}${path.slice(1)}`;
    })
    .reduce((acc, curr) => acc + curr, '');

  return reducedString;
};

const namePath = path => {
  const modifiedPath = path.replace(/\./g, '/');

  // adding the first slash
  return `/${modifiedPath}`;
};

const labelGeneration = path => {
  const seperatedDots = path.replace(/\./g, ' ');
  const seperatedCamelCases = seperatedDots.replace(/([a-z])([A-Z])/g, '$1 $2');

  // adding the first slash
  return (
    seperatedCamelCases[0].toUpperCase() +
    seperatedCamelCases.slice(1, seperatedCamelCases.length)
  );
};

export const generateCorrectPath = fieldDefs => {
  // if path isn't defined then lets use the path from the object root

  const path = fieldDefs.path || fieldDefs.pathGeneratedFromObj;
  // if generatedValue path is of type array strip [*]
  const res = elementsToBeStrippedFromPath
    .map(element => {
      if (path.endsWith(element))
        return path.slice(0, path.length - element.length);

      return null;
    })
    .reduce((prev, curr) => {
      if (curr) return curr;

      return prev;
    }, null);

  if (res) return res;
  // if generatedValue path is of type object
  // strip fields[*].something
  const match = path.match(/(fields\[\*\].*)$/i);

  if (match && match[1]) return path.slice(0, path.length - match[1].length);

  return path;
};

const generateDefaultValuesFunctions = path => {
  const nullCheckValue = path.split('.').reduce(
    (acc, curr) => {
      const splits = acc.split(' && ');
      let nowVal;

      if (splits.length > 1) nowVal = `${splits[splits.length - 1]}.${curr}`;
      else nowVal = `r.${curr}`;

      return `${acc} && ${nowVal}`;
    },

    'r'
  );

  /* jslint evil: true */
  return `r => ${nullCheckValue}`;
};

export default (fieldDefs, resource) => {
  // if path isn't defined then lets use the path from the object root
  const path = generateCorrectPath(fieldDefs);

  return {
    // helpKey: helpKeyPath(path, resource),
    // name: namePath(path),
    // id: helpKeyPath(path, resource),
    // label: labelGeneration(path),
    // defaultValue: generateDefaultValuesFunctions(path),
    fieldId: path,
  };
};
