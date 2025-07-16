export interface Employee {
  id: number;
  name: string;
  position: string;
  phone: string;
  daily_wage: number;
  current_balance: number;
  total_bonuses: number;
  total_deductions: number;
  payment_status: 'pending' | 'paid' | 'deferred';
  is_active: boolean;
  hire_date: string;
  last_payment_date: string;
  today_attendance: 'present' | 'absent';
  today_withdrawals: number;
  today_bonuses: number;
  today_deductions: number;
}

export interface FinancialTransaction {
  id: number;
  employee_id: number;
  transaction_type: 'payment' | 'deduction' | 'bonus';
  amount: number;
  description: string;
  transaction_date: string;
}

export interface AttendanceRecord {
  id: number;
  employee_id: number;
  attendance_date: string;
  status: 'present' | 'absent';
  check_in_time?: string;
  check_out_time?: string;
  notes?: string;
}
