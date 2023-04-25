import ProductTable from "./ProductTable";
import apiService from '../../../service/api';
import { Button, Col, Input, message, Row, Space, Spin } from "antd";
import { useMutation, useQuery } from "react-query";
import { PlusOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";

const Index = () => {
  const history=useHistory()
  const {mutate,isSuccess,isLoading:deleteArticles}=useMutation(({url,id})=>apiService.deleteData(url,id))

  const {data, isLoading:getArticles,refetch} = useQuery('product-get', () =>
    apiService.getData('/products'),{
      onError: (error) => {
        message.error(error.message);

        // Handle the error
      },
    }
  );
  const [search,setSearch]=useState([])
  const [isSearch,setIsSearch]=useState(false)

  useEffect(()=>{
    if (isSuccess){
      refetch()
    }
  },[isSuccess])

  const addArticle =()=>{
    history.push('/product/add')
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


    const filterData=data?.data?.products.filter(data=>data.titleUz.toLowerCase().includes(value.toLowerCase()) || data.titleRu.toLowerCase().includes(value.toLowerCase()))
    console.log(filterData)
    setSearch(filterData)
  }


  return (
    <div className={'site-space-compact-wrapper'}>
      <Space direction={'vertical'} style={{width:'100%'}}>
        <Row gutter={20}>
          <Col span={16}>
          <Input  onChange={(e)=>serachProduct(e.target.value)}/>
          </Col>
          <Col span={8}>
            <Button type="primary" icon={<PlusOutlined />} style={{width:'100%'}} onClick={addArticle}>
              Add
            </Button>
          </Col>
        </Row>
      <Spin size='medium' spinning={getArticles ||deleteArticles}>
        <ProductTable data={isSearch ? search : data?.data?.products} deleteHandle={deleteHandle} />
      </Spin>
      </Space>
    </div>
  );
};

export default Index;
