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
  place_id: string;
  createdDate: string;
  address: string;
  open_time?: string;
  close_time?: string;
}

const Locations: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const initialData: Location[] = [
    {
      key: "1",
      stt: 1,
      image: "https://fptshop.com.vn/tin-tuc/danh-gia/hoc-phi-uit-2025-176136",
      name: "UIT",
      place_id: "DD001",
      createdDate: "21/04/2025",
      address: "Số 6 Hàn Thuyên",
      open_time: "08:00",
      close_time: "22:00",
    },
    {
      key: "2",
      stt: 2,
      image: "https://fptshop.com.vn/tin-tuc/danh-gia/hoc-phi-uit-2025-176136",
      name: "USSH",
      place_id: "BN25251396",
      createdDate: "21/04/2025",
      address: "Số 6 Hàn Thuyên",
      open_time: "08:00",
      close_time: "22:00",
    },
    {
      key: "3",
      stt: 3,
      image: "https://fptshop.com.vn/tin-tuc/danh-gia/hoc-phi-uit-2025-176136",
      name: "UIS",
      place_id: "BN25251396",
      createdDate: "21/04/2025",
      address: "Số 6 Hàn Thuyên",
      open_time: "08:00",
      close_time: "22:00",
    },
    {
      key: "4",
      stt: 4,
      image: "https://fptshop.com.vn/tin-tuc/danh-gia/hoc-phi-uit-2025-176136",
      name: "UT",
      place_id: "BN25251396",
      createdDate: "21/04/2025",
      address: "Số 6 Hàn Thuyên",
      open_time: "08:00",
      close_time: "22:00",
    },
    {
      key: "5",
      stt: 5,
      image: "https://fptshop.com.vn/tin-tuc/danh-gia/hoc-phi-uit-2025-176136",
      name: "Tòa E - UIT",
      place_id: "BN25251396",
      createdDate: "21/04/2025",
      address: "Số 6 Hàn Thuyên",
      open_time: "08:00",
      close_time: "22:00",
    },
    {
      key: "6",
      stt: 6,
      image: "https://fptshop.com.vn/tin-tuc/danh-gia/hoc-phi-uit-2025-176136",
      name: "Tòa A - UIT",
      place_id: "BN25251396",
      createdDate: "21/04/2025",
      address: "Số 6 Hàn Thuyên",
      open_time: "08:00",
      close_time: "22:00",
    },
    {
      key: "7",
      stt: 7,
      image: "https://fptshop.com.vn/tin-tuc/danh-gia/hoc-phi-uit-2025-176136",
      name: "Tòa B - UIT",
      place_id: "BN25251396",
      createdDate: "21/04/2025",
      address: "Số 6 Hàn Thuyên",
      open_time: "08:00",
      close_time: "22:00",
    },
    {
      key: "8",
      stt: 8,
      image: "https://fptshop.com.vn/tin-tuc/danh-gia/hoc-phi-uit-2025-176136",
      name: "Nhà văn hóa SV",
      place_id: "BN25251396",
      createdDate: "21/04/2025",
      address: "Số 6 Hàn Thuyên",
      open_time: "08:00",
      close_time: "22:00",
    },
    {
      key: "9",
      stt: 9,
      image: "https://fptshop.com.vn/tin-tuc/danh-gia/hoc-phi-uit-2025-176136",
      name: "KTX khu A",
      place_id: "BN25251396",
      createdDate: "21/04/2025",
      address: "Số 6 Hàn Thuyên",
      open_time: "08:00",
      close_time: "22:00",
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
      title: "Tên địa điểm",
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
            <div className="text-gray-500 text-sm">{record.place_id}</div>
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
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      align: "center",
      ellipsis: {
        showTitle: false,
      },
      render: (address) => (
        <Tooltip placement="topLeft" title={address}>
          {address}
        </Tooltip>
      ),
    },
    {
      title: "Giờ mở cửa",
      dataIndex: "open_time",
      key: "open_time",
      align: "center",
      width: 110,
    },
    {
      title: "Giờ đóng cửa",
      dataIndex: "close_time",
      key: "close_time",
      align: "center",
      width: 120,
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
            <h1 className="text-2xl font-bold mb-1">Danh sách địa điểm</h1>
            <p className="text-gray-500">Hiển thị Tất cả các địa điểm đã tạo</p>
          </div>

          {/* Search and Filters */}
          <div className="p-4 mb-4">
            <div className="flex justify-between items-center">
              <Space size="middle">
                <Input
                  placeholder="Tìm địa điểm"
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
              <h2 className="text-lg font-semibold">Danh sách địa điểm</h2>
              <div className="bg-blue-100 rounded-3xl w-30 text-center">
                <p className="text-primary font-semibold">100 địa điểm</p>
              </div>
            </div>
            <button className="flex items-center gap-2 bg-primary hover:bg-primary-light hover:cursor-pointer text-white font-medium px-5 py-2.5 rounded-2xl transition">
              <Plus size={18} />
              <span>Tạo điạ điểm</span>
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

export default Locations;
