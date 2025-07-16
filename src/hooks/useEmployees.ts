import { useState, useEffect } from "react";
import {
  Employee,
  FinancialTransaction,
  CreateEmployeeDTO,
  CreateTransactionDTO,
  MarkAttendanceDTO,
} from "../types/employee";

// API Response type to match backend
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Configuration - change this to match your backend URL
  const API_BASE =
    process.env.NODE_ENV === "production"
      ? "/api/employees" // For production
      : "http://localhost:3001/api/employees"; // For development

  // Helper function to handle API responses
  const handleApiResponse = async <T>(response: Response): Promise<T> => {
    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      throw new Error(
        `خطأ في الخادم: ${response.status} ${response.statusText}`
      );
    }

    const result: ApiResponse<T> = await response.json();

    if (!result.success) {
      throw new Error(result.error || result.message || "حدث خطأ غير معروف");
    }

    return result.data as T;
  };

  // Helper function to handle errors
  const handleError = (err: unknown, defaultMessage: string) => {
    console.error(defaultMessage, err);

    if (err instanceof Error) {
      setError(err.message);
    } else if (typeof err === "string") {
      setError(err);
    } else {
      setError(defaultMessage);
    }
  };

  // Fetch all employees with enhanced error handling
  const fetchEmployees = async (searchParams?: {
    name?: string;
    position?: string;
    payment_status?: string;
    attendance_status?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      // Build query string if search params provided
      const queryParams = new URLSearchParams();
      if (searchParams) {
        Object.entries(searchParams).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });
      }

      const url = queryParams.toString()
        ? `${API_BASE}?${queryParams.toString()}`
        : API_BASE;

      console.log("🔍 Fetching employees from:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await handleApiResponse<Employee[]>(response);

      setEmployees(data || []);
      setLastUpdated(new Date().toISOString());

      console.log(`✅ Fetched ${data?.length || 0} employees successfully`);
    } catch (err) {
      handleError(err, "فشل في جلب بيانات الموظفين");
      setEmployees([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Add new employee
  const addEmployee = async (employeeData: CreateEmployeeDTO) => {
    try {
      setError(null);

      console.log("➕ Adding employee:", employeeData);

      const response = await fetch(API_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employeeData),
      });

      const newEmployee = await handleApiResponse<Employee>(response);

      console.log("✅ Employee added successfully:", newEmployee.name);

      // Refresh the list to get updated data
      await fetchEmployees();

      return newEmployee;
    } catch (err) {
      handleError(err, "فشل في إضافة الموظف");
      throw err; // Re-throw for component handling
    }
  };

  // Update employee
  const updateEmployee = async (
    employeeId: number,
    updates: Partial<Employee>
  ) => {
    try {
      setError(null);

      console.log(`📝 Updating employee ${employeeId}:`, updates);

      const response = await fetch(`${API_BASE}/${employeeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      const updatedEmployee = await handleApiResponse<Employee>(response);

      console.log("✅ Employee updated successfully");

      // Update local state
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === employeeId ? updatedEmployee : emp))
      );

      return updatedEmployee;
    } catch (err) {
      handleError(err, "فشل في تحديث بيانات الموظف");
      throw err;
    }
  };

  // Delete (deactivate) employee
  const deleteEmployee = async (employeeId: number) => {
    try {
      setError(null);

      console.log(`🗑️ Deleting employee ${employeeId}`);

      const response = await fetch(`${API_BASE}/${employeeId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      await handleApiResponse(response);

      console.log("✅ Employee deleted successfully");

      // Refresh the list
      await fetchEmployees();
    } catch (err) {
      handleError(err, "فشل في حذف الموظف");
      throw err;
    }
  };

  // Mark attendance with enhanced data
  const markAttendance = async (
    employeeId: number,
    attendanceData: MarkAttendanceDTO
  ) => {
    try {
      setError(null);

      console.log(
        `📅 Marking attendance for employee ${employeeId}:`,
        attendanceData
      );

      const response = await fetch(`${API_BASE}/${employeeId}/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(attendanceData),
      });

      const attendanceRecord = await handleApiResponse(response);

      console.log("✅ Attendance marked successfully");

      // Refresh employees to get updated attendance status
      await fetchEmployees();

      return attendanceRecord;
    } catch (err) {
      handleError(err, "فشل في تسجيل الحضور");
      throw err;
    }
  };

  // Simplified attendance marking (backward compatibility)
  const markAttendanceSimple = async (
    employeeId: number,
    status: "present" | "absent"
  ) => {
    return markAttendance(employeeId, { status });
  };

  // Add financial transaction
  const addTransaction = async (
    employeeId: number,
    transactionData: CreateTransactionDTO
  ) => {
    try {
      setError(null);

      console.log(
        `💰 Adding transaction for employee ${employeeId}:`,
        transactionData
      );

      const response = await fetch(`${API_BASE}/${employeeId}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      });

      const transaction = await handleApiResponse<FinancialTransaction>(
        response
      );

      console.log("✅ Transaction added successfully");

      // Refresh employees to get updated balances
      await fetchEmployees();

      return transaction;
    } catch (err) {
      handleError(err, "فشل في إضافة المعاملة المالية");
      throw err;
    }
  };

  // Get employee transactions
  const getEmployeeTransactions = async (
    employeeId: number,
    limit: number = 50
  ) => {
    try {
      setError(null);

      const response = await fetch(
        `${API_BASE}/${employeeId}/transactions?limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const transactions = await handleApiResponse<FinancialTransaction[]>(
        response
      );

      return transactions || [];
    } catch (err) {
      handleError(err, "فشل في جلب معاملات الموظف");
      return [];
    }
  };

  // Settle employee account
  const settleAccount = async (employeeId: number) => {
    try {
      setError(null);

      console.log(`💳 Settling account for employee ${employeeId}`);

      const response = await fetch(`${API_BASE}/${employeeId}/settle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      await handleApiResponse(response);

      console.log("✅ Account settled successfully");

      // Refresh employees to get updated status
      await fetchEmployees();
    } catch (err) {
      handleError(err, "فشل في تسوية الحساب");
      throw err;
    }
  };

  // Get employee summary/reports
  const getEmployeeSummary = async () => {
    try {
      setError(null);

      const response = await fetch(`${API_BASE}/reports/summary`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const summary = await handleApiResponse(response);

      return summary;
    } catch (err) {
      handleError(err, "فشل في جلب ملخص الموظفين");
      return null;
    }
  };

  // Get attendance report
  const getAttendanceReport = async (startDate: string, endDate: string) => {
    try {
      setError(null);

      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      });

      const response = await fetch(`${API_BASE}/reports/attendance?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const report = await handleApiResponse(response);

      return report || [];
    } catch (err) {
      handleError(err, "فشل في إنشاء تقرير الحضور");
      return [];
    }
  };

  // Test API connection
  const testConnection = async () => {
    try {
      const response = await fetch(`${API_BASE}/test`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await handleApiResponse(response);
      return result;
    } catch (err) {
      console.error("Connection test failed:", err);
      return false;
    }
  };

  // Refresh data manually
  const refreshData = () => {
    fetchEmployees();
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Initial load
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Auto-refresh every 5 minutes (optional)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        fetchEmployees();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [loading]);

  return {
    // Data
    employees,
    loading,
    error,
    lastUpdated,

    // Employee operations
    fetchEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    refreshData,

    // Attendance operations
    markAttendance,
    markAttendanceSimple, // For backward compatibility

    // Financial operations
    addTransaction,
    getEmployeeTransactions,
    settleAccount,

    // Reports
    getEmployeeSummary,
    getAttendanceReport,

    // Utilities
    testConnection,
    clearError,

    // Computed values
    totalEmployees: employees.length,
    presentEmployees: employees.filter(
      (emp) => emp.today_attendance === "present"
    ).length,
    totalDailyWages: employees.reduce((sum, emp) => sum + emp.daily_wage, 0),
    totalCurrentBalance: employees.reduce(
      (sum, emp) => sum + emp.current_balance,
      0
    ),
  };
};
