<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="运行配置" style="padding: 5px" name="directly">
        <div class="box-card-par">
          <el-card class="box-card" shadow="always">
            2333
          </el-card>
        </div>
      </el-tab-pane>
      <el-tab-pane label="皮肤与背景图配置" name="v-directive">
        22
      </el-tab-pane>
      <el-tab-pane label="站长统计代码" name="v-directive-3">
        33
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import clip from '@/utils/clipboard' // use clipboard directly
  import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive

  export default {
    name: 'ClipboardDemo',
    directives: {
      clipboard
    },
    data() {
      return {
        activeName: 'directly',
        inputData: 'https://github.com/PanJiaChen/vue-element-admin'
      }
    },
    methods: {
      handleCopy(text, event) {
        clip(text, event)
      },
      clipboardSuccess() {
        this.$message({
          message: 'Copy successfully',
          type: 'success',
          duration: 1500
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>

