import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, message, Row, Space, Spin, Upload } from "antd";
import { EditorState } from "draft-js";
import { convertFromHTML, convertToHTML } from "draft-convert";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./ArticlePostEdit.css";
import { useMutation, useQuery } from "react-query";
import apiService from "../../../service/api";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { articleEdit } from "../../../redux/slice/editSlice";
import { MinusCircleOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";


const initialValueForm = {
  titleUz: "",
  titleRu: "",
  items: [
    {
      bodyUz: "",
      bodyRu: "",
      bodyImages: []
    }
  ],
  image: []
};

const ArticlePostEdit = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const { editArticle } = useSelector(state => state.edit);
  const dispatch = useDispatch();
  // react-query
  const { mutate: imageUploadMutate, data: imageUpload, isLoading: imageUploadLoading,isSuccess:imageUploadSuccess } = useMutation(({
                                                                                                         url,
                                                                                                         formData
                                                                                                       }) => apiService.postData(url, formData));
  const { mutate: imagesUploadMutate, data: imagesUpload, isLoading: imagesUploadLoading } = useMutation(({
                                                                                                            url,
                                                                                                            formData
                                                                                                          }) => apiService.postData(url, formData));
  const {
    mutate: postArticle,
    isLoading: postArticleLoading,
    isSuccess: postArticleSuccess,
    error: postArticleError,
    isError: postArticleIsError
  } = useMutation(({
                     url,
                     data
                   }) => apiService.postData(url, data));
  const {
    mutate: patchArticle,
    isLoading: patchArticleLoading,
    data: patchData,
    isSuccess: patchArticleSuccess
  } = useMutation(({
                     url,
                     data,
                     id
                   }) => apiService.editData(url, data, id));
  const { mutate: imagesDeleteMutate } = useMutation(({ url, id }) => apiService.deleteData(url, id));
  const {
    isLoading: editArticelLoading,
    data: editArticelData,
    refetch: editArticelRefetch,
    isSuccess: editArticelSuccess
  } = useQuery(["edit-article", editArticle], () => apiService.getDataByID("/articles", editArticle), {
    enabled: false
  });
  // useState
  const [fileList, setFileList] = useState([]);
  const [fileListProps, setFileListProps] = useState([]);
  const [fileListBody, setFileListBody] = useState([]);
  const [fileListBodyProps, setFileListBodyProps] = useState([]);
  const [editorStatesUz, setEditorStatesUz] = useState([]);
  const [editorStatesRu, setEditorStatesRu] = useState([]);
  const [mainIndex, setMainIndex] = useState(0);

  console.log(fileList);
  // error

  useEffect(() => {
    if (postArticleIsError) {
      message.error("Article nomlarni avvalgilari bilan bir xilga o'xshaydi");
    }
  }, [postArticleError]);
  useEffect(() => {
    console.log(patchData);
    if (postArticleSuccess || patchArticleSuccess) {
      history.push("/article");
    }
    if (patchArticleSuccess) {
      dispatch(articleEdit(""));
    }
  }, [postArticleSuccess, patchArticleSuccess]);

  useEffect(() => {
    if (editArticle !== "") {
      editArticelRefetch();
    }
  }, [editArticle]);

  useEffect(() => {
    if (imageUploadSuccess){
    setFileList(imageUpload?.data?.media);
    }
  }, [imageUpload]);

  useEffect(() => {
    const uploadFilesState = [...fileListBody];
    uploadFilesState[mainIndex] = imagesUpload?.data?.media[0];
    if (imageUploadSuccess){
    setFileListBody(uploadFilesState);
    }
  }, [imagesUpload]);

  useEffect(() => {
    const data = editArticelData?.data?.article;

    const initialEditorUz = [];
    const initialEditorRu = [];
    const initialFileListBodyProps = [];
    const initialFileListBody = [];
    if (data !== undefined) {
      for (let i = 0; i < data?.body?.length; i++) {
        const editDefaultImages = [{
          uid: data?.body[i]?.image?._id,
          name: data?.body[i]?.image?.name,
          status: "done",
          url: `${process.env.REACT_APP_API_URL}/img/${data?.body[i]?.image?.name}`
        }];

        initialEditorUz.push(EditorState.createWithContent(convertFromHTML(data?.body[i]?.descriptionUz)));
        initialEditorRu.push(EditorState.createWithContent(convertFromHTML(data?.body[i]?.descriptionRu)));
        initialFileListBodyProps.push(editDefaultImages);
        initialFileListBody.push(data?.body[i]?.image);
      }
    }
    // initial main image
    const initialFileListProps = [{
      uid: data?.mainImage?._id,
      name: data?.mainImage?.name,
      status: "done",
      url: `${process.env.REACT_APP_API_URL}/img/${data?.mainImage?.name}`
    }];

    const bodyDefault = data?.body.map(body => {
      return {
        bodyUz: body.descriptionUz,
        bodyRu: body.descriptionRu,
        bodyImages: body.image
      };
    });

    if (editArticelSuccess) {
      console.log(data);
      const edit = {
        titleUz: data?.titleUz,
        titleRu: data?.titleRu,
        items: bodyDefault,
        image: data?.mainImage
      };
      setFileList([data?.mainImage]);
      setFileListProps(initialFileListProps);
      setFileListBody(initialFileListBody);
      setFileListBodyProps(initialFileListBodyProps);
      setEditorStatesUz(initialEditorUz);
      setEditorStatesRu(initialEditorRu);
      form.setFieldsValue(edit);
    }
  }, [editArticelData]);

  // Handle editor state change
  const onEditorStateChangeUz = (index, editorState) => {
    const updatedEditorStates = [...editorStatesUz];
    updatedEditorStates[index] = editorState;
    setEditorStatesUz(updatedEditorStates);
  };
  const onEditorStateChangeRu = (index, editorState) => {
    const updatedEditorStates = [...editorStatesRu];
    updatedEditorStates[index] = editorState;
    setEditorStatesRu(updatedEditorStates);
  };

  const onChangeBodyImage = (index, { fileList: newFileList }) => {
    setMainIndex(index);


    const getValue = form.getFieldsValue();
    const itemsValue = getValue.items;
    itemsValue[index].bodyImages = newFileList;
    form.setFieldsValue({ items: itemsValue });

    const updateImageStates = [...fileListBodyProps];
    updateImageStates[index] = newFileList;
    setFileListBodyProps(updateImageStates);

    if (fileListBody[index] || newFileList.length === 0) {
      const id = fileListBody[index]._id;
      imagesDeleteMutate({ url: "/media", id });
      fileListBody.splice(index, 1);
      setFileListBody(fileListBody);

    }
    const formData = new FormData();
    if (newFileList.length !== 0) {
      formData.append("media", newFileList[0].originFileObj);
      imagesUploadMutate({ url: "/media", formData });

    }
  };


  const handleRemove = (name, remove, index, editorStateUz, editorStateRu, editorFileList) => {
    if (editorStateUz === editorStatesUz[index]) {
      console.log(editorStatesUz[index]);
      editorStatesUz.splice(index, 1);
    }
    if (editorStateRu === editorStatesRu[index]) {
      console.log(editorStatesRu[index]);
      editorStatesRu.splice(index, 1);
    }
    if (editorFileList === fileListBodyProps[index]) {
      const id = fileListBody[index]._id;
      fileListBodyProps.splice(index, 1);
      fileListBody.splice(index, 1);
      imagesDeleteMutate({ url: "/media", id });
    }
    remove(name);
  };


  const onFinish = (values) => {
    const itemsWithHtmlContentUz = editorStatesUz.map((state) => {
      return convertToHTML(state.getCurrentContent());
    });
    const itemsWithHtmlContentRu = editorStatesRu.map((state) => {
      return convertToHTML(state.getCurrentContent());
    });
    const body = [];

    for (let i = 0; i < itemsWithHtmlContentUz.length; i++) {
      const item = {
        "descriptionUz": itemsWithHtmlContentUz[i],
        "descriptionRu": itemsWithHtmlContentRu[i],
        "image": {
          "_id": fileListBody[i]?._id,
          "name": fileListBody[i]?.name
        }
      };
      body.push(item);
    }

    const data = {
      mainImage: {
        "_id": fileList[0]?._id,
        "name": fileList[0]?.name
      },
      body,
      titleUz: values?.titleUz,
      titleRu: values?.titleRu
    };

    if (editArticelSuccess) {
      patchArticle({ url: "/articles", data, id: editArticle });
    } else {
      postArticle({ url: "/articles", data });
    }

  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };




  // image
  const onChange = ({ fileList: newFileList }) => {
    console.log(newFileList);
    setFileListProps(newFileList);
    form.setFieldsValue({ image: newFileList });
    if (fileList.length!==0 || newFileList.length === 0) {
      console.log('render');
      const id = fileList[0]?._id;
      imagesDeleteMutate({ url: "/media", id });
setFileList([])

    }
    const formData = new FormData();

    if (newFileList.length !== 0) {
      console.log("render");
      formData.append("media", newFileList[0].originFileObj);
      imageUploadMutate({ url: "/media", formData });
    }
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
      <Spin
        spinning={postArticleLoading || imagesUploadLoading || imageUploadLoading || editArticelLoading || patchArticleLoading}>

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
          <Form.Item
            label="Maqola sarlavhasi uz"
            name="titleUz"
            rules={[
              {
                required: true,
                message: "Please input your Title uz!"
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Название статьи Ru"
            name="titleRu"
            rules={[
              {
                required: true,
                message: "Please input your Title Ru!"
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Asosiy rasm"
            name={"image"}
            rules={[
              { required: true, message: "Please upload main image" }
            ]}
          >
            <ImgCrop>
              <Upload
                maxCount={1}
                fileList={fileListProps}
                listType="picture-card"
                onChange={onChange}
                onPreview={onPreview}
                beforeUpload={() => false}
              >

                {fileListProps.length < 1 && "+ Upload"}
              </Upload>
            </ImgCrop>
          </Form.Item>
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => {
                  const editorStateUz = editorStatesUz[index] || EditorState.createEmpty();
                  const editorStateRu = editorStatesRu[index] || EditorState.createEmpty();
                  const editorFileList = fileListBodyProps[index] || [];
                  return (
                    <div key={field.fieldKey} style={{ marginBottom: 20 }}>
                      <Space align={"start"}>
                        <Form.Item
                          label={`Maqola matn uz ${index + 1}`}
                          name={[field.name, "bodyUz"]}
                          rules={[
                            { required: true, message: "Please input your Body uz" }
                          ]}
                          style={{ width: "100%" }}
                        >
                          <Editor
                            editorState={editorStateUz}
                            onEditorStateChange={(state) => onEditorStateChangeUz(index, state)}
                            editorClassName="editor-class"
                            toolbarClassName="toolbar-class"
                          />
                        </Form.Item>
                        <Form.Item
                          label={`Текст статьи ${index + 1}`}
                          name={[field.name, "bodyRu"]}
                          rules={[
                            { required: true, message: "Please input your Body ru" }
                          ]}
                        >
                          <Editor
                            editorState={editorStateRu}
                            onEditorStateChange={(state) => onEditorStateChangeRu(index, state)}
                            editorClassName="editor-class"
                            toolbarClassName="toolbar-class"
                          />
                        </Form.Item>
                      </Space>
                      <Form.Item
                        label={`Maqola matn uchun rasm(Изображение для текста статьи) ${index + 1}`}
                        name={[field.name, "bodyImages"]}
                        rules={[
                          { required: true, message: "Please upload body image" }
                        ]}
                      >
                        <ImgCrop rotate>
                          <Upload
                            maxCount={1}
                            listType="picture-card"
                            fileList={editorFileList}
                            onChange={(newFileList) => onChangeBodyImage(index, newFileList)}
                            onPreview={onPreview}
                            beforeUpload={() => false}
                          >
                            {editorFileList.length < 1 && "+ Upload"}
                          </Upload>
                        </ImgCrop>
                      </Form.Item>

                      <MinusCircleOutlined
                        onClick={() => handleRemove(field.name, remove, index, editorStateUz, editorStateRu, editorFileList)} />
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

          <Form.Item
            wrapperCol={{
              span: 24
            }}
          >



                <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                  {editArticelSuccess ? `O'zgartirish` : `Qo'shish`}
                </Button>

          </Form.Item>
        </Form>

      </Spin>
    </div>
  );
};

export default ArticlePostEdit;