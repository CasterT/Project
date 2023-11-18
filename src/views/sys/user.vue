<template>
  <div>
  <!-- 搜索栏 -->
  <el-card id="search">
    <el-row>
      <el-col :span="20">
        <el-input v-model="searchModel.username" placeholder="用户名"></el-input>
        <el-input v-model="searchModel.phone" placeholder="电话"></el-input>
        <el-button @click="getUserList" type="primary" round icon="el-icon-search">查询</el-button>
      </el-col>
        <el-col :span="4" align="right">
          <el-button @click="openEditUI(null)" type="primary" icon="el-icon-plus" circle></el-button>
        </el-col>
      </el-row>
  </el-card>
    <el-card>
        <el-table :data="userList" stripe style="width: 100%">
          <el-table-column label="#" width="80">
            <template slot-scope="scope">
              <!-- (pageNo-1) * pageSize + index + 1 -->{{(searchModel.pageNo-1) * searchModel.pageSize + scope.$index + 1}}
            </template>
          </el-table-column>
          <el-table-column prop="id" label="用户ID" width="80">
          </el-table-column>
          <el-table-column prop="username" label="用户名" width="180">
          </el-table-column>
          <el-table-column prop="phone" label="电话" width="180">
          </el-table-column>
          <el-table-column prop="status" label="用户状态" width="180">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status==1">正常</el-tag>
              <el-tag v-else type="danger">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="email" label="电子邮件">
          </el-table-column>
          <el-table-column   label="操作" width="180">
            <template slot-scope="scope">
              <el-button @click="openEditUI(scope.row.id)" type="primary" icon="el-icon-edit" circle size="mini"></el-button>
              <el-button @click="deleteUser(scope.row)" type="danger" icon="el-icon-delete" circle size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
    </el-card>
    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchModel.pageNo"
      :page-sizes="[5,10,20,50]"
      :page-size="searchModel.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="userForm">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="userForm.username" autocomplete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="登录密码" :label-width="formLabelWidth">
          <el-input type="password" v-model="userForm.password" autocomplete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="联系电话" :label-width="formLabelWidth">
          <el-input v-model="userForm.phone" autocomplete="off">
          </el-input>
        </el-form-item>
          <el-form-item label="用户状态" :label-width="formLabelWidth">
            <el-switch
              v-model="userForm.status"
              :active-value="1"
              :inactive-value="0">
            </el-switch>
          </el-form-item>

          <el-form-item label="用户角色" :label-width="formLabelWidth">
            <el-checkbox-group style="width:85%" v-model="userForm.roleIdList" :max="2">
              <el-checkbox v-for="(item) in roleList" :label="item.roleId" :key="item.roleId">
                {{item.roleDesc}}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="电子邮件" :label-width="formLabelWidth">
          <el-input v-model="userForm.email" autocomplete="off">
          </el-input>
        </el-form-item>
        </el-form>
      <div slot="footer" >
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import userApi from '@/api/userManager'
import roleApi from '@/api/roleManage'
export default {
  data(){
    return{
      roleList:[],
      formLabelWidth:'130px',
      userForm:{
      },
      dialogFormVisible:false,
      title:"",
      total:0,
      searchModel:{
        pageNo: 1,
        pageSize: 10
      },
      userList: []
    }
  },
  methods:{
    deleteUser(user){
      this.$confirm(`您确定删除用户${user.username} ？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        userApi.deleteUserById(user.id).then(response => {
          this.$message({
            type: 'success',
            message: "删除成功"
          });
          this.dialogFormVisible = false;
          this.getUserList();
        });

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    getAllRole(){
      roleApi.getAllRole().then(response => {console.log(response.data);
      this.roleList = response.data;
      });
    },
    saveUser(){
      userApi.saveUser(this.userForm).then(response =>{
        this.$message({
          message: "操作成功",
          type: 'success'
        });
        this.dialogFormVisible = false;// 刷新表格
        this.getUserList();
      });
    },
    handleSizeChange(pageSize){
      this.searchModel.pageSize = pageSize;
      this.getUserList();
    },
    handleCurrentChange(pageNo){
      this.searchModel.pageNo = pageNo;
      this.getUserList();
    },
    getUserList(){
      userApi.getUserList(this.searchModel).then(response =>{this.userList = response.data.rows;
      this.total = response.data.total;
      });
    },
    openEditUI(id){
      if(id==null){
        this.title ='新增用户';
      }else{
        this.title ='修改用户';
        userApi.getUserById(id).then(response =>{
          this.userForm = response.data;
        });
      }
      this.dialogFormVisible = true;
    },
    created(){
    this.getUserList();
    }
  },
}
</script>
<style>
#search .el-input {
  width: 200px;
  margin-right: 10px;
}
.el-dialog .el-input{
  width: 85%;
}
</style>
