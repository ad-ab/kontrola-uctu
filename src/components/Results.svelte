<script>
  import { fade } from "svelte/transition";

  import ResultRow from "./ResultRow.svelte";

  export let results;
  let errorsOnly = true;

  $: filteredResult = results.filter(
    x => !errorsOnly || (!x.first.result || (!isShort && !x.second.result))
  );
  // do we have any results?
  $: hasResults = filteredResult.length > 0;
  // should we display 2 columns or 4 columns in the results (this is based on data)
  $: isShort =
    results.filter(x => x.second.result === undefined || !x.second.account)
      .length === results.length;
</script>

<h2>Výsledky</h2>
<div class="row">
  <label>
    <input type="checkbox" bind:checked="{errorsOnly}" />
    Zobrazit pouze chybné záznamy
  </label>

</div>
<div class="results">
  {#if hasResults}
    <table>
      <tr>
        <th>Účet 1</th>
        <th>Kontrola 1</th>
        {#if !isShort}
          <th>Účet 2</th>
          <th>Kontrola 2</th>
        {/if}
      </tr>
      {#each filteredResult as item}
        <ResultRow {...item} {isShort} />
      {/each}
    </table>
  {:else}
    <h3 class="top" transition:fade>Úspěch! Žádná chyba</h3>
  {/if}
</div>

<style>
  .results {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    position: relative;
  }

  button {
    margin: 4px;
  }

  .top {
    position: absolute;
    top: 100px;
    width: 100%;
    text-align: center;
  }

  table {
    width: 100%;
    table-layout: fixed;
  }
</style>
