<template>
  <div class="page">
    <div class="container column">
      <div class="header row">
        <div class="logo flex-1">
          <img src="./../../assets/logo.png">
        </div>
        <div class="title flex-1 row-center-box">
        <span>
          顶固五金设备管理可视化看板
        </span>
        </div>
        <div class="date flex-1 row-center-right">
          <div>
            {{date}}<br>{{time}}
          </div>
        </div>
      </div>
      <div class="flex-1 padding-6" style="flex: 5">
        <div class="row max-height">
          <div class="flex-1 block">
            <div id="chart-one" class="max-height max-width"></div>
          </div>
          <div class="flex-1 block">
            <div id="chart-two" class="max-height max-width"></div>
          </div>
          <div class="flex-1 block">
            <div id="chart-three" class="max-height max-width"></div>
          </div>
        </div>
      </div>
      <div class="flex-1 table block"  style="flex: 3;">
        <el-table
          :data="list"
          height="100%"
          style="width: 100%"
        >
          <el-table-column
            prop="device_name"
            label="设备名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="dept_name"
            label="所属车间"
            width="180">
          </el-table-column>
          <el-table-column
            prop="edit_user"
            label="提报人员">
          </el-table-column>
          <el-table-column
            prop="fault_date"
            label="提报时间">
          </el-table-column>
          <el-table-column
            prop="fault_describe"
            label="异常描述">
          </el-table-column>
          <el-table-column
            prop="repair_user"
            label="维修人">
          </el-table-column>
          <el-table-column
            prop="dispose_type"
            label="处理方式">
          </el-table-column>
          <el-table-column
            prop="fault_status"
            label="处理状态">
          </el-table-column>
          <el-table-column
            prop="complete_date"
            label="完工时间">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="tzh-logo">
      <span>&copy;天智汇</span>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getDepartmentFaultCount, getProgressCount, getWeekEveryDayDispose, getRepFault } from '../../api/dashboard'
  // import G2 from '@antv/g2'
  import echarts from 'echarts'
  import moment from 'moment/moment'

  export default {
    name: 'Dashboard',
    data() {
      return {
        list: [],
        name: '',
        style: {
          pageTextColorBase: '#ffffff',
          pageTextColorSmall: '#ffffff',
        },
        date: '',
        time: '',
        timer: null
      }
    },
    computed: {
      ...mapGetters([
        'name'
      ])
    },
    created() {
      // setTimeout(() => {
      //   this.renderChart()
      // }, 1000)
      this.getAllData()
      this.timer = setInterval(() => {
        this.getAllData()
      }, 15000)
      setInterval(() => {
        const date = moment()
        this.date = date.format('YYYY-MM-DD')
        this.time = date.format('HH:mm')
      }, 2000)
    },
    methods: {
      getAllData() {
        this.getDepartmentFaultCountData()
        this.getProgressCountData()
        this.getWeekEveryDayDisposeData()
        this.getRepFaultData()
      },
      async getDepartmentFaultCountData() {
        const res = await getDepartmentFaultCount()
        this.randerDepartmentFaultCount(res.data)
      },
      randerDepartmentFaultCount(countData) {
        const myChart = echarts.init(document.getElementById('chart-one'))
        const data = genData()

        function genData() {
          // 名称列表
          const legendData = []
          const seriesData = []
          let selected = ''
          let maxValue = 0
          countData.forEach(item => {
            let name = item.departmentName
            const stringArray = name.split('部_')
            if (stringArray && stringArray.length > 1) {
              name = stringArray[stringArray.length - 1]
            }
            legendData.push(name)
            seriesData.push({
              name: name,
              value: item.number
            })
            if (maxValue < item.number) {
              selected = name
              maxValue = item.number
            }
          })
          console.log(seriesData)
          return {
            legendData,
            seriesData,
            selected
          }
        }
        const style = this.style
        const option = {
          title: {
            text: '异常分布统计',
            subtext: '五金事业部',
            x: 'center',
            textStyle: {
              color: style.pageTextColorSmall
            },
            subtextStyle: {
              color: style.pageTextColorSmall
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 10,
            top: '10%',
            bottom: 20,
            data: data.legendData,
            selected: data.selected,
            textStyle: {
              color: style.pageTextColorBase
            }
          },
          series: [
            {
              name: '名称',
              type: 'pie',
              radius: ['10%', '100'],
              center: ['48%', '65%'],
              data: data.seriesData,
              roseType: 'radius',
              // itemStyle: {
              //   emphasis: {
              //     shadowBlur: 10,
              //     shadowOffsetX: 0,
              //     shadowColor: 'rgba(0, 0, 0, 0.5)'
              //   }
              // },
              itemStyle: {
                normal: {
                  label: {
                    show: true,
                    formatter: '{b} \n {c} ({d}%)',
                    color: style.pageTextColorSmall,
                    fontWeight: 'bold'
                  },
                  labelLine: {
                    show: true
                  },
                  color(params) {
                    // 自定义颜色
                    const colorList = ['#ED82A2', '#C05BF5', '#63CBFA',
                      '#8D92F7', '#687EF7', '#549DAC', '#F58F5C']
                    return colorList[params.dataIndex]
                  }
                }
              }
            }
          ]
        }
        myChart.setOption(option)
      },

      async getProgressCountData() {
        const res = await getProgressCount()
        this.randerProgressCount(res.data)
      },
      randerProgressCount(countData) {
        const myChart = echarts.init(document.getElementById('chart-two'))
        const data = {
          legendData: ['处理中', '已处理'],
          seriesData: [
            {
              name: '处理中',
              value: countData.waitNumber
            },
            {
              name: '已处理',
              value: countData.completeNumber
            }
          ],
          selected: countData.waitNumber > countData.completeNumber ? '处理中' : '已处理'
        }
        const style = this.style
        const option = {
          title: {
            text: '异常处理进度',
            subtext: '五金事业部',
            x: 'center',
            textStyle: {
              color: style.pageTextColorSmall
            },
            subtextStyle: {
              color: style.pageTextColorSmall
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 10,
            top: 20,
            bottom: 20,
            data: data.legendData,
            selected: data.selected,
            textStyle: {
              color: style.pageTextColorBase
            }
          },
          series: [
            {
              name: '名称',
              type: 'pie',
              radius: '50%',
              center: ['50%', '50%'],
              data: data.seriesData,
              // roseType : 'radius',
              // itemStyle: {
              //   emphasis: {
              //     shadowBlur: 10,
              //     shadowOffsetX: 0,
              //     shadowColor: 'rgba(0, 0, 0, 0.5)'
              //   }
              // },
              itemStyle: {
                normal: {
                  label: {
                    show: true,
                    formatter: '{b} \n {c} ({d}%)',
                    color: style.pageTextColorSmall,
                    fontWeight: 'bold'
                  },
                  labelLine: {
                    show: true
                  },
                  color(params) {
                    // 自定义颜色
                    const colorList = ['#63CBFA', '#8D92F7']
                    return colorList[params.dataIndex]
                  }
                }
              }
            }
          ]
        }
        myChart.setOption(option)
      },

      async getWeekEveryDayDisposeData() {
        const res = await getWeekEveryDayDispose()
        this.randerWeekEveryDayDispose(res.data)
      },
      randerWeekEveryDayDispose(countData) {
        const myChart = echarts.init(document.getElementById('chart-three'))
        const date = new Date()
        const dayList = [moment().format('YYYY-MM-DD')]
        for (let i = 1; i < 7; i++) {
          dayList.unshift(moment(date.getTime() - i * 86400000).format('YYYY-MM-DD'))
        }
        console.log(dayList)
        const nameList = dayList.map(day => dayNumberToName((new Date(day)).getDay()))
        console.log(nameList)
        const seriesData = []
        dayList.forEach(day => {
          for (let i = 0; i < countData.length; i++) {
            const item = countData[i]
            if (day === moment(item.date).format('YYYY-MM-DD')) {
              seriesData.push(item.completeNumber)
              return
            }
          }
          seriesData.push(0)
        })
        console.log(seriesData)
        const style = this.style
        const option = {
          title: {
            text: '每日异常处理数',
            subtext: '五金事业部',
            x: 'center',
            textStyle: {
              color: style.pageTextColorSmall
            },
            subtextStyle: {
              color: style.pageTextColorSmall
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: nameList,
            axisLabel: {
              color: style.pageTextColorSmall,
              fontWeight: 'bold'
            }
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              color: style.pageTextColorSmall,
              fontWeight: 'bold'
            }
          },
          series: [{
            data: seriesData,
            type: 'line',
            lineStyle: {
              color: '#687EF7'
            },
            areaStyle: {
              color: '#687EF7'
            }
          }]
        }
        myChart.setOption(option)

        function dayNumberToName(number) {
          switch (number) {
            case 0:
              return '日'
            case 1:
              return '一'
            case 2:
              return '二'
            case 3:
              return '三'
            case 4:
              return '四'
            case 5:
              return '五'
            case 6:
              return '六'
            default:
              return number
          }
        }
      },

      async getRepFaultData() {
        try {
          const res = await getRepFault()
          res.data.forEach(item => {
            if (item.fault_date != null) {
              item.fault_date = moment(item.fault_date).format('YYYY-MM-DD HH:mm:ss')
            }
            if (item.complete_date != null) {
              item.complete_date = moment(item.complete_date).format('YYYY-MM-DD HH:mm:ss')
            }
            if (item.dispose_type != null) {
              const value = parseInt(item.dispose_type)
              switch (value) {
                case 1:
                  item.dispose_type = '误报'
                  break
                case 2:
                  item.dispose_type = '紧急维修'
                  break
                case 3:
                  item.dispose_type = '计划维修'
                  break
                case 4:
                  item.dispose_type = '委外维修'
                  break
                default:
                  break
              }
            }
            if (item.fault_status != null) {
              const value = parseInt(item.fault_status)
              switch (value) {
                case 10:
                  item.fault_status = '上报'
                  break
                case 20:
                  item.fault_status = '异常台账'
                  break
                case 30:
                  item.fault_status = '待处理'
                  break
                case 40:
                  item.fault_status = '待验收'
                  break
                case 50:
                  item.fault_status = '已验收'
                  break
                case 60:
                  item.fault_status = '补单'
                  break
                case 70:
                  item.fault_status = '误报'
                  break
                case 80:
                  item.fault_status = '无需处理'
                  break
                case 90:
                  item.fault_status = '计划维修'
                  break
                case 100:
                  item.fault_status = '委外维修'
                  break
                case 110:
                  item.fault_status = '已完工'
                  break
                default:
                  break
              }
            }
          })
          this.list = res.data
        } catch (e) {
          if (this.timer != null) {
            clearInterval(this.timer)
          }
          alert('请求异常，请查看 console')
        }
      }

    }
  }
</script>

<style lang="scss" scoped>
  @import "./../../scss/base";
  // $boxShadowBase: 0 0 5px 0 #383E76;
  // $backgroundCardColor: #484754;
  // $blockBorderColor: #40424D;
  $backgroundCardColor: #14223C;
  // $blockBorderColor: rgba(64, 66, 77, 0.5);
  $blockBorderColor: #272D53;
  // $blockBackgroundCardColor: #31333F;
  $blockBackgroundCardColor: #284067;
  // $blockBackgroundCardColor: #2E2A41;
  // $blockBackgroundCardColorHover: #40424D;
  $blockBackgroundCardColorHover: #2A4871;
  $blockBackgroundCardBoxShadow: 2px 2px 6px 2px #141428;
  // $pageTextColorBase: #FDFEFF;
  // $pageTextColorSmall: #EEEBF7;
  $pageTextColorBase: #ffffff;
  $pageTextColorSmall: #F5F5F5;
  .page {
    height: 100vh;
    // background: $backgroundCardColor;
    // background: linear-gradient(135deg, #E9A1C6, #A2ABE9);
    background: $backgroundCardColor;
    // background-color: #5E83EC;
    color: $pageTextColorBase;
    .container {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 5;
      .block {
        margin: $spaceSmall;
        padding: $spaceBase;
        background-color: $blockBackgroundCardColor;
        border-radius: $radiusMedium;
        // box-shadow: 2px 2px 6px 2px #A489BF;
        // box-shadow: 2px 2px 6px 2px #9A7FB5;
        box-shadow: $blockBackgroundCardBoxShadow;
      }
      .header {
        width: 100%;
        height: 50px;
        .title {
          width: 100%;
          height: 100%;
          // background-color: $backgroundCardColor;
          // box-shadow: $boxShadowBase;
          span {
            font-size: 28px;
            font-weight: bold;
            color: $pageTextColorBase;
          }
        }
        .logo {
          height: 100%;
          padding: $spaceBase;
          box-sizing: border-box;
          img {
            height: 100%;
            // filter: drop-shadow(#ffffff 80px 0);
            // opacity: 0.7;
          }
        }
        .date {
          padding: $spaceBase;
          box-sizing: border-box;
          font-size: $fontSizeExtraSmall;
          color: $pageTextColorSmall;
          text-align: center;
          font-weight: bold;
        }
      }
      /deep/ .el-table__body-wrapper, /deep/ .el-table, .el-table__expanded-cell {
        background-color: transparent;
      }
      /deep/ .el-table th, /deep/ .el-table tr {
        background-color: transparent;
        border-bottom-color: $blockBorderColor;
      }
      /deep/ .el-table td, /deep/ .el-table th.is-leaf {
        border-bottom-color: $blockBorderColor;
      }
      /deep/ .el-table td, /deep/ .el-table th {
        padding-top: $spaceSmall;
        padding-bottom: $spaceSmall;
        font-weight: bold;
      }
      /deep/ .el-table--border::after, /deep/ .el-table--group::after, /deep/ .el-table::before {
        background-color: $blockBorderColor;
      }
      /deep/ .el-table thead {
        color: $pageTextColorBase;
      }
      /deep/ .el-table {
        color: $pageTextColorSmall;
      }
      /deep/ .el-table--enable-row-hover .el-table__body tr:hover>td {
        background-color: $blockBackgroundCardColorHover;
      }
      .table {
        margin: 0 $spaceBase $spaceBase $spaceBase;
        padding: $spaceBase;
        background-color: $blockBackgroundCardColor;
        border-radius: $radiusMedium;
        box-sizing: border-box;
        overflow-y: auto;
      }
    }
    .tzh-logo {
      position: absolute;
      z-index: 6;
      bottom: $spaceBase * 2;
      right: $spaceBase * 2;
      opacity: 0.6;
      span {
        color: #ffffff;
      }
    }
  }
</style>
