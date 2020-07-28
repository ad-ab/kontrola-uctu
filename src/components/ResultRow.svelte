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
    padding-top: 4px;
    padding-bottom: 4px;
  }
</style>

<div class={result ? 'good' : 'bad'}>{account}</div>
