<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline" size="mini">
        <el-form-item label="合作方" prop="partnerIdArr">
          <el-select
            v-model="listQuery.partner"
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
        <el-form-item label="小程序">
          <el-input v-model="listQuery.programName" placeholder="请输入小程序名称" style="width: 120px"/>
        </el-form-item>
        <el-form-item label="地图区域">
          <el-input v-model="listQuery.name" placeholder="请输入地图区域名称" style="width: 120px"/>
        </el-form-item>
        <el-form-item label="公众号">
          <el-input v-model="listQuery.wxName" placeholder="请输入公众号名称" style="width: 120px"/>
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
                v-model="listQuery.endTime"
                type="date"
                placeholder="结束时间"
                style="width: 100%;"
              />
            </el-col>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
          <el-button type="success" icon="el-icon-edit" @click="handleCreate">添加</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="handleDelete(deleteUsers)">批量删除</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click="areaSync">CMGIS区域同步</el-button>
          <el-button style="background-color: #51D4D2;color: white" icon="el-icon-upload2">导入
          </el-button>
          <el-button type="warning" icon="el-icon-download" @click="handleExport()">导出</el-button>
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
      <el-table-column label="合作方名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.partnerName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="区域LOGO" align="center">
        <template slot-scope="scope">
          <img :src="baseUrl+scope.row.logo" style="width: 38px;height: 38px" alt="">
        </template>
      </el-table-column>
      <el-table-column label="是否显示商标" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.watermark?'是':'否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="定位配置" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.locType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地域区域" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="`地图ID:${scope.row.mapId}`" placement="right-end">
            <span>{{ scope.row.name }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="绑定类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="经纬度" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.longitude+','+ scope.row.latitude}}</span>
        </template>
      </el-table-column>
      <el-table-column label="小程序" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.programName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公众号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.wxName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.status" effect="plain">已开启</el-tag>
          <el-tag size="small" v-else effect="plain" type="danger">已关闭</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width areaBtn">
        <template slot-scope="scope">
          <el-tag size="small" v-if="!scope.row.watermark" color="#45D1A8"
                  @click="openMark({id:scope.row.id,watermark :true})">显示商标
          </el-tag>
          <el-tag size="small" v-else color="#3AC8E2" @click="openMark({id:scope.row.id,watermark :false})">隐藏商标
          </el-tag>
          <el-tag size="small" v-if="scope.row.status" color="#EF9302"
                  @click="openMap({id:scope.row.id,watermark :false})">关闭
          </el-tag>
          <el-tag size="small" v-else color="#409EFF" @click="openMap({id:scope.row.id,status:true})">开启</el-tag>
          <el-tag size="small" color="#F86746" @click="setPoint(scope.row)">设置中心点</el-tag>
          <el-tag size="small" color="#66C33A" @click="handleUpdate(scope.row)">编辑</el-tag>
          <el-tag size="small" color="#F85151" @click="handleDelete(scope.row.id)">删除</el-tag>
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

    <div v-if="showMap" class="map-box">
      <div class="map-container">
        <div class="map-head">
          <span>设置中心点(拖动中心点图标设置)</span>
          <i class="el-icon-close" style="cursor: pointer" @click="showMap=false"></i>
        </div>
        <div id="map-body" class="map-body"></div>
        <div class="map-foot">
          <span>经纬度：{{transPt[0]+','+transPt[1]}}</span>
          <el-button type="primary" @click="mapSubmit" size="mini">提交</el-button>
        </div>
      </div>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="alertDialogVisible"
      width="30%"
    >
      <span>{{dialogContent}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="alertDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmDialog">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" top="10vh" width="550px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="userForm"
        label-position="left"
        label-width="120px"
        style="width: 480px;"
      >
        <el-form-item label="区域ID：" prop="mapId">
          <el-input v-model="userForm.mapId" placeholder="请输入地图区域ID,保持与CMGIS一致"/>
        </el-form-item>
        <el-form-item label="地图区域：" prop="name">
          <el-input v-model="userForm.name" placeholder="请输入地图区域名称"/>
        </el-form-item>
        <el-form-item label="区域LOGO：" prop="logo">
          <el-upload
            action=""
            class="avatar-uploader"
            :show-file-list="false"
            :http-request="toUploadFile">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="定位配置：" prop="locType">
          <el-radio-group v-model="userForm.locType">
            <el-radio label="IAO">室内外</el-radio>
            <el-radio label="I">室内</el-radio>
            <el-radio label="O">室外</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动性质">
          <el-checkbox-group v-model="userForm.navigationMode">
            <el-checkbox label="1">人走</el-checkbox>
            <el-checkbox label="2">车走</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="默认进入：" prop="defaultEntry">
          <el-radio-group v-model="userForm.defaultEntry">
            <el-radio label="index">内容首页</el-radio>
            <el-radio label="map">地图页面</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否显示商标：" prop="watermark">
          <el-radio-group v-model="userForm.watermark">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="绑定类型：" prop="typeName">
          <el-radio-group v-model="userForm.typeName">
            <el-radio label="car">停车场</el-radio>
            <el-radio label="Addressing">医院</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="公众号：" prop="wxName">
          <el-select v-model="userForm.wxName" filterable placeholder="请选择公众号">
            <el-option
              v-for="item in wxLists"
              :key="item.wxName"
              :label="item.wxName"
              :value="item.wxName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="小程序：" prop="wxName">
          <el-select
            v-model="userForm.programIds"
            class="filter-item"
            placeholder="选择"
            style="width: 120px"
            @change="forceChange"
          >
            <el-option
              v-for="item in minis"
              :key="item.programId"
              :label="item.programName"
              :value="item.programId"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="submitForm(dialogStatus)">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getAreaList,
    updateStatus,
    deleteUser,
    updateMarker,
    addUser,
    submitCenter,
    exportFlie,
    editUser,
    synchro
  } from '@/api/dataManage/area'
  import { getAllWX } from '@/api/official'
  import { getPartners } from '@/api/partner'
  import { userMini } from '@/api/dataManage/mini'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import coordtransform from 'coordtransform'
  import locImg from '@/assets/custom-theme/loc.png'

  export default {
    name: 'ComplexTable',
    components: { Pagination },
    data() {
      const validateRequire = (rule, value, callback) => {
        if (this.imageUrl) {
          callback()
        } else {
          callback(new Error('logo必传'))
        }
      }
      return {
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: false,
        listQuery: {
          page: 0,
          name: '',
          wxName: '',
          pageSize: 10,
          partnerName: '',
          programName: '',
          startTime: null,
          endTime: null
        },
        userForm: {
          id: undefined,
          mapId: '',
          name: '',
          logo: '',
          locType: 'IAO',
          defaultEntry: 'index',
          watermark: true,
          typeName: 'car',
          wxName: '',
          navigationMode: []
        },
        rules: {
          mapId: [{ required: true, message: '地图必填', trigger: 'blur' }],
          name: [{ required: true, message: '地图区域必填', trigger: 'blur' }],
          logo: [{ validator: validateRequire, trigger: 'blur' }]
        },
        showMap: false,
        dialogStatus: '添加',
        dialogFormVisible: false,
        alertDialogVisible: false,
        roles: [],
        partners: [],
        chooseArea: [],
        deleteUsers: '',
        dialogTitle: '',
        dialogContent: '',
        imageUrl: '',
        wxLists: [],
        transPt: [],
        baseUrl: this._baseUrl,
        minis: []
      }
    },
    created() {
      this.getList()
      this.getPartners()
      this.getMinis()
    },
    methods: {
      async getList() {
        this.listLoading = false
        const res = await getAreaList(this.listQuery)
        this.list = res.list
        this.total = res.total
      },
      async getMinis() {
        const res = await userMini()
        this.minis = res
        console.log(4444, res)
      },
      openMap(data) {
        this.alertDialogVisible = true
        if (data.status == '开启') {
          this.dialogTitle = '关闭'
          this.dialogContent = '确定关闭该地图区域吗？（关闭后，小程序将不显示该 区域）'
        } else {
          this.dialogTitle = '开启'
          this.dialogContent = '确定开启该地图区域吗？'
        }
        this.confirmDialog = () => {
          this.alertDialogVisible = false
          updateStatus(data).then(res => {
            this.getList()
          })
        }
      },
      openMark(data) {
        updateMarker(data).then(() => {
          this.getList()
        })
      },
      areaSync() {
        this.$confirm('是否进行覆盖', 'CMGIS区域同步', {
          confirmButtonText: '覆盖更新',
          cancelButtonText: '不覆盖更新'
        }).then(() => {
          synchro({ flag: true })
        }).catch(() => {
          synchro({ flag: false })
        })
      },
      setPoint(row) {
        this.currentProgramId = row.id
        this.showMap = true
        this.$nextTick(() => {
          const map = new BMap.Map('map-body')
          map.enableScrollWheelZoom(true)
          this.transPt = [row.longitude, row.latitude]
          let center = coordtransform.wgs84togcj02(row.longitude, row.latitude)
          center = coordtransform.gcj02tobd09(center[0], center[1])
          const point = new BMap.Point(center[0], center[1])
          map.centerAndZoom(point, 12)
          const bbox = row.bbox.split(',')
          let pt1 = [bbox[0], bbox[1]]
          pt1 = coordtransform.wgs84togcj02(pt1[0], pt1[1])
          pt1 = coordtransform.gcj02tobd09(pt1[0], pt1[1])
          let pt2 = [bbox[2], bbox[3]]
          pt2 = coordtransform.wgs84togcj02(pt2[0], pt2[1])
          pt2 = coordtransform.gcj02tobd09(pt2[0], pt2[1])
          const minLng = Math.min(pt1[0], pt2[0])
          const minLat = Math.min(pt1[1], pt2[1])
          const maxLng = Math.max(pt1[0], pt2[0])
          const maxLat = Math.max(pt1[1], pt2[1])

          const a1 = [pt1[0], pt2[1]]
          const a2 = [pt2[0], pt1[1]]
          var rectangle = new BMap.Polygon([
            new BMap.Point(pt1[0], pt1[1]),
            new BMap.Point(a1[0], a1[1]),
            new BMap.Point(pt2[0], pt2[1]),
            new BMap.Point(a2[0], a2[1])
          ], { fillColor: '#F5573D', strokeColor: '#F5573D', strokeOpacity: 0.3 })
          const myIcon = new BMap.Icon(locImg, new BMap.Size(30, 30))
          this.marker = new BMap.Marker(point, { icon: myIcon })
          this.marker.enableDragging()
          this.marker.addEventListener('dragend', (e) => {
            const pt = e.point
            if (pt.lng > maxLng) {
              pt.lng = maxLng
            }
            if (pt.lng < minLng) {
              pt.lng = minLng
            }
            if (pt.lat > maxLat) {
              pt.lat = maxLat
            }
            if (pt.lat < minLat) {
              pt.lat = minLat
            }
            this.marker.setPosition(pt)
            let transPt = coordtransform.bd09togcj02(pt.lng, pt.lat)
            transPt = coordtransform.gcj02towgs84(transPt[0], transPt[1])
            this.transPt = transPt
          })
          map.addOverlay(rectangle)
          map.addOverlay(this.marker)
        })

// 创建点坐标
      },
      mapSubmit() {
        submitCenter(
          {
            id: this.currentProgramId,
            longitude: this.transPt[0],
            latitude: this.transPt[1]
          }
        ).then(() => {
          this.showMap = false
          this.getList()
        })
      },
      confirmDialog() {
      },
      handleDelete(data) {
        this.alertDialogVisible = true
        this.dialogTitle = '删除'
        this.dialogContent = '确定删除该地图区域吗？'
        this.confirmDialog = () => {
          this.alertDialogVisible = false
          deleteUser(data).then(() => {
            this.getList()
          })
        }
      },
      toUploadFile(res) {
        this.userForm.logo = res.file
        this.imageUrl = URL.createObjectURL(res.file)
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
      addArea(row) {
        if (this.chooseArea.indexOf(row.id) > -1) {
          this.chooseArea = this.chooseArea.filter(v => v != row.id)
        } else {
          this.chooseArea.push(row.id)
        }
      },
      handleSelectionChange(v) {
        this.deleteUsers = v.reduce((total, curr) => total + curr.programId + ',', '')
      },
      resetForm() {
        this.userForm = {
          id: undefined,
          mapId: '',
          name: '',
          logo: '',
          locType: 'IAO',
          defaultEntry: 'index',
          watermark: true,
          typeName: 'car',
          wxName: '',
          programIds: '',
          navigationMode: []
        }
      },
      handleCreate() {
        this.resetForm()
        this.activeName = 'v-directive'
        this.currentProgramId = null
        this.dialogStatus = '添加'
        this.dialogFormVisible = true
        this.getAllWX()
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
        // this.getBindList()
        // this.getNoBindList()
        // this.getOtherBindList()
      },
      forceChange() {
        this.$forceUpdate()
      },
      getAllWX() {
        getAllWX().then(res => {
          this.wxLists = res
        })
      },
      handleUpdate(row) {
        this.currentProgramId = row.id
        this.userForm = Object.assign({}, row)
        this.imageUrl = this._baseUrl + row.logo
        // this.userForm.partnerIdArr = row.partners[0].partnerId
        // this.userForm.ruleIdArr = row.rules[0].ruleId
        this.dialogStatus = '编辑'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      submitForm() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const formData = new FormData()
            Object.keys(this.userForm).forEach((key) => {
              formData.append(key, this.userForm[key])
            })
            if (this.dialogStatus === '添加') {
              addUser(formData).then(() => {
                this.getList()
              })
            } else {
              editUser(formData).then(() => {
                this.getList()
              })
            }
            this.dialogFormVisible = false
          }
        })
      },
      async getPartners() {
        const res = await getPartners()
        this.partners = res
      }
    }
  }
</script>

<style lang="scss">
  .areaBtn {
    .el-tag {
      color: white;
      cursor: pointer;
    }
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 24px;
    color: #8c939d;
    width: 128px;
    height: 128px;
    line-height: 128px;
    text-align: center;
  }

  .avatar {
    width: 128px;
    height: 128px;
    display: block;
  }

  .anchorBL {
    display: none;
  }

  .map-box {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background: rgba(39, 39, 39, 0.4);
    z-index: 1;
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
      }
      .map-foot {
        width: 80vw;
        height: 7vh;
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
