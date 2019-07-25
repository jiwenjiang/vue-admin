<template>
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
            v-model="listQuery.minis"
            class="filter-item"
            placeholder="选择"
            style="width: 120px"
            @change="forceChange"
          >
            <el-option
              v-for="item in partners"
              :key="item.programName"
              :label="item.programName"
              :value="item.programName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属区域">
          <el-input v-model="listQuery.mapName" placeholder="请输入地图区域名称" style="width: 120px"/>
        </el-form-item>
        <el-form-item label="选择时间">
          <div style="width: 290px">
            <el-col :span="11">
              <el-date-picker
                v-model="listQuery.startTime"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="开始时间"
                style="width: 100%;"
              />
            </el-col>
            <el-col class="line" :span="2" style="text-align: center">-</el-col>
            <el-col :span="11">
              <el-date-picker
                v-model="formInline.endTime"
                type="date"
                placeholder="结束时间"
                style="width: 100%;"
              />
            </el-col>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="handleDelete(deleteUsers)">批量删除</el-button>
          <el-button type="warning" icon="el-icon-upload2">导入</el-button>
          <el-button type="primary" icon="el-icon-download" @click="handleExport()">导出</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column label="指纹库文件名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.areaName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="存储路径" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.serviceTypeId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属地图区域" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mapName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.longitude+','+scope.row.latitude }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件大小" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="版本号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            更新
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            下载
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row.functionAreaId)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page-1"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />

    <div v-if="dialogFormVisible" class="map-box">
      <div class="map-container">
        <div class="map-head">
          <span>{{dialogStatus}}</span>
          <i class="el-icon-close" style="cursor: pointer" @click="dialogFormVisible=false"></i>
        </div>
        <div id="map-body" class="map-body"></div>
        <div class="map-foot">
          <el-form
            ref="dataForm"
            :rules="rules"
            :model="userForm"
            label-position="top"
            size="mini"
            style="height: 75vh"
          >
            <el-form-item label="数据名称：" prop="areaName">
              <el-input v-model="userForm.areaName" placeholder="请输入分类名称"/>
            </el-form-item>
            <el-form-item label="合作方：" prop="partnerName">
              <el-select
                v-model="userForm.partnerName"
                clearable
                class="filter-item"
                placeholder="选择"
                style="width: 100%"
                @change="searchMini"
              >
                <el-option
                  v-for="item in partners"
                  :key="item.partnerId"
                  :label="item.partnerName"
                  :value="item.partnerId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="小程序：" prop="partnersMini">
              <el-select
                v-model="userForm.programName"
                class="filter-item"
                placeholder="选择"
                style="width: 100%"
                @change="searchArea"
              >
                <el-option
                  v-for="item in partnersMini"
                  :key="item.programName"
                  :label="item.programName"
                  :value="item.programId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="地图区域：" prop="mapId2">
              <el-select
                v-model="userForm.mapId"
                class="filter-item"
                style="width: 100%"
                placeholder="选择"
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
            <el-form-item label="分类类型：" prop="serviceType">
              <el-select
                v-model="userForm.serviceType"
                class="filter-item"
                style="width: 100%"
                placeholder="选择"
                @change="chooseType"
              >
                <el-option
                  v-for="item in types"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="所属分类：" prop="serviceTypeId">
              <el-select
                v-model="userForm.serviceTypeId"
                class="filter-item"
                style="width: 100%"
                placeholder="选择"
                @change="forceChange"
              >
                <el-option
                  v-for="item in serviceTypeIds"
                  :key="item.serviceTypeId"
                  :label="item.serviceName"
                  :value="item.serviceTypeId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="位置：" prop="longitudeAndLatitude">
              <el-input v-model="userForm.longitudeAndLatitude" placeholder="经纬度"/>
            </el-form-item>
            <el-form-item label="排序：" prop="orderid">
              <el-input v-model="userForm.orderid" type="number" placeholder="前一个分类排序为5，推荐排序6"/>
            </el-form-item>
            <div style="text-align: center;margin: 10px">
              <el-button type="primary" size="small" @click="submitForm(dialogStatus)">
                提交
              </el-button>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <!--<el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" top="10vh" width="460px">-->

    <!--<div slot="footer" class="dialog-footer">-->
    <!--<el-button @click="dialogFormVisible = false">-->
    <!--取消-->
    <!--</el-button>-->
    <!---->
    <!--</div>-->
    <!--</el-dialog>-->
  </div>
</template>

