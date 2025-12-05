interface DashboardPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export function DashboardPagination({
  page,
  totalPages,
  onPageChange
}: DashboardPaginationProps) {

  return (
    <div className="flex justify-center mt-8">
      <div className="flex gap-4 items-center bg-black/40 px-6 py-3 rounded-xl text-white">

        <button
          disabled={page === 1}
          className="disabled:opacity-40"
          onClick={() => onPageChange(page - 1)}
        >
          ← Предыдущая
        </button>

        <div className="flex gap-2">
          {Array.from({ length: totalPages }).map((_, i) => {
            const num = i + 1;
            return (
              <button
                key={num}
                onClick={() => onPageChange(num)}
                className={`px-3 py-1 rounded-xl ${
                  num === page ? "bg-red-600 text-white" : "text-white/70"
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>
        
        <button
          disabled={page === totalPages}
          className="disabled:opacity-40"
          onClick={() => onPageChange(page + 1)}
        >
          Следующая →
        </button>

      </div>
    </div>
  );
}
