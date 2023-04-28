import { Button, Popconfirm, Space,  Table,Image } from "antd";
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { articleEdit } from "../../../redux/slice/editSlice";



const ArticleTable = ({data,deleteHandle}) => {
  const dispatch=useDispatch()
  const history=useHistory()
  const Delete = async (id) => {
    deleteHandle('/articles',id)
  };
  const Edit = (id) => {
    dispatch(articleEdit(id))
    history.push('/article/add')
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
      title: 'Main image',
      dataIndex: 'mainImage',
      id: 'mainImage',
      render: (image) => {
        return (
        <Image
          width={100}
          src={`${image?.location}`}
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

ArticleTable.propTypes={
  data:PropTypes.array,
  deleteHandle:PropTypes.func
}

export default ArticleTable;
