<script>
  import ResultRow from "./components/ResultRow.svelte";
  import checkAccounts from "./components/app/index.js";
  import placeholder from "./constants/placeholders.js";

  import { fade, fly } from "svelte/transition";

  let data = {
    config: "",
    accounts: ""
  };
  let resultItems = [];
  let errorsOnly = true;

  const handleSubmit = () => {
    resultItems = checkAccounts(data.config, data.accounts);
  };

  const handleReset = () => {
    data.config = "";
    data.accounts = "";
    resultItems = [];
  };

  $: filteredResult = resultItems.filter(
    x => !errorsOnly || (!x.result || !x.secondResult)
  );
  $: hasResults = filteredResult.length > 0;
</script>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 2em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }

  textarea {
    width: 400px;
    height: 150px;
  }

  form {
    margin-left: auto;
    margin-right: auto;
    background: #fff;
    padding: 16px;
    width: 500px;
    max-height: 580px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    box-shadow: 0px 4px 7px 4px rgba(0, 0, 0, 0.58);
  }

  ::placeholder {
    color: lightgray;
  }

  .row {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }

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
</style>

<main>
  <h1>Kontrola</h1>
  <div class="row">
    <form
      on:submit|preventDefault={handleSubmit}
      on:reset|preventDefault={handleReset}>
      <h2>Rozsahy</h2>
      <textarea placeholder={placeholder.config} bind:value={data.config} />
      <br />
      <h2>Účty</h2>
      <textarea placeholder={placeholder.accounts} bind:value={data.accounts} />
      <br />
      <div class="row">
        <button type="reset">Smazat</button>
        <button type="submit">Kontrola</button>
      </div>
    </form>
    {#if resultItems.length}
      <form transition:fly={{ x: -200, duration: 100 }}>
        <h2>Výsledky</h2>
        <div class="row">
          <label>
            <input type="checkbox" bind:checked={errorsOnly} />
            Zobrazit pouze chyby
          </label>

        </div>
        <div class="results">
          {#if hasResults}
            {#each filteredResult as item}
              <div transition:fade={{ duration: 100 }}>
                <ResultRow {...item} />
              </div>
            {/each}
          {:else}
            <h3 class="top" transition:fade>Úspěch! Žádná chyba</h3>
          {/if}
        </div>
      </form>
    {/if}
  </div>
</main>
