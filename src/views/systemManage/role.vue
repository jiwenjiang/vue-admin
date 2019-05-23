<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline" size="mini">
        <el-form-item label="角色名称">
          <el-input v-model="listQuery.name" placeholder="请输入角色名称" style="width: 120px" />
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
      <el-table-column label="角色名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编码" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row.userId)">
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

    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" top="10vh" width="420px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="userForm"
        label-position="left"
        label-width="70px"
        style="width: 380px;"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="userForm.name" />
        </el-form-item>
        <el-form-item label="编码" prop="content">
          <el-input v-model="userForm.content" />
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
  import { getRolesList } from '@/api/role'
  import { getPartners } from '@/api/partner'
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
          name: '',
          startTime: null,
          endTime: null
        },
        formInline: {
          user: '',
          region: ''
        },
        userForm: {
          id: undefined,
          name: '',
          password: '',
          realName: '',
          phone: '',
          partnerIdArr: '',
          ruleIdArr: ''
        },
        rules: {
          userCode: [{ required: true, message: '账号必填', trigger: 'blur' }],
          password: [{ required: true, message: '密码必填', trigger: 'blur' }],
          realName: [{ required: true, message: '姓名必填', trigger: 'blur' }],
          phone: [{ required: true, pattern: /^1[3|4|5|7|8|9][0-9]\d{8}$/, message: '输入正确的手机号', trigger: 'blur' }],
          partnerIdArr: [{ required: true, message: '合作方必填', trigger: 'blur' }],
          ruleIdArr: [{ required: true, message: '角色必填', trigger: 'blur' }]
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
      this.getRoles()
      this.getPartners()
    },
    methods: {
      async getList() {
        this.listLoading = false
        const res = await getRolesList(this.listQuery)
        this.list = res.list
        this.total = res.total
      },
      handleDelete(data) {
        deleteRole(data).then(() => {
          this.getList()
        })
      },
      forceChange() {
        this.$forceUpdate()
      },
      handleSelectionChange(v) {
        this.deleteUsers = v.reduce((total, curr) => total + curr.userId + ',', '')
      },
      resetForm() {
        this.userForm = {
          id: undefined,
          userCode: '',
          password: '',
          realName: '',
          phone: '',
          partnerIdArr: '',
          ruleIdArr: ''
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
        this.userForm.partnerIdArr = row.partners[0].partnerId
        this.userForm.ruleIdArr = row.rules[0].ruleId
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
      async getRoles() {
        const res = await getRoles()
        this.roles = res
      },
      async getPartners() {
        const res = await getPartners()
        this.partners = res
      }
    }
  }
</script>
