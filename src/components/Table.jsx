import React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

function generateColumns(data) {
  if (!data || data.length === 0) return [];

  const allKeys = new Set();
  data.forEach((item) => Object.keys(item).forEach((key) => allKeys.add(key)));

  return Array.from(allKeys).map((key) => {
    let sampleValue;
    for (let i = 0; i < data.length; i++) {
      if (data[i][key] !== undefined && data[i][key] !== null) {
        sampleValue = data[i][key];
        break;
      }
    }

    const isNested = typeof sampleValue === "object" && sampleValue !== null;

    return {
      accessorKey: key,
      header: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      cell: ({ row }) => {
        const value = row.original[key];

        if (value === null || value === undefined) {
          return <span className="text-gray-400">-</span>;
        }

        if (isNested) {
          if ("latitude" in value && "longitude" in value) {
            return (
              <div className="text-xs leading-tight text-gray-700">
                <div>{value.latitude}</div>
                <div>{value.longitude}</div>
              </div>
            );
          }

          return (
            <pre className="text-xs">{JSON.stringify(value, null, 2)}</pre>
          );
        }

        return value.toString();
      },
    };
  });
}

export default function DataTable({
  TableData,
  page,
  setPage,
  pageCount,
  totalCount,
  limit,
  setLimit,
}) {
  const columns = React.useMemo(() => generateColumns(TableData), [TableData]);

  const table = useReactTable({
    data: TableData || [],
    columns,
    pageCount,
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: limit,
      },
    },
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!TableData || TableData.length === 0) {
    return (
      <div className="text-center text-gray-500 p-6">
        No data available to display.
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto rounded-lg border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(
                    cell.column.columnDef.cell ?? (() => cell.getValue()),
                    cell.getContext()
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>


      <div className="flex justify-between items-center p-4 flex-wrap gap-2">
        <div>
          Page {page} of {pageCount} — Total: {totalCount}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="rowsPerPage" className="text-sm">
            Rows per page:
          </label>
          <select
            id="rowsPerPage"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1); 
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            {[10, 20, 30, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={page === pageCount}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
