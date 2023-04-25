import React, { useEffect, useMemo, useState } from "react";
import { Button, Col, Form, Input, message, Row, Select, Space, Spin, Upload } from "antd";
import { MinusCircleOutlined } from "@ant-design/icons";
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./ProductPostEdit.css";
import { useMutation, useQuery } from "react-query";
import apiService from "../../../service/api";
import { convertFromHTML, convertToHTML } from "draft-convert";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { productEdit } from "../../../redux/slice/editSlice";
import ImgCrop from "antd-img-crop";

const initialValueForm = {
  titleUz: "",
  titleRu: "",
  items: [
    {
      characteristicVariabelUz: "",
      characteristicValueUz:"",
      characteristicVariabelRu: "",
      characteristicValueRu:""
    }
  ],
  category:"",
  images:[]
};


const ProductPostEdit = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const history = useHistory();
  const { editProduct } = useSelector(state => state.edit);
  // react-query

  const {
    data: categoryData,
    refetch: categoryFetch
  } = useQuery("get-categories", () => apiService.getData("/categories"), {
    enabled: false
  });
  const {
    mutate: imagesUploadMutate,
    data: imagesUpload,
    isLoading: imagesUploadLoading,
    isSuccess: imagesUploadSuccess
  } = useMutation(({ url, formData }) => apiService.postData(url, formData));
  const {
    mutate: postProductMutate,
    data: postProduct,
    isLoading: postProductLoading,
    isSuccess: postProductSuccess,
    error:postProductError,
    isError:postProductIsError
  } = useMutation(({ url, data }) => apiService.postData(url, data));
  const {
    isLoading: editProductLoading,
    data: editProductData,
    refetch: editProductRefetch,
    isSuccess: editProductSuccess
  } = useQuery(["edit-product", editProduct], () => apiService.getDataByID("/products", editProduct), {
    enabled: false
  });
  const { mutate: imagesDeleteMutate } = useMutation(({ url, id }) => apiService.deleteData(url, id));
  const {
    mutate: patchProduct,
    isLoading: patchProductLoading,
    data: patchData,
    isSuccess: patchProductSuccess
  } = useMutation(({
                     url,
                     data,
                     id
                   }) => apiService.editData(url, data, id));
  // useState
  const [editorStatesUz, setEditorStatesUz] = useState(EditorState.createEmpty());
  const [editorStatesRu, setEditorStatesRu] = useState(EditorState.createEmpty());
  const [fileList, setFileList] = useState([]);
  const [fileListProps, setFileListProps] = useState([]);
  const [valuesForm, setValues] = useState({});
  const [isNotEditImages, setIsNotEditImages] = useState(false);

  useEffect(()=>{
    if (postProductIsError){
      message.error('Article nomlarni avvalgilari bilan bir xilga o\'xshaydi')
    }
  },[postProductError])

  useEffect(() => {
    if (editProduct !== "") {
      editProductRefetch();
    }
  }, [editProduct]);

  useEffect(() => {
    console.log(patchData);
    if (postProductSuccess || patchProductSuccess) {
      history.push("/product");
    }
    if (patchProductSuccess) {
      dispatch(productEdit(""));
    }
  }, [postProduct, patchProductSuccess]);
  useEffect(() => {
    categoryFetch();
  }, []);
  // edit product initialValue
  useEffect(() => {
    const data = editProductData?.data?.product;
    const items = [];
    const imagesInitial = [];
    for (let i = 0; i < data?.aboutUz.length; i++) {
      const item = {
        characteristicVariabelUz: data?.aboutUz[i]?.variable,
        characteristicValueUz: data?.aboutUz[i]?.value,
        characteristicVariabelRu: data?.aboutRu[i]?.variable,
        characteristicValueRu: data?.aboutRu[i]?.value
      };

      items.push(item);
    }
    for (let i = 0; i < data?.images?.length; i++) {
      const editDefaultImages = {
        uid: data?.images[i]?._id,
        name: data?.images[i]?.name,
        status: "done",
        url: `http://localhost:3000/img/${data?.images[i]?.name}`
      };
      imagesInitial.push(editDefaultImages);
    }
    if (editProductSuccess) {
      if (data?.descriptionUz !== undefined) {
        setEditorStatesUz(EditorState.createWithContent(convertFromHTML(data?.descriptionUz)));
      }
      if (data?.descriptionRu !== undefined) {
        setEditorStatesRu(EditorState.createWithContent(convertFromHTML(data?.descriptionRu)));

      }
      setFileListProps(imagesInitial);
      const edit = {
        titleUz: data?.titleUz,
        titleRu: data?.titleRu,
        items,
        images: imagesInitial,
        category: data?.category
      };
      form.setFieldsValue(edit);
    }

    console.log(data);
  }, [editProductData]);

  // post product
  useEffect(() => {
    const aboutUz = [];
    const aboutRu = [];
    for (let i = 0; i < valuesForm?.items?.length; i++) {
      const aboutUzItem = {
        variable: valuesForm?.items[i]?.characteristicVariabelUz,
        value: valuesForm?.items[i]?.characteristicValueUz
      };
      const aboutRuItem = {
        variable: valuesForm?.items[i]?.characteristicVariabelRu,
        value: valuesForm?.items[i]?.characteristicValueRu
      };
      aboutUz.push(aboutUzItem);
      aboutRu.push(aboutRuItem);
    }

    let patchImagesAndInitialImages = [];
    if (imagesUploadSuccess) {
      console.log('render');
      patchImagesAndInitialImages = fileList.concat(imagesUpload?.data?.media);
    } else {
      patchImagesAndInitialImages = [...fileList];
    }
    const deleteLocalImage=[]
    patchImagesAndInitialImages.map((image)=>{
      if (!image?.originFileObj?.uid){
        deleteLocalImage.push(image)
      }
    })

    console.log(deleteLocalImage);
    const patchImages = deleteLocalImage.map((image) => {

      if (image?.uid) {
        return {
          name: image?.name,
          _id: image?.uid
        };
      } else {
        return {
          name: image?.name,
          _id: image?._id
        };
      }
    });
    console.log(patchImagesAndInitialImages);
    const data = {
      images: editProductSuccess ? patchImages : imagesUpload?.data?.media,
      titleUz: valuesForm.titleUz,
      titleRu: valuesForm.titleRu,
      descriptionUz: convertToHTML(editorStatesUz.getCurrentContent()),
      descriptionRu: convertToHTML(editorStatesRu.getCurrentContent()),
      category: valuesForm.category,
      aboutUz,
      aboutRu
    };
    if (imagesUploadSuccess && !editProductSuccess) {
      postProductMutate({ url: "/products", data });
    } else if (isNotEditImages || imagesUploadSuccess) {
      patchProduct({ url: "/products", data, id: editProduct });
    }
    console.log(data);

  }, [imagesUpload, valuesForm]);


  const options = useMemo(() => {
    return categoryData?.data?.categories?.map(option => {
      return {
        value: option?._id,
        label: option?.nameUz
      };
    });
  }, [categoryData]);


  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const handleRemoveImage = (file) => {
    if (editProductSuccess) {
      imagesDeleteMutate({ url: "/media", id: file.uid });
    }
    console.log(file);
  };


  const onFinish = (values) => {
    const formData = new FormData();

    fileListProps.map((file) => {
      if (editProductSuccess) {
        if (file?.originFileObj?.uid) {
          formData.append("media", file.originFileObj);
          console.log('upload image');
          // console.log(fileListProps[ind])
          // fileListProps.splice(ind, 1);
          // console.log(fileListProps)
          setIsNotEditImages(false);
          setFileList(fileListProps);
        } else {
          setFileList(fileListProps);
          setIsNotEditImages(true);
        }
      } else {
        formData.append("media", file.originFileObj);
      }
    });

    if (!imagesUploadSuccess) {
      imagesUploadMutate({ url: "/media", formData });

    }
    setValues(values);

  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };


  const onChange = ({ fileList: newFileList }) => {
    setFileListProps(newFileList);
    form.setFieldsValue({images:newFileList})
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
  return (
    <div>
      <Spin spinning={imagesUploadLoading || postProductLoading || editProductLoading || patchProductLoading}>
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
          autoComplete="off"
        >

          <Row gutter={20}>
            <Col span={12}>
              <Form.Item
                label="Mahsulot nomi Uz"
                name="titleUz"
                rules={[
                  {
                    required: true,
                    message: "Please input your Name Uz!"
                  }
                ]}
              >
                <Input />
              </Form.Item>

            </Col>
            <Col span={12}>
              <Form.Item
                label="Наименование товара Ru"
                name="titleRu"
                rules={[
                  {
                    required: true,
                    message: "Please input your Name Ru!"
                  }
                ]}
              >
                <Input />
              </Form.Item>

            </Col>

          </Row>

          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => {

                  return (
                    <div key={field.fieldKey} style={{ marginBottom: 20 }}>
                      <Space align={"baseline"} direction={"vertical"} style={{ display: "flex", marginBottom: 8 }}>
                        <Row gutter={20}>
                          {/*xususiyatlari uz*/}
                          <Col span={12}>
                            <Form.Item
                              label={`Xususiyatlari uz ${index + 1}`}
                              name={[field.name, "characteristicVariabelUz"]}
                              rules={[
                                { required: true, message: "Please input your characteristics" }
                              ]}
                              style={{ width: "100%" }}
                            >
                              <Input placeholder={"Pechning hajmi"} />
                            </Form.Item>

                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label={`Xususiyatlari uz ${index + 1}`}
                              name={[field.name, "characteristicValueUz"]}
                              rules={[
                                { required: true, message: "Please input your characteristics" }
                              ]}
                            >
                              <Input placeholder={"52 l"} />
                            </Form.Item>

                          </Col>
                          {/*Характеристики Ru*/}
                          <Col span={12}>
                            <Form.Item
                              label={`Характеристики uz ${index + 1}`}
                              name={[field.name, "characteristicVariabelRu"]}
                              rules={[
                                { required: true, message: "Please input your characteristics" }
                              ]}
                              style={{ width: "100%" }}
                            >
                              <Input placeholder={"Объем духовки"} />
                            </Form.Item>

                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label={`Характеристики ru ${index + 1}`}
                              name={[field.name, "characteristicValueRu"]}
                              rules={[
                                { required: true, message: "Please input your characteristics" }
                              ]}
                            >
                              <Input placeholder={"52 л"} />
                            </Form.Item>

                          </Col>
                        </Row>

                      </Space>

                      <MinusCircleOutlined onClick={() => remove(field.name)} />

                    </div>

                  );
                })}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block>
                    Add Item
                  </Button>
                </Form.Item>

              </>
            )}
          </Form.List>
          <Row gutter={20}>
            <Col span={12}><Form.Item
              label={`Tavsif Uz`}
              name={["descriptionUz"]}
              style={{ width: "100%" }}
            >
              <Editor
                editorState={editorStatesUz}
                onEditorStateChange={setEditorStatesUz}
                editorClassName="editor-class"
                toolbarClassName="toolbar-class"
              />
            </Form.Item></Col>
            <Col span={12}> <Form.Item
              label={`Описание Ru`}
              name={"descriptionRu"}
              style={{ width: "100%" }}
            >
              <Editor
                editorState={editorStatesRu}
                onEditorStateChange={setEditorStatesRu}
                editorClassName="editor-class"
                toolbarClassName="toolbar-class"
              />
            </Form.Item></Col>
          </Row>

          <Form.Item
            label={"Kategoriya tanlang"}
            name={"category"}
            wrapperCol={{
              span: 24
            }}
            rules={[
              { required: true, message: "Please selected your Category" }
            ]}
          >
            <Select

              style={{
                width: "100%"
              }}
              placeholder="Select one category"

              onChange={handleChange}
              optionLabelProp="label"
              options={options}
            />

          </Form.Item>
          <Form.Item
            label="Rasm yuklang"
            name={"images"}
            rules={[
              { required: true, message: "Please upload images" }
            ]}
          >
            <ImgCrop rotationSlider>


            <Upload
              maxCount={3}
              fileList={fileListProps}
              listType="picture-card"
              onChange={onChange}
              onPreview={onPreview}
              beforeUpload={() => false}
              onRemove={handleRemoveImage}
            >

              {fileListProps.length < 3 && "+ Upload"}
            </Upload>
            </ImgCrop>
          </Form.Item>
          <Form.Item
            wrapperCol={{
              span: 24
            }}
          >
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              {editProductSuccess ? `O'zgartirish` : `Qo'shish`}
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default ProductPostEdit;