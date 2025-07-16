import express from 'express';
import { EmployeeService } from '../services/employeeService';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const employees = await EmployeeService.getAllEmployees();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'خطأ في جلب بيانات الموظفين' });
  }
});

router.post('/', async (req, res) => {
  try {
    const employee = await EmployeeService.addEmployee(req.body);
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ error: 'خطأ في إضافة الموظف' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const employee = await EmployeeService.updateEmployee(parseInt(req.params.id), req.body);
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: 'خطأ في تحديث بيانات الموظف' });
  }
});

router.post('/:id/attendance', async (req, res) => {
  try {
    const { status, date } = req.body;
    const success = await EmployeeService.markAttendance(parseInt(req.params.id), status, date);
    res.json({ success });
  } catch (error) {
    res.status(500).json({ error: 'خطأ في تسجيل الحضور' });
  }
});

router.post('/:id/transactions', async (req, res) => {
  try {
    const transaction = await EmployeeService.addFinancialTransaction({
      employee_id: parseInt(req.params.id),
      ...req.body
    });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'خطأ في إضافة المعاملة المالية' });
  }
});

router.post('/:id/settle', async (req, res) => {
  try {
    const success = await EmployeeService.settleEmployeeAccount(parseInt(req.params.id));
    res.json({ success });
  } catch (error) {
    res.status(500).json({ error: 'خطأ في تسوية الحساب' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const success = await EmployeeService.deleteEmployee(parseInt(req.params.id));
    res.json({ success });
  } catch (error) {
    res.status(500).json({ error: 'خطأ في حذف الموظف' });
  }
});

export default router;
