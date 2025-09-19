
import React from 'react';

interface ThumbnailGridProps {
  images: string[];
  isLoading: boolean;
}

const SkeletonLoader: React.FC = () => (
  <div className="aspect-video bg-gray-200 rounded-lg animate-pulse"></div>
);

const downloadImage = (base64Image: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = base64Image;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const ThumbnailGrid: React.FC<ThumbnailGridProps> = ({ images, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, index) => (
          <SkeletonLoader key={index} />
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        <h3 className="text-xl font-semibold">Your Thumbnails Will Appear Here</h3>
        <p className="max-w-md mt-2">Fill in the details on the left and click "Generate" to see the magic happen!</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((src, index) => (
        <div key={index} className="group relative aspect-video rounded-lg overflow-hidden shadow-md cursor-pointer" onClick={() => downloadImage(src, `thumbnail-${index + 1}.png`)}>
          <img src={src} alt={`Generated Thumbnail ${index + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
             <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center space-x-2 bg-white/80 text-black px-4 py-2 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                <span className="font-semibold text-sm">Download</span>
             </div>
          </div>
        </div>
      ))}
    </div>
  );
};
