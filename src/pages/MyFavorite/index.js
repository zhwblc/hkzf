import React, { useState } from "react"
import { useNavigate, useLocation } from 'react-router-dom'

import HouseItem from '../../components/HouseItem'
import NavBarHeader from "../../components/NavBarHeader"

import { API, BASE_URL } from '../../utils'

import styles from './index.module.scss'

function MyFavorite() {
  const [list, setList] = useState([])
  const navigate = useNavigate()
  const location = useLocation()

  // 获取收藏房屋列表数据
  const getHouseList = async () => {

    const { data: { body, status } } = await API.get('/user/favorites')

    if (status === 200) {
      // 查询成功
      setList(body)
    } else {
      // 查询失败
      navigate('/login', {
        replace: true,
        state: {
          from: location
        }
      })
    }
  }

  const renderHouseItem = () => {
    return list.map(item => {
      return (
        <HouseItem
          key={item.houseCode}
          onClick={() => navigate(`/detail/${item.houseCode}`)}
          src={BASE_URL + item.houseImg}
          title={item.title}
          desc={item.desc}
          tags={item.tags}
          price={item.price}
        />
      )
    })
  }

  getHouseList()

  return (
    <div className={styles.root}>
      <NavBarHeader onBack={() => navigate(-1)}>我的收藏</NavBarHeader>
      <div className={styles.houses}>{renderHouseItem()}</div>
    </div>
  )
}

export default MyFavorite