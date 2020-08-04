<script>
  export let account;
  export let result;
  export let secondResult;
</script>

<style>
  .good {
    background-color: #00ff0020;
  }

  .bad {
    background-color: #ff000020;
  }

  td {
    text-align: center;
  }
</style>

<tr>
  <td class={result ? 'good' : 'bad'}>{account.split('\t')[0]}</td>
  <td class={result ? 'good' : 'bad'}>{result ? 'Ok' : 'Chyba'}</td>
  <td class={secondResult ? 'good' : 'bad'}>{account.split('\t')[1]}</td>
  <td class={secondResult ? 'good' : 'bad'}>{secondResult ? 'Ok' : 'Chyba'}</td>
</tr>
