"use client"

import type React from "react"
import { useState } from "react"
import { Upload, message, Checkbox } from "antd"
import { InboxOutlined } from "@ant-design/icons"
import type { UploadFile, UploadProps } from "antd"
import type { BuildingFormData } from "../../../types/building"

const { Dragger } = Upload

interface Step2Props {
  initialData: Partial<BuildingFormData>
  onNext: (data: Partial<BuildingFormData>) => void
  onBack: () => void
}

const Step2: React.FC<Step2Props> = ({ initialData, onNext, onBack }) => {
  const [enableDraw, setEnableDraw] = useState(true)
  const [enableUpload, setEnableUpload] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const uploadProps: UploadProps = {
    name: "file",
    multiple: false,
    accept: ".glb,.gltf",
    beforeUpload: (file) => {
      const isGLB = file.name.endsWith(".glb") || file.name.endsWith(".gltf")
      if (!isGLB) {
        message.error("Chỉ chấp nhận file .glb hoặc .gltf!")
        return false
      }
      const isLt50M = file.size / 1024 / 1024 < 50
      if (!isLt50M) {
        message.error("File phải nhỏ hơn 50MB!")
        return false
      }
      
      // Read file and convert to base64 for localStorage
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        localStorage.setItem(`model_${file.name}`, base64)
        message.success("Đã lưu file vào localStorage")
      }
      reader.readAsDataURL(file)
      
      return false // Prevent auto upload
    },
    onChange(info) {
      const newFileList = info.fileList.slice(-1)
      setFileList(newFileList)
    },
    onRemove: (file) => {
      localStorage.removeItem(`model_${file.name}`)
      setFileList([])
      message.info("Đã xóa file khỏi localStorage")
    },
    fileList: fileList,
  }

  const handleSubmit = () => {
    if (!enableDraw && !enableUpload) {
      message.warning("Vui lòng chọn ít nhất 1 phương thức")
      return
    }

    if (enableUpload && fileList.length === 0) {
      message.warning("Vui lòng tải lên file mô hình 3D")
      return
    }

    const modelFile = fileList.length > 0 ? fileList[0] : undefined
    
    onNext({
      ...initialData,
      enableDraw: enableDraw,
      enableUpload: enableUpload,
      modelFile: modelFile?.originFileObj,
      modelFileName: modelFile?.name,
      useLocalStorage: true,
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Chọn cách tạo mô hình 3D</h2>
          <p className="text-gray-500">Bạn có thể chọn 1 hoặc kết hợp cả 2 phương thức</p>
        </div>

        {/* Method Selection */}
        <div className="space-y-4 mb-6">
          {/* Draw Option */}
          <div 
            className={`border-2 rounded-lg p-4 cursor-pointer transition ${
              enableDraw 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onClick={() => { setEnableDraw(!enableDraw); if (!enableDraw) setEnableUpload(false) }}
          >
            <div className="flex items-start gap-3">
                <Checkbox 
                checked={enableDraw} 
                onChange={(e) => { setEnableDraw(e.target.checked); if (e.target.checked) setEnableUpload(false) }}
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🎨</span>
                  <span className="font-medium text-lg">Vẽ khối hình 3D</span>
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    ✨ Khuyến nghị
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Tự vẽ các khối hình đơn giản như hộp, trụ, lăng trụ và ghép cửa sổ/cửa ra vào
                </p>
                <ul className="text-xs text-gray-500 space-y-1 ml-4">
                  <li>• Vẽ hộp chữ nhật, khối trụ, lăng trụ</li>
                  <li>• Upload file .glb nhỏ (cửa sổ, cửa...) để ghép vào</li>
                  <li>• Điều chỉnh kích thước, vị trí từng khối</li>
                  <li>• Preview 3D real-time</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Upload Option */}
          <div 
            className={`border-2 rounded-lg p-4 cursor-pointer transition ${
              enableUpload 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onClick={() => { setEnableUpload(!enableUpload); if (!enableUpload) setEnableDraw(false) }}
          >
            <div className="flex items-start gap-3">
              <Checkbox 
                checked={enableUpload} 
                onChange={(e) => { setEnableUpload(e.target.checked); if (e.target.checked) setEnableDraw(false) }}
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📦</span>
                  <span className="font-medium text-lg">Upload file .glb có sẵn</span>
                  <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                    💾 Lưu local
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Tải lên file mô hình 3D có sẵn - file sẽ được lưu trong trình duyệt
                </p>
                <ul className="text-xs text-gray-500 space-y-1 ml-4">
                  <li>• File .glb/.gltf tối đa 50MB</li>
                  <li>• Lưu trong localStorage (không upload cloud)</li>
                  <li>• Phù hợp cho model phức tạp đã có sẵn</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Area - Show if upload enabled */}
        {enableUpload && (
          <>
            <div className="mb-6">
              <label className="block text-lg font-medium mb-4">📦 Tải lên file mô hình 3D</label>
              <Dragger {...uploadProps} className="mb-4">
                <p className="ant-upload-drag-icon">
                  <InboxOutlined style={{ fontSize: 48, color: "#1890ff" }} />
                </p>
                <p className="ant-upload-text text-lg">Nhấp hoặc kéo thả file vào khu vực này</p>
                <p className="ant-upload-hint">Hỗ trợ: .glb, .gltf (tối đa 50MB) - Lưu trong localStorage</p>
              </Dragger>

              {fileList.length > 0 && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-green-800 font-medium">File đã lưu: {fileList[0].name}</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    Kích thước: {((fileList[0].size || 0) / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    ✓ Đã lưu vào localStorage của trình duyệt
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-blue-900 mb-2">💡 Gợi ý:</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li><strong>Chỉ vẽ:</strong> Nhanh chóng cho tòa nhà đơn giản</li>
            <li><strong>Chỉ upload:</strong> Phù hợp cho model phức tạp có sẵn</li>
            <li><strong>Kết hợp cả 2:</strong> Upload model chính + vẽ thêm chi tiết</li>
            <li>File lưu trong localStorage (không upload cloud, miễn phí)</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-5 py-2 rounded-md transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Quay lại</span>
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-primary hover:bg-primary-light hover:cursor-pointer text-white font-medium px-5 py-2 rounded-md transition"
          >
            <span>Bước tiếp theo</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Step2