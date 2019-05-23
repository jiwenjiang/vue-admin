<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline" size="mini">
        <el-form-item label="账号">
          <el-input v-model="listQuery.userName" placeholder="请输入账号" style="width: 120px"/>
        </el-form-item>
        <el-form-item label="用户角色" prop="role">
          <el-select
            v-model="listQuery.role"
            clearable
            class="filter-item"
            placeholder="选择"
            style="width: 120px"
            @change="forceChange"
          >
            <el-option
              v-for="item in roles"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="来源模块" prop="source">
          <el-input v-model="listQuery.source" placeholder="请输入账号" style="width: 120px"/>
        </el-form-item>
        <el-form-item label="操作类型" prop="method">
          <el-select
            v-model="listQuery.method"
            clearable
            class="filter-item"
            placeholder="选择"
            style="width: 120px"
            @change="forceChange"
          >
            <el-option
              v-for="item in methods"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
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
          <el-button type="danger" icon="el-icon-delete" @click="handleDelete(deleteUsers)">批量删除</el-button>
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
      <el-table-column label="账号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户角色" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.rule }}</span>
        </template>
      </el-table-column>
      <el-table-column label="来源模块" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.source }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.method }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作描述" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="danger" @click="handleDelete(row.logId)">
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
  </div>
</template>

<script>
  import { getList, deleteLog, exportFlie } from '@/api/log'
  import { getRoles } from '@/api/role'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  export default {
    name: 'ComplexTable',
    components: { Pagination },
    data() {
      return {
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: false,
        listQuery: {
          page: 0,
          pageSize: 10,
          userName: '',
          startTime: null,
          endTime: null,
          role: '',
          source: '',
          method: ''
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
        methods: [
          {
            name: '添加'
          },
          {
            name: '修改'
          },
          {
            name: '删除'
          },
          {
            name: '查询'
          }
        ],
        dialogStatus: '添加',
        dialogFormVisible: false,
        roles: [],
        partners: [],
        deleteUsers: ''
      }
    },
    created() {
      this.getList()
      this.getRolesAll()
    },
    methods: {
      async getList() {
        this.listLoading = false
        const res = await getList(this.listQuery)
        this.list = res.list
        this.total = res.total
      },
      handleDelete(data) {
        deleteLog(data).then(() => {
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
        this.deleteUsers = v.reduce((total, curr) => total + curr.logId + ',', '')
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
      },
      async getRolesAll() {
        const res = await getRoles()
        this.roles = res
        console.log('role', res)
      }
    }
  }
</script>
