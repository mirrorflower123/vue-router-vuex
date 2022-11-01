<template>
  <div>
    <div>{{ title }}</div>
    <!-- 上方查询表单 -->
    <div>
      <el-form :inline="true">
        <el-form-item> <el-input v-model="queryInfo.cname" placeholder="班级查询"></el-input> </el-form-item>
        <el-form-item>
          <el-input v-model="queryInfo.info" placeholder="学生查询"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="querys">学生查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="showadd">添加</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 数据呈现 -->
    <div v-loading="loading">
      <el-table :data="list">
        <el-table-column label="编号" prop="sid"></el-table-column>
        <el-table-column label="班级描述" prop="cinfo"></el-table-column>
        <el-table-column label="班级名称" prop="cname"></el-table-column>
        <el-table-column label="修改信息使时间">
          <template slot-scope="w">
            {{ w.row.lastupdate | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="d">
            <el-button @click="querysw(d.row)" size="small" type="primary">查看</el-button>
            <el-button @click="showModify(d.row)" size="small" type="primary">修改</el-button>
            <el-button @click="del(d.row)" size="small" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background :total="page.total" :current-page.sync="page.pageNumber" :page-size.sync="page.pageSize" @current-change="query" layout="prev,pager,next,total,jumper,sizes" :page-sizes="[5, 10, 20]" @size-change="query"></el-pagination>
    </div>

    <!-- 添加对话框 -->
    <div>
      <el-dialog title="添加信息" :visible.sync="addVisible" :close-on-click-modal="false" @closed="query">
        <div v-loading="loading">
          <el-form>
            <el-form-item>
              <el-input v-model="addInfo.cinfo" placeholder="标题"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="addInfo.cname" placeholder="标题"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" v-loading="loading">
          <el-button type="primary" @click="add">保存</el-button>
          <el-button type="primary" @click="addVisible = false">关闭</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 修改对话框 -->
    <div>
      <el-dialog title="修改信息" :visible.sync="modifyVisible" :close-on-click-modal="false" @closed="query">
        <div v-loading="loading">
          <el-form>
            <el-form-item>
              <el-input v-model="modifyInfo.cinfo" placeholder="标题"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="modifyInfo.cname" placeholder="标题"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" v-loading="loading">
          <el-button type="primary" @click="modify">保存</el-button>
          <el-button type="primary" @click="modifyVisible = false">关闭</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 学生查询数据呈现 -->
    <div v-loading="loading">
      <el-table :data="slist">
        <el-table-column label="编号" prop="cid"></el-table-column>
        <el-table-column label="姓名" prop="sname"></el-table-column>
        <el-table-column label="家庭地址" prop="address"></el-table-column>
        <el-table-column label="家庭地址" prop="phone"></el-table-column>
        <el-table-column label="修改信息使时间">
          <template slot-scope="k">
            {{ k.row.lastupdate | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="d">
            <el-button @click="showModify(d.row)" size="small" type="primary">修改</el-button>
            <el-button @click="del(d.row)" size="small" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background :total="page.total" :current-page.sync="page.pageNumber" :page-size.sync="page.pageSize" @current-change="query" layout="prev,pager,next,total,jumper,sizes" :page-sizes="[5, 10, 20]" @size-change="query"></el-pagination>
    </div>
  </div>
</template>

<script>
import tools from '@/js/tools'
let app
export default {
  name: 'UserNoteView',
  data() {
    return {
      loading: false,
      title: '管理系统',
      page: { pageSize: 5 },
      //班级管理部分开始
      queryInfo: {
        cname: '',
      },
      list: [],
      clist: [],
      //添加的部分
      addInfo: {
        cinfo: '',
        cname: '',
      },
      modifyInfo: {},
      modifyVisible: false,
      addVisible: false,
      //班级管理部分结束
      //学生管理部分开始
      queryInfos: {
        sname: '',
      },
      slist: [],
    }
  },
  computed: {},
  methods: {
    //删除
    del(info) {
      app
        .$confirm('是否删除：' + info.cname, '删除', {
          type: 'warnig',
        })
        .then(() => {
          tools.ajax('/manage/class/delete', { cid: info.cid }, (data) => {
            app.$alert(data.message, '信息', {
              callback: app.query,
            })
          })
        })
        .catch(() => {})
    },

    //修改
    showModify(info) {
      app.modifyInfo = tools.concatJson(info)
      app.modifyVisible = true
    },

    modify() {
      app.loading = true
      tools.ajax('/manage/class/update', app.modifyInfo, (data) => {
        app.loading = false
        app.$alert(data.message)
      })
    },

    // 添加
    add() {
      app.loading = true
      tools.ajax('/manage/class/add', app.addInfo, (data) => {
        app.loading = false
        app.$alert(data.message)
      })
    },
    showadd() {
      app.addInfo = {
        info: '',
        title: '',
      }
      app.addVisible = true
    },
    // 查询
    query() {
      app.loading = true
      let q = tools.concatJson(app.queryInfo, app.page)
      console.log('合并的请求参数', q)
      tools.ajax('/manage/class/queryAll', q, (data) => {
        app.loading = false
        if (data.success) {
          app.list = data.list
          app.page = data.page
        } else {
          app.$alert(data.message, '错误')
        }
      })
    },
    queryw() {
      tools.ajax('/linkinfo/queryAllClass', {}, (data) => {
        if (data.success) {
          app.clist = data.list
          app.cid = data.list[0].cid
          return
        }
      })
    },

    //学生的增删改查
    querys() {
      app.loading = true
      let e = tools.concatJson(app.queryInfos, app.page)
      console.log('合并的请求参数', e)
      tools.ajax('/manage/student/queryAll', e, (data) => {
        app.loading = false
        if (data.success) {
          app.list = data.list
          app.page = data.page
        } else {
          app.$alert(data.message, '错误')
        }
      })
    },
    querysw() {
      tools.ajax('/linkinfo/queryStudentByClass', {}, (data) => {
        if (data.success) {
          app.slist = data.list
          app.cid = data.list[0].cid
          return
        }
        app.$alert(data.message)
      })
    },
  },
  created() {
    app = this
    console.log(app.title)
    app.query()
    app.querys()
  },
}
</script>
