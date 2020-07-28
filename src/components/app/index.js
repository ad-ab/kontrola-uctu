import configLineTestFn from "./loaders";

function main(config, data) {
  const configFileLines = config.split(/\r?\n/);
  const dataFileLines = data.split(/\r?\n/);

  const tests = configFileLines.filter((x) => x).map(configLineTestFn);

  const results = [];
  dataFileLines
    .filter((x) => x)
    .forEach((value) => {
      let result = false;
      for (let i = 0; i < tests.length; i++) {
        result = tests[i](value);
        if (result) break;
      }

      results.push({ account: value, result });
    });

  return results;
}

export default main;
