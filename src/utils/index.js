import { API } from './api.js'

export const gerCurrentCity = () => {
  // 判断 localStorage 中是否有定位城市
  const localCity = JSON.parse(localStorage.getItem('hkzf_city'))
  if (!localCity) {
    // 如果没有，就获取，并存储到本地存储中，然后返回城市数据
    // 通过 IP 定位获取当前城市名称
    return new Promise((resolve, reject) => {
      const myCity = new window.BMapGL.LocalCity();
      myCity.get(async res => {
        try {
          const cityName = res.name;
          const { data: result } = await API.get(`/area/info?name=${cityName}`)
          localStorage.setItem('hkzf_city', JSON.stringify(result.body))
          resolve(result.body)
        } catch (err) {
          reject(err)
        }
      })
    })
  } else {
    // 如果有，则直接返回本地存储中的城市数据
    // 因为上面 return 的是 Promise ，这里也应该是 Promise,(保证返回值类型的一致性)
    return Promise.resolve(localCity)
  }
}

export { API } from './api'
export { BASE_URL } from './url'