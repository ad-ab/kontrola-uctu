import configLineTestFn from "./loaders";

const delimiter = /[ \t]+/; //"\t";

function main(config, data) {
  const configFileLines = config
    .split(/\r?\n/)
    .filter((x) => x)
    .map((x) => x.split(delimiter));
  const dataFileLines = data.split(/\r?\n/).filter((x) => x);

  const tests = configFileLines
    .filter((x) => x)
    .map(([a, b]) => {
      return [configLineTestFn(a), configLineTestFn(b, true)];
    });

  const results = [];
  dataFileLines
    .filter((x) => x)
    .map((v) => v.split(delimiter))
    .forEach(([value, second]) => {
      let result = false;
      let secondResult = false;
      for (let i = 0; i < tests.length; i++) {
        result = tests[i][0](value);
        if (result) {
          // test second with other tests
          secondResult = tests[i][1](second);
          if (secondResult) break;
        }
      }

      results.push({
        account: [value, second].join("\t"),
        result,
        secondResult,
      });
    });

  return results;
}

export default main;