<script>
  import { getList, addUser, editUser, deleteUser, exportFlie } from '@/api/dataManage/data'
  import { getPartners, getMini } from '@/api/partner'
  import { getAllMini, getBindList } from '@/api/dataManage/mini'
  import { searchType } from '@/api/dataManage/type'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import locImg from '@/assets/custom-theme/loc.png'
  // import * as creeper from '@/utils/mapbox-gl'

  export default {
    name: 'ComplexTable',
    components: { Pagination },
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
          startTime: null,
          endTime: null,
          programName: ''
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
        confMarker: ''
      }
    },
    created() {
      this.getList()
      this.getPartners()
      this.getMinis()
    },
    methods: {
      handleClose() {
        this.showSelect = false
      },
      async getList() {
        this.listLoading = false
        const res = await getList(this.listQuery)
        this.list = res.list
        this.total = res.total
      },
      searchMini(id, cb) {
        getMini(id).then(res => {
          this.partnersMini = res
          cb && cb()
        })
        this.forceChange()
      },
      searchArea(id, cb) {
        getBindList(id).then(res => {
          this.areas = res.zones
          cb && cb()
        })
        this.forceChange()
      },
      chooseMap(id) {
        creeper.CreeperConfig.token = 'bG9jYXRpb246YzFmNWZmZDg4ZWNkYzQyZDJlYzFkZjViYTU1OWU4MTA='
        this.$nextTick(() => {
          const map = new creeper.VectorMap('map-body', id, 'https://cmgis.parkbobo.com/')
          map.on('click', (e) => {
            this.userForm.longitudeAndLatitude = e.lngLat.lng + ',' + e.lngLat.lat
            this.forceChange()
            if (this.confMarker) {
              this.confMarker.setLngLat([e.lngLat.lng, e.lngLat.lat])
            } else {
              const el = document.createElement('div')
              el.style.width = '20px'
              const img = document.createElement('img')
              img.src = locImg
              img.style.width = '20px'
              el.appendChild(img)
              this.confMarker = new creeper.Marker(el).setLngLat([e.lngLat.lng, e.lngLat.lat])
                .addTo(map)
            }
          })
        })
        this.forceChange()
      },
      chooseType(id) {
        searchType({ serviceType: id, mapId: this.userForm.mapId }).then(res => {
          this.serviceTypeIds = res
        })
        this.forceChange()
      },
      handleDelete(data) {
        deleteUser(data).then(() => {
          this.getList()
        })
      },
      handleExport() {
        exportFlie(this.listQuery).then(res => {
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
      deleteCheckbox(key) {
        this.boxs[key] = false
      },
      handleSelectionChange(v) {
        this.deleteUsers = v.reduce((total, curr) => total + curr.serviceTypeId + ',', '')
      },
      resetForm() {
        this.userForm = {
          serviceTypeId: undefined,
          serviceName: '',
          orderid: '',
          mapId: '',
          serviceType: '',
          iconImg: ''
        }
        this.imageUrl = ''
      },
      toUploadFile(res) {
        this.userForm.iconImg = res.file
        this.imageUrl = URL.createObjectURL(res.file)
      },
      handleCreate() {
        this.resetForm()
        this.dialogStatus = '添加'
        this.dialogFormVisible = true
        // this.$nextTick(() => {
        //   this.$refs['dataForm'].clearValidate()
        // })
      },
      handleUpdate(row) {
        console.log(row)
        this.userForm = Object.assign({}, row)
        this.userForm.partnerName = row.partners && row.partners[0].partnerId
        this.userForm.longitudeAndLatitude = row.longitude + ',' + row.latitude
        if (this.userForm.partnerName) {
          this.searchMini(this.userForm.partnerName, () => {
            this.userForm.programName = row.programs && row.programs[0].programId
            if (this.userForm.programName) {
              this.searchArea(this.userForm.programName, () => {
                this.userForm.mapId = row.locMapZones && row.locMapZones[0].mapId
                this.chooseMap(this.userForm.mapId)
                searchType({ serviceType: row.serviceType, mapId: this.userForm.mapId }).then(res => {
                  this.serviceTypeIds = res
                })
              })
            }
          })
        }
        this.dialogStatus = '编辑'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      submitForm() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.dialogStatus === '添加'
              ? addUser(this.userForm).then(() => {
                this.getList()
              })
              : editUser(this.userForm).then(() => {
                this.getList()
              })
            this.dialogFormVisible = false
          }
        })
      },
      handleCheckChange(e) {
        // console.log(e)
        // console.log(this.boxs)
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

<style lang="scss" scoped>
  .map-box {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background: rgba(39, 39, 39, 0.4);
    z-index: 1002;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    .map-container {
      position: relative;
      width: 80vw;
      height: 80vh;
      .map-head {
        width: 80vw;
        height: 5vh;
        background-color: #409FFF;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        font-size: 14px;
        color: white;
      }
      .map-body {
        width: 80vw;
        height: 75vh;
        background-color: white;
      }
      .map-foot {
        width: 220px;
        height: 75vh;
        overflow-y: auto;
        background: rgba(255, 255, 255, 0.7);
        box-shadow: 0px 5px 7px 0px rgba(0, 0, 0, 0.17);
        position: absolute;
        left: 0;
        bottom: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 15px;
        font-size: 14px;
        color: rgba(39, 40, 40, 1);
      }
    }
  }
</style>
