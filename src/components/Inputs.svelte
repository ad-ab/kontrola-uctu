<script>
  import placeholder from "../constants/placeholders.js";

  export let ranges;
  export let accounts;
</script>

<h2>Rozsahy</h2>
<textarea placeholder="{placeholder.ranges}" bind:value="{ranges}"></textarea>
<br />
<h2>Účty</h2>
<textarea
  placeholder="{placeholder.accounts}"
  bind:value="{accounts}"
></textarea>
<br />
<div class="row">
  <button type="reset">Smazat</button>
  <button type="submit">Kontrola</button>
</div>

<style>
  textarea {
    width: 400px;
    height: 150px;
  }

  ::placeholder {
    color: lightgray;
  }
</style>
