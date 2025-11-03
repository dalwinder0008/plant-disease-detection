import React, { useState } from 'react';
import { askGeminiWithImage } from '../services/geminiService';
import { CameraIcon, SparklesIcon } from '../components/Icons';

const CheckDisease: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Check Plant Disease</h1>
        <p className="text-gray-600 mt-2">Upload a photo of a plant leaf to get an instant AI-powered diagnosis.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Plant Leaf Image</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Plant leaf preview" className="mx-auto h-48 w-auto rounded-md" />
              ) : (
                <CameraIcon className="mx-auto h-12 w-12 text-gray-400" />
              )}
              <div className="flex text-sm text-gray-600 justify-center">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                  <span>{imageFile ? 'Change image' : 'Upload a file'}</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                </label>
                {!imageFile && <p className="pl-1">or drag and drop</p>}
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, WEBP, etc.</p>
            </div>
          </div>
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
