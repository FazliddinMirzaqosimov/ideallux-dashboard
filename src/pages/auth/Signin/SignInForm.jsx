import { setItem } from '@crema/utility/helper/persistence-storage';
import { Button, Form, Input } from 'antd';
import { useDispatch } from 'react-redux';
import { signUserFailure, signUserStart, signUserSuccess } from 'redux/slice/authSlice';
import apiService from "../../../service/api";


const SignInForm = () => {
  const dispatch = useDispatch()

  const onFinish = async (user) => {
    dispatch(signUserStart());
    try {
      const { data } = await apiService.userLogin('/admins/login',user)
      setItem('jwt', data.token)
      dispatch(signUserSuccess(data))

    } catch (error) {
      console.log(error)
      dispatch(signUserFailure())
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };


  return (
    <div> <Form
      name="basic"
      labelCol={{
        span: 24,
      }}
      wrapperCol={{
        span: 24,
      }}

      initialValues={{ username: "fazliddin", password: "1212qwqw" }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="User name"
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>


      <Form.Item
        wrapperCol={{

          span: 24,
        }}
      >
        <Button style={{ width: '100%' }} type="primary" htmlType="submit">
          Login
        </Button>
      </Form.Item>
    </Form></div>
  )
}

export default SignInForm