<script>
  export let first;
  export let second;
  export let isShort = false;
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
  <td class={first.result ? 'good' : 'bad'}>{first.account}</td>
  <td class={first.result ? 'good' : 'bad'}>{first.result ? 'Ok' : 'Chyba'}</td>
  {#if !isShort}
    <td class={second.result ? 'good' : 'bad'}>
      {second.account || 'Nezadáno'}
    </td>
    <td class={second.result ? 'good' : 'bad'}>
      {second.account ? (second.result ? 'Ok' : 'Chyba') : 'Chybí záznam'}
    </td>
  {/if}
</tr>
