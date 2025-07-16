import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import {
  UserCheck,
  Plus,
  Phone,
  Calendar,
  DollarSign,
  Clock,
  AlertCircle,
  Wallet,
  TrendingUp,
  Minus,
  CheckCircle,
  UserPlus,
  XCircle
} from "lucide-react";

import { useEmployees } from '@/hooks/useEmployees';
import { Employee } from '@/types/employee';
import { apiAddTransaction, apiMarkAttendance, apiSettleAccount } from '@/services/api';

const StaffManagement = () => {
  const {
    employees,
    loading,
    error,
    addEmployee: apiAddEmployee,
    markAttendance: apiMarkAttendance,
    addTransaction: apiAddTransaction,
    settleAccount: apiSettleAccount
  } = useEmployees();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDeductionModal, setShowDeductionModal] = useState(false);
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  // Modal form states
  const [paymentAmount, setPaymentAmount] = useState('');
  const [deductionAmount, setDeductionAmount] = useState('');
  const [deductionReason, setDeductionReason] = useState('');
  const [bonusAmount, setBonusAmount] = useState('');
  const [bonusReason, setBonusReason] = useState('');

  // === الدوال المستقلة للعمليات الحسابية ===
  const totalDailyWages = employees?.reduce((sum, emp) => sum + emp.daily_wage, 0) || 0;

  const totalWithdrawals = employees?.reduce((sum, emp) => sum + emp.today_withdrawals, 0) || 0;

  const totalBalance = employees?.reduce((sum, emp) => sum + emp.current_balance, 0) || 0;

  const totalBonuses = employees?.reduce((sum, emp) => sum + (emp.total_bonuses || 0), 0) || 0;

  const totalDeductions = employees?.reduce((sum, emp) => sum + (emp.total_deductions || 0), 0) || 0;

  const presentCount = employees?.filter(emp => emp.today_attendance === 'present').length || 0;

  // === وظائف الأزرار ===
  const handlePayment = async (employeeId: number, amount: number) => {
    try {
      await apiAddTransaction(employeeId, {
        transaction_type: 'payment',
        amount,
        description: 'Daily wage payment',
        transaction_date: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  const handleAddEmployee = async (employeeData: Omit<Employee, 'id'>) => {
    try {
      await apiAddEmployee(employeeData);
      setShowAddEmployeeModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeduction = async (employeeId: number, amount: number, reason: string) => {
    try {
      await apiAddTransaction(employeeId, {
        transaction_type: 'deduction',
        amount,
        description: reason,
        transaction_date: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error processing deduction:', error);
    }
  };

  const handleBonus = async (employeeId: number, amount: number, reason: string) => {
    try {
      await apiAddTransaction(employeeId, {
        transaction_type: 'bonus',
        amount,
        description: reason,
        transaction_date: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error processing bonus:', error);
    }
  };

  const handleSettlement = async (employeeId: number) => {
    try {
      await apiSettleAccount(employeeId);
    } catch (error) {
      console.error('Error settling account:', error);
    }
  };

  // === وظائف المودال ===
  const submitPayment = () => {
    if (!selectedEmployee || !paymentAmount) return;

    const amount = parseFloat(paymentAmount);
    // setStaff(prev => prev.map(emp =>
    //   emp.id === selectedEmployee.id
    //     ? {
    //       ...emp,
    //       todayWithdrawals: emp.todayWithdrawals + amount,
    //       currentBalance: emp.currentBalance - amount
    //     }
    //     : emp
    // ));

    setPaymentAmount('');
    setShowPaymentModal(false);
    setSelectedEmployee(null);
  };

  const handleSubmitDeduction = async () => {
    if (!selectedEmployee || !deductionAmount || !deductionReason) return;
    await handleDeduction(selectedEmployee.id, Number(deductionAmount), deductionReason);
    setDeductionAmount('');
    setDeductionReason('');
    setShowDeductionModal(false);
    setSelectedEmployee(null);
  };

  const handleSubmitBonus = async () => {
    if (!selectedEmployee || !bonusAmount || !bonusReason) return;
    await handleBonus(selectedEmployee.id, Number(bonusAmount), bonusReason);
    setBonusAmount('');
    setBonusReason('');
    setShowBonusModal(false);
    setSelectedEmployee(null);
  };

  // === تسجيل الحضور ===
  const handleMarkAttendance = async (employeeId: number, status: 'present' | 'absent') => {
    try {
      await apiMarkAttendance(employeeId, status);
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">إدارة الموظفين</h1>
            <p className="text-gray-600">مرتبات، خصومات، وحضور الموظفين</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowAttendanceModal(true)}
              variant="outline"
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
            >
              <Clock className="h-4 w-4 mr-2" />
              تسجيل الحضور
            </Button>
            <Button
              onClick={() => setShowAddEmployeeModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              موظف جديد
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <UserCheck className="h-4 w-4 mr-2" />
                الموظفين الحاضرين
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{presentCount}</div>
              <p className="text-xs text-gray-500">من {employees?.length || 0} موظف</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                إجمالي الأجور
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{totalDailyWages} ج.م</div>
              <p className="text-xs text-gray-500">اليومية</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Wallet className="h-4 w-4 mr-2" />
                السحوبات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{totalWithdrawals} ج.م</div>
              <p className="text-xs text-gray-500">اليوم</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                البونص
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{totalBonuses} ج.م</div>
              <p className="text-xs text-gray-500">إجمالي</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                المستحقات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{totalBalance} ج.م</div>
              <p className="text-xs text-gray-500">الرصيد الحالي</p>
            </CardContent>
          </Card>
        </div>

        {/* Staff List */}
        <div className="grid gap-4">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : employees?.map((employee) => (
            <Card key={employee.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserCheck className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{employee.name}</h3>
                      <p className="text-sm text-gray-600">{employee.position}</p>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Phone className="h-4 w-4 mr-1" />
                        {employee.phone}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 w-full lg:w-auto">
                    <div className="text-center">
                      <div className="text-sm text-gray-500">أجر اليوم</div>
                      <div className="font-bold text-blue-600">{employee.daily_wage} ج.م</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500">السحوبات</div>
                      <div className="font-bold text-orange-600">
                        {employee.today_withdrawals > 0 ? `-${employee.today_withdrawals}` : '0'} ج.م
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500">البونص</div>
                      <div className="font-bold text-green-600">+{employee.total_bonuses} ج.م</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500">الخصومات</div>
                      <div className="font-bold text-red-600">
                        {employee.total_deductions > 0 ? `-${employee.total_deductions}` : '0'} ج.م
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500">الرصيد الحالي</div>
                      <div className="font-bold text-lg text-purple-600">{employee.current_balance} ج.م</div>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row items-center space-y-2 lg:space-y-0 lg:space-x-3 rtl:space-x-reverse">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Badge
                        variant={employee.today_attendance === 'present' ? 'default' : 'destructive'}
                        className={
                          employee.today_attendance === 'present'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }
                      >
                        {employee.today_attendance === 'present' ? 'حاضر' : 'غائب'}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          employee.payment_status === 'paid'
                            ? 'bg-blue-100 text-blue-800 border-blue-200'
                            : employee.payment_status === 'deferred'
                              ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                              : 'bg-gray-100 text-gray-800 border-gray-200'
                        }
                      >
                        {employee.payment_status === 'paid' ? 'مدفوع' :
                          employee.payment_status === 'deferred' ? 'مؤجل' : 'معلق'}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedEmployee(employee);
                          setShowPaymentModal(true);
                        }}
                        className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                      >
                        <Wallet className="h-4 w-4 mr-1" />
                        بونص
                      </Button>
                      {employee.current_balance > 0 && (
                        <Button
                          size="sm"
                          onClick={() => handleSettlement(employee.id)}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          تسوية
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Payment Modal */}
        <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>إعطاء فلوس - {selectedEmployee?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="payment-amount">المبلغ (ج.م)</Label>
                <Input
                  id="payment-amount"
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="أدخل المبلغ"
                />
              </div>
              <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
                  إلغاء
                </Button>
                <Button onClick={() => {
                  if (selectedEmployee && paymentAmount) {
                    handlePayment(selectedEmployee.id, Number(paymentAmount));
                    setShowPaymentModal(false);
                    setPaymentAmount('');
                  }
                }} className="bg-green-600 hover:bg-green-700">
                  تأكيد الدفع
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Deduction Modal */}
        <Dialog open={showDeductionModal} onOpenChange={setShowDeductionModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>خصم - {selectedEmployee?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="deduction-amount">المبلغ (ج.م)</Label>
                <Input
                  id="deduction-amount"
                  type="number"
                  value={deductionAmount}
                  onChange={(e) => setDeductionAmount(e.target.value)}
                  placeholder="أدخل مبلغ الخصم"
                />
              </div>
              <div>
                <Label htmlFor="deduction-reason">سبب الخصم</Label>
                <Input
                  id="deduction-reason"
                  value={deductionReason}
                  onChange={(e) => setDeductionReason(e.target.value)}
                  placeholder="سبب الخصم"
                />
              </div>
              <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                <Button variant="outline" onClick={() => setShowDeductionModal(false)}>
                  إلغاء
                </Button>
                <Button onClick={() => {
                  if (selectedEmployee && deductionAmount && deductionReason) {
                    handleDeduction(selectedEmployee.id, Number(deductionAmount), deductionReason);
                    setShowDeductionModal(false);
                    setDeductionAmount('');
                    setDeductionReason('');
                  }
                }} className="bg-red-600 hover:bg-red-700">
                  تأكيد الخصم
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Bonus Modal */}
        <Dialog open={showBonusModal} onOpenChange={setShowBonusModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>بونص - {selectedEmployee?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bonus-amount">المبلغ (ج.م)</Label>
                <Input
                  id="bonus-amount"
                  type="number"
                  value={bonusAmount}
                  onChange={(e) => setBonusAmount(e.target.value)}
                  placeholder="أدخل مبلغ البونص"
                />
              </div>
              <div>
                <Label htmlFor="bonus-reason">سبب البونص</Label>
                <Input
                  id="bonus-reason"
                  value={bonusReason}
                  onChange={(e) => setBonusReason(e.target.value)}
                  placeholder="سبب البونص"
                />
              </div>
              <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                <Button variant="outline" onClick={() => setShowBonusModal(false)}>
                  إلغاء
                </Button>
                <Button onClick={() => {
                  if (selectedEmployee && bonusAmount && bonusReason) {
                    handleBonus(selectedEmployee.id, Number(bonusAmount), bonusReason);
                    setShowBonusModal(false);
                    setBonusAmount('');
                    setBonusReason('');
                  }
                }} className="bg-blue-600 hover:bg-blue-700">
                  تأكيد البونص
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Attendance Modal */}
        <Dialog open={showAttendanceModal} onOpenChange={setShowAttendanceModal}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>تسجيل الحضور - {new Date().toLocaleDateString('ar-EG')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {employees?.map((employee) => (
                <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserCheck className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-sm text-gray-500">{employee.position}</div>
                    </div>
                  </div>
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Button
                      size="sm"
                      variant={employee.today_attendance === 'present' ? 'default' : 'outline'}
                      onClick={() => handleMarkAttendance(employee.id, 'present')}
                      className={employee.today_attendance === 'present' ? 'bg-green-600 hover:bg-green-700' : ''}
                    >
                      حاضر
                    </Button>
                    <Button
                      size="sm"
                      variant={employee.today_attendance === 'absent' ? 'default' : 'outline'}
                      onClick={() => handleMarkAttendance(employee.id, 'absent')}
                      className={employee.today_attendance === 'absent' ? 'bg-red-600 hover:bg-red-700' : ''}
                    >
                      غائب
                    </Button>
                  </div>
                </div>
              ))}
              <div className="flex justify-end">
                <Button onClick={() => setShowAttendanceModal(false)}>
                  إغلاق
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default StaffManagement;