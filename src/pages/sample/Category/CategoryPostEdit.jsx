import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, message, Modal, Row, Spin, Upload } from "antd";
import PropTypes from "prop-types";
import { useMutation, useQuery } from "react-query";
import apiService from "../../../service/api";
import { useDispatch, useSelector } from "react-redux";
import { categoryEdit } from "../../../redux/slice/editSlice";
import { useForm } from 'antd/lib/form/Form';
import ImgCrop from "antd-img-crop";
const initialValueForm = {
  nameUz: "",
  nameRu: "",
  image: []
};
const CategoryPostEdit = ({ setIsModalOpen, isModalOpen, refetch }) => {
  const [form] = useForm();
  const { editCategory } = useSelector((state => state.edit));
  const dispatch=useDispatch()
  // react-query
  const {
    mutate: imagesUploadMutate, data: imagesUpload, isLoading: imagesUploadLoading,reset:imageUploadReset,
    isSuccess: imagesUploadSuccess
  } = useMutation(({ url, formData }) => apiService.postData(url, formData));
  const {
    mutate: postCategoryMutate,
    data: postCategory,
    error:postCategoryError,
    isError:postCategoryIsError,
    isLoading: postCategoryLoading,
    isSuccess: postCategorySuccess
  } = useMutation(({ url, data }) => apiService.postData(url, data),{
    onError:(error)=>{
      console.log('xatolik ro\'y berdi', error );
  }
  });
  const {
    isLoading: editCategoryLoading,
    data: editCategoryData,
    refetch: editCategoryRefetch,
    isSuccess: editCategorySuccess
  } = useQuery(["edit-category", editCategory], () => apiService.getDataByID("/categories", editCategory), {
    enabled: false
  });
  const {
    mutate: patchCategory,
    isLoading: patchCategoryLoading,
    isSuccess: patchCategorySuccess
  } = useMutation(({
                     url,
                     data,
                     id
                   }) => apiService.editData(url, data, id));
  const { mutate: imagesDeleteMutate } = useMutation(({ url, id }) => apiService.deleteData(url, id));
  // useState
  const [fileList, setFileList] = useState([]);
  const [valuesForm, setValuesForm] = useState({});
  const [isNotEditImages, setIsNotEditImages] = useState(false);


  useEffect(()=>{
    if (postCategoryIsError){
      message.error('Article nomlarni avvalgilari bilan bir xilga o\'xshaydi')
    }
  },[postCategoryError])


  useEffect(() => {
    if (editCategory !== "") {
      setIsModalOpen(true);
      editCategoryRefetch();
    }
  }, [editCategory]);

  useEffect(()=>{
    if (!isModalOpen){
      form.setFieldsValue(initialValueForm)
      setFileList([])
    }
  },[isModalOpen])
  useEffect(() => {

    if (postCategorySuccess || patchCategorySuccess) {
      setIsModalOpen(false);
      refetch();
      setIsNotEditImages(false)
      imageUploadReset()
    }
    if (patchCategorySuccess){
      dispatch(categoryEdit(""))
    }
  }, [postCategory,patchCategorySuccess]);
  // edit category initialValue
  useEffect(() => {
    const data = editCategoryData?.data?.category;

    const editDefaultImage = [{
      uid: data?.image?._id,
      name: data?.image?.name,
      location:data?.image?.location,
      status: "done",
      url: data?.image?.location
    }];
    const edit = {
      nameUz: data?.nameUz,
      nameRu: data?.nameRu,
      image: editDefaultImage
    };
    if (editCategorySuccess) {
      setFileList(editDefaultImage);
      form.setFieldsValue(edit);
    }

  }, [editCategoryData]);

  // post category
  useEffect(() => {
    const image={
      name:  imagesUpload?.data?.media[0]?.name,
      _id:  imagesUpload?.data?.media[0]?._id,
      location:imagesUpload?.data?.media[0]?.location
    }
    let editImage={}
    if (isNotEditImages){
      editImage={
        name:fileList[0]?.name,
        _id:fileList[0]?.uid,
        location:fileList[0]?.location
      }
    }else {
      editImage={
        name:imagesUpload?.data?.media[0]?.name,
        _id:imagesUpload?.data?.media[0]?._id,
        location:imagesUpload?.data?.media[0]?.location
      }
    }

    const data = {
      image: editCategorySuccess ? editImage : image,
      nameUz: valuesForm.nameUz,
      nameRu: valuesForm.nameRu
    };
    console.log(data);
    if (imagesUploadSuccess && !editCategorySuccess) {
      postCategoryMutate({ url: "/categories", data });
    }else if (isNotEditImages || imagesUploadSuccess){
      patchCategory({url:"/categories",data,id:editCategory})
    }
  }, [imagesUpload, valuesForm]);
  const onFinish = (values) => {
    console.log(values);
    setValuesForm(values);

    if (fileList.length===0){
      message.error('Iltimos rasm yuklang')
    }

    const formData = new FormData();
    if (editCategorySuccess) {
      if (fileList[0]?.originFileObj?.uid) {
        formData.append("media", fileList[0]?.originFileObj);
      }else{
        setIsNotEditImages(true);
      }
    }else{
      formData.append("media", fileList[0]?.originFileObj);
    }
    if (!imagesUploadSuccess && fileList.length!==0) {
      imagesUploadMutate({ url: "/media", formData });
    }

  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleRemoveImage = (file) => {
    setFileList([])
    form.setFieldsValue({ image: [] });
    if (editCategorySuccess && file?.status!=="removed") {
      imagesDeleteMutate({ url: "/media", id: file.uid });
    }
  };
  const onChange = ({ fileList: newFileList }) => {
    form.setFieldsValue({image:newFileList})
    setFileList(newFileList);
  };
  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };


  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (<>

    <Modal title="Basic Modal" maskClosable={false} visible={isModalOpen} onOk={onFinish} onCancel={handleCancel}
           footer={null}
           width={800}>
      <Spin spinning={imagesUploadLoading || postCategoryLoading || editCategoryLoading ||patchCategoryLoading}>
        <Form
          form={form}
          name="basic"
          labelCol={{
            span: 24
          }}
          wrapperCol={{
            span: 24
          }}
          style={{
            maxWidth: "100%"
          }}
          initialValues={initialValueForm}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off">
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item
                label="Kategoriya nomi Uz"
                name="nameUz"
                rules={[{
                  required: true, message: "Please input your category Uz!"
                }]}
              >
                <Input />
              </Form.Item>

            </Col>
            <Col span={12}>
              <Form.Item
                label="Название категории Ru"
                name="nameRu"
                rules={[{
                  required: true, message: "Please input your category Ru!"
                }]}
              >
                <Input />
              </Form.Item>

            </Col>

          </Row>
          <Form.Item
            label="Rasm yuklang"
            name={"image"}
            rules={[{ required: true, message: "Please upload image" }]}
          >
            <ImgCrop>
            <Upload
              maxCount={1}
              fileList={fileList}
              listType="picture-card"
              onChange={onChange}
              onPreview={onPreview}
              onRemove={handleRemoveImage}
              beforeUpload={() => false}
            >

              {fileList.length < 1 && "+ Upload"}
            </Upload>
            </ImgCrop>
          </Form.Item>
          <Form.Item
            wrapperCol={{
              span: 24
            }}
          >
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              {/*{editProductSuccess ? `O'zgartirish` : `Qo'shish`}*/}
              Add
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  </>);
};

CategoryPostEdit.propTypes = {
  isModalOpen: PropTypes.bool,
  setIsModalOpen: PropTypes.func,
  refetch: PropTypes.func
};
export default CategoryPostEdit;