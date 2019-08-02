<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="运行配置" style="padding: 7px" name="directly">
        <div class="box-card-par">
          <el-card class="box-card" shadow="always">
            <el-form
              ref="dataForm1"
              :model="userForm1"
              label-position="right"
              label-width="130px"
              style="width: 420px;"
            >
              <el-form-item label="地图API配置:" prop="partnerName">
                <el-input v-model="userForm1.mapApiUrl"/>
              </el-form-item>
              <el-form-item label="地图授权token:" prop="description">
                <el-input v-model="userForm1.mapAuthToken"/>
              </el-form-item>
              <el-form-item prop="description">
                <el-button
                  type="primary"
                  style="width:100px;margin-bottom:30px;background-color: #409FFF"
                  @click.native.prevent="submit1"
                >提交
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </el-tab-pane>
      <el-tab-pane label="皮肤与背景图配置" name="v-directive" style="padding: 7px">
        <el-form
          ref="dataForm2"
          :model="userForm2"
          label-position="right"
          label-width="130px"
          :inline="true"
        >
          <el-card class="box-card" shadow="always">
            <el-form-item label="主题色:" prop="partnerName">
              <el-color-picker popper-class="my-color-pick" v-model="userForm2.themeColor"
                               @click="test"></el-color-picker>
            </el-form-item>
            <el-form-item label="搜索框背景色:" prop="description">
              <el-color-picker popper-class="my-color-pick" v-model="userForm2.searchBoxBg"></el-color-picker>
            </el-form-item>
          </el-card>
          <el-card class="box-card" shadow="always" style="margin-top: 10px">
            <el-form-item label="列表顶部背景图：" prop="logo" style="position: relative">
              <el-upload
                action=""
                class="avatar-uploader"
                :show-file-list="false"
                style="margin-top: 10px;margin-right: 30px"
                :http-request="toUploadFile1">
                <img v-if="imageUrl1" :src="imageUrl1" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <span class="advice-span">建议尺寸：748 x 174 px</span>
            </el-form-item>
            <el-form-item label="返回图标配置：" prop="logo" style="position: relative">
              <el-upload
                action=""
                class="avatar-uploader"
                style="margin-top: 10px;margin-right: 30px"
                :show-file-list="false"
                :http-request="toUploadFile2">
                <img v-if="imageUrl2" :src="imageUrl2" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <span class="advice-span">建议尺寸：748 x 174 px</span>
            </el-form-item>
            <el-form-item label="语音图标配置：" prop="logo" style="position: relative">
              <el-upload
                action=""
                class="avatar-uploader"
                :show-file-list="false"
                style="margin-top: 10px;margin-right: 30px"
                :http-request="toUploadFile3">
                <img v-if="imageUrl3" :src="imageUrl3" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <span class="advice-span">建议尺寸：748 x 174 px</span>
            </el-form-item>
            <el-form-item label="过渡加载文字： " prop="description">
              <el-input v-model="userForm2.overloadingText"/>
            </el-form-item>
          </el-card>
          <el-button
            type="primary"
            style="width:100px;margin-bottom:30px;background-color: #409FFF;margin-top: 10px"
            @click.native.prevent="submit2"
          >提交
          </el-button>
        </el-form>

      </el-tab-pane>
      <el-tab-pane label="站长统计代码" name="v-directive-3">
        <el-form
          ref="dataForm3"
          :model="userForm3"
          label-position="right"
          label-width="130px"
        >
          <p>站长统计代码： </p>
          <el-input
            type="textarea"
            :rows="12"
            style="width: 100%"
            placeholder="请输入内容"
            v-model="userForm3.cnzzCode">
          </el-input>
          <el-button
            type="primary"
            style="width:100px;margin-bottom:30px;background-color: #409FFF;margin-top: 10px"
            @click.native.prevent="submit3"
          >提交
          </el-button>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import { getRun, editRun } from '@/api/run'

  export default {
    name: 'ClipboardDemo',
    data() {
      return {
        userForm1: {
          id: undefined,
          mapApiUrl: '',
          mapAuthToken: ''
        },
        baseUrl: this._baseUrl,
        userForm2: {
          themeColor: '#000',
          searchBoxBg: '#000'
        },
        userForm3: {
        },
        imageUrl1: '',
        imageUrl2: '',
        imageUrl3: '',
        expandPanel: false,
        dom1: false,
        dom2: false,
        activeName: 'directly',
        inputData: 'https://github.com/PanJiaChen/vue-element-admin'
      }
    },
    mounted() {
      this.getRun()
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
      submit1() {
        this.$refs.dataForm1.validate(valid => {
          if (valid) {
            console.log(this.userForm1)
            editRun(this.userForm1).then(v => {
              console.log(v)
              this.getRun()
            })
          }
        })
      },
      submit2() {
        this.$refs.dataForm2.validate(valid => {
          if (valid) {
            const formData = new FormData()
            Object.keys(this.userForm2).forEach((key) => {
              formData.append(key, this.userForm2[key])
            })
            editRun(formData).then(() => {
              this.getRun()
            })
          }
        })
      },
      submit3() {
        this.$refs.dataForm3.validate(valid => {
          if (valid) {
            console.log(this.userForm3)
            editRun(this.userForm3).then(() => {
              this.getRun()
            })
          }
        })
      },
      getRun() {
        getRun().then(v => {
          console.log(222, v)
          this.userForm1 = v
          this.userForm2 = v
          this.userForm3 = v
          this.imageUrl1 = v.listTopBg ? this._baseUrl + v.listTopBg : ''
          this.imageUrl2 = v.returnIconConfig ? this._baseUrl + v.returnIconConfig : ''
          this.imageUrl3 = v.voiceIconConfig ? this._baseUrl + v.voiceIconConfig : ''
        })
      },
      toUploadFile1(res) {
        this.userForm2.listTopBg = res.file
        this.imageUrl1 = URL.createObjectURL(res.file)
      },
      toUploadFile2(res) {
        this.userForm2.returnIconConfig = res.file
        this.imageUrl2 = URL.createObjectURL(res.file)
      },
      toUploadFile3(res) {
        this.userForm2.voiceIconConfig = res.file
        this.imageUrl3 = URL.createObjectURL(res.file)
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

  .advice-span {
    position: absolute;
    bottom: 0;
    right: 0;
    margin-right: -108px;
    color: #C0C4CC;
    font-size: 12px;
  }
</style>

