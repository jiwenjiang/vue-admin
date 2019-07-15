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
        <el-form-item label="分类名称">
          <el-input v-model="listQuery.serviceName" placeholder="请输入公众号名称" style="width: 120px"/>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select
            v-model="listQuery.serviceType"
            class="filter-item"
            placeholder="选择"
            style="width: 120px"
            @change="forceChange"
          >
            <el-option
              v-for="item in types"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
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
          <el-button type="success" icon="el-icon-edit" @click="handleCreate">添加</el-button>
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
      <el-table-column label="分类图标" align="center">
        <template slot-scope="scope">
          <img :src="baseUrl+scope.row.iconImg" style="width: 38px;height: 38px" alt="">
        </template>
      </el-table-column>
      <el-table-column label="分类名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.serviceName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属区域" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.locMapZones[0]&&scope.row.locMapZones[0].name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.serviceType==1?'图片类型':'文字类型' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row.serviceTypeId)">
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

    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" top="10vh" width="460px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="userForm"
        label-position="right"
        label-width="100px"
        style="width: 420px;"
      >
        <el-form-item label="分类图标：" prop="iconImg">
          <el-upload
            action=""
            class="avatar-uploader"
            :show-file-list="false"
            :http-request="toUploadFile">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="分类名称：" prop="serviceName">
          <el-input v-model="userForm.serviceName" placeholder="请输入分类名称"/>
        </el-form-item>
        <el-form-item label="合作方名称" prop="partnerIdArr">
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
        <el-form-item label="小程序" prop="partnerIdArr">
          <el-select
            v-model="userForm.minis"
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
        <el-form-item label="地图区域：" prop="mapId">
          <el-select
            v-model="userForm.mapId"
            class="filter-item"
            style="width: 100%"
            placeholder="选择"
            @change="forceChange"
          >
            <el-option
              v-for="item in areas"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="类型：" prop="serviceType">
          <el-select
            v-model="userForm.serviceType"
            class="filter-item"
            style="width: 100%"
            placeholder="选择"
            @change="forceChange"
          >
            <el-option
              label="图片类型"
              value="1"
            />
            <el-option
              label="文字类型"
              value="2"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序：" prop="orderid">
          <el-input v-model="userForm.orderid" type="number" placeholder="前一个分类排序为5，推荐排序6"/>
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
  import { getList, addUser, editUser, deleteUser, exportFlie } from '@/api/dataManage/type'
  import { getPartners, getMini } from '@/api/partner'
  import { getAllMini, getBindList } from '@/api/dataManage/mini'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  export default {
    name: 'ComplexTable',
    components: { Pagination },
    data() {
      const validateRequire = (rule, value, callback) => {
        if (this.imageUrl) {
          callback()
        } else {
          callback(new Error('图标必传'))
        }
      }
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
        value: '',
        userForm: {
          serviceTypeId: undefined,
          serviceName: '',
          orderid: '',
          mapId: '',
          serviceType: '',
          iconImg: ''
        },
        rules: {
          serviceName: [{ required: true, message: '分类名称必填', trigger: 'blur' }],
          mapId: [{ required: true, message: '地图区域必填', trigger: 'change' }],
          iconImg: [{ validator: validateRequire, trigger: 'blur' }],
          serviceType: [{ required: true, message: '类型必填', trigger: 'change' }],
          orderid: [{ required: true, message: '排序必填', trigger: 'blur' }]
        },
        dialogStatus: '添加',
        dialogFormVisible: false,
        roles: [],
        partners: [],
        partnersMini: [],
        deleteUsers: '',
        baseUrl: this._baseUrl
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
      searchMini(id) {
        getMini(id).then(res => {
          this.partnersMini = res
        })
        this.forceChange()
      },
      searchArea(id) {
        getBindList(id).then(res => {
          this.areas = res.zones
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
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleUpdate(row) {
        console.log(row)
        this.userForm = Object.assign({}, row)
        this.imageUrl = this._baseUrl + row.iconImg
        this.dialogStatus = '编辑'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      submitForm() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.userForm.mapId = this.areas.filter(v => v.id == this.userForm.mapId)[0].mapId
            const formData = new FormData()
            Object.keys(this.userForm).forEach((key) => {
              formData.append(key, this.userForm[key])
            })
            this.dialogStatus === '添加'
              ? addUser(formData).then(() => {
                this.getList()
              })
              : editUser(formData).then(() => {
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
        // const area = await getAreaAll()
      },
      async getPartners() {
        const res = await getPartners()
        this.partners = res
      }
    }
  }
</script>

<style lang="scss">

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

</style>
