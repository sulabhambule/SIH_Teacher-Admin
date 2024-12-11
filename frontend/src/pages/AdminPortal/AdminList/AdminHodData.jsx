import React, { useEffect, useMemo, useState } from "react";
import { useParams, Outlet } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { columnDef } from "../../../table/Tables/Columns/AdminHodColumn.jsx";
import "../../../table/table.css";
import DownloadBtn from "../../../table/DownloadBtn.jsx";
import DebouncedInput from "../../../table/DebouncedInput.jsx";
import { SearchIcon, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Checkbox } from "@/components/ui/checkbox.jsx";
import DrawerComponent from "../../../Forms/AddEntry/DrawerComponent.jsx";
import DeleteDialog from "../../../table/DeleteDialog.jsx";
import LoadingPage from "@/pages/LoadingPage.jsx";
import axios from "axios";
import AdminHOD1Appraisal from "../../../table/Tables/Admin/AdminHOD1Appraisal.jsx";

function HODAppraisal() {
  const { id } = useParams();
  // console.log(id);
  const [data, setData] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToEdit, setRowToEdit] = useState(null);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedHOD, setSelectedHOD] = useState(null);

  // const [eventData, setEventData] = useState("");
  // useEffect(() => {
  //   const fetchTeacherInfo = async () => {
  //     try {
  //       const token = sessionStorage.getItem("teacherAccessToken");

  //       const response = await axios.get(
  //         `http://localhost:6005/api/v1/event/events`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       console.log("EVENT DATA Is", response.data.data.events);
  //       setData(response.data.data.events);
  //     } catch (error) {
  //       console.log("An error occurred while fetching teacher info.");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchTeacherInfo();
  // }, []);

  const sampleHodData = [
    {
      id: 1,
      name: "Dr. John Doe",
      department: "Computer Science",
      points: 85,
      lastUpdated: "2024-12-01",
    },
    {
      id: 2,
      name: "Dr. Jane Smith",
      department: "Electrical Engineering",
      points: 92,
      lastUpdated: "2024-12-05",
    },
    {
      id: 3,
      name: "Dr. Mark Johnson",
      department: "Mechanical Engineering",
      points: 76,
      lastUpdated: "2024-11-28",
    },
  ];

  const columns = useMemo(() => {
    return columnDef.map((col) => {
      if (col.accessorKey === "actions") {
        return {
          ...col,
          cell: ({ row }) => (
            <div>
              <Button
                onClick={() => {
                  setSelectedHOD(row.original.id);
                }}
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
              >
                View Appraisal Report
              </Button>
            </div>
          ),
        };
      }
      return col;
    });
  }, []);

  const renderAppraisalReport = () => {
    switch (selectedHOD) {
      case 1:
        return <AdminHOD1Appraisal onClose={() => setSelectedHOD(null)} />;
      case 2:
        return <AppraisalReport2 onClose={() => setSelectedHOD(null)} />;
      case 3:
        return <AppraisalReport3 onClose={() => setSelectedHOD(null)} />;
      default:
        return null;
    }
  };
  useEffect(() => {
    if (selectedHOD) {
      renderAppraisalReport();
    }
  }, [selectedHOD]);

  const table = useReactTable({
    data: sampleHodData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // Add filtering
    state: {
      sorting,
      globalFilter,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
  });

  const resetFilters = () => {
    setGlobalFilter("");
    setSorting([]);
    table.resetColumnFilters(); // Reset column filters
    table.resetColumnVisibility();
  };

  const handleAddEntry = (newData) => {
    setData((prevData) => [...prevData, { ...newData, id: Date.now() }]);
  };

  const handleEditEntry = (updatedData) => {
    setData((prevData) =>
      prevData.map((row) => (row._id === updatedData._id ? updatedData : row))
    );
  };

  const handleDeleteRow = async () => {
    try {
      console.log(rowToDelete);
      const token = sessionStorage.getItem("teacherAccessToken");

      await axios.delete(
        `http://localhost:6005/api/v1/event/events/${rowToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Remove the deleted item from the local state
      setData((prevData) =>
        prevData.filter((row) => row._id !== rowToDelete._id)
      );

      setDeleteDialogOpen(false);
      setRowToDelete(null);
    } catch (error) {
      console.error("Failed to delete Event Data:", error);
    }
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-2">
          <SearchIcon className="text-gray-400" />
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            className="p-2 bg-transparent outline-none border-b-2 w-64 focus:w-96 duration-300 border-gray-300 focus:border-blue-500"
            placeholder="Search all columns..."
          />
        </div>
        <DownloadBtn data={data} fileName="Research" />
      </div>

      <div className="flex justify-end mb-4">
        <Button onClick={() => setDrawerOpen(true)} className="add-entry-btn">
          Add Entry
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {table.getAllLeafColumns().map((column) => (
          <div key={column.id} className="flex items-center">
            <Checkbox
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
              id={column.id}
            />
            <label htmlFor={column.id} className="ml-2 text-sm font-medium">
              {column.id}
            </label>
          </div>
        ))}
        <Button
          onClick={resetFilters}
          variant="outline"
          size="sm"
          className="ml-2"
        >
          Reset Filters
        </Button>
      </div>

      <div className="table-container">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-2">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {/* Render filter element if available */}
                    {header.column.columnDef.filterElement && (
                      <div className="mt-2">
                        {flexRender(
                          header.column.columnDef.filterElement,
                          header.getContext()
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DrawerComponent
        isOpen={isDrawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setRowToEdit(null);
        }}
        onSubmit={async (formData) => {
          console.log(formData);
          const token = sessionStorage.getItem("teacherAccessToken");

          try {
            if (rowToEdit) {
              console.log("editing  the data", formData);

              const response = await axios.patch(
                `http://localhost:6005/api/v1/event/events/${rowToEdit._id}`,
                formData,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }
              );
              console.log(response.data.data);
              handleEditEntry(response.data.data);
            } else {
              // Add (POST Request)
              console.log("posting the data", formData);
              const response = await axios.post(
                `http://localhost:6005/api/v1/event/events`,
                formData,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application.json",
                  },
                }
              );
              console.log(response.data.data);
              handleAddEntry(response.data.data);
            }
          } catch (error) {
            console.error("Failed to submit Event data:", error);
          }

          setDrawerOpen(false);
        }}
        columns={columns}
        rowData={rowToEdit}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteRow}
        rowData={rowToDelete}
      />

      <div className="flex items-center justify-end mt-4 gap-2">
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

