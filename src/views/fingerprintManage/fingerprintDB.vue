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
          <el-input v-model="listQuery.name" placeholder="请输入地图区域名称" style="width: 120px"/>
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
          <span>{{ scope.row.fileName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="存储路径" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.filePath }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属地图区域" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="warning" size="mini" @click="handleUpdate(row)">
            更新
          </el-button>
          <el-button type="success" size="mini" @click="handleExport(row)">
            下载
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

    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" top="10vh" width="460px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="userForm"
        label-position="left"
        label-width="100px"
        style="width: 420px;"
      >
        <el-form-item label="指纹库文件：" prop="userCode">
          <el-input v-model="userForm.filename" placeholder="未选择文件" readonly style="width: 240px"/>
          <span class="chooseFile" @click="chooseFile">选择文件</span>
          <input type="file" id="upfile" class="file-input"/>
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

    <el-dialog
      title="更新中"
      :visible.sync="dialogVisible"
      width="500px"
      :before-close="handleClose">
      <el-slider v-model="uploadProgress" :show-tooltip="false" style="width: 430px"></el-slider>
      <span class="progress-value">{{uploadProgress}}%</span>
    </el-dialog>
  </div>
</template>

<script>
  import { getDBList, exportFlie, importLib } from '@/api/fingerprint'
  import { getPartners, getMini } from '@/api/partner'
  import { getAllMini, getBindList } from '@/api/dataManage/mini'
  import { searchType } from '@/api/dataManage/type'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
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
        uploadProgress: 0,
        listQuery: {
          page: 0,
          pageSize: 10,
          partnerName: '',
          name: '',
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
        dialogVisible: false,
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
        const res = await getDBList(this.listQuery)
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
      chooseFile() {
        const file = document.getElementById('upfile')
        file.click()
        file.addEventListener('change', () => {
          const filename = file.files[0].name
          this.userForm.filename = filename
          this.userForm.classLib = file.files[0]
          this.forceChange()
        })
      },
      handleExport(e) {
        exportFlie({ mapId: e.mapId }).then(res => {
          const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
          const url = window.URL.createObjectURL(blob)
          const aLink = document.createElement('a')
          aLink.style.display = 'none'
          aLink.href = url
          aLink.setAttribute('download', new Date().getTime() + '.zip')
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
        this.uploadProgress = 0
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
        this.dialogStatus = '更新'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      submitForm() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.dialogVisible = true
            this.dialogFormVisible = false
            const formData = new FormData()
            formData.append('mapId', this.userForm.mapId)
            formData.append('classLib', this.userForm.classLib)
            importLib(formData, (e) => {
              this.uploadProgress = e
              this.forceChange()
            }).then(() => {
              this.dialogVisible = false
            })
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

  .chooseFile {
    position: absolute;
    width: 75px;
    height: 36px;
    background: #409FFF;
    left: 222px;
    border-radius: 3px;
    text-align: center;
    color: white;
  }

  .file-input {
    visibility: hidden;
    position: absolute;
  }

  .progress-value {
    position: absolute;
    right: 15px;
    top: 95px;
    color: #999999;
  }
</style>
