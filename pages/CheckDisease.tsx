import React, { useState, useRef, useEffect } from 'react';
import { askGeminiWithImage } from '../services/geminiService';
import { CameraIcon, SparklesIcon, ImageIcon } from '../components/Icons';

const CheckDisease: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isCameraOpen && videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }, [isCameraOpen]);

  const startCamera = async () => {
    setCameraError(null);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setCameraError("Could not access camera. Please ensure you have given permission and are not using it elsewhere.");
        setIsCameraOpen(false);
      }
    } else {
        setCameraError("Camera not supported on this device or browser.");
        setIsCameraOpen(false);
    }
  };

  const handleCameraClick = () => {
    setIsCameraOpen(true);
    startCamera();
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
        
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
          }
        }, 'image/jpeg');

        setIsCameraOpen(false);
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const clearSelection = () => {
      setImageFile(null);
      setImagePreview(null);
      setResponse('');
      if (fileInputRef.current) {
          fileInputRef.current.value = "";
      }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      alert("Please upload an image of the plant leaf.");
      return;
    }
    setIsLoading(true);
    setResponse('');
    const prompt = `Analyze the attached image of a plant leaf. Identify any diseases, pests, or nutrient deficiencies. Provide a detailed analysis including: 1. **Disease/Pest Name**: 2. **Confidence Level**: (High, Medium, or Low) 3. **Description & Symptoms**: visible in the image 4. **Recommended Organic Treatments**: 5. **Recommended Chemical Treatments**:.`;
    
    const result = await askGeminiWithImage(prompt, imageFile);
    setResponse(result);
    setIsLoading(false);
  };
  
  if (isCameraOpen) {
      return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
            <canvas ref={canvasRef} className="hidden"></canvas>
            {cameraError && <div className="absolute top-4 p-4 bg-red-500 text-white rounded">{cameraError}</div>}
            <div className="absolute bottom-4 flex items-center justify-center w-full">
                 <button onClick={handleCapture} className="w-20 h-20 rounded-full bg-white border-4 border-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"></button>
            </div>
            <button onClick={() => setIsCameraOpen(false)} className="absolute top-4 right-4 bg-black/50 text-white p-3 rounded-full font-semibold">Cancel</button>
        </div>
      )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Check Plant Disease</h1>
        <p className="text-gray-600 mt-2">Upload a photo of a plant leaf to get an instant AI-powered diagnosis.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Provide a Plant Leaf Image</label>
          
          {imagePreview ? (
             <div className="mt-1 text-center">
                <img src={imagePreview} alt="Plant leaf preview" className="mx-auto h-64 w-auto rounded-md" />
                <button type="button" onClick={clearSelection} className="mt-4 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300">
                    Choose a different image
                </button>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <button type="button" onClick={handleCameraClick} className="flex flex-col items-center justify-center p-6 border-2 border-gray-300 border-dashed rounded-md text-gray-600 hover:bg-gray-50 hover:border-green-500 transition">
                    <CameraIcon className="w-12 h-12 text-gray-400 mb-2" />
                    <span className="font-semibold">Take Photo</span>
                </button>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center p-6 border-2 border-gray-300 border-dashed rounded-md text-gray-600 hover:bg-gray-50 hover:border-green-500 transition">
                    <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                    <span className="font-semibold">Upload from Gallery</span>
                </button>
                <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
            </div>
          )}
           {cameraError && <p className="text-red-500 text-center mt-2">{cameraError}</p>}
        </div>
        
        <button type="submit" disabled={isLoading || !imageFile} className="w-full flex justify-center items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400">
          <SparklesIcon className="w-5 h-5"/>
          {isLoading ? 'Analyzing Image...' : 'Get AI Diagnosis'}
        </button>
      </form>

      {(isLoading || response) && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h3 className="text-xl font-bold mb-4">AI Diagnosis Report</h3>
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse [animation-delay:-0.15s] mx-2"></div>
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          ) : (
            <div className="prose prose-green max-w-none" dangerouslySetInnerHTML={{ __html: response.replace(/\n/g, '<br />') }} />
          )}
        </div>
      )}
    </div>
  );
};

export default CheckDisease;