import { NavBar } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

import styles from './index.module.scss'

const NavBarHeader = ({ children, onBack, className, rightContent }) => {
  const navigate = useNavigate()

  // 默认点击行为
  const defaultHandler = () => navigate(-1)

  return (
    // 顶部导航
    <NavBar
      onBack={onBack || defaultHandler}
      className={[styles.navbar, className || ''].join(' ')}
      right={rightContent}
    >
      {children}
    </NavBar>
  )
}

// props校验
NavBarHeader.prototypes = {
  children: PropTypes.string.isRequired,
  onBack: PropTypes.func,
  className: PropTypes.string,
  rightContent: PropTypes.array
}

export default NavBarHeader
