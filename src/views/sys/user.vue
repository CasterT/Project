<template>
  <div>
  <!-- 搜索栏 -->
  <el-card id="search">
    <el-row>
      <el-col :span="20">
        <el-input v-model="input" placeholder="用户名"></el-input>
        <el-input v-model="input" placeholder="电话"></el-input>
        <el-button type="primary" round icon="el-icon-search">查询</el-button>
      </el-col>
        <el-col :span="4" align="right">
          <el-button type="primary" icon="el-icon-plus" circle></el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
  <script>
  export default {};
  </script>
<style>
  #search .el-input {
  width: 200px;
  margin-right: 10px;
  }
</style>
