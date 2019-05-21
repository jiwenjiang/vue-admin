<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
        <el-form-item label="账号">
          <el-input v-model="formInline.user" placeholder="请输入账号" style="width: 120px"></el-input>
        </el-form-item>
        <el-form-item label="合作方">
          <el-select v-model="formInline.region" placeholder="活动区域" style="width: 120px">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择时间">
          <div style="width: 300px">
            <el-col :span="11">
              <el-date-picker type="date" placeholder="开始时间" v-model="formInline.start"
                              style="width: 100%;"></el-date-picker>
            </el-col>
            <el-col class="line" :span="2" style="text-align: center">-</el-col>
            <el-col :span="11">
              <el-date-picker type="date" placeholder="结束时间" v-model="formInline.start"
                              style="width: 100%;"></el-date-picker>
            </el-col>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
          <el-button type="primary" @click="onSubmit">添加</el-button>
          <el-button type="primary" @click="onSubmit">批量删除</el-button>
          <el-button type="warning">导入</el-button>
          <el-button type="primary">导出</el-button>
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
    >
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column label="账号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合作方" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.partners&&scope.row.partners[0]&&scope.row.partners[0].partnerName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userGroup }}</span>
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
          <el-button size="mini" type="danger" @click="handleModifyStatus(row,'deleted')">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList"/>

    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" top="10vh" width="420px">
      <el-form ref="dataForm" :rules="rules" :model="userForm" label-position="left" label-width="70px"
               style="width: 380px;">
        <el-form-item label="账号" prop="userCode">
          <el-input v-model="userForm.userCode"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userForm.password"/>
        </el-form-item>
        <el-form-item label="姓名" prop="realName">
          <el-input v-model="userForm.realName"/>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="userForm.phone"/>
        </el-form-item>
        <el-form-item label="合作方" prop="partnerIdArr">
          <el-select v-model="userForm.partnerIdArr" class="filter-item" placeholder="选择" style="width: 100%">
            <el-option v-for="item in roles" :key="item.ruleId" :label="item.name"
                       :value="item.ruleId"/>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="ruleIdArr">
          <el-select v-model="userForm.partnerIdArr" class="filter-item" placeholder="选择" style="width: 100%">
            <el-option v-for="item in roles" :key="item.ruleId" :label="item.name"
                       :value="item.ruleId"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getList } from '@/api/user'
  import { getRoles } from '@/api/role'
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
          page: 1,
          pageSize: 10,
          partner: '',
          startTime: null,
          endTime: null,
          userCode: ''
        },
        formInline: {
          user: '',
          region: ''
        },
        userForm: {
          id: undefined,
          importance: 1,
          remark: '',
          timestamp: new Date(),
          title: '',
          type: '',
          status: 'published'
        },
        rules: {
          type: [{ required: true, message: 'type is required', trigger: 'change' }],
          timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
          title: [{ required: true, message: 'title is required', trigger: 'blur' }]
        },
        dialogStatus: '新增',
        dialogFormVisible: true,
        roles: []
      }
    },
    created() {
      this.getList()
      this.getRoles()
    },
    methods: {
      async getList() {
        this.listLoading = false
        const res = await getList(this.listQuery)
        this.list = res.list
      },
      onSubmit() {
        console.log('submit!')
      },
      async getRoles() {
        const res = await getRoles()
        this.roles = res
      }
    }
  }
</script>
