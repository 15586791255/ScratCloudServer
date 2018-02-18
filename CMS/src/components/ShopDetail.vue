<template>
  <div>
    <x-header>{{title}}</x-header>
    <label for="coverInput"><img slot="header" :src="cover" style="width:100%;display:block;" v-on:click="changeImg()"></label>
    <input type="file" @change="upload" accept="image/gif,image/jpeg,image/jpg,image/png" style="display: none;" id="coverInput" ref="coverInput">

    <group>
      <x-input v-if="goodsId != 0" title="ID" disabled v-model="goodsId"></x-input>
      <x-input v-if="createDatetime != ''" title="创建时间" disabled v-model="createDatetime"></x-input>
      <x-input v-if="deleteTs != 0" title="删除时间" disabled v-model="deleteDatetime"></x-input>
    </group>

    <group title="基本信息">
      <x-input title="标题" placeholder="必填" v-model="title"></x-input>
      <!-- <x-input title="竞猜币" placeholder="必填" v-model="coin" keyboard="number"></x-input> -->
      <x-number :value="0" title="竞猜币" fillable v-model="coin" width="100px"></x-number>
      <!-- <x-input title="换购人数" placeholder="必填" v-model="total" keyboard="number"></x-input> -->
      <x-number :value="0" title="换购人数" fillable v-model="total" width="100px"></x-number>
      <popup-picker title="奖品类型" :data="tpList" v-model="typeStr" placeholder="请选择"></popup-picker>
      <calendar v-model="expiredDatetime" title="过期时间" disable-past></calendar>
    </group>
    
    <group title="详情">
      <x-textarea :max="1000" placeholder="请输入详情信息" v-model="description"></x-textarea>
    </group>

    <div style="padding: 15px" v-if="deleteTs == 0">
      <x-button type="primary" @click.native="add()" v-if="goodsId == 0">添加</x-button>
      <x-button type="primary" @click.native="update()" v-if="goodsId != 0">修改</x-button>
      <x-button type="warn" @click.native="deleteGoods()" v-if="goodsId != 0">删除</x-button>
    </div>
    <loading :show="loading" text="加载中"></loading>
  </div>
</template>

