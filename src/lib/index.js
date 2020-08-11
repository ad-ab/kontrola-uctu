import configLineTestFn from "./loaders";

const delimiter = /[ \t]+/; //"\t";

function main(config, data) {
  const configFileLines = config
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter((x) => x)
    .map((x) => x.split(delimiter));

  const dataFileLines = data
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter((x) => x);

  const tests = configFileLines
    .filter((x) => x)
    .map(([a, b]) => {
      return [configLineTestFn(a), b && configLineTestFn(b, true)];
    });

  const results = [];
  dataFileLines
    .filter((x) => x)
    .map((v) => v.split(delimiter))
    .forEach(([value, second]) => {
      let result = false;
      let secondResult = undefined;
      let checkResult = [];
      for (let [firstCheck, secondCheck] of tests) {
        result = firstCheck(value);
        if (secondCheck && second) {
          if (result) {
            secondResult = secondCheck(second);
          }
          if (secondResult) {
            checkResult = [[result, secondResult]];
            break;
          }
          checkResult.push([result, secondResult]);
        } else {
          checkResult.push([result]);
          if (result) break;
        }
      }

      results.push({
        first: { account: value, result },
        second: { account: second, result: secondResult },
      });
    });

  console.log(results);
  return results;
}

export default main;
