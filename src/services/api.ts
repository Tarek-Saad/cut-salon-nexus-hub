import { Employee } from '@/types/employee';

export interface FinancialTransaction {
  id: number;
  employee_id: number;
  transaction_type: 'payment' | 'deduction' | 'bonus';
  amount: number;
  description: string;
  transaction_date: string;
}

export const apiAddTransaction = async (employeeId: number, transaction: Omit<FinancialTransaction, 'id' | 'employee_id'>) => {
  // TODO: Implement actual API call
  console.log('Adding transaction:', { employeeId, transaction });
};

export const apiMarkAttendance = async (employeeId: number, status: 'present' | 'absent') => {
  // TODO: Implement actual API call
  console.log('Marking attendance:', { employeeId, status });
};

export const apiSettleAccount = async (employeeId: number) => {
  // TODO: Implement actual API call
  console.log('Settling account:', { employeeId });
};
