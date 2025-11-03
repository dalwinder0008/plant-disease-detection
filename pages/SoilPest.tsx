import React, { useState } from 'react';
import { askGeminiWithImage } from '../services/geminiService';
import { CameraIcon, SparklesIcon } from '../components/Icons';

const SoilPest: React.FC = () => {
  const [soilType, setSoilType] = useState('Loamy');
  const [ph, setPh] = useState('6.5');
  const [notes, setNotes] = useState('');
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
    const prompt = `A farmer has ${soilType} soil with a pH of ${ph}. Based on the attached image of a plant leaf, please identify any diseases or pests. Provide a detailed analysis including: 1. Disease/Pest Name 2. Confidence Level (e.g., High, Medium, Low) 3. Description and Symptoms visible in the image 4. Recommended organic and chemical treatments. Additional farmer notes: "${notes || 'None'}".`;
    
    const result = await askGeminiWithImage(prompt, imageFile);
    setResponse(result);
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-3">
            <SparklesIcon className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold">AI Plant Disease Detection</h2>
        </div>

        {/* Image Upload Section */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Upload Plant Leaf Image</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-stone-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Plant leaf preview" className="mx-auto h-48 w-auto rounded-md" />
              ) : (
                <CameraIcon className="mx-auto h-12 w-12 text-stone-400" />
              )}
              <div className="flex text-sm text-stone-600 justify-center">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                  <span>{imageFile ? 'Change image' : 'Upload a file'}</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                </label>
                {!imageFile && <p className="pl-1">or drag and drop</p>}
              </div>
              <p className="text-xs text-stone-500">PNG, JPG, WEBP, etc.</p>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="soil-type" className="block text-sm font-medium text-stone-700">Soil Type (Optional)</label>
            <select id="soil-type" value={soilType} onChange={(e) => setSoilType(e.target.value)} className="mt-1 block w-full p-2 border border-stone-300 rounded-md">
              <option>Loamy</option>
              <option>Clay</option>
              <option>Sandy</option>
              <option>Silty</option>
            </select>
          </div>
          <div>
            <label htmlFor="ph" className="block text-sm font-medium text-stone-700">Soil pH (Optional)</label>
            <input type="number" id="ph" value={ph} onChange={(e) => setPh(e.target.value)} step="0.1" min="0" max="14" className="mt-1 block w-full p-2 border border-stone-300 rounded-md" />
          </div>
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-stone-700">Additional Notes (Optional)</label>
          <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="e.g., The issue started last week after heavy rain..." className="mt-1 block w-full p-2 border border-stone-300 rounded-md"></textarea>
        </div>
        
        <button type="submit" disabled={isLoading || !imageFile} className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-stone-400 w-full sm:w-auto">
          {isLoading ? 'Analyzing Image...' : 'Get AI Diagnosis'}
        </button>
      </form>

      {(isLoading || response) && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold mb-2">AI Diagnosis Report</h3>
          {isLoading ? (
            <p>Our AI is analyzing your image. This may take a moment...</p>
          ) : (
            <div className="prose prose-green max-w-none" dangerouslySetInnerHTML={{ __html: response.replace(/\n/g, '<br />') }} />
          )}
        </div>
      )}
    </div>
  );
};

export default SoilPest;
