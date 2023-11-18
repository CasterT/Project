import request from '@/utils/request'

export default{
  // 分页查询角色列表
  getRoleList(searchModel){
    return request({
      url: '/indent/list',
      method: 'get',
      params: {
        indentTitle: searchModel.indentTitle,
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize
      }
    });
  },
  // 新增
  addRole(role){
    return request({
      url: '/indent',
      method: 'post',
      data: role
    });
  },
  // 修改
  updateRole(role){
    return request({
      url: '/indent',
      method: 'put',
      data: role
    });
  },
  // 保存角色数据
  saveRole(role){
    if(role.indentId == null && role.indentId == undefined){
      return this.addRole(role);
    }
    return this.updateRole(role);
  },
  // 根据id查询
  getRoleById(id){
    return request({
      url: `/indent/${id}`,
      method: 'get'
    });
  },
  // 根据id删除
  deleteRoleById(id){
    return request({
      url: `/indent/${id}`,
      method: 'delete'
    });
  },
  // 查询所有角色列表
getAllRole(){
  return request({
      url: '/indent/all',
      method: 'get'
  });
},
}
