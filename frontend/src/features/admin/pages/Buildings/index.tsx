import React, { useState } from "react";
import { Table, Button, Input, Select, Space, Tooltip } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Plus } from "lucide-react";
import type { ColumnsType } from "antd/es/table";

interface Location {
  key: string;
  stt: number;
  image: string;
  name: string;
  building_id: string;
  createdDate: string;
  floors: number;
  location_name?: string;
  description?: string;
}

const Buildings: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const initialData: Location[] = [
    {
      key: "1",
      stt: 1,
      image: "https://fptshop.com.vn/tin-tuc/danh-gia/hoc-phi-uit-2025-176136",
      name: "UIT",
      building_id: "DD001",
      createdDate: "21/04/2025",
      floors: 12,
      location_name: "Trường ĐH Công nghệ Thông tin",
      description: "Tòa nhà chính của trường ĐH Công nghệ Thông tin",
    },
    {
      key: "2",
      stt: 2,
      image: "https://fptshop.com.vn/tin-tuc/danh-gia/hoc-phi-uit-2025-176136",
      name: "USSH",
      building_id: "BN25251396",
      createdDate: "21/04/2025",
      floors: 12,
      location_name: "Trường ĐH Công nghệ Thông tin",
      description: "Tòa nhà chính của trường ĐH Công nghệ Thông tin",
    },
    {
      key: "3",
      stt: 3,
      image: "https://fptshop.com.vn/tin-tuc/danh-gia/hoc-phi-uit-2025-176136",
      name: "UIS",
      building_id: "BN25251396",
      createdDate: "21/04/2025",
      floors: 12,
      location_name: "Trường ĐH Công nghệ Thông tin",
      description: "Tòa nhà chính của trường ĐH Công nghệ Thông tin",
    },
    {
      key: "4",
      stt: 4,
      image: "https://fptshop.com.vn/tin-tuc/danh-gia/hoc-phi-uit-2025-176136",
      name: "UT",
      building_id: "BN25251396",
      createdDate: "21/04/2025",
      floors: 12,
      location_name: "Trường ĐH Công nghệ Thông tin",
      description: "Tòa nhà chính của trường ĐH Công nghệ Thông tin",
    },
    {
      key: "5",
      stt: 5,
      image: "https://fptshop.com.vn/tin-tuc/danh-gia/hoc-phi-uit-2025-176136",
      name: "Tòa E - UIT",
      building_id: "BN25251396",
      createdDate: "21/04/2025",
      floors: 12,
      location_name: "Trường ĐH Công nghệ Thông tin",
      description: "Tòa nhà chính của trường ĐH Công nghệ Thông tin",
    },
    {
      key: "6",
      stt: 6,
      image: "https://fptshop.com.vn/tin-tuc/danh-gia/hoc-phi-uit-2025-176136",
      name: "Tòa A - UIT",
      building_id: "BN25251396",
      createdDate: "21/04/2025",
      floors: 12,
      location_name: "Trường ĐH Công nghệ Thông tin",
      description: "Tòa nhà chính của trường ĐH Công nghệ Thông tin",
    },
    {
      key: "7",
      stt: 7,
      image: "https://fptshop.com.vn/tin-tuc/danh-gia/hoc-phi-uit-2025-176136",
      name: "Tòa B - UIT",
      building_id: "BN25251396",
      createdDate: "21/04/2025",
      floors: 12,
      location_name: "Trường ĐH Công nghệ Thông tin",
      description: "Tòa nhà chính của trường ĐH Công nghệ Thông tin",
    },
    {
      key: "8",
      stt: 8,
      image: "https://fptshop.com.vn/tin-tuc/danh-gia/hoc-phi-uit-2025-176136",
      name: "Nhà văn hóa SV",
      building_id: "BN25251396",
      createdDate: "21/04/2025",
      floors: 12,
      location_name: "Trường ĐH Công nghệ Thông tin",
      description: "Tòa nhà chính của trường ĐH Công nghệ Thông tin",
    },
    {
      key: "9",
      stt: 9,
      image: "https://fptshop.com.vn/tin-tuc/danh-gia/hoc-phi-uit-2025-176136",
      name: "KTX khu A",
      building_id: "BN25251396",
      createdDate: "21/04/2025",
      floors: 12,
      location_name: "Trường ĐH Công nghệ Thông tin",
      description: "Tòa nhà chính của trường ĐH Công nghệ Thông tin",
    },
  ];

  const [data] = useState<Location[]>(initialData);

  const columns: ColumnsType<Location> = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: 60,
      align: "center",
    },
    {
      title: "Tên tòa nhà",
      dataIndex: "name",
      key: "name",
      width: 250,
      ellipsis: {
        showTitle: false,
      },
      render: (text: string, record: Location) => (
        <div className="flex items-center gap-3">
          <img
            src={record.image}
            alt={text}
            className="w-12 h-12 rounded object-cover"
          />
          <div>
            <Tooltip placement="topLeft" title={text}>
              {text}
            </Tooltip>
            <div className="text-gray-500 text-sm">{record.building_id}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      align: "center",
      width: 110,
    },
    {
      title: "Số tầng",
      dataIndex: "floors",
      key: "floors",
      align: "center",
      width: 90,
    },
    {
      title: "Trực thuộc địa điểm",
      dataIndex: "location_name",
      key: "location_name",
      align: "center",
      width: 300,
      ellipsis: {
        showTitle: false,
      },
      render: (location_name) => (
        <Tooltip placement="topLeft" title={location_name}>
          {location_name}
        </Tooltip>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      align: "center",
      ellipsis: {
        showTitle: false,
      },
      render: (description) => (
        <Tooltip placement="topLeft" title={description}>
          {description}
        </Tooltip>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: () => (
        <Space size="middle">
          <Button type="text" icon={<EyeOutlined />} />
          <Button type="text" icon={<EditOutlined />} />
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Space>
      ),
      align: "center",
    },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-row justify-between">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-1">Danh sách tòa nhà</h1>
            <p className="text-gray-500">Hiển thị Tất cả các tòa nhà đã tạo</p>
          </div>

          {/* Search and Filters */}
          <div className="p-4 mb-4">
            <div className="flex justify-between items-center">
              <Space size="middle">
                <Input
                  placeholder="Tìm tòa nhà"
                  prefix={<SearchOutlined />}
                  value={searchText}
                  size="large"
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 300 }}
                />
                <Select
                  defaultValue="all"
                  style={{ width: 150 }}
                  size="large"
                  onChange={setCategoryFilter}
                  options={[
                    { value: "all", label: "Sắp xếp theo" },
                    { value: "university", label: "Ngày tạo gần nhất" },
                    { value: "building", label: "Ngày tạo xa nhất" },
                  ]}
                />
              </Space>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Danh sách tòa nhà</h2>
              <div className="bg-blue-100 rounded-3xl w-30 text-center">
                <p className="text-primary font-semibold">100 tòa nhà</p>
              </div>
            </div>
            <button className="flex items-center gap-2 bg-primary hover:bg-primary-light hover:cursor-pointer text-white font-medium px-5 py-2.5 rounded-2xl transition">
              <Plus size={18} />
              <span>Tạo tòa nhà</span>
            </button>
          </div>

          <Table
            columns={columns}
            dataSource={data}
            pagination={{
              current: 1,
              pageSize: 10,
              total: 100,
              showSizeChanger: false,
              placement: ["bottomCenter"],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Buildings;
