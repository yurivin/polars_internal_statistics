<template>
  <!-- Modal -->
  <div class="modal-mask">
    <div class="modal-mask-container">
      <header>
        There was a problem processing transactions. The current node cannot
        process all transactions. Please change node and try again.
      </header>
      <div class="modal-mask-container-content">
        <div>Recommended nodes:</div>
        <div>
          https://rpc-mainnet.matic.quiknode.pro (fast node)
        </div>
        <div>
          https://polygon.blockpi.network/v1/rpc/public (fast node)
        </div>
        <div>
          https://1rpc.io/matic (slow node)
        </div>
      </div>
      <div class="modal-mask-container-close" @click="closeModal">X</div>
      <!--      <close-modal-button @click="closeModal"></close-modal-button>-->
    </div>
  </div>
</template>

<script>
export default {
  name: "ChangeNodaModal",
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: grid;
  place-items: center;
  header {
    padding: 0 1rem;
    line-height: 1.5rem;
  }
  z-index: 100;
  &-container {
    position: relative;
    max-width: calc(570px - 4rem);
    padding: 3rem 2rem;
    color: #ffffff;
    background: rgba(21, 21, 21, 0.1);
    border: 0.2px solid rgba(143, 219, 252, 0.2);
    box-shadow: 4px 0px 20px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(20px);

    &-close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      cursor: pointer;
    }
    &-content {
      color: #eeeaea;

      margin-top: 3rem;
      padding: 2rem 0;
      background: radial-gradient(
          564.02% 385.13% at 33.43% -150.71%,
          #181818 0%,
          #363841 0.01%,
          #121315 100%
        )
        /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */;
      border-radius: 7px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      line-height: 1.5rem;
      &-points {
        margin-top: 10px;
        font-family: "Bai Jamjuree";
        font-style: normal;
        font-weight: 700;
        font-size: 30px;
        line-height: 38px;
        /* identical to box height */

        display: flex;
        align-items: center;
        text-align: center;
        letter-spacing: 0.025em;
        background: linear-gradient(
          165.48deg,
          #eecbd4 0.69%,
          #edcfdb 12.57%,
          #eadcf1 31.37%,
          #eadff6 34.34%,
          #d7dff3 50.17%,
          #bde1f1 69.96%,
          #bff6e7 99.65%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
      }
    }
  }
}
</style>
