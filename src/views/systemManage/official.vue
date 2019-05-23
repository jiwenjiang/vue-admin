<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline" size="mini">
        <el-form-item label="公众号名称">
          <el-input v-model="listQuery.chName" placeholder="请输入公众号" style="width: 120px"/>
        </el-form-item>
        <el-form-item label="选择时间">
          <div style="width: 300px">
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
      <el-table-column label="公众号名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.chName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="APP ID" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.appid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="APP Secret" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.secret }}</span>
        </template>
      </el-table-column>
      <el-table-column label="access_token" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.accessToken }}</span>
        </template>
      </el-table-column>
      <el-table-column label="jsapi_ticket" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.jsapiTicket }}</span>
        </template>
      </el-table-column>
      <el-table-column label="token获取类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.buildType==1?'定时器生成':'第三方获取' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row.id)">
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

    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" top="10vh" width="470px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="userForm"
        label-position="right"
        label-width="120px"
        style="width: 380px;"
      >
        <el-form-item label="公众号名称:" prop="chName">
          <el-input v-model="userForm.chName" placeholder="请输入公众号"/>
        </el-form-item>
        <el-form-item label="英文名称:" prop="wxName">
          <el-input v-model="userForm.wxName" placeholder="请输入英文名称"/>
        </el-form-item>
        <el-form-item label="APP ID:" prop="appid">
          <el-input v-model="userForm.appid" placeholder="请输入APP ID"/>
        </el-form-item>
        <el-form-item label="APP Secret:" prop="secret">
          <el-input v-model="userForm.secret" placeholder="请输入APP Secret"/>
        </el-form-item>
        <el-form-item label="token获取类型:" prop="buildType">
          <el-radio v-model="userForm.buildType" label="1">定时器获取</el-radio>
          <el-radio v-model="userForm.buildType" label="2">第三方获取</el-radio>
        </el-form-item>
        <el-form-item label="第三方获取地址:" prop="tokenUrl" v-if="userForm.buildType==2">
          <el-input v-model="userForm.tokenUrl" placeholder="请输入APP Secret"/>
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
  import { getList, addWx, editWx, deleteWx, exportFlie } from '@/api/official'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  export default {
    name: 'ComplexTable',
    components: { Pagination },
    directives: { waves },
    data() {
      return {
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: false,
        listQuery: {
          page: 0,
          pageSize: 10,
          chName: '',
          startTime: null,
          endTime: null
        },
        userForm: {
          id: undefined,
          chName: '',
          wxName: '',
          appid: '',
          secret: '',
          buildType: '1',
          tokenUrl: ''
        },
        rules: {
          chName: [{ required: true, message: '公众号必填', trigger: 'blur' }],
          wxName: [{ required: true, message: '英文名必填', trigger: 'blur' }],
          appid: [{ required: true, message: 'appid必填', trigger: 'blur' }],
          secret: [{ required: true, message: 'secret必填', trigger: 'blur' }],
        },
        dialogStatus: '添加',
        dialogFormVisible: false,
        roles: [],
        partners: [],
        deleteUsers: ''
      }
    },
    created() {
      this.getList()
    },
    methods: {
      async getList() {
        this.listLoading = false
        const res = await getList(this.listQuery)
        this.list = res.list
        this.total = res.total
      },
      handleDelete(data) {
        deleteWx(data).then(() => {
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
      handleSelectionChange(v) {
        this.deleteUsers = v.reduce((total, curr) => total + curr.id + ',', '')
      },
      resetForm() {
        this.userForm = {
          id: undefined,
          chName: '',
          wxName: '',
          appid: '',
          secret: '',
          buildType: '1',
          tokenUrl: ''
        }
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
        this.userForm = Object.assign({}, row)
        this.userForm.buildType = String(this.userForm.buildType)
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
              ? addWx(this.userForm).then(() => {
                this.getList()
              })
              : editWx(this.userForm).then(() => {
                this.getList()
              })
            this.dialogFormVisible = false
          }
        })
      }
    }
  }
</script>
