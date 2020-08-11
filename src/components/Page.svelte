<script>
  import { fade } from "svelte/transition";
</script>

<div class="page">
  <slot />
</div>

<style>
  .page {
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
</style>
