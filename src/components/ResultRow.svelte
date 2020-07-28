<script>
  export let account;
  export let result;
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
    grid-template-columns: 2fr 1fr;
  }

  .center {
    width: 100%;
    text-align: center;
  }
</style>

<div class={result ? 'good' : 'bad'}>
  <div>{account}</div>
  <div class="center">{result ? 'Ok' : 'Chyba'}</div>

</div>
