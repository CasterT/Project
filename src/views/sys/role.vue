<template>
  <div>
    <!-- 搜索栏 -->
    <el-card id="search">
      <el-row>
        <el-col :span="18">
          <el-input placeholder="订单名" v-model="searchModel.roleName" clearable> </el-input>
          <el-button @click="getRoleList" type="primary" icon="el-icon-search" round>查询</el-button>
        </el-col>
        <el-col :span="6" align="right">
          <el-button @click="openEditUI(null)" type="primary" icon="el-icon-plus" circle></el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 结果列表 -->
    <el-card>
        <el-table :data="roleList" stripe style="width: 100%">
          <el-table-column label="#" width="80">
            <template slot-scope="scope">
              {{(searchModel.pageNo-1) * searchModel.pageSize + scope.$index + 1}}
            </template>
          </el-table-column>
          <el-table-column prop="indentId" label="订单编号" width="180">
          </el-table-column>
          <el-table-column prop="indentTitle" label="订单名称" width="180">
          </el-table-column>
          <el-table-column prop="price" label="价格" >
          </el-table-column>
          <el-table-column   label="操作" width="180">
            <template slot-scope="scope">
              <el-button @click="openEditUI(scope.row.indentId)" type="primary" icon="el-icon-edit" circle size="mini"></el-button>
              <el-button @click="deleteRole(scope.row)" type="danger" icon="el-icon-delete" circle size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>

    </el-card>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchModel.pageNo"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="searchModel.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!-- 对话框 -->
    <el-dialog @close="clearForm" :title="title" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form :model="roleForm" ref="roleFormRef" :rules="rules">
        <el-form-item prop="indentId" label="订单编号" :label-width="formLabelWidth">
          <el-input v-model="roleForm.indentId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="indentTitle" label="订单名称" :label-width="formLabelWidth">
          <el-input v-model="roleForm.indentTitle" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="price" label="价格" :label-width="formLabelWidth">
          <el-input v-model="roleForm.price" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item
              prop="nickName"
              label="权限设置"
              :label-width="formLabelWidth"
              >
              <el-form-item prop="nickName" label="所属用户" :label-width="formLabelWidth">
                <el-input v-model="roleForm.nickName" autocomplete="off"></el-input>
              </el-form-item>
            <el-tree
              ref="menuRef"
              :data="menuList"
              :props="menuProps"
              node-key="menuId"
              show-checkbox
              style="width:85%"
              default-expand-all
              >
            </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import roleApi from '@/api/roleManage';
import menuApi from '@/api/menuManage';
export default {
  data(){
    return{
      menulist:[],
      menuProps:{
        children:'children',
        label:'title'
      },
      formLabelWidth: '130px',
      roleForm: {
        openId: "12534535",
        inviteCode: "112341",
        indentNo:"1",
        productType: 1,
        indentStatus: 1,
        createTime: "13",
        updateTime: "13"
      },
      dialogFormVisible: false,
      title: '',
      searchModel: {
        pageNo: 1,
        pageSize: 10
      },
      roleList: [],
      total: 0,
      rules:{
        roleName: [
          { required: true, message: '请输入订单名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods:{
    getAllMenu(){
      menuApi.getAllMenu().then(response=>{
        this.menulist = response.data;
      })
    },
    deleteRole(role){
      this.$confirm(`您确定删除订单${role.indentTitle} ？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        roleApi.deleteRoleById(role.indentId).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功'
          });
          this.dialogFormVisible = false;
          this.getRoleList();
        });

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    saveRole(){
      let selected=this.$refs.menuRef.getCheckedKeys();
      let halfSelect=this.$refs.menuRef.getHalfCheckedKeys();
      this.roleForm.menuIDList=1;//selected.concat(halfSelect);
          roleApi.saveRole(this.roleForm).then(response => {
            this.$message({
              message: "操作成功",
              type: 'success'
            });
            // 关闭对话框
            this.dialogFormVisible = false;
            // 刷新表格数据
            this.getRoleList();
          });
    },
    clearForm(){
      this.roleForm = {};
      this.$refs.roleFormRef.clearValidate();
      this.$refs.menuRef.setCheckedKeys([]);
    },
    openEditUI(id){
      if(id == null){
        this.title = '新增订单';
      }else{
        this.title = '修改订单';
        roleApi.getRoleById(id).then(response => {
          this.roleForm = response.data;
          this.$refs.menuRef.setCheckedKeys(response.data.menuIDList);
        });
      }
      this.dialogFormVisible = true;
    },
    handleSizeChange(pageSize){
      this.searchModel.pageSize = pageSize;
      this.getRoleList();
    },
    handleCurrentChange(pageNo){
      this.searchModel.pageNo = pageNo;
      this.getRoleList();
    },
    getRoleList(){
      roleApi.getRoleList(this.searchModel).then(response => {
        this.roleList = response.data.rows;
        this.total = response.data.total;
      });
    }
  },
  created(){
    this.getRoleList();
    this.getAllrole();
  }
};
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
