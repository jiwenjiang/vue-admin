<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-form :inline="true" :model="listQuery" class="demo-form-inline" size="mini">
          <el-form-item label="合作方名称" prop="partnerIdArr">
            <el-select
              v-model="listQuery.partnerName"
              clearable
              class="filter-item"
              placeholder="选择"
              style="width: 120px"
              @change="forceChange"
            >
              <el-option
                v-for="item in partners"
                :key="item.partnerId"
                :label="item.partnerName"
                :value="item.partnerName"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="小程序" prop="partnerIdArr">
            <el-select
              v-model="listQuery.programName"
              class="filter-item"
              placeholder="选择"
              style="width: 120px"
              @change="forceChange"
            >
              <el-option
                v-for="item in minis"
                :key="item.programName"
                :label="item.programName"
                :value="item.programName"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="地图区域">
            <el-select
              v-model="listQuery.mapId"
              class="filter-item"
              placeholder="选择"
              style="width: 120px"
              @change="chooseMap"
            >
              <el-option
                v-for="item in areas"
                :key="item.id"
                :label="item.name"
                :value="item.mapId"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
            <el-button type="primary" @click="toTrain()" :loading="isLoading">训练</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div id="map-body" class="map-body"></div>
      <div class="last-train" v-show="lastTrain">最后训练时间：{{lastTrain}}</div>
    </div>
    <div class="map-operators-floor-total" id="map-operators-floor-total">
      <ul>
        <li
          v-for="item in floorData"
          :key="item.value"
          :class="filterClass(item.value)"
          @click="changeFloor(item.value)">{{item.label}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { getList, deleteUser, exportFlie, getTime, deletePrint, deletePrints } from '@/api/fingerprint'
  import { getPartners } from '@/api/partner'
  import { getAllMini } from '@/api/dataManage/mini'
  import { getAreaAll } from '@/api/dataManage/area'
  import ibeaconImg from '@/assets/custom-theme/loc.png'
  import ibeaconImg2 from '@/assets/custom-theme/locRed.png'
  // import startImg from '@/assets/custom-theme/start.png'
  // import endImg from '@/assets/custom-theme/end.png'
  // import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  // import * as creeper from '@/utils/mapbox-gl'

  export default {
    name: 'ComplexTable',
    data() {
      return {
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: false,
        boxs: {},
        imageUrl: '',
        showSelect: false,
        listQuery: {
          page: 0,
          pageSize: 10,
          partnerName: '',
          deviceId: null,
          major: null,
          programName: '',
          minor: '',
          name: ''
        },
        types: [
          {
            id: null,
            name: '全部类型'
          },
          {
            id: 1,
            name: '图标类型'
          },
          {
            id: 2,
            name: '文字类型'
          }
        ],
        formInline: {
          user: '',
          region: ''
        },
        minis: [],
        areas: [],
        serviceTypeIds: [],
        value: '',
        userForm: {
          serviceTypeId: undefined,
          areaName: '',
          mapId: '',
          serviceType: '',
          orderid: '',
          serviceTypeIds: ''
        },
        rules: {
          areaName: [{ required: true, message: '数据名称必填', trigger: 'blur' }],
          serviceType: [{ required: true, message: '分类类型必填', trigger: 'change' }],
          serviceTypeIds: [{ required: true, message: '分类必填', trigger: 'change' }],
          orderid: [{ required: true, message: '排序必填', trigger: 'blur' }]
        },
        dialogStatus: '添加',
        dialogFormVisible: false,
        roles: [],
        partners: [],
        partnersMini: [],
        deleteUsers: '',
        baseUrl: this._baseUrl,
        confMarker: '',
        floorData: [],
        currFloor: 0,
        map: '',
        floorObj: {},
        devicesMarkerList: [],
        tempArr: [],
        tempMarker: null,
        tempPop: null,
        mapId: null,
        lastTrain: null,
        isLoading: false,
        startMarker: null,
        endMarker: null
      }
    },
    created() {
      // this.getList()
      this.getPartners()
      this.getMinis()
      this.getAreaList()
    },
    mounted() {
      document.getElementById('map-body').style.height = 'calc(100vh - 84px)'
    },
    methods: {
      handleClose() {
        this.showSelect = false
      },
      getAreaList() {
        getAreaAll().then(res => {
          this.areas = res
        })
      },
      async getList() {
        this.listLoading = false
        const res = await getList(this.listQuery)
        // return false
        res.forEach((v) => {
          if (this.floorObj[v.level]) {
            this.floorObj[v.level].push(v)
          } else {
            this.floorObj[v.level] = []
            this.floorObj[v.level].push(v)
          }
        })
        this.ibeaconImg2 = document.createElement('div')
        const img2 = document.createElement('img')
        this.ibeaconImg2.id = 'clickme'
        img2.src = ibeaconImg2
        img2.style.width = '30px'
        this.ibeaconImg2.appendChild(img2)
        this.floorObj[this.currFloor].forEach((v, i) => {
          this.generateMarker(v)
        })
        // console.log('res', res)
      },
      async getTime() {
        const res = await getTime({ mapId: this.mapId })
        const filename = res.fileName.slice(-14)
        const year = filename.substr(0, 4)
        const month = filename.substr(4, 2)
        const day = filename.substr(6, 2)
        const h = filename.substr(8, 2)
        const m = filename.substr(10, 2)
        const s = filename.substr(12, 2)
        this.lastTrain = year + '-' + month + '-' + day + ' ' + h + ':' + m + ':' + s
      },
      toTrain() {
        const url = this.baseUrl.split('//')[1]
        this.isLoading = true
        this.ws = new WebSocket(`ws://${url}/loc/v1/learn`)
        const params = {
          mapId: this.mapId,
          building: ''
        }
        this.ws.addEventListener('open', () => {
          this.ws.send(JSON.stringify(params))
        })
        this.ws.addEventListener('message', () => {
          // console.log('succ')
          this.$message({
            message: '训练完成！',
            type: 'success',
            offset: 100
          })
          this.isLoading = false
        })
      },
      setMarker(imgSrc, v) {
        const el = document.createElement('div')
        const img = document.createElement('img')
        img.src = imgSrc
        img.style.width = '30px'
        el.appendChild(img)
        this.startMarker = new creeper.Marker(el).setLngLat([v.lon, v.lat]).addTo(this.map)
        this.endMarker = new creeper.Marker(el).setLngLat([v.lon, v.lat]).addTo(this.map)
      },
      generatePop(tempObj) {
        const tag = `<div class="markerPop">
    <div class="markerPop-head">指纹信息
    <i class="el-icon-close" id="close-marker"></i>
    </div>
    <div class="markerPop-body">
    <ul>
   <li>指纹ID:${tempObj.classId}</li>
    <li>所属楼栋:${tempObj.building}</li>
    <li>所属楼层:${tempObj.level}</li>
    <li>添加时间:${tempObj.posttime}</li>
        <div class="markerPop-foot">
    <button class="btn1" id="deleteSingle">删除</button>
    <button class="btn2" id="getGroup">查看关联指纹组</button>
</div>
</ul>
</div>
</div>`
        this.tempPop = new creeper.Popup({ offset: 25, closeOnClick: false })
          .setLngLat([tempObj.lon, tempObj.lat])
          .setHTML(tag)
          .addTo(this.map)
        document.getElementById('deleteSingle').addEventListener('click', () => {
          console.log('temp', tempObj)
          this.tempPop.remove()
          this.$confirm('确认删除？（删除后信息将不可恢复）', '删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            deletePrint({ classId: tempObj.classId }).then((a) => {
              this.devicesMarkerList.forEach(v => v.marker.remove())
              this.devicesMarkerList = []
              if (this.tempMarker) {
                this.tempMarker.remove()
                this.tempPop.remove()
                this.tempMarker = null
                this.tempPop = null
                this.tempArr = []
              }
              this.getList()
            })
          }).catch(() => {
            this.generatePop(tempObj)
          })
        })
        document.getElementById('getGroup').addEventListener('click', () => {
          this.tempPop.remove()
          this.generateGroupPop(tempObj)
        })
        document.getElementById('close-marker').addEventListener('click', () => {
          this.generateMarker(tempObj)
          this.tempMarker.remove()
          this.tempPop.remove()
          this.tempMarker = null
          this.tempPop = null
          this.tempArr = []
        })
      },
      generateGroupPop(tempObj) {
        const filterGroup = this.floorObj[this.currFloor].filter(v => {
          return v.columnId == tempObj.columnId
        })
        const tag = `<div class="markerPop">
    <div class="markerPop-head">指纹组信息
    <i class="el-icon-close" id="close-marker"></i>
    </div>
    <div class="markerPop-body">
    <ul class="groupList" id="groupList">
      <li class="mt10">指纹组ID：${tempObj.columnId}</li>
    </ul>
        <div class="markerPop-foot markerPop-position">
        <span class="list-count">共<span style="color:red">${filterGroup.length}个</span>指纹点</span>
    <button class="btn1" id="deleteSingles">删除</button>
</div>
</div>
</div>`
        this.tempPop = new creeper.Popup({ offset: 25, closeOnClick: false })
          .setLngLat([tempObj.lon, tempObj.lat])
          .setHTML(tag)
          .addTo(this.map)

        filterGroup.forEach(v => {
          const li = document.createElement('li')
          const text = v.classId.substr(0, 20)
          const ct = document.createTextNode(`指纹ID: ${text}`)
          // li.innerText(v.classId)
          li.appendChild(ct)
          document.getElementById('groupList').appendChild(li)
        })
        // console.log(3333333, filterGroup)
        // this.setMarker(startImg, filterGroup[0])
        // this.setMarker(endImg, filterGroup[filterGroup.length - 1])

        document.getElementById('close-marker').addEventListener('click', () => {
          this.generateMarker(tempObj)
          this.tempMarker.remove()
          this.tempPop.remove()
          this.tempMarker = null
          this.tempPop = null
          this.tempArr = []
        })
        document.getElementById('deleteSingles').addEventListener('click', () => {
          deletePrints({ columnId: tempObj.columnId }).then(() => {
            this.devicesMarkerList.forEach(v => v.marker.remove())
            this.devicesMarkerList = []
            if (this.tempMarker) {
              this.tempMarker.remove()
              this.tempPop.remove()
              this.tempMarker = null
              this.tempPop = null
              this.tempArr = []
            }
            this.getList()
          })
        })
      },
      generateMarker(v) {
        const el = document.createElement('div')
        const img = document.createElement('img')
        img.src = ibeaconImg
        img.style.width = '30px'
        el.appendChild(img)
        el.uid = v.classId
        img.uid = v.classId
        el.addEventListener('click', (e) => {
          this.devicesMarkerList.filter(v => v.uid == e.target.uid)[0].marker.remove()
          this.devicesMarkerList = this.devicesMarkerList.filter(v => v.uid != e.target.uid)
          const tempObj = this.floorObj[this.currFloor].filter(v => v.classId == e.target.uid)[0]
          console.log(tempObj)
          if (this.tempArr.length > 0) {
            const obj = this.tempArr[0]
            this.tempMarker.remove()
            this.tempPop.remove()
            this.tempMarker = new creeper.Marker(this.ibeaconImg2).setLngLat([tempObj.lon, tempObj.lat]).addTo(this.map)
            // set pop
            this.generatePop(tempObj)
            // console.log('pop', popup, div2)
            this.generateMarker(obj)
            this.tempArr[0] = tempObj
          } else {
            this.tempArr.push(tempObj)
            // set pop
            this.tempMarker = new creeper.Marker(this.ibeaconImg2).setLngLat([tempObj.lon, tempObj.lat]).addTo(this.map)
            this.generatePop(tempObj)
          }
          // this.devicesMarkerList.filter(v => v.uid == e.target.uid)[0]
        })
        this.devicesMarkerList.push({
          uid: v.classId,
          marker: new creeper.Marker(el).setLngLat([v.lon, v.lat]).addTo(this.map)
        })
      },
      chooseMap(id) {
        creeper.CreeperConfig.token = 'bG9jYXRpb246YzFmNWZmZDg4ZWNkYzQyZDJlYzFkZjViYTU1OWU4MTA='
        this.mapId = id
        this.$nextTick(() => {
          const map = new creeper.VectorMap('map-body', id, 'https://cmgis.parkbobo.com/')
          this.map = map
          map.on('load', () => {
            const floorData = this.calcFloorList(map)
            this.floorData = floorData
            this.currFloor = map.floorComponent.nowLevelIndex
            this.$nextTick(() => {
              const referFloor = this.currFloor >= 0
                ? this.currFloor + 1
                : this.currFloor
              const index = floorData.findIndex(v => referFloor == v.value)
              const mapFloor = document.getElementById('map-operators-floor-total')
              const itemHeight = mapFloor.scrollHeight / floorData.length
              const scrollHeight = (index - 1) * itemHeight
              mapFloor.scrollTop = scrollHeight
              this.getList()
              this.getTime()
            })
          })
        })
        this.forceChange()
      },
      calcFloorList(map) {
        const maxFloor = map.getMaxLevel()
        const minFloor = map.getMinLevel()
        let minArr = []
        if (minFloor <= -1) {
          minArr = Array.from({ length: -minFloor }, (v, i) => {
            return { label: 'B' + (i + 1), value: -(i + 1) }
          }).reverse()
        }
        const maxArr = Array.from({ length: maxFloor }, (v, i) => {
          return { label: (i + 1) + 'F', value: (i + 1) }
        })
        return [...minArr, ...maxArr].reverse()
      },
      filterClass(mapFloor) {
        const referFloor = this.currFloor >= 0 ? this.currFloor + 1 : this.currFloor
        return mapFloor == referFloor ? 'chooseItem' : ''
      },
      changeFloor(v) {
        const level = v >= 0 ? v - 1 : v
        if (level == this.currFloor) {
          return false
        }
        this.currFloor = level
        this.map.setLevel(this.currFloor)
        this.devicesMarkerList.forEach(v => v.marker.remove())
        this.devicesMarkerList = []
        if (this.tempMarker) {
          this.tempMarker.remove()
          this.tempPop.remove()
          this.tempMarker = null
          this.tempPop = null
          this.tempArr = []
        }
        this.floorObj[this.currFloor].forEach((v, i) => {
          this.generateMarker(v)
        })
      },
      handleDelete(data) {
        deleteUser(data).then(() => {
          this.getList()
        })
      },
      handleExport() {
        exportFlie({ mapId: this.mapId }).then(res => {
          const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
          const url = window.URL.createObjectURL(blob)
          const aLink = document.createElement('a')
          aLink.style.display = 'none'
          aLink.href = url
          aLink.setAttribute('download', new Date().getTime() + '.xlsx')
          document.body.appendChild(aLink)
          aLink.click()
          document.body.removeChild(aLink) // 下载完成移除元素
          window.URL.revokeObjectURL(url) // 释放掉blob对象
        })
      },
      forceChange() {
        this.$forceUpdate()
      },
      handleSelectionChange(v) {
        this.deleteUsers = v.reduce((total, curr) => total + curr.serviceTypeId + ',', '')
      },
      async getMinis() {
        const res = await getAllMini()
        this.minis = res
      },
      async getPartners() {
        const res = await getPartners()
        this.partners = res
      }
    }
  }
