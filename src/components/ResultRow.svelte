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

  div {
    width: 100%;
    margin-bottom: 2px;
    display: grid;
    grid-template-columns: 3fr 1fr 1fr;
  }

  .center {
    width: 100%;
    text-align: center;
  }
</style>

<div class={result && secondResult ? 'good' : 'bad'}>
  <div>{account}</div>
  <div class="center">{result ? 'Ok' : 'Chyba'}</div>
  <div class="center">{secondResult ? 'Ok' : 'Chyba'}</div>

</div>
