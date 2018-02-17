<template>
  <div>
    <x-header>{{title}}<a slot="right" v-on:click="newGoods()">新建</a></x-header>
    <card v-for="(item,index) in list" :key="index" @click.native="gotoDetail(item.goods_id)">
      <img slot="header" :src="item.src" style="width:100%;display:block;">
      <div slot="content" class="card-padding">
        <p style="color:#999;font-size:12px;">{{item.expiredDateStr}}</p>
        <p style="color:red;font-size:12px;" v-if="item.deleteDateStr != ''">删除时间：{{item.deleteDateStr}}</p>
        <p style="font-size:14px;line-height:1.2;">{{item.title}}</p>
      </div>
    </card>
    <!--</a>-->
    <group>
      <cell title="加载更多" v-if="loadMore" @click.native="loadData(false)"></cell>
    </group>
    <loading :show="loading" text="加载中"></loading>
  </div>
</template>

<script>
  import {Group, Cell, Panel, Loading, XHeader, Card} from 'vux'

  export default {
    components: {
      Group,
      Cell,
      Panel,
      Loading,
      XHeader,
      Card
    },
    data () {
      return {
        title: '',
        list: [],
        listHeader: '',
        index: 0,
        tp: '',
        loading: true,
        loadMore: false
      }
    },
    created: function () {
      this.tp = this.$route.query.tp
      this.title = this.$global.shopType[this.tp]
      this.loadData(true)
    },
    methods: {
      loadData (refresh) {
        if (refresh) {
          this.index = 0
          this.list = []
        }
        if (this.index === -1) {
          return
        }
        const that = this
        this.$http.get(`${this.$global.apiHost}/api/mall/admin/goods`, {params: {tp: this.tp, index: this.index}})
          .then(function (response) {
            console.dir(response)
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
            that.index = data.index
            if (data.index === -1) {
              that.loadMore = false
            } else {
              that.loadMore = true
            }
            const now = new Date()
            for (let item of data.items) {
              console.log(item)
              const expiredDate = new Date(parseFloat(item.expired_ts))
              const dateStr = expiredDate < now ? '已过期' : that.$dateFormat.toStr(expiredDate, 'yyyy-MM-dd hh:mm')
              const deleteStr = item.delete_ts > 0 ? that.$dateFormat.toStr(new Date(parseFloat(item.delete_ts)), 'yyyy-MM-dd hh:mm') : ''
              that.list.push({
                goods_id: item.goods_id,
                src: item.cover,
                title: item.title,
                expiredDateStr: `过期时间：${dateStr}`,
                deleteDateStr: deleteStr,
                url: {
                  path: '/shop_detail',
                  query: {
                    goods_id: item.goods_id
                  }
                }
              })
            }
            if (that.list.length === 0) {
              that.listHeader = '没有找到数据'
            }
          }).catch(function (response) {
            that.loading = false
            console.log(response)
            that.$showAlert('请求失败', '网络异常')
          })
      },
      gotoDetail (goodsId) {
        this.$router.push({
          path: '/shop_detail',
          query: {goods_id: goodsId}
        })
      },
      newGoods () {
        this.$router.push({
          path: '/shop_detail',
          query: {goods_id: '0'}
        })
      }
    }
  }
</script>

<style lang="less">
  /*@import '~vux/src/styles/1px.less';*/
  .card-padding {
    padding: 15px;
  }
</style>
