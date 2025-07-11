import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { ChevronDown, ChevronRight, ChevronLeft, Search, Plus, Edit, Trash2, Download, Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DrawerComponent from "../../../Forms/AddEntry/DrawerComponent.jsx";
import DeleteDialog from "../../DeleteDialog.jsx";
import axios from "axios";
import { CSVLink } from "react-csv";

function ExpandedRowContent({ data }) {
  const fieldLabels = {
    TY: 'Type',
    T1: 'Title',
    A1: 'Authors',
    Y1: 'Year',
    PB: 'Publisher',
    JO: 'Journal',
    VL: 'Volume',
    IS: 'Issue',
    SP: 'Start Page',
    EP: 'End Page',
    SN: 'ISBN/ISSN',
    T2: 'Secondary Title',
    UR: 'URL'
  };

  const formatValue = (key, value) => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return value;
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {Object.entries(data)
        .filter(([key, value]) => value && value !== 'N/A')
        .map(([key, value]) => (
          <div key={key} className="flex flex-col">
            <Label className="font-medium">
              {fieldLabels[key] || key}
            </Label>
            <span className="text-sm">
              {formatValue(key, value)}
            </span>
          </div>
        ))}
    </div>
  );
}

export default function FacultyRefManResearchTable() {
  const [data, setData] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToEdit, setRowToEdit] = useState(null);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const fileInputRef = useRef(null);
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem("teacherAccessToken");
      const response = await axios.get(
        "http://localhost:6005/api/v1/research-paper/allPapers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.data.researchPapers);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleRefManUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          const parsedData = parseRefMan(content);
          console.log('Parsed Data:', parsedData); // For debugging
          setData(parsedData);
        } catch (error) {
          console.error('Error parsing RefMan file:', error);
          alert('Error parsing the RefMan file. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const parseRefMan = (content) => {
    const entries = content.split('ER  - ').filter(entry => entry.trim());
    
    return entries.map(entry => {
      const fields = {};
      const lines = entry.split('\n');
      
      lines.forEach(line => {
        const [key, ...valueParts] = line.split('  - ');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('  - ').trim();
          if (value) {
            if (fields[key.trim()]) {
              if (Array.isArray(fields[key.trim()])) {
                fields[key.trim()].push(value);
              } else {
                fields[key.trim()] = [fields[key.trim()], value];
              }
            } else {
              fields[key.trim()] = value;
            }
          }
        }
      });

      const authors = fields.A1 
        ? (Array.isArray(fields.A1) ? fields.A1 : [fields.A1]).join(', ')
        : 'N/A';

      return {
        title: fields.T1 || 'N/A',
        authors: authors,
        year: fields.Y1 || 'N/A',
        type: mapPublicationType(fields.TY || ''),
        viewUrl: fields.UR || '',
        allFields: fields
      };
    }).filter(entry => entry.title !== 'N/A' || entry.authors !== 'N/A');
  };

  const mapPublicationType = (type) => {
    const typeMap = {
      'BOOK': 'Book',
      'CHAP': 'Book Chapter',
      'JOUR': 'Journal Article',
      'PAT': 'Patent',
      'CONF': 'Conference Paper',
      'THES': 'Thesis',
      'RPRT': 'Report'
    };
    return typeMap[type.trim()] || 'Other';
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row, getValue }) => (
          <div
            className="cursor-pointer flex items-center gap-2"
            onClick={() => row.toggleExpanded()}
          >
            {row.getIsExpanded() ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <span className="font-medium">{getValue()}</span>
          </div>
        ),
      },
      {
        accessorKey: "authors",
        header: "Author(s)",
      },
      {
        accessorKey: "year",
        header: "Year",
      },
      {
        accessorKey: "type",
        header: "Type",
      },
      {
        accessorKey: "viewUrl",
        header: "View URL",
        cell: ({ getValue }) => {
          const url = getValue();
          return url ? (
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              View
            </a>
          ) : (
            <span className="text-gray-400">N/A</span>
          );
        },
      },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setRowToEdit(row.original);
                setDrawerOpen(true);
              }}
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => {
                setRowToDelete(row.original);
                setDeleteDialogOpen(true);
              }}
              className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination,
      expanded,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const searchValue = filterValue.toLowerCase();
      const value = row.getValue(columnId);
      return value?.toString().toLowerCase().includes(searchValue);
    },
  });

  const filteredRows = React.useMemo(() => {
    return table.getRowModel().rows.filter(row => {
      if (typeFilter === "all") return true;
      return row.original.type === typeFilter;
    });
  }, [table.getRowModel().rows, typeFilter]);

  const handleAddEntry = async (formData) => {
    try {
      const token = sessionStorage.getItem("teacherAccessToken");
      const response = await axios.post(
        "http://localhost:6005/api/v1/research-paper/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setData((prevData) => [...prevData, response.data.data]);
      setDrawerOpen(false);
    } catch (error) {
      console.error("Error adding entry:", error);
    }
  };

  const handleEditEntry = async (formData) => {
    try {
      const token = sessionStorage.getItem("teacherAccessToken");
      const response = await axios.patch(
        `http://localhost:6005/api/v1/research-paper/update/${rowToEdit._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setData((prevData) =>
        prevData.map((item) =>
          item._id === response.data.data._id ? response.data.data : item
        )
      );
      setDrawerOpen(false);
      setRowToEdit(null);
    } catch (error) {
      console.error("Error editing entry:", error);
    }
  };

  const handleDeleteEntry = async () => {
    try {
      const token = sessionStorage.getItem("teacherAccessToken");
      await axios.delete(
        `http://localhost:6005/api/v1/research-paper/delete/${rowToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData((prevData) => prevData.filter((item) => item._id !== rowToDelete._id));
      setDeleteDialogOpen(false);
      setRowToDelete(null);
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  const csvData = useMemo(() => {
    return data.map(item => ({
      Title: item.title,
      Authors: item.authors,
      Year: item.year,
      Type: item.type,
      ViewURL: item.viewUrl,
    }));
  }, [data]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Research Papers</h2>

      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-xs"
            placeholder="Search all columns..."
            leftIcon={<Search className="h-4 w-4 text-gray-400" />}
          />
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="type-filter">Filter by Type:</Label>
          <Select
            value={typeFilter}
            onValueChange={setTypeFilter}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Book">Book</SelectItem>
              <SelectItem value="Book Chapter">Book Chapter</SelectItem>
              <SelectItem value="Journal Article">Journal Article</SelectItem>
              <SelectItem value="Patent">Patent</SelectItem>
              <SelectItem value="Conference Paper">Conference Paper</SelectItem>
              <SelectItem value="Thesis">Thesis</SelectItem>
              <SelectItem value="Report">Report</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept=".ris"
            onChange={handleRefManUpload}
            className="hidden"
            ref={fileInputRef}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Upload className="h-4 w-4 mr-2" /> Upload RefMan
          </Button>
          {uploadedFileName && (
            <span className="text-sm text-gray-600">
              Uploaded: {uploadedFileName}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setDrawerOpen(true)} className="bg-green-500 hover:bg-green-600">
            <Plus className="h-4 w-4 mr-2" /> Add Entry
          </Button>
          <CSVLink
            data={csvData}
            filename={"research_papers.csv"}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
          >
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </CSVLink>
        </div>
      </div>

      {data.length > 0 ? (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
          <table className="w-full table-auto">
            <thead className="bg-gray-50 border-b border-gray-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-sm font-medium text-gray-700"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-2">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getIsSorted() && (
                          <ChevronDown className={`h-4 w-4 ${header.column.getIsSorted() === "desc" ? "transform rotate-180" : ""}`} />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <React.Fragment key={row.id}>
                  <tr className="hover:bg-gray-50 border-b border-gray-200">
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-6 py-3 text-sm text-gray-700"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                  {row.getIsExpanded() && (
                    <tr>
                      <td colSpan={columns.length} className="bg-gray-50 border-b">
                        <ExpandedRowContent data={row.original.allFields} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          No data available. Please upload a RefMan file or add entries.
        </div>
      )}

      {data.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {Math.ceil(filteredRows.length / table.getState().pagination.pageSize)}
              </strong>
            </span>
            <Button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  Show {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <DrawerComponent
        isOpen={isDrawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setRowToEdit(null);
        }}
        onSubmit={rowToEdit ? handleEditEntry : handleAddEntry}
        columns={columns}
        rowData={rowToEdit}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteEntry}
      />
    </div>
  );
}

