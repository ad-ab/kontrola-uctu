<script>
  import checkAccounts from "./lib/index.js";
  import placeholder from "./constants/placeholders.js";

  import Page from "./components/Page.svelte";
  import Inputs from "./components/Inputs.svelte";
  import Results from "./components/Results.svelte";

  let data = {};
  let resultItems = [];

  const submitForm = () => {
    resultItems = checkAccounts(data.ranges, data.accounts);
  };

  const reset = () => {
    data = {
      ranges: "",
      accounts: ""
    };
    resultItems = [];
  };

  reset();
  submitForm();
</script>

<main>
  <h1>Account Structure Check</h1>
  <div class="row">
    <Page>
      <form
        on:submit|preventDefault="{submitForm}"
        on:reset|preventDefault="{reset}"
      >
        <Inputs bind:ranges="{data.ranges}" bind:accounts="{data.accounts}" />
      </form>
    </Page>
    {#if resultItems.length}
      <Page>
        <Results bind:results="{resultItems}" />
      </Page>
    {/if}
  </div>
</main>

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

  .row {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }
</style>
