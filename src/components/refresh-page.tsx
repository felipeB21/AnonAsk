"use client";

export default function RefreshPage() {
  const refresh = () => {
    window.location.reload();
  };
  return (
    <button
      onClick={refresh}
      className="mt-10 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-stone-300 text-sm font-medium hover:bg-stone-100 transition whitespace-nowrap"
    >
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 10C2 10 4.00498 7.26822 5.63384 5.63824C7.26269 4.00827 9.5136 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.89691 21 4.43511 18.2543 3.35177 14.5M2 10V4M2 10H8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Refresh
    </button>
  );
}
