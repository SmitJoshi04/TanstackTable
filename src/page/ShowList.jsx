import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { GetTab } from "../services/fetchCategoriesOfTab";
import Tabs from "../components/Tabs";
import DataTable from "../components/Table";
import { GetTableData } from "../services/GetTableData";
import useDebounce from "../hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ShowList = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 1000);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["tab"],
    queryFn: GetTab,
  });

  useEffect(() => {
    if (data?.response_temp?.data?.length && activeTab === null) {
      setActiveTab(data.response_temp.data[0].infrastructure_id);
    }
  }, [data]);

  useEffect(() => {
    setPage(1);
  }, [activeTab, debouncedSearch]);

  const {
    data: tableData,
    isLoading: isTableDataLoading,
    isError: isTableDataError,
  } = useQuery({
    queryKey: [
      "TableData",
      {
        search: debouncedSearch.trim(),
        infrastructure_id: activeTab,
        limit,
        page,
      },
    ],
    queryFn: () =>
      GetTableData({
        search: debouncedSearch.trim(),
        infrastructure_id: activeTab,
        limit,
        page,
      }),
    keepPreviousData: true,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg font-medium">Loading...</div>
      </div>
    );
  }

  const tabs = data?.response_temp?.data;
  const Table = tableData?.response_temp?.data || [];
  const totalItems = tableData?.response_temp?.pagination.total || 0;
  const pageCount = tableData?.response_temp?.pagination.totalPages || 0;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-end">
        <Button onClick={() => navigate("/form")}>Go to Form</Button>
      </div>
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-6 mb-4">
        <Input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search..."
          className="bg-white"
        />
      </div>

      <div className="p-4 bg-white border rounded shadow">
        {isTableDataLoading ? (
          <div>Loading table data...</div>
        ) : isTableDataError ? (
          <div className="text-red-600">Failed to load table data.</div>
        ) : (
          <DataTable
            TableData={Table}
            page={page}
            setPage={setPage}
            pageCount={pageCount}
            totalCount={totalItems}
            limit={limit}
            setLimit={setLimit}
          />
        )}
      </div>
    </div>
  );
};

export default ShowList;
