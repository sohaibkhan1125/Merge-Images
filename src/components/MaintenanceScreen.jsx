export default function MaintenanceScreen() {
  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-b from-gray-50 to-white px-6">
      <div className="w-full max-w-xl text-center">
        <div className="mx-auto h-14 w-14 relative mb-4">
          <span className="absolute inset-0 rounded-full border-4 border-gray-200"></span>
          <span className="absolute inset-0 rounded-full border-4 border-gray-900 border-t-transparent animate-spin [animation-duration:1000ms]"></span>
        </div>
        <h1 className="text-2xl font-bold">We’ll be back soon</h1>
        <p className="mt-2 text-gray-600">Our website is currently undergoing maintenance. Please check back later.</p>
      </div>
    </div>
  );
}