// "use client";

// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { cn } from "@/lib/utils";

// // Sample HOD Data
// const sampleHodData = [
//   {
//     id: 1,
//     name: "Dr. John Doe",
//     department: "Computer Science",
//     totalPoints: 85,
//     lastUpdated: "2024-12-01",
//   },
//   {
//     id: 2,
//     name: "Dr. Jane Smith",
//     department: "Electrical Engineering",
//     totalPoints: 92,
//     lastUpdated: "2024-12-05",
//   },
//   {
//     id: 3,
//     name: "Dr. Mark Johnson",
//     department: "Mechanical Engineering",
//     totalPoints: 76,
//     lastUpdated: "2024-11-28",
//   },
// ];

// const HODAppraisal = () => {
//   const [searchTerm, setSearchTerm] = useState("");

//   const filteredHodData = sampleHodData.filter(
//     (hod) =>
//       hod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       hod.department.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="container mx-auto p-8 bg-white rounded-lg shadow-lg mt-10">
//       <h1 className="text-3xl font-semibold text-center text-primary mb-6">
//         HOD Appraisal Reports
//       </h1>

//       <div className="flex justify-between items-center mb-4">
//         <div>
//           <Label htmlFor="search" className="text-sm font-medium">
//             Search HODs
//           </Label>
//           <Input
//             id="search"
//             type="text"
//             placeholder="Search by name or department..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-80 mt-1"
//           />
//         </div>
//         <Button className="ml-4">Export Data</Button>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Name
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Department
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Total Points
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Last Updated
//               </th>
//               <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {filteredHodData.map((hod) => (
//               <tr key={hod.id}>
//                 <td className="px-6 py-4 whitespace-nowrap">{hod.name}</td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   {hod.department}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   {hod.totalPoints}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   {hod.lastUpdated}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-center">
//                   <Button variant="secondary" size="sm" className="mr-2">
//                     View Details
//                   </Button>
//                   <Button variant="destructive" size="sm">
//                     Delete
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {filteredHodData.length === 0 && (
//         <div className="text-center text-gray-500 mt-4">
//           No HODs match your search criteria.
//         </div>
//       )}
//     </div>
//   );
// };

export default HODAppraisal;
