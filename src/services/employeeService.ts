import { pool } from "../lib/db";
import {
  Employee,
  FinancialTransaction,
  AttendanceRecord,
} from "../types/employee";

export class EmployeeService {
  static async getAllEmployees(): Promise<Employee[]> {
    const query = `
      SELECT 
        e.id,
        e.name,
        e.position,
        e.phone,
        e.daily_wage,
        e.current_balance,
        e.total_bonuses,
        e.total_deductions,
        e.payment_status,
        e.last_payment_date,
        a.status as today_attendance,
        COALESCE(w.today_withdrawals, 0) as today_withdrawals,
        COALESCE(b.today_bonuses, 0) as today_bonuses,
        COALESCE(d.today_deductions, 0) as today_deductions
      FROM employees e
      LEFT JOIN attendance a ON e.id = a.employee_id AND a.attendance_date = CURRENT_DATE
      LEFT JOIN (
        SELECT employee_id, SUM(amount) as today_withdrawals 
        FROM financial_transactions 
        WHERE transaction_type = 'withdrawal' AND transaction_date = CURRENT_DATE
        GROUP BY employee_id
      ) w ON e.id = w.employee_id
      LEFT JOIN (
        SELECT employee_id, SUM(amount) as today_bonuses
        FROM financial_transactions 
        WHERE transaction_type = 'bonus' AND transaction_date = CURRENT_DATE
        GROUP BY employee_id
      ) b ON e.id = b.employee_id
      LEFT JOIN (
        SELECT employee_id, SUM(amount) as today_deductions
        FROM financial_transactions 
        WHERE transaction_type = 'deduction' AND transaction_date = CURRENT_DATE
        GROUP BY employee_id
      ) d ON e.id = d.employee_id
      WHERE e.is_active = true
      ORDER BY e.name
    `;

    const result = await pool.query(query);
    return result.rows;
  }

  static async addEmployee(employee: Omit<Employee, "id">): Promise<Employee> {
    const query = `
      INSERT INTO employees (name, position, phone, daily_wage, current_balance)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [
      employee.name,
      employee.position,
      employee.phone,
      employee.daily_wage,
      employee.current_balance || 0,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async updateEmployee(
    id: number,
    updates: Partial<Employee>
  ): Promise<Employee> {
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(", ");

    const query = `
      UPDATE employees 
      SET ${setClause}
      WHERE id = $1
      RETURNING *
    `;

    const values = [id, ...Object.values(updates)];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async deleteEmployee(id: number): Promise<boolean> {
    const query = "UPDATE employees SET is_active = false WHERE id = $1";
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
  }

  static async markAttendance(
    employeeId: number,
    status: "present" | "absent",
    date?: string
  ): Promise<boolean> {
    const query = `
      INSERT INTO attendance (employee_id, attendance_date, status)
      VALUES ($1, $2, $3)
      ON CONFLICT (employee_id, attendance_date) 
      DO UPDATE SET status = EXCLUDED.status
    `;

    const attendanceDate = date || new Date().toISOString().split("T")[0];
    const result = await pool.query(query, [
      employeeId,
      attendanceDate,
      status,
    ]);
    return result.rowCount > 0;
  }

  static async addFinancialTransaction(
    transaction: Omit<FinancialTransaction, "id">
  ): Promise<FinancialTransaction> {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const transactionQuery = `
        INSERT INTO financial_transactions (employee_id, transaction_type, amount, description, transaction_date)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;

      const transactionValues = [
        transaction.employee_id,
        transaction.transaction_type,
        transaction.amount,
        transaction.description || null,
        transaction.transaction_date || new Date().toISOString().split("T")[0],
      ];

      const transactionResult = await client.query(
        transactionQuery,
        transactionValues
      );

      let balanceChange = 0;
      let bonusChange = 0;
      let deductionChange = 0;

      if (
        transaction.transaction_type === "payment" ||
        transaction.transaction_type === "deduction"
      ) {
        balanceChange = -transaction.amount;
        if (transaction.transaction_type === "deduction") {
          deductionChange = transaction.amount;
        }
      } else if (transaction.transaction_type === "bonus") {
        balanceChange = transaction.amount;
        bonusChange = transaction.amount;
      }

      const updateQuery = `
        UPDATE employees 
        SET current_balance = current_balance + $1,
            total_bonuses = total_bonuses + $2,
            total_deductions = total_deductions + $3
        WHERE id = $4
      `;

      await client.query(updateQuery, [
        balanceChange,
        bonusChange,
        deductionChange,
        transaction.employee_id,
      ]);

      await client.query("COMMIT");
      return transactionResult.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  static async settleEmployeeAccount(employeeId: number): Promise<boolean> {
    const query = `
      UPDATE employees 
      SET current_balance = 0,
          payment_status = 'paid',
          last_payment_date = CURRENT_DATE
      WHERE id = $1
    `;

    const result = await pool.query(query, [employeeId]);
    return result.rowCount > 0;
  }

  static async getAttendanceReport(
    startDate: string,
    endDate: string
  ): Promise<any[]> {
    const query = `
      SELECT 
        e.name,
        e.position,
        COUNT(CASE WHEN a.status = 'present' THEN 1 END) as present_days,
        COUNT(CASE WHEN a.status = 'absent' THEN 1 END) as absent_days,
        COUNT(a.id) as total_days
      FROM employees e
      LEFT JOIN attendance a ON e.id = a.employee_id 
        AND a.attendance_date BETWEEN $1 AND $2
      WHERE e.is_active = true
      GROUP BY e.id, e.name, e.position
      ORDER BY e.name
    `;

    const result = await pool.query(query, [startDate, endDate]);
    return result.rows;
  }

  static async getFinancialSummary(): Promise<any> {
    const query = `
      SELECT 
        COUNT(*) as total_employees,
        SUM(daily_wage) as total_daily_wages,
        SUM(current_balance) as total_current_balance,
        SUM(total_bonuses) as total_bonuses,
        SUM(total_deductions) as total_deductions,
        COUNT(CASE WHEN payment_status = 'paid' THEN 1 END) as paid_employees,
        COUNT(CASE WHEN payment_status = 'pending' THEN 1 END) as pending_employees
      FROM employees 
      WHERE is_active = true
    `;

    const result = await pool.query(query);
    return result.rows[0];
  }

  static async getTodayWithdrawals(): Promise<number> {
    const query = `
      SELECT COALESCE(SUM(amount), 0) as total
      FROM financial_transactions 
      WHERE transaction_type = 'withdrawal' 
      AND transaction_date = CURRENT_DATE
    `;

    const result = await pool.query(query);
    return parseFloat(result.rows[0].total);
  }
}
