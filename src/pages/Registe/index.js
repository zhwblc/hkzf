import React, { Component } from 'react'
// 导入withFormik
import { withFormik, Form, Field, ErrorMessage } from 'formik'

// 导入Yup
import * as Yup from 'yup'

import { Link } from 'react-router-dom'

import NavBarHeader from '../../components/NavBarHeader'

import styles from './index.module.css'
import { API } from '../../utils'
import { Toast } from 'antd-mobile'

import withHook from '../../utils/withHook'

// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Registe extends Component {
  render() {
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavBarHeader className={styles.navHeader}>注册</NavBarHeader>
        {/* <WhiteSpace size="xl" />
        <WingBlank> */}
        <Form className={styles.form}>
          <div className={styles.formItem}>
            <Field
              className={styles.input}
              name="username"
              placeholder="请输入账号"
            />
          </div>
          <ErrorMessage
            className={styles.error}
            name="username"
            component="div"
          />
          <div className={styles.formItem}>
            <Field
              className={styles.input}
              name="password"
              type="password"
              placeholder="请输入密码"
            />
          </div>
          <ErrorMessage
            className={styles.error}
            name="password"
            component="div"
          />
          <div className={styles.formItem}>
            <Field
              className={styles.input}
              name="repassword"
              type="repassword"
              placeholder="请输入密码"
            />
          </div>
          <ErrorMessage
            className={styles.error}
            name="repassword"
            component="div"
          />
          <div className={styles.formSubmit}>
            <button className={styles.submit} type="submit">
              注册并登录
            </button>
          </div>
        </Form>
        <div className={styles.backHome} justify="between">
          <Link to="/home">点我回首页</Link>
          {/* <Link to="/login">已有账号，去登录</Link> */}
          <div onClick={() => { this.props.to('/login', { replace: true }) }}>已有账号，去登录</div>
        </div>
        {/* </WingBlank> */}
      </div>
    )
  }
}

Registe = withFormik({
  // 提供状态：
  mapPropsToValues: () => ({ username: '', password: '' }),

  // 添加表单校验规则
  validationSchema: Yup.object().shape({
    username: Yup.string()
      .required('账号为必填项')
      .matches(REG_UNAME, '长度为5到8位，只能出现数字、字母、下划线'),
    password: Yup.string()
      .required('密码为必填项')
      .matches(REG_PWD, '长度为5到12位，只能出现数字、字母、下划线'),
    repassword: Yup.string()
      .required('密码为必填项')
      .oneOf([Yup.ref('password')], '密码不一致')
  }),

  handleSubmit: async (values, { props }) => {
    // 获取账号和密码
    const { username, password } = values

    const { data: { body, status, description } } = await API.post('/user/registered', { username, password })

    if (status === 200) {
      console.log(body);
      // 注册成功
      localStorage.setItem('hkzf_token', body.toke)

      props.to(-1)
      // props.to('/home/profile')
    } else {
      Toast.show({ content: description })
    }

  }
})(Registe)

export default withHook(Registe)
