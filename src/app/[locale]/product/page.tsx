'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Card, message } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { Get_Product, Add_Product } from '@/models/product.model';
import { productAPI } from '@/libs/api/product.api';
import { COLUMNS } from '../../../components/UI_shared/Table';
import { Product_Colum } from '@/components/product/product_Table';
import { ProductForm } from '@/components/product/product_Form';
import { useNotification } from '../../../components/UI_shared/Notification';
import Header_Children from '@/components/UI_shared/Children_Head';
import { showDateFormat } from '@/utils/date';
import { uploadFile } from '@/libs/api/upload.api';
import { Add_Document_DTO } from '@/models/document.model';
import { documentAPI } from '@/libs/api/document.api';
import { Department_DTO } from '@/models/department.model';
import { DepartmentAPI } from '@/libs/api/department.api';
const ProductPage = () => {
  const [Products, setProducts] = useState<Get_Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Get_Product | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orderType, setOrderType] = useState<'ASC' | 'DESC'>('ASC');
  const [form] = Form.useForm();
  const [total, setTotal] = useState<number>(10);
  const { show } = useNotification();
  const [documents, setDocuments] = useState<any[]>([]);
  const [departments, setDepartments] = useState<Department_DTO[]>([]);
  const [documentAfter, setdocumentAfter] = useState<any[]>([]);

  useEffect(() => {
    Get_ProductsByPageOrder(currentPage, pageSize, orderType, searchText);
    Get_Departments();
  }, [currentPage, pageSize, orderType, searchText]);

  const Get_Departments = async () => {
    const data = await DepartmentAPI.getDepartmentByPageOrder(1, 100, 'ASC');
    setDepartments(data);
  };

  const Get_ProductsByPageOrder = async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
    ProductName?: string,
  ) => {
    try {
      setLoading(true);
      const data = await productAPI.getproductsByPageOrder(
        pageIndex,
        pageSize,
        orderType,
        ProductName,
      );
      setTotal(data[0].TotalRecords);
      setProducts(data);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi tải danh sách sản phẩm',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setSearchText('');
    Get_ProductsByPageOrder(1, pageSize, orderType);
  };

  const handleSearch = (value: string) => {
    Get_ProductsByPageOrder(1, pageSize, orderType, value);
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setIsEditing(false);
    form.resetFields();
    setModalVisible(true);
  };

  const openEditModal = async (record: Get_Product) => {
    const dataDocuments = await documentAPI.GetDocuments_by_IdRelated(
      record.Id,
    );

    if (dataDocuments) {
      console.log('data lấy ra riêng', dataDocuments);
      setDocuments(dataDocuments);
      setdocumentAfter(dataDocuments);
    } else {
      setDocuments([]);
    }

    setEditingProduct(record);
    setIsEditing(true);
    const formattedValues = {
      ...record,
      ProductStartDate: showDateFormat(record.ProductStartDate),
      ProductEndDate: showDateFormat(record.ProductEndDate),
    };

    form.setFieldsValue(formattedValues);
    setModalVisible(true);
  };

  const closeModal = () => {
    setDocuments([]);
    setModalVisible(false);
    setEditingProduct(null);
    setIsEditing(false);
    form.resetFields();
  };

  const handleDelete = async (record: Get_Product) => {
    try {
      const data: any = await productAPI.deleteproduct(record.Id);
      show({
        result: data.result,
        messageDone: 'Cập nhập sản phẩm thành công',
        messageError: 'Cập sản phẩm thất bại',
      });
      Get_ProductsByPageOrder(currentPage, pageSize, orderType);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi xóa sản phẩm',
      });
    }
  };

  const addProduct = async (newProduct: Add_Product) => {
    if (
      newProduct.ProductEndDate &&
      newProduct.ProductEndDate < newProduct.ProductStartDate
    ) {
      message.error('Ngày kết thúc phải lớn hơn ngày bắt đầu');
      return;
    }

    const result: any = await productAPI.createproduct(newProduct);
    return result.result;
  };

  const updateproduct = async (Id: number, product: Add_Product) => {
    const newProduct = {
      Id,
      ...product,
    };
    const result: any = await productAPI.updateproduct(newProduct);
    if (result.result !== 0) {
      throw new Error('Failed to update product');
    }
  };
  const addDocuments = async (ID_Product: number, uploadedDocuments: any) => {
    if (uploadedDocuments.length > 0) {
      for (const doc of uploadedDocuments) {
        await documentAPI.createdocument({
          DocumentName: doc.DocumentName,
          DocumentLink: doc.DocumentUrl,
          RelatedId: ID_Product,
          RelatedType: 'Product',
        });
      }
    }
  };
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      let uploadedDocuments: any = [];
      if (documents.length > 0) {
        const result = await uploadFile(documents);
        uploadedDocuments = result.documents || [];
      }

      if (editingProduct) {
        await updateproduct(editingProduct.Id, values);
        debugger;

        console.log('document data mới:', uploadedDocuments);
        console.log('data document', documents);
        console.log('document data cũ', documentAfter);

        const newDocuments = uploadedDocuments.filter((doc: any) => !doc.Id);
        await addDocuments(editingProduct.Id, newDocuments);

        console.log('Tài liệu cần thêm mới:', newDocuments);
      } else {
        const newIDProduct: any = await addProduct(values);

        await addDocuments(newIDProduct, uploadedDocuments);

        show({
          result: newIDProduct,
          messageDone: 'Thêm sản phẩm thành công!',
          messageError: 'Thêm sản phẩm thất bại',
        });
      }

      await Get_ProductsByPageOrder(currentPage, pageSize, orderType);
      closeModal();
    } catch (error) {
      console.error('Save error:', error);
      show({
        result: 1,
        messageDone: 'Thêm sản phẩm thành công!',
        messageError: 'Thêm sản phẩm thất bại',
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = COLUMNS({
    columnType: Product_Colum,
    openModal: openEditModal,
    handleDelete: handleDelete,
  });

  return (
    <Card className="p-6">
      <Header_Children
        title={'Quản lý sản phẩm'}
        onAdd={openCreateModal}
        text_btn_add="Thêm sản phẩm"
      />

      <hr />

      <div className="py-4">
        <Space size="middle">
          <Input.Search
            placeholder="Search Products..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
          <Button
            type="default"
            icon={<ReloadOutlined />}
            size="large"
            onClick={handleRefresh}
          >
            Refresh
          </Button>
        </Space>
      </div>

      <div className="py-4" style={{ marginTop: '20px' }}>
        <Table
          columns={columns}
          dataSource={Products}
          rowKey="Id"
          loading={loading}
          scroll={{ x: 800, y: 400 }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} items`,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
        />
      </div>

      <Modal
        title={editingProduct ? 'Cập nhập sản phẩm' : 'Thêm sản phẩm'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={closeModal}
        width="60%"
        confirmLoading={loading}
      >
        <ProductForm
          formdata={form}
          documents={documents}
          setDocuments={setDocuments}
          departments={departments}
        />
      </Modal>
    </Card>
  );
};

export default ProductPage;
