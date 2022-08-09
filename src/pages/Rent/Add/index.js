import React, { Component } from 'react'
import withHook from '../../../utils/withHook'

import {
  List,
  Input,
  Form,
  Picker,
  ImageUploader,
  TextArea,
  Modal,
  Toast
} from 'antd-mobile'

import { API } from '../../../utils'

import NavHeader from '../../../components/NavBarHeader'
import HousePackge from '../../../components/HousePackage'

import styles from './index.module.scss'
import { FormItem } from 'antd-mobile/es/components/form/form-item'


const alert = Modal.alert

// 房屋类型
const roomTypeData = [
  [{ label: '一室', value: 'ROOM|d4a692e4-a177-37fd' },
  { label: '二室', value: 'ROOM|d1a00384-5801-d5cd' },
  { label: '三室', value: 'ROOM|20903ae0-c7bc-f2e2' },
  { label: '四室', value: 'ROOM|ce2a5daa-811d-2f49' },
  { label: '四室+', value: 'ROOM|2731c38c-5b19-ff7f' }]
]

// 朝向：
const orientedData = [
  [{ label: '东', value: 'ORIEN|141b98bf-1ad0-11e3' },
  { label: '西', value: 'ORIEN|103fb3aa-e8b4-de0e' },
  { label: '南', value: 'ORIEN|61e99445-e95e-7f37' },
  { label: '北', value: 'ORIEN|caa6f80b-b764-c2df' },
  { label: '东南', value: 'ORIEN|dfb1b36b-e0d1-0977' },
  { label: '东北', value: 'ORIEN|67ac2205-7e0f-c057' },
  { label: '西南', value: 'ORIEN|2354e89e-3918-9cef' },
  { label: '西北', value: 'ORIEN|80795f1a-e32f-feb9' }]
]

// 楼层
const floorData = [
  [{ label: '高楼层', value: 'FLOOR|1' },
  { label: '中楼层', value: 'FLOOR|2' },
  { label: '低楼层', value: 'FLOOR|3' }]
]
class RentAdd extends Component {
  constructor(props) {
    super(props)

    // console.log(props)
    const { state } = props.location
    const community = {
      name: '',
      id: ''
    }

    if (state) {
      // 有小区信息数据，存储到状态中
      community.name = state.name
      community.id = state.id
    }

    this.state = {
      // 临时图片地址
      tempSlides: [],

      // 小区的名称和id
      community,
      // 价格
      price: '',
      // 面积
      size: '',
      // 房屋类型
      roomType: '',
      roomLabel: '',
      // 楼层
      floor: '',
      floorLabel: '',
      // 朝向：
      oriented: '',
      orientedLabel: '',
      // 房屋标题
      title: '',
      // 房屋图片
      houseImg: '',
      // 房屋配套：
      supporting: '',
      // 房屋描述
      description: ''
    }
  }

  // 取消编辑，返回上一页
  onCancel = () => {
    alert('提示', '放弃发布房源?', [
      {
        text: '放弃',
        onPress: async () => this.props.to(-1)
      },
      {
        text: '继续编辑'
      }
    ])
  }

  /* 
    获取表单数据：
  */
  getValue = (name, value, labelName, label) => {
    // console.log(name, value, label);
    if (labelName === '') {
      this.setState({
        [name]: value
      })
    } else {
      this.setState({
        [name]: value,
        [labelName]: label
      })
    }
  }

  /* 
    获取房屋配置数据：
  */
  handleSupporting = selected => {
    // console.log(selected)
    this.setState({
      supporting: selected.join('|')
    })
  }

  /* 
    获取房屋图片：

    1 给 ImagePicker 组件添加 onChange 配置项。
    2 通过 onChange 的参数，获取到上传的图片，并存储到状态 tempSlides 中。
  */
  handleHouseImg = (item) => {
    // console.log('item', item)
    this.setState({
      tempSlides: item
    })
  }

