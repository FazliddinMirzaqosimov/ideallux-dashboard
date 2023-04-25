import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {  productEdit } from "../../../redux/slice/editSlice";
import { Button, Image, Popconfirm, Space, Table } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const ProductTable = ({data,deleteHandle}) => {
  const dispatch=useDispatch()
  const history=useHistory()
  const Delete = async (id) => {
    deleteHandle('/products',id)
  };
  const Edit = (id) => {
    dispatch(productEdit(id))
    history.push('/product/add')
  };

  const columns = [
    {
      title: 'Name uz',
      dataIndex: 'titleUz',
      id: 'titleUz',
      render: (text) => <p>{text}</p>,
    },
    {
      title: 'Name ru',
      dataIndex: 'titleRu',
      id: 'titleRu',
      render: (text) => <p>{text}</p>,
    },
    {
      title: 'Images',
      dataIndex: 'images',
      id: 'images',
      render: (image) => {
        return (
          <Image
            width={100}
            src={`${process.env.REACT_APP_API_URL}/img/${image[0]?.name}`}
          />
        )},
    },
    {
      title: 'Action',
      id: 'action',
      render: (_, record) => (
        <Space size={20}>
          <Button
            onClick={() => Edit(record._id)}
            type='primary'
            icon={<EditOutlined />}>
            Edit
          </Button>
          <Popconfirm
            title={'Are you sure to delete this task?'}
            description={'Delete the task '}
            onConfirm={() => Delete(record._id)}>
            <Button type='danger' icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record._id}
      />
    </div>
  );
};

ProductTable.propTypes={
  data:PropTypes.array,
  deleteHandle:PropTypes.func
}

export default ProductTable;