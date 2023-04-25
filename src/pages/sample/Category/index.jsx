import apiService from '../../../service/api';
import { Button, Col, Input, message, Row, Space, Spin } from "antd";
import { useMutation, useQuery } from "react-query";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import CategoryTable from "./CategoryTable";
import CategoryPostEdit from "./CategoryPostEdit";

const Index = () => {
  const {mutate,isSuccess,isLoading:deleteCategory}=useMutation(({url,id})=>apiService.deleteData(url,id))

  const {data, isLoading:getCategory,refetch} = useQuery('category-get', () =>
      apiService.getData('/categories'),{
      onError: (error) => {
        message.error(error.message);

        // Handle the error
      },
    }
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search,setSearch]=useState([])
  const [isSearch,setIsSearch]=useState(false)


  useEffect(()=>{
    if (isSuccess){
      refetch()
    }
  },[isSuccess])

  const addArticle =()=>{
    setIsModalOpen(true);

  }

  const deleteHandle=(url,id)=>{
    mutate({url,id})

  }

  const serachProduct=(value)=>{
    console.log(value);
    if (value===""){
      setIsSearch(false)
    }
    else{
      setIsSearch(true)
    }


    const filterData=data?.data?.categories.filter(data=>data.nameUz.toLowerCase().includes(value.toLowerCase()) || data.nameRu.toLowerCase().includes(value.toLowerCase()))
    console.log(filterData)
    setSearch(filterData)
  }


  return (
    <div className={'site-space-compact-wrapper'}>

      <Space direction={'vertical'} style={{width:'100%'}}>
        <Row gutter={20}>
          <Col span={16}>
            <Input onChange={(e)=>serachProduct(e.target.value)} />
          </Col>
          <Col span={8}>
            <Button type="primary" icon={<PlusOutlined />} style={{width:'100%'}} onClick={addArticle}>
              Add
            </Button>
          </Col>
        </Row>
        <Spin size='medium' spinning={getCategory ||deleteCategory}>
          <CategoryTable data={isSearch ? search : data?.data?.categories} deleteHandle={deleteHandle} />
        </Spin>
      </Space>
      <CategoryPostEdit isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} refetch={refetch}/>
    </div>
  );
};

export default Index;