</script>

<style lang="scss">
  .map-body {
    width: 100vw;
    height: 100vh;
  }

  .span-position {
    position: absolute;
    left: 5px;
    color: white;
  }

  .mapboxgl-popup-content {
    padding: 0 !important;
  }

  .markerPop {
    /*width: 100px;*/
    /*height: 100px;*/
    .markerPop-head {
      width: 274px;
      height: 24px;
      line-height: 24px;
      background-color: #409FFF;
      position: absolute;
      padding: 0 10px;
      top: 0;
      color: white;
      i {
        position: absolute;
        right: 8px;
        top: 6px;
      }
    }
    .markerPop-body {
      width: 274px;
      min-height: 100px;
      padding: 0 10px;
      margin-top: 25px;
      ul, li {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .mt10 {
        margin-top: 5px;
      }
    }
    .markerPop-foot {
      display: flex;
      justify-content: space-around;
      padding: 15px 0;
      position: relative;
      button {
        cursor: pointer;
        border-radius: 4px;
      }
      .btn1 {
        height: 30px;
        width: 80px;
        border: 1px solid rgba(220, 223, 230, 1);
        background-color: white;
        outline: none;
        color: #999999;
      }
      .btn2 {
        height: 30px;
        background: rgba(64, 159, 255, 1);
        border: 1px solid rgba(92, 176, 249, 1);
        outline: none;
        color: white;
      }
      .list-count {
        position: absolute;
        left: 0;
        top: 2px;
      }
    }
    .markerPop-position {
      justify-content: right;
      flex-direction: row-reverse;
    }
    .groupList {
      height: 150px;
      overflow-y: auto;
    }
  }

  .last-train {
    background: rgba(255, 255, 255, 0.7);
    box-shadow: 0px 0px 5px 0px rgba(148, 148, 148, 0.72);
    border-radius: 2px;
    position: absolute;
    top: 100px;
    left: 30px;
    padding: 10px 30px;
  }

  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  .map-operators-floor-total::-webkit-scrollbar {
    width: 3px;
    height: 14px;
    background-color: #F5F5F5;
  }

  /*定义滚动条轨道 内阴影+圆角*/
  .map-operators-floor-total::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #F5F5F5;
  }

  /*定义滑块 内阴影+圆角*/
  .map-operators-floor-total::-webkit-scrollbar-thumb {
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
    background-color: #555;
  }

  .map-operators-floor-total {
    right: 10px;
    bottom: 30px;
    position: fixed;
    height: 180px;
    width: 32px;
    z-index: 1;
    overflow-y: auto;
    overflow-x: hidden;
    background: rgba(255, 255, 255, 1);
    border-radius: 5px;
    box-shadow: 0px 2px 6px 0px rgba(119, 119, 119, 0.3);
    .chooseItem {
      background: rgba(10, 153, 241, 1);
      color: white;
    }
    ul {
      padding: 0;
      margin: 0;
    }
    ul > li {
      width: 30px;
      height: 27px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #666666;
      font-size: 16px;
      font-family: PingFang-SC-Heavy;
      font-weight: 800;
      cursor: pointer;
    }
  }
</style>