  /* 
    发布房源：

    1 在 addHouse 方法中，从 state 里面获取到所有房屋数据。
    2 使用 API 调用发布房源接口，传递所有房屋数据。
    3 根据接口返回值中的状态码，判断是否发布成功。
    4 如果状态码是 200，表示发布成功，就提示：发布成功，并跳转到已发布房源页面。
    5 否则，就提示：服务器偷懒了，请稍后再试~。
  */
  addHouse = async () => {
    const {
      tempSlides,
      title,
      description,
      oriented,
      supporting,
      price,
      roomType,
      size,
      floor,
      community
    } = this.state
    let houseImg = ''

    // 上传房屋图片：
    if (tempSlides.length > 0) {
      // 已经有上传的图片了
      const form = new FormData()
      tempSlides.forEach(item => form.append('file', item.file))

      const res = await API.post('/houses/image', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      // console.log(res)
      houseImg = res.data.body.join('|')
    }
    try {
      const data = {
        title,
        description,
        oriented,
        supporting,
        price,
        roomType,
        size,
        floor,
        community: community.id,
        houseImg
      }
      // 信息未完善不能上传
      for (let key in data) {
        if (data[key] === '') {
          Toast.show({ content: '请补全信息后再试！' })
          return
        }
      }
      // 发布房源
      const res = await API.post('/user/houses', data)

      if (res.data.status === 200) {
        // 发布成功
        Toast.show({ content: '发布成功' })
        this.props.to('/rent')
      } else {
        Toast.show({ content: '服务器偷懒了，请稍后再试~' })
      }
    } catch (err) {
      Toast.show({ content: '服务器偷懒了，请稍后再试~' })
    }
  }

  render() {
    const Item = List.Item
    const { to } = this.props
    const {
      community,
      price,
      roomType,
      floor,
      oriented,
      description,
      tempSlides,
      title,
      size
    } = this.state

    return (
      <div className={styles.root}>
        <NavHeader onLeftClick={this.onCancel}>发布房源</NavHeader>

        {/* 房源信息 */}
        <List
          className={styles.header}
          header='房源信息'
          data-role="rent-list"
        >
          {/* 选择所在小区 */}
          <Item
            extra={community.name || '请输入小区名称'}
            onClick={() => to('/rent/search', { replace: true })}
          >
            小区名称
          </Item>
          {/* 相当于 form 表单的 input 元素 */}
          <Form layout='horizontal'>
            <Form.Item label='租&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金' name='price' extra="￥/月">
              <Input
                placeholder="请输入租金/月"
                value={price}
                onChange={val => this.getValue('price', val)}
              />
            </ Form.Item>
            <FormItem label='建筑面积' extra="㎡" name='size'>
              <Input
                placeholder="请输入建筑面积"
                value={size}
                onChange={val => this.getValue('size', val)}
              />
            </FormItem>
          </Form>


          <Picker
            columns={roomTypeData}
            value={[roomType]}
            onConfirm={(val, extend) => this.getValue('roomType', val[0], 'roomLabel', extend.items[0].label)}
          >
            {(_, actions) => <Item extra={this.state.roomLabel || '请选择'} onClick={actions.open}>户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型</Item>}
          </Picker>

          <Picker
            columns={floorData}
            value={[floor]}
            onConfirm={(val, extend) => this.getValue('floor', val[0], 'floorLabel', extend.items[0].label)}
          >
            {(_, actions) => <Item extra={this.state.floorLabel || '请选择'} onClick={actions.open}>所在楼层</Item>}
          </Picker>

          <Picker
            columns={orientedData}
            value={[oriented]}
            onConfirm={(val, extend) => this.getValue('oriented', val[0], 'orientedLabel', extend.items[0].label)}
          >
            {(_, actions) => <Item extra={this.state.orientedLabel || '请选择'} onClick={actions.open}>朝&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;向</Item>}
          </Picker>
        </List>

        {/* 房屋标题 */}
        <List
          className={styles.title}
          header='房屋标题'
          data-role="rent-list"
        >
          <Input
            placeholder="请输入标题（例如：整租 小区名 2室 5000元）"
            value={title}
            onChange={val => this.getValue('title', val)}
          />
        </List>

        {/* 房屋图像 */}
        <List
          className={styles.pics}
          header='房屋图像'
          data-role="rent-list"
        >
          <ImageUploader
            value={tempSlides}
            onChange={this.handleHouseImg}
            upload={(file) => {
              return {
                file,
                url: URL.createObjectURL(file)
              }
            }}
            multiple={true}
            className={styles.imgpicker}
          />
        </List>

        {/* 房屋配置 */}
        <List
          className={styles.supporting}
          header='房屋配置'
          data-role="rent-list"
        >
          <HousePackge select onSelect={this.handleSupporting} />
        </List>

        {/* 房屋描述 */}
        <List
          className={styles.desc}
          header='房屋描述'
          data-role="rent-list"
        >
          <TextArea
            rows={5}
            placeholder="请输入房屋描述信息"
            value={description}
            onChange={val => this.getValue('description', val)}
          />
        </List>

        <div className={styles.bottom}>
          <div className={styles.cancel} onClick={this.onCancel}>
            取消
          </div>
          <div className={styles.confirm} onClick={this.addHouse}>
            提交
          </div>
        </div>
      </div>
    )
  }
}


export default withHook(RentAdd)
