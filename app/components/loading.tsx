// ./app/components/loading.tsx
export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen bg-closetoblack">
      <div className="font-light  text-center text-pearlwhite">
        <div className="text-center text-pearlwhite text-2xl">
          <span className="inline-block animate-loading-dots-1">L</span>
          <span className="inline-block animate-loading-dots-2">o</span>
          <span className="inline-block animate-loading-dots-3">a</span>
          <span className="inline-block animate-loading-dots-4">d</span>
          <span className="inline-block animate-loading-dots-5">i</span>
          <span className="inline-block animate-loading-dots-6">n</span>
          <span className="inline-block animate-loading-dots-7">g</span>
          <span className="inline-block animate-loading-dots-8">.</span>
          <span className="inline-block animate-loading-dots-1">.</span>
          <span className="inline-block animate-loading-dots-2">.</span>
        </div>
        <p className="mt-4 text-lg">The server is starting up. Please wait...</p>
      </div>
    </div>
  );
}
