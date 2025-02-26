'use client';

import { useState, useEffect, useCallback } from 'react';
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
import { documentAPI } from '@/libs/api/document.api';
import type { Department_DTO } from '@/models/department.model';
import { DepartmentAPI } from '@/libs/api/department.api';
import { useAddDocuments, useUpdateDocuments } from '../document/page';

const ProductPage = () => {
  const [products, setProducts] = useState<Get_Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Get_Product | null>(
    null,
  );
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orderType, setOrderType] = useState<'ASC' | 'DESC'>('ASC');
  const [form] = Form.useForm();
  const [total, setTotal] = useState<number>(10);
  const { show } = useNotification();
  const [documents, setDocuments] = useState<any[]>([]);
  const [departments, setDepartments] = useState<Department_DTO[]>([]);
  const { updateDocuments } = useUpdateDocuments();
  const { addDocuments } = useAddDocuments();
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await productAPI.getproductsByPageOrder(
        currentPage,
        pageSize,
        orderType,
        searchText,
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
  }, [currentPage, pageSize, orderType, searchText]);

  const fetchDepartments = useCallback(async () => {
    const data = await DepartmentAPI.getDepartmentByPageOrder(1, 100, 'ASC');
    setDepartments(data);
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchDepartments();
  }, [fetchProducts, fetchDepartments]);

  const handleRefresh = useCallback(() => {
    setSearchText('');
    setCurrentPage(1);
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = useCallback((value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  }, []);

  const openCreateModal = useCallback(() => {
    setEditingProduct(null);
    form.resetFields();
    setModalVisible(true);
  }, [form]);

  const openEditModal = async (record: Get_Product) => {
    const dataDocuments = await documentAPI.GetDocuments_by_IdRelated(
      record.Id,
      'Product',
    );

    setDocuments(dataDocuments || []);

    setEditingProduct(record);
    const formattedValues = {
      ...record,
      ProductStartDate: showDateFormat(record.ProductStartDate),
      ProductEndDate: showDateFormat(record.ProductEndDate),
    };
    form.setFieldsValue(formattedValues);
    setModalVisible(true);
  };

  const closeModal = useCallback(() => {
    setDocuments([]);
    setModalVisible(false);
    setEditingProduct(null);
    form.resetFields();
  }, [form]);

  const handleDelete = useCallback(
    async (record: Get_Product) => {
      try {
        const data: any = await productAPI.deleteproduct(record.Id);
        show({
          result: data.result,
          messageDone: 'Xóa sản phẩm thành công',
          messageError: 'Xóa sản phẩm thất bại',
        });
        fetchProducts();
      } catch (error) {
        show({
          result: 1,
          messageError: 'Lỗi xóa sản phẩm',
        });
      }
    },
    [fetchProducts, show],
  );

  const addProduct = useCallback(async (newProduct: Add_Product) => {
    if (
      newProduct.ProductEndDate &&
      newProduct.ProductEndDate < newProduct.ProductStartDate
    ) {
      show({
        result: 1,
        messageError: 'Ngày kết thúc phải lớn hơn ngày bắt đầu',
      });
      return null;
    }
    const result: any = await productAPI.createproduct(newProduct);
    return result.result;
  }, []);

  const updateProduct = useCallback(
    async (Id: number, product: Add_Product) => {
      if (
        product.ProductEndDate &&
        product.ProductEndDate < product.ProductStartDate
      ) {
        show({
          result: 1,
          messageError: 'Ngày kết thúc phải lớn hơn ngày bắt đầu',
        });
        return null;
      }
      const newProduct = { Id, ...product };
      const result: any = await productAPI.updateproduct(newProduct);
      return result.result;
    },
    [],
  );

  const handleSave = async () => {
    try {
      const values: any = await form.validateFields();
      setLoading(true);

      let uploadedDocuments: any = [];
      let newIDProductt, result: any;

      if (documents.length > 0) {
        const uploadResult = await uploadFile(documents);
        uploadedDocuments = uploadResult.documents || [];
      }
      debugger;
      if (editingProduct) {
        result = await updateProduct(editingProduct.Id, values);
        if (result === 0) {
          const dataDocuments = await documentAPI.GetDocuments_by_IdRelated(
            editingProduct.Id,
            'Product',
          );
          const updateResult = await updateDocuments(
            uploadedDocuments,
            dataDocuments,
          );
          const addResult = await addDocuments(
            'Product',
            editingProduct.Id,
            uploadedDocuments,
          );
          if (!updateResult.success) {
            show({
              result: 1,
              messageError: 'Cập nhật một số tài liệu thất bại!',
            });
            return;
          }
          if (!addResult.success) {
            show({ result: 1, messageError: 'Thêm một số tài liệu thất bại!' });
            return;
          }

          show({ result: 0, messageDone: 'Cập nhật dự án thành công!' });
        } else {
          show({ result: 1, messageError: 'Cập nhật dự án thất bại!' });
          return;
        }
      } else {
        newIDProductt = await addProduct(values);
        if (newIDProductt) {
          const addResult = await addDocuments(
            'Productt',
            newIDProductt,
            uploadedDocuments,
          );
          if (!addResult.success) {
            show({ result: 1, messageError: 'Thêm một số tài liệu thất bại!' });
            return;
          }
          show({ result: 0, messageDone: 'Thêm dự án thành công!' });
        } else {
          show({ result: 1, messageError: 'Thêm dự án thất bại!' });
          return;
        }
      }

      fetchProducts();
      closeModal();
    } catch (error) {
      show({ result: 1, messageError: 'Lỗi lưu dự án' });
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
          dataSource={products}
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
            onChange: handlePageChange,
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
