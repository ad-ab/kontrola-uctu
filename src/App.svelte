<script>
  import ResultRow from "./components/ResultRow.svelte";
  import checkAccounts from "./components/app/index.js";

  let placeholder = {
    config: "100000..110000;200000..300000\r\n4*;5*\r\n012345",
    accounts: "100001\r\n100002"
  };

  let data = {
    config: "",
    accounts: ""
  };
  let resultItems = [];

  const handleSubmit = params => {
    resultItems = checkAccounts(data.config, data.accounts);
  };

  const handleReset = () => {
    data.config = "";
    data.accounts = "";
    resultItems = [];
  };
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
  }

  button {
    margin: 4px;
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
      <form>
        <h2>Výsledky</h2>
        <div class="results">
          {#each resultItems as item}
            <ResultRow {...item} />
          {/each}
        </div>
      </form>
    {/if}
  </div>
</main>
