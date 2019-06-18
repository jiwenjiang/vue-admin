<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="运行配置" style="padding: 7px" name="directly">
        <div class="box-card-par">
          <el-card class="box-card" shadow="always">
            <el-form
              ref="dataForm"
              :model="userForm"
              label-position="right"
              label-width="130px"
              style="width: 420px;"
            >
              <el-form-item label="地图API配置:" prop="partnerName">
                <el-input v-model="userForm.partnerName"/>
              </el-form-item>
              <el-form-item label="地图授权token:" prop="description">
                <el-input v-model="userForm.description"/>
              </el-form-item>
              <el-form-item prop="description">
                <el-button
                  type="primary"
                  style="width:100px;margin-bottom:30px;background-color: #409FFF"
                  @click.native.prevent="submit"
                >提交
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </el-tab-pane>
      <el-tab-pane label="皮肤与背景图配置" name="v-directive" style="padding: 7px">
        <el-card class="box-card" shadow="always">
          <el-form
            ref="dataForm"
            :model="userForm"
            label-position="right"
            label-width="130px"
            :inline="true"
          >
            <el-form-item label="主题色:" prop="partnerName">
              <el-color-picker popper-class="my-color-pick" v-model="userForm.color1" @click="test"></el-color-picker>
            </el-form-item>
            <el-form-item label="搜索框背景色:" prop="description">
              <el-color-picker popper-class="my-color-pick" v-model="userForm.color1"></el-color-picker>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="站长统计代码" name="v-directive-3">
        33
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

  export default {
    name: 'ClipboardDemo',
    data() {
      return {
        userForm: {
          color1: '#000',
          partnerName: '44555'
        },
        expandPanel: false,
        dom1: false,
        dom2: false,
        activeName: 'directly',
        inputData: 'https://github.com/PanJiaChen/vue-element-admin'
      }
    },
    mounted() {
      const targetNode = document.getElementsByClassName('my-color-pick')[0]

      const config = { attributeFilter: ['style'], childList: false, subtree: false }

      const callback = (mutations) => {
        this.dom1 = mutations.every((record) => {
          return record.target.style.display === 'none'
        })
        this.checkDom()
      }

      const observer = new MutationObserver(callback)
      observer.observe(targetNode, config)
    },
    methods: {
      submit() {
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            console.log(this.userForm)
          }
        })
      },
      test() {
        console.log('test')
      },
      checkDom() {
        if (this.dom1 === true || this.dom2 === true) {
          this.expandPanel = true
        } else {
          this.expandPanel = false
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>