<script>
  import {XHeader, Card, Loading, Group, XInput, Cell, Calendar, PopupPicker, XTextarea, XButton, XNumber} from 'vux'
  export default {
    components: {
      XHeader, Card, Loading, Group, XInput, Cell, Calendar, PopupPicker, XTextarea, XButton, XNumber
    },
    data () {
      return {
        loading: true,
        goodsId: 0,
        title: '',
        cover: 'http://placeholder.qiniudn.com/750x300',
        coin: 0,
        total: 0,
        description: '',
        createDatetime: '',
        expiredDatetime: '',
        deleteDatetime: '',
        deleteTs: 0,
        tpList: [],
        typeStr: []
      }
    },
    created: function () {
      const tpKeyList = []
      for (var tp in this.shopType) {
        tpKeyList.push(this.shopType[tp])
      }
      this.tpList = [tpKeyList]
      this.goodsId = this.$route.query.goods_id
      if (this.goodsId === '0') {
        this.loading = false
        this.typeStr = [tpKeyList[0]]
        this.expiredDatetime = this.$dateFormat.toStr(new Date(new Date().getTime() + 24 * 3600000), 'yyyy-MM-dd')
        return
      }
      const that = this
      this.$http.get(`${this.apiHost}/api/mall/goods/${this.goodsId}`)
        .then(response => {
          console.log(response)
          that.loading = false
          if (response.status !== 200) {
            that.$showAlert('请求失败', '网络异常')
            return
          }
          const {code, data, msg} = response.data
          if (code !== 200) {
            that.$showAlert('请求失败', msg)
            return
          }
          that.title = data.title
          that.cover = data.cover
          that.total = data.total
          that.coin = data.coin
          that.deleteTs = data.delete_ts ? data.delete_ts : 0
          that.description = data.description
          that.typeStr = [that.shopType[data.tp]]
          const createTs = parseFloat(data.create_ts)
          if (createTs > 0) {
            that.createDatetime = that.$dateFormat.toStr(new Date(createTs), 'yyyy-MM-dd hh:mm:ss')
          }
          const expiredTs = parseFloat(data.expired_ts)
          if (expiredTs > 0) {
            that.expiredDatetime = that.$dateFormat.toStr(new Date(expiredTs), 'yyyy-MM-dd')
          }
          const deleteTs = parseFloat(data.delete_ts)
          if (deleteTs > 0) {
            that.deleteDatetime = that.$dateFormat.toStr(new Date(deleteTs), 'yyyy-MM-dd hh:mm')
          }
        }).catch(response => {
          that.loading = false
          console.log(response)
          that.$showAlert('请求失败', '网络异常')
        })
    },
    methods: {
      add () {
        const expiredTs = new Date(this.expiredDatetime).getTime()
        const that = this
        this.$http.put(`${this.apiHost}/api/mall/admin/goods`,
          {
            tp: this.getSelectedType(this.typeStr[0]),
            cover: this.cover,
            title: this.title,
            description: this.description,
            coin: this.coin,
            total: this.total,
            expired_ts: expiredTs
          }).then(response => {
            that.$router.go(-1)
          }).catch(response => {
            that.loading = false
            console.log(response)
            that.$showAlert('操作失败', '网络异常')
          })
      },
      getSelectedType (tpStr) {
        for (var tp in this.shopType) {
          if (this.shopType[tp] === tpStr) {
            return tp
          }
        }
        return ''
      },
      update () {
        const that = this
        that.loading = true
        this.$http.post(`${this.apiHost}/api/mall/admin/goods`,
          {
            goods_id: this.goodsId,
            tp: this.getSelectedType(this.typeStr[0]),
            cover: this.cover,
            title: this.title,
            description: this.description,
            coin: this.coin,
            total: this.total,
            expired_ts: new Date(this.expiredDatetime).getTime(),
            delete_ts: 0
          }).then(response => {
            that.loading = false
            that.$router.go(-1)
          }).catch(response => {
            that.loading = false
            console.log(response)
            that.$showAlert('操作失败', '网络异常')
          })
      },
      changeImg () {
        this.$refs.coverInput.click()
      },
      upload (event) {
        let file = event.target.files[0]
        if (!file) {
          console.log('file is empty')
          return
        }
        const that = this
        that.loading = true
        this.$http.get(`${this.apiHost}/api/file/qiniu_token`)
          .then(res => {
            that.loading = false
            if (res.data.code !== 200) {
              console.dir(res)
              return
            }
            const {upload_token, domain} = res.data.data
            const formData = new FormData()
            const nowDateStr = that.$dateFormat.toStr(new Date(), 'yyMMddhhmmss')
            const key = `${nowDateStr}.${file.name}`
            formData.append('token', upload_token)
            formData.append('key', key)
            formData.append('file', file)
            that.$http.post('http://up.qiniu.com', formData, {
              progress (event) {
                const loaded = (event.loaded / 1000000).toFixed(2)
                const fileSize = (event.total / 1000000).toFixed(2)
                const percent = (event.loaded / event.total * 100).toFixed(2)
                console.log(loaded)
                console.log(fileSize)
                console.log(percent)
              }
            })
            .then(response => {
              that.cover = `${domain}${key}`
            }, error => {
              console.dir(error)
            })
          }).catch(err => {
            that.loading = false
            console.log(err)
            that.$showAlert('操作失败', '网络异常')
          })
      },
      deleteGoods () {
        const that = this
        this.$http.delete(`${this.apiHost}/api/mall/admin/goods/${this.goodsId}`)
          .then(res => {
            that.$router.go(-1)
          }, err => {
            console.log(err)
          })
      }
    }
  }
</script>

<style>
</style>
