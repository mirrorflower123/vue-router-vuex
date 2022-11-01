<template>
  <div>
    <template>
      <!-- 上方查询表单 -->
      <div>
        <el-form :inline="true">
          <el-form-item> <el-input v-model="queryInfoClass.cname" placeholder="班级名称"></el-input></el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryClass">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="showaddClass">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 班级数据呈现 -->
      <div v-loading="loading">
        <el-table :data="clist">
          <el-table-column label="编号" prop="cid"></el-table-column>
          <el-table-column label="班级描述" prop="cinfo"></el-table-column>
          <el-table-column label="班级名称" prop="cname"></el-table-column>
          <el-table-column label="修改信息使时间">
            <template slot-scope="w">
              {{ w.row.lastupdate | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="d">
              <el-button @click="showModifyClass(d.row)" size="small" type="primary">修改</el-button>
              <el-button @click="delClass(d.row)" size="small" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background :total="page.total" :current-page.sync="page.pageNumber" :page-size.sync="page.pageSize" @current-change="queryClass" layout="prev,pager,next,total,jumper,sizes" :page-sizes="[5, 10, 20]" @size-change="queryClass"></el-pagination>
      </div>

      <!-- 上方查询表单 -->
      <div>
        <el-form :inline="true">
          <el-form-item> <el-input v-model="queryInfoStudent.sname" placeholder="学生姓名"></el-input></el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryStudent">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="showaddStudent">添加</el-button>
          </el-form-item>
        </el-form>
        <el-select @change="queryVStudent" v-model="cid" placeholder="所在班级">
          <el-option v-for="d in clist" :key="d.cid" :value="d.cid" :label="d.cname"></el-option>
        </el-select>
      </div>

      <!-- 学生数据呈现 -->
      <div v-loading="loading">
        <el-table :data="slist">
          <el-table-column label="班级编号" prop="cid"></el-table-column>
          <el-table-column label="学生姓名" prop="sname"></el-table-column>
          <el-table-column label="家庭地址" prop="address"></el-table-column>
          <el-table-column label="家庭地址" prop="phone"></el-table-column>
          <el-table-column label="修改信息使时间">
            <template slot-scope="k">
              {{ k.row.lastupdate | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="d">
              <el-button @click="showModifyStudent(d.row)" size="small" type="primary">修改</el-button>
              <el-button @click="delStudents(d.row)" size="small" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background :total="page.total" :current-page.sync="page.pageNumber" :page-size.sync="page.pageSize" @current-change="queryStudent" layout="prev,pager,next,total,jumper,sizes" :page-sizes="[5, 10, 20]" @size-change="queryStudent"></el-pagination>
      </div>
    </template>

    <!-- 班级添加对话框 -->
    <div>
      <el-dialog title="添加信息" :visible.sync="ClassaddVisible" :close-on-click-modal="false" @closed="queryClass">
        <div v-loading="loading">
          <el-form>
            <el-form-item>
              <el-input v-model="addInfoClass.cinfo" placeholder="班级描述"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="addInfoClass.cname" placeholder="班级名称"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" v-loading="loading">
          <el-button type="primary" @click="addClass">保存</el-button>
          <el-button type="primary" @click="ClassaddVisible = false">关闭</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 学生添加对话框 -->
    <div>
      <el-dialog title="添加信息" :visible.sync="StudentaddVisible" :close-on-click-modal="false" @closed="queryStudent">
        <div v-loading="loading">
          <el-form>
            <el-form-item>
              <el-input v-model="addInfoStudents.cid" placeholder="所属班级编号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="addInfoStudents.sname" placeholder="学生姓名"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="addInfoStudents.address" placeholder="家庭住址"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="addInfoStudents.phone" placeholder="学生电话"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="addInfoStudents.qq" placeholder="QQ号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="addInfoStudents.wechat" placeholder="微信号"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" v-loading="loading">
          <el-button type="primary" @click="addStudent">保存</el-button>
          <el-button type="primary" @click="StudentaddVisible = false">关闭</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 班级修改对话框 -->
    <div>
      <el-dialog title="修改信息" :visible.sync="ClassmodifyVisible" :close-on-click-modal="false" @closed="queryClass">
        <div v-loading="loading">
          <el-form>
            <el-form-item>
              <el-input v-model="modifyInfoClass.cinfo" placeholder="班级描述"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="modifyInfoClass.cname" placeholder="班级名称"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" v-loading="loading">
          <el-button type="primary" @click="modifyClass">保存</el-button>
          <el-button type="primary" @click="ClassmodifyVisible = false">关闭</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 学生修改对话框 -->
    <div>
      <el-dialog title="修改信息" :visible.sync="StudentsmodifyVisible" :close-on-click-modal="false" @closed="queryStudent">
        <div v-loading="loading">
          <el-form>
            <el-form-item>
              <el-input v-model="modifyInfoStudent.cid" placeholder="所属班级编号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="modifyInfoStudent.sname" placeholder="学生姓名"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="modifyInfoStudent.address" placeholder="家庭住址"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="modifyInfoStudent.phone" placeholder="学生电话"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="modifyInfoStudent.qq" placeholder="QQ号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="modifyInfoStudent.wechat" placeholder="微信号"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" v-loading="loading">
          <el-button type="primary" @click="modifyStudent">保存</el-button>
          <el-button type="primary" @click="StudentsmodifyVisible = false">关闭</el-button>
        </div>
      </el-dialog>
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
      cid: '',
      clist: [],
      sid: '',
      slist: [],
      page: { pageSize: '' },
      // 班级请求参数
      queryInfoClass: {
        cname: '',
      },
      //学生请求参数
      queryInfoStudent: {
        sname: '',
      },
      //添加的部分
      addInfoClass: {
        cinfo: '',
        cname: '',
      },
      addInfoStudents: {
        cid: '',
        sname: '',
        address: '',
        phone: '',
        qq: '',
        wechat: '',
      },
      modifyInfoClass: {},
      modifyInfoStudent: {},
      ClassmodifyVisible: false,
      StudentsmodifyVisible: false,
      ClassaddVisible: false,
      StudentaddVisible: false,
    }
  },
  computed: {},
  methods: {
    // 班级查询
    queryClass() {
      app.loading = true
      let q = tools.concatJson(app.queryInfoClass, app.page)
      console.log('合并的请求参数', q)
      tools.ajax('/manage/class/queryAll', q, (data) => {
        app.loading = false
        if (data.success) {
          app.clist = data.list
          app.page = data.page
        } else {
          app.$alert(data.message, '错误')
        }
      })
    },
    // 班级联动查询
    queryVClass() {
      tools.ajax('/linkinfo/queryAllClass', {}, (data) => {
        if (data.success) {
          app.clist = data.list
          app.cid = data.list[0].cid
          app.queryVStudent()
          return
        }
      })
    },
    //学生查询
    queryStudent() {
      app.loading = true
      let s = tools.concatJson(app.queryInfoStudent, app.page)
      console.log('合并的请求参数', s)
      tools.ajax('/manage/student/queryAll', s, (data) => {
        app.loading = false
        if (data.success) {
          app.slist = data.list
          app.page = data.page
        } else {
          app.$alert(data.message, '错误')
        }
      })
    },
    //学生联动查询
    queryVStudent() {
      tools.ajax('/linkinfo/queryStudentByClass', { cid: app.cid }, (data) => {
        if (data.success) {
          app.slist = data.list
          app.sid = data.list[0].sid
          return
        }
        app.$alert(data.message)
      })
    },
    // 班级删除
    delClass(info) {
      app
        .$confirm('是否删除：' + info.cname, '删除', {
          type: 'warnig',
        })
        .then(() => {
          tools.ajax('/manage/class/delete', { cid: info.cid }, (data) => {
            app.$alert(data.message, '信息', {
              callback: app.queryClass,
            })
          })
        })
        .catch(() => {})
    },
    // 学生删除
    delStudents(info) {
      app
        .$confirm('是否删除：' + info.sname, '删除', {
          type: 'warnig',
        })
        .then(() => {
          tools.ajax('/manage/student/delete', { sid: info.sid }, (data) => {
            app.$alert(data.message, '信息', {
              callback: app.queryStudent,
            })
          })
        })
        .catch(() => {})
    },

    //班级修改
    showModifyClass(info) {
      app.modifyInfoClass = tools.concatJson(info)
      app.ClassmodifyVisible = true
    },

    modifyClass() {
      app.loading = true
      tools.ajax('/manage/class/update', app.modifyInfoClass, (data) => {
        app.loading = false
        app.$alert(data.message)
      })
    },

    //学生修改
    modifyStudent() {
      app.loading = true
      tools.ajax('/manage/student/update', app.modifyInfoStudent, (data) => {
        app.loading = false
        app.$alert(data.message)
      })
    },

    showModifyStudent(info) {
      app.modifyInfoStudent = tools.concatJson(info)
      app.StudentsmodifyVisible = true
    },

    // 班级添加
    addClass() {
      app.loading = true
      tools.ajax('/manage/class/add', app.addInfoClass, (data) => {
        app.loading = false
        app.$alert(data.message)
      })
    },
    showaddClass() {
      app.addInfoClass = {
        cinfo: '',
        cname: '',
      }
      app.ClassaddVisible = true
    },
    //学生添加
    addStudent() {
      app.loading = true
      tools.ajax('/manage/student/add', app.addInfoStudents, (data) => {
        app.loading = false
        app.$alert(data.message)
      })
    },
    showaddStudent() {
      app.addInfoStudents = {
        cid: '',
        sname: '',
        address: '',
        phone: '',
        qq: '',
        wechat: '',
      }
      app.StudentaddVisible = true
    },
  },
  created() {
    app = this
    console.log(app.title)
    app.queryClass()
    app.queryStudent()
  },
}
</script>
