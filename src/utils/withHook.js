import { useNavigate, useParams, useLocation } from 'react-router-dom'
// 高阶组件包装
function withHook(WrapCompontent) {
  // 设置别名
  WrapCompontent.displayName = `WithHook${getDisplayName(WrapCompontent)}`
  return function QiLincompont() {
    const navigate = useNavigate()
    const params = useParams()
    const location = useLocation()
    return <WrapCompontent to={navigate} params={params} location={location}></WrapCompontent>
  }
}

// 设置别名
function getDisplayName(WrapCompontent) {
  return WrapCompontent.displayname || WrapCompontent.name || 'Component'
}

export default withHook