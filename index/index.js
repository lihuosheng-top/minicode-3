Page({
  data: {
    latitude: 22.80524,
    longitude: 113.293359,
    cur_scale: 10,
    // 这是地区数据
    area_markers: [  
        {
        id: 1,
        latitude: 22.80524,
        longitude: 113.293359,
        iconPath:'/image/touming.png',
        name: '顺德区',
        label: {
          content: "顺德区 \n 21家",
          fontSize: 30,  // 字体大小能改变图标大小
          anchorX: -50,
          anchorY: -40,
          bgColor: '#7cb5ec88',
          color: '#fff',
          borderRadius: 90, // 图片的半径大小 随着字体大小而改变
          padding: 4,
        },
        },
      {
        id: 1,
        latitude: 23.009505,
        longitude: 113.12244,
        iconPath: '/image/touming.png',
        name: '禅城区',
        label: {
          content: "禅城区 \n 31家",
          fontSize: 30,  // 字体大小能改变图标大小
          anchorX: -50,
          anchorY: -40,
          bgColor: '#7cb5ec88',
          color: '#fff',
          borderRadius: 90, // 图片的半径大小 随着字体大小而改变
          padding: 4,
        },
      },
    ],
    // 这是镇数据
    town_markers: [
      {
        id: 10,
        latitude: 22.758537,
        longitude: 113.275009,
        iconPath: '/image/touming.png',
        name: '容桂',
        label: {
          content: "容桂  \n  11家",
          fontSize: 30,  // 字体大小能改变图标大小
          anchorX: -50,
          anchorY: -40,
          bgColor: '#7cb5ec88',
          color: '#fff',
          borderRadius: 90, // 图片的半径大小 随着字体大小而改变
          padding: 4,
        },
      },
      {
        id: 1,
        latitude: 22.833065,
        longitude: 113.250504,
        iconPath: '/image/touming.png',
        name: '大良',
        label: {
          content: "大良   \n  10家",
          fontSize: 30,  // 字体大小能改变图标大小
          anchorX: -50,
          anchorY: -40,
          bgColor: '#7cb5ec88',
          color: '#fff',
          borderRadius: 90, // 图片的半径大小 随着字体大小而改变
          padding: 4,
        },
      },
      {
        id: 1,
        latitude: 22.861252,
        longitude: 113.209027,
        iconPath: '/image/touming.png',
        name: '伦敦',
        label: {
          content: "伦敦   \n   3家",
          fontSize: 30,  // 字体大小能改变图标大小
          anchorX: -50,
          anchorY: -40,
          bgColor: '#7cb5ec88',
          color: '#fff',
          borderRadius: 90, // 图片的半径大小 随着字体大小而改变
          padding: 4,
        },
      },
    ],
    // 这是企业具体位置
    markers: [
      {
      id: 1,
      latitude: 22.779925,
      longitude: 113.284901,
      name: '拿货商城',
        label: {
          content: "拿货商城",
          fontSize: 20,  // 字体大小能改变图标大小
          anchorX: -50,
          anchorY: -40,
        },
     },
    {
        id: 2,
        latitude: 22.763228,
        longitude: 113.339787,
        name: '顺德农商银行',
        label: {
        content: "顺德农商银行",
        fontSize: 20,  // 字体大小能改变图标大小
        anchorX: -50,
        anchorY: -40,
      },
    },
    ],
    // 缓存数据
    temp_marks: [],
    covers: [{
      latitude: 23.099994,
      longitude: 113.344520,
      iconPath: '/image/location.png'
    }, {
      latitude: 23.099994,
      longitude: 113.304520,
      iconPath: '/image/location.png'
    },
    ],
  },
  onReady: function (e) {
    this.setData(
      {
        temp_marks:this.data.area_markers
      }
    )
    this.mapCtx = wx.createMapContext('myMap')
  },
  getCenterLocation: function () {
    this.mapCtx.getCenterLocation({
      success: function(res){
        console.log(res.longitude)
        console.log(res.latitude)
      }
    })
  },

  getScale: function() {
    this.mapCtx.getScale({
      success: function(res)
      {
        console.log(res.scale)
      }
    })
  },

  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
  translateMarker: function() {
    this.mapCtx.translateMarker({
      markerId: 1,
      autoRotate: true,
      duration: 1000,
      destination: {
        latitude:23.10229,
        longitude:113.3345211,
      },
      animationEnd() {
        console.log('animation end')
      }
    })
  },
  includePoints: function() {
    this.mapCtx.includePoints({
      padding: [10],
      points: [{
        latitude:23.10229,
        longitude:113.3345211,
      }, {
        latitude:23.00229,
        longitude:113.3345211,
      }]
    })
  },
  bindlabeltap: function(res){
    // 需要 跳转到 14级别
    // 需要 请求数据 修改marks
    console.log(res)
    var that = this
    // 检测点击标签按钮 那么 首先应该判断 缩放级别
    // 如果当前级别在区 就转到镇
    // 如果当前级别在镇 就转到具体位置
    this.mapCtx.getScale({
      success: function (res) {
        if (res.scale < 12)
        {
          that.setData(
            {
              cur_scale : 13,
              temp_marks: that.data.town_markers
            }
          )
        }
        else if(res.scale < 14)
        {
            that.setData(
              {
                cur_scale: 14,
                temp_marks: that.data.markers
              }
            )
        }
      }
      })
  },
  
  bindregionchange: function(res){
    // 判断 触发事件为 causedBy: scale
    var that = this
    if (res['causedBy'] == "scale")
    {
      // 获取 缩放级别
      this.mapCtx.getScale({
        success: function (res) {
          // 判断 缩放级别 进行修改 marks 值
          // 原始 级别 与 改变的级别 如果在统一范围 则不需要 改变
          // 如果 需要 优化的话 则需要 改变覆盖大小  现阶段 不弄
          // 区范围 10-11   镇范围 12-13   具体地址范围 14-18
          // 以是否改变作为 第一判断
          console.log(res.scale)
          if (res.scale >= 14){
            // 具体范围
            if (that.data.cur_scale < 14){
              // 从镇 转 到 具体地址
              console.log('aaaa')
              console.log(res.scale)
              that.setData({
                temp_marks: that.data.markers,
                cur_scale: res.scale
              })
            }
          }else if(res.scale >= 12)
          {
            if (that.data.cur_scale < 12)
            {
              // 从区 转到 镇
              that.setData({
                temp_marks: that.data.town_markers,
                cur_scale: res.scale
              })
            }
            else if (that.data.cur_scale >= 14)
            {
              // 从具体地址 到 镇
              that.setData({
                temp_marks: that.data.town_markers,
                cur_scale: res.scale
              })
            }
          }else{
            if (that.data.cur_scale >= 12)
            {
              // 从镇 转到 区
              that.setData({
                temp_marks: that.data.area_markers,
                cur_scale: res.scale
              })
            }
          }
        }
      })
    }
    
  }
})
