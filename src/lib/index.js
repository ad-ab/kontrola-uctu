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

      const adjustedCheckResult = checkResult
        .filter(([a, b]) => a || b)
        .sort(([a1, b1], [a2, b2]) => {
          if (b2 == b1) return 0;
          if (b1) return -1;
          if (b2) return 1;
        });

      const answer = adjustedCheckResult.length
        ? adjustedCheckResult[0]
        : [false, false];

      results.push({
        first: { account: value, result: answer[0] },
        second: { account: second, result: answer[1] },
      });
    });

  return results;
}

export default main;
