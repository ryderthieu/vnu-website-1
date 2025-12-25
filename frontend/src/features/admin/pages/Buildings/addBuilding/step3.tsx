import React, { useState, useEffect, useRef } from "react"
import { message, InputNumber } from "antd"

// Preview scale constant: 1 unit ThreeJS = 1 meter, but scale down for better visuals
const PREVIEW_SCALE = 0.1

// Types
interface Vector3 { x: number; y: number; z: number }

interface ShapeBase {
  id: string
  type: 'box' | 'cylinder' | 'prism'
  position: Vector3
  rotation: Vector3
  scale: Vector3
  color: string
}

interface BoxShape extends ShapeBase { 
  type: 'box'
  width: number
  height: number
  depth: number
}

interface CylinderShape extends ShapeBase { 
  type: 'cylinder'
  radius: number
  height: number
}

interface PrismShape extends ShapeBase { 
  type: 'prism'
  points: [number, number][]
  height: number
  baseLatLng?: { lat: number; lng: number }[] // store original lat/lng for API
}

type Shape = BoxShape | CylinderShape | PrismShape

interface GlbAsset {
  id: string
  name: string
  file: File
  url: string
  instances: {
    id: string
    position: Vector3
    rotation: Vector3
    scale: Vector3
  }[]
}

interface BuildingFormData {
  name?: string
  description?: string
  floors?: number
  place_id?: number
  imageFile?: File
  enableDraw?: boolean
  enableUpload?: boolean
  modelFile?: File
  modelFileName?: string
  useLocalStorage?: boolean
  latitude?: number
  longitude?: number
  shapes?: Shape[]
  glbAssets?: GlbAsset[]
}

interface Step3Props {
  initialData: Partial<BuildingFormData>
  onNext: (data: Partial<BuildingFormData>) => void
  onBack: () => void
}

