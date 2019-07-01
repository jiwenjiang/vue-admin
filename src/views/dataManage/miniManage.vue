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
              :value="item.partnerId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="小程序">
          <el-input v-model="listQuery.programName" placeholder="请输入小程序名称" style="width: 120px"/>
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
      <el-table-column label="小程序" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.programName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="绑定区域个数" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.zones&&scope.row.zones.length }}</span>
        </template>
      </el-table-column>
      <el-table-column label="绑定区域" align="center">
        <template slot-scope="scope">
          <span v-for="item of scope.row.zones" :key="item.id">{{ `${item.name},` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row.programId)">
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

    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" top="10vh" width="450px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="userForm"
        label-position="left"
        label-width="120px"
        style="width: 380px;"
      >
        <el-form-item label="APP ID：" prop="appid">
          <el-input v-model="userForm.appid" placeholder="请输入ID"/>
        </el-form-item>
        <el-form-item label="APP Secret：" prop="secret">
          <el-input v-model="userForm.secret" placeholder="请输入Secret"/>
        </el-form-item>
        <el-form-item label="小程序：" prop="programName">
          <el-input v-model="userForm.programName" placeholder="请输入小程序名称  "/>
        </el-form-item>
      </el-form>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="当前已绑定区域" style="padding: 7px" name="directly">
          <el-table
            :key="tableKey"
            v-loading="listLoading"
            :data="bindList"
            border
            fit
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column label="区域ID" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column label="区域名称" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="{row}">
                <el-button type="text" size="mini" @click="cancelBind(row)"> 解绑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="可绑定区域" name="v-directive" style="padding: 7px">
          <el-table
            :key="tableKey"
            v-loading="listLoading"
            :data="nobindList"
            border
            fit
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column label="区域ID" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.mapId }}</span>
              </template>
            </el-table-column>
            <el-table-column label="区域名称" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="绑定" align="center">
              <template slot-scope="scope">
                <el-checkbox @change="addArea(scope.row)"></el-checkbox>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="其他已绑定区域" name="v-directive-3">
          <el-table
            :data="otherbindList"
            :span-method="objectSpanMethod"
            border
            style="width: 100%; margin-top: 20px">
            <el-table-column label="小程序名称" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.proName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="区域ID" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column label="区域名称" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="{row}">
                <el-button type="text" size="mini" @click="cancelBind(row,row.programId)">解绑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
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
    getList,
    getBindList,
    getOtherBindList,
    getNoBindList,
    addUser,
    editUser,
    deleteUser,
    exportFlie,
    cancelMiniBind,
    addMiniBind
  } from '@/api/dataManage/mini'
  import { getAreaAll } from '@/api/dataManage/area'
  import { getPartners } from '@/api/partner'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  export default {
    name: 'ComplexTable',
    components: { Pagination },
    data() {
      return {
        tableKey: 0,
        list: null,
        bindList: null,
        nobindList: null,
        otherbindList: null,
        currentProgramId: null,
        total: 0,
        activeName: 'directly',
        listLoading: false,
        listQuery: {
          page: 0,
          pageSize: 10,
          partnerName: '',
          programName: '',
          startTime: null,
          endTime: null
        },
        formInline: {
          user: '',
          region: ''
        },
        userForm: {
          id: undefined,
          appid: '',
          secret: '',
          programName: '',
          zoneIdArr: ','
        },
        rules: {
          appid: [{ required: true, message: 'appid必填', trigger: 'blur' }],
          secret: [{ required: true, message: 'secret必填', trigger: 'blur' }],
          programName: [{ required: true, message: '名称必填', trigger: 'blur' }]
        },
        dialogStatus: '添加',
        dialogFormVisible: false,
        roles: [],
        partners: [],
        chooseArea: [],
        deleteUsers: ''
      }
    },
    created() {
      this.getList()
      this.getPartners()
    },
    methods: {
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        // console.log(row)
        if (columnIndex === 0) {
          if (rowIndex === row.num) {
            // if (rowIndex % 2 === 0) {
            return {
              rowspan: row.count,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      },
      async getList() {
        this.listLoading = false
        const res = await getList(this.listQuery)
        this.list = res.list
        this.total = res.total
      },
      handleClick(e) {
        if (e.index === '0') {
          this.currentProgramId && this.getBindList(this.currentProgramId)
          return false
        }
        if (e.index === '2') {
          this.currentProgramId && this.getOtherBindList(this.currentProgramId)
          return false
        }
        if (e.index === '1' && this.currentProgramId) {
          this.getNoBindList(this.currentProgramId)
        } else {
          this.getAreaList()
        }
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
      addArea(row) {
        if (this.chooseArea.indexOf(row.id) > -1) {
          this.chooseArea = this.chooseArea.filter(v => v != row.id)
        } else {
          this.chooseArea.push(row.id)
        }
      },
      forceChange() {
        this.$forceUpdate()
      },
      handleSelectionChange(v) {
        this.deleteUsers = v.reduce((total, curr) => total + curr.programId + ',', '')
      },
      resetForm() {
        this.userForm = {
          id: undefined,
          appid: '',
          secret: '',
          programName: '',
          zoneIdArr: ','
        }
      },
      handleCreate() {
        this.resetForm()
        this.activeName = 'v-directive'
        this.currentProgramId = null
        this.dialogStatus = '添加'
        this.dialogFormVisible = true
        this.getAreaList()
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
        // this.getBindList()
        // this.getNoBindList()
        // this.getOtherBindList()
      },

      getAreaList() {
        getAreaAll().then(res => {
          this.nobindList = res
        })
      },
      handleUpdate(row) {
        this.currentProgramId = row.programId
        this.userForm = Object.assign({}, row)
        // this.userForm.partnerIdArr = row.partners[0].partnerId
        // this.userForm.ruleIdArr = row.rules[0].ruleId
        this.dialogStatus = '编辑'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
        this.getBindList(row.programId)
        this.getNoBindList(row.programId)
        this.getOtherBindList(row.programId)
      },
      submitForm() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (this.chooseArea.length > 0) {
              this.userForm.zoneIdArr = this.chooseArea.join()
            }
            if (this.dialogStatus === '添加') {
              addUser(this.userForm).then(() => {
                this.getList()
              })
            } else {
              editUser(this.userForm).then(() => {
                this.getList()
                this.getBindList(this.userForm.programId)
                this.getNoBindList(this.userForm.programId)
                this.getOtherBindList(this.userForm.programId)
              })
              if (this.chooseArea.length > 0) {
                addMiniBind({ programId: this.userForm.programId, zoneId: this.chooseArea.join() })
              }
            }
            this.dialogFormVisible = false
          }
        })
      },
      cancelBind(row, id) {
        cancelMiniBind({
          programId: id ? id : this.currentProgramId,
          zoneId: row.id
        }).then(res => {
          this.getBindList(this.currentProgramId)
          this.getOtherBindList(this.currentProgramId)
        })
      },
      async getPartners() {
        const res = await getPartners()
        this.partners = res
      },
      async getBindList(id) {
        const res = await getBindList(id)
        this.bindList = res && res.zones
      },
      async getNoBindList(id) {
        const res = await getNoBindList(id)
        this.nobindList = res
      },
      async getOtherBindList(id) {
        const res = await getOtherBindList(id)
        const handleArr = []
        let num = 0
        let count = 0
        res.forEach(v1 => {
          count = v1.zones.length
          v1.zones.forEach(v2 => {
            handleArr.push({ proName: v1.programName, programId: v1.programId, ...v2, num, count })
          })
          num += count
        })
        this.otherbindList = handleArr
      }
    }
  }
</script>
