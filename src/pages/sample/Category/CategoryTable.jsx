import { Button, Popconfirm, Space,  Table,Image } from "antd";
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { categoryEdit } from "../../../redux/slice/editSlice";



const CategoryTable = ({data,deleteHandle}) => {
  const dispatch=useDispatch()
  const Delete = async (id) => {
    deleteHandle('/categories',id)
  };
  const Edit = (id) => {
    dispatch(categoryEdit(id))
  };

  const columns = [
    {
      title: 'Name uz',
      dataIndex: 'nameUz',
      id: 'nameUz',
      render: (text) => <p>{text}</p>,
    },
    {
      title: 'Name ru',
      dataIndex: 'nameRu',
      id: 'nameRu',
      render: (text) => <p>{text}</p>,
    },
    {
      title: 'Image',
      dataIndex: 'image',
      id: 'image',
      render: (image) => {
        return (
          <Image
            width={100}
            src={`${process.env.REACT_APP_API_URL}/img/${image?.name}`}
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

CategoryTable.propTypes={
  data:PropTypes.array,
  deleteHandle:PropTypes.func
}

export default CategoryTable;
