<template>
  <div>
    <div>{{ title }}</div>
    <!-- 上方查询表单 -->
    <div>
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="queryInfo.title" placeholder="标题"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryInfo.info" placeholder="内容"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="showadd">添加</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 添加的对话框 -->
    <div>
      <el-dialog title="添加信息" :visible.sync="addVisible" :close-on-click-modal="false" @closed="query">
        <div v-loading="loading">
          <el-form>
            <el-form-item>
              <el-input v-model="addInfo.title" placeholder="标题"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="addInfo.info" placeholder="内容"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" v-loading="loading">
          <el-button type="primary" @click="add">保存</el-button>
          <el-button type="danger" @click="addVisible = false">关闭</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 修改对话框 -->
    <div>
      <el-dialog title="修改信息" :visible.sync="modifyVisible" :close-on-click-modal="false" @closed="query">
        <div v-loading="loading">
          <el-form>
            <el-form-item>
              <el-input v-model="modifyInfo.title" placeholder="标题"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="modifyInfo.info" placeholder="内容"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" v-loading="loading">
          <el-button type="primary" @click="modify">保存</el-button>
          <el-button type="danger" @click="modifyVisible = false">关闭</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 数据显示部分 -->
    <div v-loading="loading">
      <!-- 表格的data属性就是数据的数组 -->
      <el-table :data="list">
        <!-- label是表头，prop是数组中的数据的属性名称 -->
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="内容" prop="info"></el-table-column>
        <!-- 自定义模板列 -->
        <el-table-column label="信息修改时间">
          <template slot-scope="s">
            {{ s.row.lastupdate | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="d">
            <el-button @click="showModify(d.row)" size="small" type="primary">修改</el-button>
            <el-button @click="del(d.row)" size="small" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 total是总记录数,churrent-page是当前页码
      page-size是分页大小
      current-change事件是页码变化是要调用的方法
      -->
      <el-pagination background :total="page.total" :page-size.sync="page.pagesize" @current-change="query" layout="prev,pager,next,total,jumper" :page-sizes="[5, 10, 20]" @size-change="query"> </el-pagination>
    </div>
  </div>
</template>
<script>
// @表示从src目录开始计算
import tools from '@/js/tools'

let app
export default {
  // 作业:同步完成用户地址簿全部功能
  name: 'UserNoteView',
  data() {
    return {
      loading: '',
      title: '用户记事本',
      page: { pagesize: 5 },
      queryInfo: {
        info: '',
        title: '',
      },
      list: [],
      // 添加的部分
      addInfo: {
        info: '',
        title: '',
      },
      addVisible: false,
      //修改的部分
      modifyInfo: {},
      modifyVisible: false,
    }
  },
  computed: {},
  methods: {
    // 删除
    del(info) {
      app
        .$confirm('是否删除：' + info.title, '删除', {
          type: 'warnig',
        })
        .then(() => {
          tools.ajax('/user/note/delete', { unid: info.unid }, (data) => {
            app.$alert(data.message, '信息', {
              callback: app.query,
            })
          })
        })
        .catch(() => {})
    },

    // 修改
    showModify(info) {
      app.modifyInfo = tools.concatJson(info)
      // app.modifyInfo = JSON.parse(JSON.stringify(info))
      app.modifyVisible = true
    },
    modify() {
      app.loading = true
      tools.ajax('/user/note/update', app.modifyInfo, (data) => {
        app.loading = false
        app.$alert(data.message)
      })
    },

    // 添加
    add() {
      app.loading = true
      tools.ajax('/user/note/add', app.addInfo, (data) => {
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
      console.log('合并后的请求参数', q)
      tools.ajax('/user/note/queryAll', app.queryInfo, (data) => {
        app.loading = false
        if (data.success) {
          app.list = data.list
          app.page = data.page
        } else {
          app.$alert(data.message, '错误')
        }
      })
    },
  },
  created() {
    app = this
    console.log(app.title)
    app.query()
  },
}
</script>
