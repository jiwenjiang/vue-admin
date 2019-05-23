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
            style="width: 100%"
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
            v-model="listQuery.programName"
            class="filter-item"
            placeholder="选择"
            style="width: 100%"
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
      <el-table-column label="合作方ID" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.partnerId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合作方名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.partnerName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="小程序" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.programs&&scope.row.programs[0]&&scope.row.programs[0].partnerName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
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

    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" top="10vh" width="460px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="userForm"
        label-position="right"
        label-width="100px"
        style="width: 420px;"
      >
        <el-form-item label="合作方名称:" prop="partnerName">
          <el-input v-model="userForm.partnerName" />
        </el-form-item>
        <el-form-item label="描述:" prop="description">
          <el-input v-model="userForm.description" type="textarea" :rows="3" />
        </el-form-item>
        <div class="select-box">
          <div class="mini">小程序</div>
          <div id="checkBox-select" v-clickoutside="handleClose" class="checkBox-select">
            <div class="checkBox-select-input">
              <input type="text" @focus="showSelect=true">
            </div>
            <div v-show="showSelect" class="checkBox-select-content">
              <ul>
                <li v-for="item in cities" :key="item.id">
                  <el-checkbox v-model="boxs[item.label]">{{ item.label }}</el-checkbox>
                </li>
              </ul>
            </div>
            <div class="checkBox-select-result">
              <span class="result-span">成都 &nbsp;<i class="el-icon-close" @click="test" /></span>
            </div>
          </div>
        </div>

        <!--<el-form-item label="小程序" prop="programIdArr">-->
        <!--<el-select v-model="userForm.programIdArr" class="filter-item" @change="forceChange" placeholder="选择"-->
        <!--style="width: 100%">-->
        <!--<el-option v-for="item in partners" :key="item.partnerId" :label="item.partnerName"-->
        <!--:value="item.partnerId"/>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
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
  import { addUser, editUser, deleteUser, exportFlie } from '@/api/user'
  import { getRoles } from '@/api/role'
  import { getPartners, getPartnersList } from '@/api/partner'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  const clickoutside = {
    // 初始化指令
    bind(el, binding, vnode) {
      function documentHandler(e) {
        // 这里判断点击的元素是否是本身，是本身，则返回
        if (el.contains(e.target)) {
          return false
        }
        // 判断指令中是否绑定了函数
        if (binding.expression) {
          // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
          binding.value(e)
        }
      }

      // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
      el.__vueClickOutside__ = documentHandler
      document.addEventListener('click', documentHandler)
    },
    update() {
    },
    unbind(el, binding) {
      // 解除事件监听
      document.removeEventListener('click', el.__vueClickOutside__)
      delete el.__vueClickOutside__
    }
  }

  export default {
    name: 'ComplexTable',
    components: { Pagination },
    directives: { waves, clickoutside },
    data() {
      return {
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: false,
        boxs: {
          上海: true
        },
        showSelect: false,
        listQuery: {
          page: 0,
          pageSize: 10,
          partnerName: '',
          startTime: null,
          endTime: null,
          programName: ''
        },
        formInline: {
          user: '',
          region: ''
        },
        cities: [{
          value: 'Beijing',
          label: '北京'
        }, {
          value: 'Shanghai',
          label: '上海'
        }, {
          value: 'Nanjing',
          label: '南京'
        }],
        value: '',
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
          partnerName: [{ required: true, message: '合作方必填', trigger: 'blur' }],
          description: [{ required: true, message: '描述必填', trigger: 'blur' }]
        },
        dialogStatus: '添加',
        dialogFormVisible: true,
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
      test() {
        console.log(this.boxs)
      },
      handleClose() {
        this.showSelect = false
      },
      async getList() {
        this.listLoading = false
        const res = await getPartnersList(this.listQuery)
        this.list = res.list
        this.total = res.total
      },
      handleDelete(data) {
        deleteUser(data).then(() => {
          this.getList()
        })
      },
      chooseOpts(v) {
        console.log('v', v)
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

<style lang="scss" scoped>
  .select-box {
    display: flex;
    flex-direction: row;
  }

  .checkBox-select {
    width: 100%;
    height: 200px;
    /*border: 1px solid red;*/
    overflow: hidden;
    .checkBox-select-input {
      width: 100%;
      border: 1px solid #C0C4CC;
      border-radius: 6px;
      height: 36px;
      text-align: center;
      input {
        width: 98%;
        height: 34px;
        padding: 4px 10px;
        outline: none;
        border: none;
      }
    }
    .checkBox-select-content {
      width: 100%;
      background-color: white;
      border: 1px solid #C0C4CC;
      border-radius: 6px;
      position: relative;
      margin-top: 10px;
      padding: 6px 10px;
      height: 130px;
      ul, li {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      li {
        padding: 5px 0;
      }
    }
    .checkBox-select-content:after {
      position: absolute;
      display: inline-block;
      top: -4px;
      left: 24px;
      width: 0;
      height: 0px;
      content: '';
      border-style: solid;
      border-width: 5px;
      border-color: #fff #fff transparent transparent;
      transform: rotate(-45deg);
      box-shadow: 2px -2px 2px #ccc;
    }
    .checkBox-select-result {
      margin-top: 6px;
      .result-span {
        padding: 4px 6px;
        font-size: 14px;
        color: #7F8C8D;
        background-color: #EFEFEF;
      }
    }
  }

  .mini {
    width: 127px;
    padding-right: 12px;
    line-height: 36px;
    text-align: right;
    font-size: 14px;
    font-weight: 700;
  }

</style>
