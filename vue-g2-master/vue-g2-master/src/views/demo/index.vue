<template>
  <div class="dashboard-container">
    <div class="dashboard-text">device card data:</div>
    <el-row>
      <el-col :span="12">
        <el-input v-model="name" placeholder=""></el-input>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="search" style="margin-left: 12px">搜索</el-button>
      </el-col>
    </el-row>
    <div>
      <div v-for="(item, index) in list" :key="index">
        {{item.device_type}}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDeviceCard } from '../../api/dashboard'

export default {
  name: 'Demo',
  data() {
    return {
      list: [],
      name: ''
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.search()
  },
  methods: {
    async search() {
      let params
      if (this.name != null && this.name.length > 0) {
        params = {
          name: this.name
        }
      }
      const res = await getDeviceCard(params)
      this.list = res.data
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
