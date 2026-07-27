"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h2 className="text-2xl font-bold text-red-500">
        Something went wrong 😵
      </h2>

      <p className="mt-2 text-gray-500">{error.message}</p>

      <button
        onClick={() => reset()}
        className="bg-purple-600 mt-4 rounded px-4 py-2 text-white"
      >
        Try again
      </button>
    </div>
  );
}
