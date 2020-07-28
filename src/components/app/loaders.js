const arrayDelimiter = ";";
const rangeSeparator = "..";
const regexStar = "*";
const delimiter = "\t";

function loadArray(arr) {
  return arr.split(arrayDelimiter);
}

function isRangeFn(stringItem) {
  const arr = stringItem.split(rangeSeparator);
  const [a, b] = arr.map((x) => parseInt(x));

  // param we get from the data.txt must be in between [a, b]
  return (x) => {
    return parseInt(x) >= a && parseInt(x) <= b;
  };
}

function isExactFn(stringItem) {
  const value = parseInt(stringItem);

  // param we get from the data.txt must be exactly the same
  return (x) => parseInt(x) === value;
}

function isStarFn(stringItem) {
  const chars = stringItem.split("");
  for (let i = chars.length; i < 6; i++) chars.push("[0-9]");

  const regex = chars.join("").replace(regexStar, "[0-9]");

  // param must match regex
  return (x) => x.match(regex);
}

function itemFunction(stringItem) {
  let testFn;
  if (stringItem.includes(rangeSeparator)) testFn = isRangeFn(stringItem);
  else if (stringItem.includes(regexStar)) testFn = isStarFn(stringItem);
  else testFn = isExactFn(stringItem);

  return testFn;
}

function configLineTestFn(line) {
  const [input, result] = line.split(delimiter);
  const items = loadArray(input);
  const testFns = items.map(itemFunction);

  return (x) => {
    // go trough all tests
    for (let i = 0; i < testFns.length; i++) {
      if (testFns[i](x)) return result || true;
    }
    // nothing found
    return false;
  };
}

export default configLineTestFn;
