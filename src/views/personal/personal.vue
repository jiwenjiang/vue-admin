<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :model="listQuery" ref="dataForm" class="demo-form-inline" label-width="100px">
        <el-form-item label="账号：">
          <el-input v-model="listQuery.username" disabled style="width: 300px"/>
        </el-form-item>
        <el-form-item label="姓名：">
          <el-input v-model="listQuery.realName" style="width: 300px"/>
        </el-form-item>
        <el-form-item label="密码：">
          <el-input v-model="listQuery.password" type="password" style="width: 300px"/>
          <span class="modify" @click="modifyPsw">修改密码</span>
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-input v-model="listQuery.phone" type="number" placeholder="" style="width: 300px"/>
        </el-form-item>
        <el-form-item label="合作方：">
          <el-input v-model="listQuery.partnerName" disabled placeholder="" style="width: 300px"/>
        </el-form-item>
        <el-form-item label="角色：">
          <el-input v-model="listQuery.rules" disabled placeholder="" style="width: 300px"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100px" @click="submit">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" top="10vh" width="460px">
      <el-form
        ref="userForm"
        :model="userForm"
        :rules="rules"
        label-position="right"
        label-width="100px"
        style="width: 420px;"
      >
        <el-form-item label="密码：" prop="password">
          <el-input v-model="userForm.password" type="password" placeholder="密码包含数字与字母，至少6位数以上"/>
        </el-form-item>
        <el-form-item label="确认密码：" prop="passwordAgain">
          <el-input v-model="userForm.passwordAgain" type="password" placeholder="请再次输入新密码"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="submitForm()">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getInfoById, editInfoById, modifyPsw } from '@/api/user'

  export default {
    name: 'ComplexTable',
    data() {
      const validateRequire = (rule, value, callback) => {
        if (value && value.length >= 6) {
          callback()
        } else {
          callback(new Error('密码长度小于6位'))
        }
      }
      const validateRequire2 = (rule, value, callback) => {
        if (value && value.length >= 6) {
          if (value == this.userForm.password) {
            callback()
          } else {
            callback(new Error('两次密码输入不同'))
          }
        } else {
          callback(new Error('密码长度小于6位'))
        }
      }
      return {
        tableKey: 0,
        listQuery: {},
        rules: {
          password: [{ validator: validateRequire, trigger: 'blur' }],
          passwordAgain: [{ validator: validateRequire2, trigger: 'blur' }]
        },
        formInline: {
          user: '',
          region: ''
        },
        userForm: {},
        dialogStatus: '',
        dialogFormVisible: false
      }
    },
    created() {
      this.getList()
      // this.getRoleAuth()
    },
    methods: {
      async getList() {
        const res = await getInfoById(this.$store.state.user.userId)
        this.listQuery = res
        this.listQuery.partnerName = res.partners[0] && res.partners[0].partnerName
        this.listQuery.rules = res.rules[0] && res.rules[0].name
      },
      submit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            editInfoById(this.listQuery.userId, this.listQuery).then(res => {
            })
          }
        })
      },
      modifyPsw() {
        this.dialogStatus = '修改密码'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
        this.userForm = {}
      },
      submitForm() {
        this.$refs['userForm'].validate((valid) => {
          if (valid) {
            this.userForm.userId = this.$store.state.user.userId
            modifyPsw(this.userForm).then(res => {
              this.dialogFormVisible = false
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .auth-box {
    width: 100%;
    padding: 10px;
    background-color: #eeeeee;
  }

  .modify {
    color: #409FFF;
    font-size: 15px;
    text-decoration: underline;
    cursor: pointer;
  }

</style>

