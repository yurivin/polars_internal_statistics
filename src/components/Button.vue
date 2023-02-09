<template>
  <div :class="disabled ? type + ' disabled' : type" @click="btnClick">
    {{ text }}
  </div>
</template>

<script>
export default {
  name: 'NewButton',
  props: {
    text: String,
    type: String,
    disabled: {
      type: Boolean,
      default() {
        return false
      },
    },
  },
  methods: {
    btnClick() {
      !this.disabled && this.$emit('click')
    },
  },
}
</script>

<style scoped lang="scss">
.big {
  background: linear-gradient(106.84deg, #27b0e6 31.03%, #f338c3 96.13%);
  border-radius: 14px;
  width: 100%;
  height: 62px;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 92%;
  text-align: center;

  color: var(--theme-text);

  padding: 25px 6px;
  cursor: pointer;
  user-select: none;
  @media (max-width: 768px) {
    height: 60px;
    padding-top: 24px;
  }

  &.disabled {
    background: #27b0e6 !important;
    opacity: 0.4;
    border-radius: 16px !important;
    cursor: default;
    &:hover {
      background: #27b0e6;
    }
  }
}

.small {
  background: linear-gradient(106.84deg, #27b0e6 31.03%, #f338c3 96.13%);
  border-radius: 14px;
  margin-right: 16px;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  text-align: center;
  padding: 4px 14px;
  border-right: 0.5px solid #f338c3;
  border-left: #27b0e6;
  color: white;
  width: auto;
  /*height: 25.58px;*/
  cursor: pointer;

  &.disabled {
    background: #27b0e6 !important;
    opacity: 0.4;
    border-radius: 16px;
    border-right: #27b0e6 !important;
    cursor: default;
    &:hover {
      background: #423b52;
    }
  }
}
</style>
