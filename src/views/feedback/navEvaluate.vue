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
              v-for="item in minis"
              :key="item.programName"
              :label="item.programName"
              :value="item.programName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属区域">
          <el-input v-model="listQuery.mapName" placeholder="请输入地图区域名称" style="width: 120px"/>
        </el-form-item>
        <el-form-item label="评价标签" prop="partnerIdArr">
          <el-select
            v-model="listQuery.label"
            class="filter-item"
            placeholder="选择"
            style="width: 120px"
            @change="forceChange"
          >
            <el-option
              v-for="item in labels"
              :key="item.name"
              :label="item.name"
              :value="item.name"
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
      <el-table-column label="设备机型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.machineType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机识别标识" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="起点" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.startPlace }}</span>
        </template>
      </el-table-column>
      <el-table-column label="终点" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.endPlace }}</span>
        </template>
      </el-table-column>
      <el-table-column label="评价标签" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.label }}</span>
        </template>
      </el-table-column>
      <el-table-column label="评价内容" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.evaluate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="评星等级" width="160" align="center">
        <template slot-scope="scope">
          <el-rate
            v-model="scope.row.score"
            disabled
            :value="scope.row.score"
          >
          </el-rate>

        </template>
      </el-table-column>
      <el-table-column label="评价时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="130" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
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
  </div>
</template>

<script>
  import { getList, exportFlie, deleteUser } from '@/api/feedback/evaluate'
  import { getAllMini } from '@/api/dataManage/mini'
  import { getPartners } from '@/api/partner'
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
          partner: '',
          startTime: null,
          endTime: null,
          mapName: '',
          programName: ''
        },
        formInline: {
          user: '',
          region: ''
        },
        userForm: {
          id: undefined,
          userCode: '',
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
        labels: [
          { name: '全部' },
          { name: '体验流畅' },
          { name: '提示贴心' },
          { name: '定位不准' },
          { name: '信息有误' }
        ],
        partners: [],
        deleteUsers: ''
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
        const res = await getList(this.listQuery)
        this.list = res.list
        this.total = res.total
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
      handleSelectionChange(v) {
        this.deleteUsers = v.reduce((total, curr) => total + curr.id + ',', '')
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