const Step3: React.FC<Step3Props> = ({ initialData, onNext, onBack }) => {
  // Refs
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const threeContainerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<any>(null)
  const rendererRef = useRef<any>(null)
  const cameraRef = useRef<any>(null)
  const controlsRef = useRef<any>(null)
  const animationIdRef = useRef<number>(0)
  const tempObjectUrlsRef = useRef<string[]>([])

  // State
  const [position, setPosition] = useState({
    lat: initialData.latitude || 10.8231,
    lng: initialData.longitude || 106.6297,
  })

  const [shapes, setShapes] = useState<Shape[]>([])
  const [glbAssets, setGlbAssets] = useState<GlbAsset[]>([])
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null)
  const [threeLoaded, setThreeLoaded] = useState(false)
  const [mapReady, setMapReady] = useState(false)

  // Drawing on map state
  const [drawingMode, setDrawingMode] = useState(!!initialData.enableDraw)
  const [drawPoints, setDrawPoints] = useState<{lat:number; lng:number}[]>([])
  
  const drawMarkersRef = useRef<any[]>([])
  const drawPolylineRef = useRef<any>(null)
  const [drawHeight, setDrawHeight] = useState<number>(4)
  const [drawScale, setDrawScale] = useState<number>(1)

  // Keep drawingMode in sync if initialData changes
  useEffect(() => {
    setDrawingMode(!!initialData.enableDraw)
  }, [initialData.enableDraw])

  // If user selected upload in step2 and model stored in localStorage, load a simple asset for preview
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (initialData.enableUpload && initialData.modelFileName && glbAssets.length === 0) {
      const key = `model_${initialData.modelFileName}`
      const data = localStorage.getItem(key)
      const url = data || ''
      const newAsset: GlbAsset = {
        id: `asset_${Date.now()}`,
        name: initialData.modelFileName,
        file: initialData.modelFile as File,
        url,
        instances: [
          {
            id: `instance_${Date.now()}`,
            position: { x: 0, y: 1, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 0.2, y: 0.2, z: 0.2 }
          }
        ]
      }
      setGlbAssets([newAsset])
    }
  }, [])

  // Initialize Leaflet Map
  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return

    import("leaflet").then((L) => {
      if (!mapInstanceRef.current) {
        const map = L.map(mapRef.current!).setView([position.lat, position.lng], 17)

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map)

        // ensure map sizing/interaction is correct after render
        setTimeout(() => {
          try { map.invalidateSize && map.invalidateSize() } catch(e) {}
        }, 200)

        const customIcon = L.divIcon({
          className: "custom-map-marker",
          html: `
            <div style="
              width: 40px; height: 40px; background: #3b82f6;
              border: 3px solid white; border-radius: 50%;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              display: flex; align-items: center; justify-content: center;
              cursor: move;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
        })

        const marker = L.marker([position.lat, position.lng], {
          draggable: !drawingMode,
          icon: customIcon,
        })

        // only add marker if not in drawing mode
        if (!drawingMode) marker.addTo(map)

        marker.on("dragend", (e: any) => {
          const newPos = e.target.getLatLng()
          setPosition({ lat: newPos.lat, lng: newPos.lng })
          message.success("Đã cập nhật vị trí")
        })

        mapInstanceRef.current = map
        markerRef.current = marker
        setMapReady(true)
      }
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        setMapReady(false)
      }
    }
  }, [position.lat, position.lng])

  // Map drawing handlers
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    const handleMapClick = (e: any) => {
      if (!drawingMode) return
      // only allow drawing when there is no existing prism
      if (Array.isArray(shapes) && shapes.length > 0) {
        try { message.info('Chỉ được vẽ 1 khối lăng trụ') } catch(e) {}
        return
      }

      // debug: log event latlng and container point to diagnose offset issues
      const lat = e.latlng.lat
      const lng = e.latlng.lng
      console.log('🎯 MAP CLICK (raw from Leaflet):', { lat, lng, clickAt: `${lat.toFixed(6)}, ${lng.toFixed(6)}` })

      // If there is at least one point, check if click is near the first point -> finalize
      if (drawPoints.length >= 1) {
        const first = drawPoints[0]
        const latFactor = 111320 // meters per degree latitude
        const lngFactor = Math.cos((lat + first.lat) / 2 * Math.PI / 180) * 111320 // meters per degree longitude (adjusted for latitude)
        const dx = (lng - first.lng) * lngFactor
        const dy = (lat - first.lat) * latFactor
        const dist = Math.sqrt(dx*dx + dy*dy)
        // threshold 5 meters
        if (dist < 5) {
          // finalize without adding this click
          finishDrawing()
          return
        }
      }

      setDrawPoints(prev => {
        const next = [...prev, { lat, lng }]
        // add marker and update polyline
        import('leaflet').then((L) => {
          const marker = L.circleMarker([lat, lng], { radius: 6, color: '#ff5722', fillColor: '#ff5722', fillOpacity: 0.9 }).addTo(map)
          drawMarkersRef.current.push(marker)
          if (drawPolylineRef.current) {
            drawPolylineRef.current.setLatLngs(next.map(p => [p.lat, p.lng]))
          } else {
            drawPolylineRef.current = L.polyline(next.map(p => [p.lat, p.lng]), { color: '#ff5722' }).addTo(map)
          }
        })
        return next
      })
    }

    map.on('click', handleMapClick)

    return () => {
      map.off('click', handleMapClick)
    }
  }, [drawingMode, drawPoints, mapReady, shapes])

  // Manage marker: update position, toggle layer and dragging based on drawingMode
  useEffect(() => {
    const map = mapInstanceRef.current
    const marker = markerRef.current
    if (!map || !marker) return

    try { marker.setLatLng([position.lat, position.lng]) } catch (e) {}

    try {
      if (drawingMode) {
        if (map.hasLayer(marker)) map.removeLayer(marker)
        if (marker.dragging && typeof marker.dragging.disable === 'function') marker.dragging.disable()
      } else {
        if (!map.hasLayer(marker)) marker.addTo(map)
        if (marker.dragging && typeof marker.dragging.enable === 'function') marker.dragging.enable()
      }
    } catch (e) {}
  }, [position.lat, position.lng, drawingMode, mapReady])
  const clearDrawLayers = () => {
    const map = mapInstanceRef.current
    if (!map) return
    drawMarkersRef.current.forEach(m => { try { map.removeLayer(m) } catch (e) {} })
    drawMarkersRef.current = []
    if (drawPolylineRef.current) {
      try { map.removeLayer(drawPolylineRef.current) } catch (e) {}
      drawPolylineRef.current = null
    }
    setDrawPoints([])
  }

  const finishDrawing = () => {
  if (drawPoints.length < 3) {
    message.warning('Vui lòng chọn ít nhất 3 điểm để tạo polygon')
    return
  }

  console.log('🔵 FINISH DRAWING - Raw draw points (direct from clicks):', drawPoints.map(p => `(${p.lat.toFixed(6)}, ${p.lng.toFixed(6)})`))

  // Lấy điểm đầu làm gốc tọa độ
  const base = drawPoints[0]
  const latFactor = 111320 // meters per degree latitude
  const lngFactor = Math.cos(base.lat * Math.PI/180) * 111320 // meters per degree longitude

  // Chuyển đổi lat/lng sang meters (X=lng, Z=lat)
  const ptsRaw: [number, number][] = drawPoints.map(p => [
    (p.lng - base.lng) * lngFactor * drawScale,  // X (East-West)
    (p.lat - base.lat) * latFactor * drawScale,  // Z (North-South)
  ])

  // Tính centroid trong không gian XZ
  const centroidX = ptsRaw.reduce((sum, p) => sum + p[0], 0) / ptsRaw.length
  const centroidZ = ptsRaw.reduce((sum, p) => sum + p[1], 0) / ptsRaw.length

  // Điểm relative to centroid (để geometry được centered)
  const pts: [number, number][] = ptsRaw.map(p => [
    p[0] - centroidX,  // X offset from centroid
    p[1] - centroidZ   // Z offset from centroid
  ])

  const prism: PrismShape = {
    id: `shape_${Date.now()}`,
    type: 'prism',
    position: { 
      x: centroidX,           // X position (East-West)
      y: drawHeight / 2,      // Y position (vertical - half height)
      z: centroidZ            // Z position (North-South)
    },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    color: '#'+Math.floor(Math.random()*16777215).toString(16),
    points: pts,
    height: drawHeight,
    baseLatLng: drawPoints,  // ✅ Store ORIGINAL clicked lat/lng ONLY
  }

  console.log('✅ PRISM CREATED with baseLatLng (will send to API):', prism.baseLatLng.map(p => `(${p.lat.toFixed(6)}, ${p.lng.toFixed(6)})`))
  console.log('   Centroid in meters (for 3D preview only):', { x: centroidX, z: centroidZ })
  console.log('   Note: baseLatLng is INDEPENDENT of marker position:', position)

  setShapes([prism])
  setSelectedShapeId(prism.id)
  message.success('Đã tạo lăng trụ từ polygon')
  setDrawingMode(false)
  clearDrawLayers()

  // Focus camera
  setTimeout(() => {
    const THREE = (window as any).THREE
    if (!THREE) return
    const cam = cameraRef.current
    const controls = controlsRef.current
    if (cam && controls) {
      const distance = Math.max(15, drawHeight * 3)
      cam.position.set(
        centroidX + distance, 
        drawHeight * 2, 
        centroidZ + distance
      )
      if (typeof controls.target?.set === 'function') {
        controls.target.set(centroidX, drawHeight / 2, centroidZ)
      }
      controls.update()
    }
  }, 200)
}

 


  // Update marker position and disable dragging in drawing mode
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLatLng([position.lat, position.lng])
      try {
        markerRef.current.dragging[drawingMode ? 'disable' : 'enable']()
      } catch(e) {}
    }
  }, [position.lat, position.lng, drawingMode])

  // Initialize Three.js Scene
  useEffect(() => {
    if (!threeContainerRef.current) return
    if (rendererRef.current) return

    // // If already initialized and canvas still present, skip
    // if (threeLoaded && rendererRef.current && threeContainerRef.current.contains(rendererRef.current.domElement)) return

    // // If there's an existing renderer but its canvas is gone (container re-mounted), dispose it first
    // if (rendererRef.current) {
    //   try {
    //     if (rendererRef.current.domElement && rendererRef.current.domElement.parentElement) {
    //       rendererRef.current.domElement.parentElement.removeChild(rendererRef.current.domElement)
    //     }
    //   } catch (e) {}
    //   try {
    //     // properly lose the WebGL context to avoid accumulating contexts
    //     if (typeof rendererRef.current.forceContextLoss === 'function') {
    //       try { rendererRef.current.forceContextLoss() } catch(e) {}
    //     }
    //   } catch(e) {}
    //   try { rendererRef.current.dispose() } catch (e) {}
    //   try { if (rendererRef.current.domElement) { rendererRef.current.domElement.width = 1; rendererRef.current.domElement.height = 1 } } catch (e) {}
    //   rendererRef.current = null
    //   sceneRef.current = null
    //   cameraRef.current = null
    //   controlsRef.current = null
    //   setThreeLoaded(false)
    // }

    const initThreeJS = async () => {
      try {
        const THREE = await import("three")
        const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js")

        // Make THREE available globally for shape updates
        const w = window as any
        w.THREE = THREE

        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0xf0f0f0)
        
        const camera = new THREE.PerspectiveCamera(
          50,
          threeContainerRef.current!.clientWidth / threeContainerRef.current!.clientHeight,
          0.1,
          1000
        )
        camera.position.set(15, 15, 15)

        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(threeContainerRef.current!.clientWidth, threeContainerRef.current!.clientHeight)
        renderer.shadowMap.enabled = true
        // Attach renderer canvas to current container
        threeContainerRef.current!.appendChild(renderer.domElement)

        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = 0.05

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
        scene.add(ambientLight)

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
        dirLight.position.set(10, 20, 10)
        dirLight.castShadow = true
        scene.add(dirLight)

        const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.4)
        dirLight2.position.set(-10, 10, -10)
        scene.add(dirLight2)

        // Grid & Axes
        const gridHelper = new THREE.GridHelper(30, 30, 0x888888, 0xcccccc)
        scene.add(gridHelper)

        const axesHelper = new THREE.AxesHelper(5)
        scene.add(axesHelper)

        sceneRef.current = scene
        rendererRef.current = renderer
        cameraRef.current = camera
        controlsRef.current = controls

        // Animation loop
        const animate = () => {
          animationIdRef.current = requestAnimationFrame(animate)
          controls.update()
          renderer.render(scene, camera)
        }
        animate()

        setThreeLoaded(true)
        message.success("Khởi tạo 3D thành công")

      } catch (error) {
        console.error("Error initializing Three.js:", error)
        message.error("Không thể khởi tạo 3D viewer")
      }
    }

    initThreeJS()

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      // if (rendererRef.current && threeContainerRef.current && threeContainerRef.current.contains(rendererRef.current.domElement)) {
      //   try { threeContainerRef.current.removeChild(rendererRef.current.domElement) } catch(e) {}
      //   try { if (typeof rendererRef.current.forceContextLoss === 'function') rendererRef.current.forceContextLoss() } catch(e) {}
      //   try { rendererRef.current.dispose() } catch(e) {}
      // }
    }
  }, [])

  // Update scene when shapes change
  useEffect(() => {
    if (!sceneRef.current || !threeLoaded) return

    const THREE = (window as any).THREE
    if (!THREE) return

    const shapesArr = Array.isArray(shapes) ? shapes : []
    console.log('updateScene: shapesArr length', shapesArr.length)

    // Clear previous shapes
    const objectsToRemove: any[] = []
    sceneRef.current.children.forEach((child: any) => {
      if (child.userData.isShape || child.userData.isGlbInstance || child.userData.tempDebugMarker) {
        objectsToRemove.push(child)
      }
    })
    objectsToRemove.forEach(obj => sceneRef.current.remove(obj))
    console.log('updateScene: removed previous shape children', objectsToRemove.length)

    // Add shapes (use safe index loop to avoid calling .forEach on unexpected values)
    for (let i = 0; i < shapesArr.length; i++) {
      const shape = shapesArr[i]
      let geometry: any
      const material = new THREE.MeshPhongMaterial({
        color: shape.color,
        transparent: true,
        opacity: selectedShapeId === shape.id ? 0.8 : 0.9
      })

      if (shape.type === 'box') {
        geometry = new THREE.BoxGeometry(shape.width, shape.height, shape.depth)
      } else if (shape.type === 'cylinder') {
        geometry = new THREE.CylinderGeometry(shape.radius, shape.radius, shape.height, 32)
      } else if (shape.type === 'prism') {
        const prismShape = new THREE.Shape()
        for (let j = 0; j < shape.points.length; j++) {
          const pt = shape.points[j]
          if (j === 0) prismShape.moveTo(pt[0], pt[1])
          else prismShape.lineTo(pt[0], pt[1])
        }
        prismShape.closePath()
        geometry = new THREE.ExtrudeGeometry(prismShape, {
          depth: shape.height,
          bevelEnabled: false
        })
        // rotate so extrusion (originally along +Z) maps to +Y (up)
        geometry.rotateX(-Math.PI / 2)
      }

      if (geometry) {
        // ensure both sides are visible
        material.side = THREE.DoubleSide
        const mesh = new THREE.Mesh(geometry, material)
        // Position should use real-world meters (no preview scaling)
        mesh.position.set(shape.position.x, shape.position.y, shape.position.z)
        mesh.rotation.set(shape.rotation.x, shape.rotation.y, shape.rotation.z)
        // Apply PREVIEW_SCALE only to scale so preview appears smaller but keeps correct position
        mesh.scale.set(shape.scale.x * PREVIEW_SCALE, shape.scale.y * PREVIEW_SCALE, shape.scale.z * PREVIEW_SCALE)
        mesh.castShadow = true
        mesh.receiveShadow = true
        mesh.userData = { isShape: true, shapeId: shape.id }
        try { geometry.computeBoundingBox && geometry.computeBoundingBox() } catch(e){}
        console.log('updateScene: adding mesh', shape.id, 'pos', mesh.position, 'bbox', geometry.boundingBox)
        sceneRef.current.add(mesh)
      }
    }

    // Add GLB instances using GLTFLoader (real model preview)
    (async () => {
      try {
        const mod = await import('three/examples/jsm/loaders/GLTFLoader.js')
        const { GLTFLoader } = mod as any
        const loader = new GLTFLoader()

        for (const asset of glbAssets) {
          // determine URL: prefer asset.url (could be data URL), otherwise create object URL from file
          let assetUrl = asset.url
          if ((!assetUrl || assetUrl.length === 0) && asset.file) {
            const objUrl = URL.createObjectURL(asset.file)
            tempObjectUrlsRef.current.push(objUrl)
            assetUrl = objUrl
          }

          if (!assetUrl) continue

          // load glb once, then clone for instances
          await new Promise<void>((resolveLoad) => {
            console.log('GLB: loading URL', assetUrl)
            loader.load(assetUrl, (gltf: any) => {
              console.log('GLB: loaded', assetUrl, 'scene children', gltf.scene.children.length)
              asset.instances.forEach((instance: any) => {
                const root = gltf.scene.clone(true)
                // Keep GLB instance position as true map-relative meters (no preview position scaling)
                root.position.set(instance.position.x, instance.position.y, instance.position.z)
                root.rotation.set(instance.rotation.x, instance.rotation.y, instance.rotation.z)
                // Only scale the model for preview
                root.scale.set(instance.scale.x * PREVIEW_SCALE, instance.scale.y * PREVIEW_SCALE, instance.scale.z * PREVIEW_SCALE)
                root.traverse((child: any) => {
                  if (child.isMesh) {
                    child.castShadow = true
                    child.receiveShadow = true
                  }
                })
                root.userData = { isGlbInstance: true, instanceId: instance.id, assetId: asset.id }
                sceneRef.current.add(root)
                console.log('GLB: added instance', instance.id, 'at', instance.position)
              })
              resolveLoad()
            }, undefined, (err: any) => {
              console.warn('Failed to load glb', assetUrl, err)
              resolveLoad()
            })
          })
        }
      } catch (err) {
        console.warn('GLTFLoader import/load failed', err)
      }
    })()

    // auto-frame camera to fit new content (shapes + glbs)
    try {
      // compute bounding box only from shapes and GLB instances to avoid grid/other helpers inflating bounds
      const box = new THREE.Box3()
      let any = false
      sceneRef.current.children.forEach((child: any) => {
        if (child.userData && (child.userData.isShape || child.userData.isGlbInstance)) {
          try { box.expandByObject(child); any = true } catch(e) {}
        }
      })
      if (!any) {
        // nothing to frame
        console.log('updateScene: no shape/glb children to frame')
      } else {
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        const maxSize = Math.max(size.x, size.y, size.z)
        // clamp fit distance to avoid extreme camera positions
        const fitDistance = Math.min(Math.max(10, maxSize * 1.2), 200)
        const cam = cameraRef.current
        const controls = controlsRef.current
        console.log('updateScene: scene bbox (shapes only)', { min: box.min, max: box.max, center, size, maxSize, fitDistance })
        if (cam && controls) {
          console.log('updateScene: camera before', cam.position, 'controls target before', controls.target)
          // position camera along normalized diagonal (1,1,1)
          const dir = new THREE.Vector3(1, 1, 1).normalize().multiplyScalar(fitDistance)
          const newPos = center.clone().add(dir)
          cam.position.copy(newPos)
          if (typeof controls.target?.copy === 'function') {
            controls.target.copy(center)
          } else if (controls.target) {
            controls.target = { x: center.x, y: center.y, z: center.z }
          }
          controls.update()
          console.log('updateScene: camera after', cam.position, 'controls target after', controls.target)

          // ensure renderer size matches container
          try {
            const renderer = rendererRef.current
            if (renderer && threeContainerRef.current) {
              const w = threeContainerRef.current.clientWidth
              const h = threeContainerRef.current.clientHeight
              renderer.setSize(w, h)
              console.log('updateScene: renderer resized to', w, h)
            }
          } catch (e) { console.warn('renderer resize failed', e) }
        }
      }
    } catch (e) {
      console.warn('Framing error', e)
    }

    // revoke any temp object URLs on next scene update
    tempObjectUrlsRef.current.forEach(u => { try { URL.revokeObjectURL(u) } catch(e) {} })
    tempObjectUrlsRef.current = []
  }, [shapes, glbAssets, selectedShapeId, threeLoaded])

  

  // Sync drawHeight edits to the single prism height (if present)
  useEffect(() => {
    if (!Array.isArray(shapes) || shapes.length === 0) return
    const s = shapes[0]
    if (s.type !== 'prism') return
    if (s.height === drawHeight) return
    const updated: PrismShape = {
      ...s,
      height: drawHeight,
      position: { x: s.position.x, y: drawHeight / 2, z: s.position.z }
    }
    setShapes([updated])
  }, [drawHeight])


  const handleSubmit = () => {
    const shapesCount = Array.isArray(shapes) ? shapes.length : 0
    if (initialData.enableDraw && shapesCount === 0) {
      message.warning("Vui lòng vẽ ít nhất 1 khối hình")
      return
    }

    // Build API payload matching backend schema
    const objects3d: any[] = []

    // Add GLB models - use marker position (map coordinates) not 3D local position
    for (const asset of glbAssets) {
      asset.instances.forEach((instance) => {
        objects3d.push({
          objectType: 0, // IMPORTED_MODEL
          meshes: [
            {
              meshUrl: asset.url,
              point: {
                type: "Point",
                coordinates: [position.lng, position.lat, 0] // [lng, lat, elevation]
              },
              rotate: instance.rotation.y || 0,
              scale: instance.scale.x || 1
            }
          ]
        })
      })
    }

    // Add drawn prisms
    if (Array.isArray(shapes) && shapes.length > 0) {
      const prism = shapes[0]
      if (prism.type === 'prism' && prism.baseLatLng && prism.baseLatLng.length >= 3) {
        // Convert prism points to GeoJSON Polygon coordinates [lng, lat, 0]
        const coordinates = [
          prism.baseLatLng.map(p => [p.lng, p.lat, 0])
        ]
        // Close the polygon by adding first point at end if not already closed
        if (JSON.stringify(coordinates[0][0]) !== JSON.stringify(coordinates[0][coordinates[0].length - 1])) {
          coordinates[0].push(coordinates[0][0])
        }

        console.log('📤 API PAYLOAD - Drawn Prism Coordinates (from baseLatLng):', coordinates[0].map(c => `[${c[0].toFixed(6)}, ${c[1].toFixed(6)}, ${c[2]}]`))
        console.log('   These are the ACTUAL clicked points on map - NOT related to marker position')

        objects3d.push({
          objectType: 1, // DRAWN_SHAPE
          body: {
            name: "Drawn Structure",
            prisms: [
              {
                baseFace: {
                  type: "Polygon",
                  coordinates: coordinates
                },
                height: prism.height
              }
            ]
          }
        })
      }
    }

    onNext({
      ...initialData,
      latitude: position.lat,
      longitude: position.lng,
      shapes,
      glbAssets,
      objects3d // API payload
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold mb-2">
          {initialData.enableDraw && initialData.enableUpload ? 'Vẽ mô hình 3D & Điều chỉnh vị trí' :
           initialData.enableDraw ? 'Vẽ mô hình 3D & Điều chỉnh vị trí' :
           'Điều chỉnh vị trí trên bản đồ'}
        </h2>
        <p className="text-gray-500 mb-6">
          {initialData.enableDraw ? 'Vẽ các khối hình, ghép assets và đặt vị trí trên bản đồ' : 
           'Đặt vị trí hiển thị mô hình trên bản đồ'}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Drawing or Upload tools */}
          {(initialData.enableDraw || initialData.enableUpload) && (
            <div className="space-y-4">
              <div className="border border-gray-300 rounded-lg p-4">
                <h3 className="font-medium mb-3">🎨 Công cụ</h3>

                {initialData.enableDraw ? (
                  <div className="mb-3 text-sm space-y-2">
                    <div className="text-xs text-gray-600">Nhấp trên bản đồ để thêm điểm. Nhấp vào điểm đầu để đóng polygon và hiển thị preview 3D.</div>

                    <div className="flex items-center gap-2">
                      <label className="text-xs">Chiều cao (sau khi tạo lăng trụ):</label>
                      <InputNumber size="small" value={drawHeight} onChange={(v) => {
                        setDrawHeight(v || 1)
                      }} min={0.1} step={0.5} disabled={Array.isArray(shapes) && shapes.length === 0} />
                      <label className="text-xs">Tỷ lệ:</label>
                      <InputNumber size="small" value={drawScale} onChange={(v) => setDrawScale(v || 1)} min={0.01} step={0.1} />
                    </div>

                    <div className="text-xs text-gray-500">Điểm hiện tại: {drawPoints.length}</div>
                  </div>
                ) : (
                  <div className="text-sm space-y-2">
                    <div className="text-xs text-gray-700">Chế độ Upload: hiển thị preview model và chọn vị trí trên bản đồ.</div>
                    {glbAssets.length > 0 ? (
                      <div className="p-2 border rounded">
                        <div className="text-sm font-medium">{glbAssets[0].name}</div>
                        <div className="text-xs text-gray-500">Kéo marker trên bản đồ để chọn vị trí.</div>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400">Không tìm thấy model trong localStorage</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Center/Right - 3D Preview & Map */}
          <div className={`space-y-4 ${initialData.enableDraw ? 'col-span-2' : 'col-span-3'}`}>
            {/* 3D Preview */}
            <div className="border border-gray-300 rounded-lg overflow-hidden">
  <div className="bg-gray-100 px-4 py-2 border-b flex justify-between items-center">
    <h3 className="font-medium text-sm">🎬 Preview 3D</h3>
  </div>
  <div ref={threeContainerRef} style={{ height: "400px", width: "100%" }} />
</div>

            {/* Map */}
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 border-b">
                <h3 className="font-medium text-sm">📍 Vị trí trên bản đồ</h3>
              </div>
              <div ref={mapRef} style={{ height: "300px", width: "100%" }} />
              <div className="p-2 bg-gray-50 text-xs flex items-center justify-between">
                <span>📌 Lat: {position.lat.toFixed(6)}, Lng: {position.lng.toFixed(6)}</span>
                <span className="text-gray-500">Kéo marker để di chuyển</span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        {initialData.enableDraw && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Khối hình:</span>
                <span className="ml-2">{Array.isArray(shapes) ? shapes.length : 0}</span>
              </div>
              <div>
                <span className="font-medium">Assets:</span>
                <span className="ml-2">{glbAssets.length}</span>
              </div>
              <div>
                <span className="font-medium">Instances:</span>
                <span className="ml-2">{glbAssets.reduce((sum, a) => sum + a.instances.length, 0)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between mt-6">
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
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-md transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Hoàn thành</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Step3