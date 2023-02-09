<template>
  <div class="big">
    <b-card card-body>
      <line-chart :chart-data="datacollection" :options="options"></line-chart>
    </b-card>
  </div>
</template>

<script>
import LineChart from '@/util/LineChart'
import { BCard } from "bootstrap-vue";


export default {
  components: {
    LineChart,
    BCard
  },
  props: {
    arr: Array,
  },
  data() {
    return {
      datacollection: {},
      dateArray: [],
      priceArray: [],
      options: {
        elements: {
          point: {
            radius: 0,
          },
        },
      },
    }
  },
  async mounted() {
    await this.array()
    await this.fillData()
  },
  methods: {
    fillData() {
      this.datacollection = {
        labels: this.dateArray.reverse(),
        datasets: [
          {
            label: 'WHITE + BLACK',
            borderColor: 'rgb(255, 99, 132)',
            data: this.priceArray.reverse(),
          },
        ],
      }
    },
    array() {
      this.arr = this.arr.sort((a, b) => new Date(b.date) - new Date(a.date))
      for (let i = 0; i < this.arr.length; i++) {
        this.dateArray.push(this.arr[i].date)
        this.priceArray.push(this.arr[i].price)
      }
    },
  },
}
</script>

<style lang="scss">
.big {
  padding: 0;
  max-width: 640px;
  margin: 20px auto;
}
</style>
