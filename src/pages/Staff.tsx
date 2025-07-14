import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  CheckCircle
} from "lucide-react";

const staff = [
  {
    id: 1,
    name: "أحمد الحلاق",
    position: "صنايعي",
    phone: "05x-xxx-xxxx",
    dailyWage: 300,
    todayWithdrawals: 150,
    bonuses: 50,
    deductions: 20,
    currentBalance: 180, // dailyWage + bonuses - withdrawals - deductions
    isPaidToday: false,
    paymentStatus: "pending", // pending, paid, deferred
    status: "present",
    lastPayment: "2024-01-13"
  },
  {
    id: 2,
    name: "محمد الأسطى",
    position: "صنايعي",
    phone: "05x-xxx-xxxx",
    dailyWage: 300,
    todayWithdrawals: 100,
    bonuses: 0,
    deductions: 0,
    currentBalance: 200,
    isPaidToday: false,
    paymentStatus: "pending",
    status: "present",
    lastPayment: "2024-01-13"
  },
  {
    id: 3,
    name: "يوسف المساعد",
    position: "مساعد",
    phone: "05x-xxx-xxxx",
    dailyWage: 120,
    todayWithdrawals: 50,
    bonuses: 20,
    deductions: 10,
    currentBalance: 80,
    isPaidToday: true,
    paymentStatus: "paid",
    status: "present",
    lastPayment: "2024-01-14"
  },
  {
    id: 4,
    name: "كريم الكاشير",
    position: "مساعد",
    phone: "05x-xxx-xxxx",
    dailyWage: 120,
    todayWithdrawals: 0,
    bonuses: 0,
    deductions: 0,
    currentBalance: 120,
    isPaidToday: false,
    paymentStatus: "deferred",
    status: "present",
    lastPayment: "2024-01-12"
  }
];

const Staff = () => {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">إدارة الموظفين</h1>
            <p className="text-muted-foreground">مرتبات، خصومات، وحضور الموظفين</p>
          </div>
          <Button className="bg-primary hover:bg-primary-glow text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" />
            موظف جديد
          </Button>
        </div>

        {/* Staff List */}
        <div className="grid gap-4">
          {staff.map((employee) => (
            <Card key={employee.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <UserCheck className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{employee.name}</h3>
                      <p className="text-sm text-muted-foreground">{employee.position}</p>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Phone className="h-4 w-4 mr-1" />
                        {employee.phone}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 w-full lg:w-auto">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">أجر اليوم</div>
                      <div className="font-bold text-primary">{employee.dailyWage} ج.م</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">السحوبات</div>
                      <div className="font-bold text-warning">
                        {employee.todayWithdrawals > 0 ? `-${employee.todayWithdrawals}` : '0'} ج.م
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">البونص</div>
                      <div className="font-bold text-success">+{employee.bonuses} ج.م</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">الخصومات</div>
                      <div className="font-bold text-destructive">
                        {employee.deductions > 0 ? `-${employee.deductions}` : '0'} ج.م
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">الرصيد الحالي</div>
                      <div className="font-bold text-lg text-success">{employee.currentBalance} ج.م</div>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row items-center space-y-2 lg:space-y-0 lg:space-x-3 rtl:space-x-reverse">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Badge 
                        variant={employee.status === 'present' ? 'default' : 'destructive'}
                        className={
                          employee.status === 'present' 
                            ? 'bg-success text-success-foreground' 
                            : ''
                        }
                      >
                        {employee.status === 'present' ? 'حاضر' : 'غائب'}
                      </Badge>
                      <Badge 
                        variant={employee.paymentStatus === 'paid' ? 'default' : 'outline'}
                        className={
                          employee.paymentStatus === 'paid' 
                            ? 'bg-primary text-primary-foreground' 
                            : employee.paymentStatus === 'deferred'
                            ? 'bg-warning text-warning-foreground'
                            : 'bg-muted'
                        }
                      >
                        {employee.paymentStatus === 'paid' ? 'مدفوع' : 
                         employee.paymentStatus === 'deferred' ? 'مؤجل' : 'معلق'}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Button variant="outline" size="sm">
                        <Wallet className="h-4 w-4 mr-1" />
                        إعطاء فلوس
                      </Button>
                      <Button variant="outline" size="sm">
                        <Minus className="h-4 w-4 mr-1" />
                        خصم
                      </Button>
                      <Button variant="outline" size="sm">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        بونص
                      </Button>
                      {employee.currentBalance > 0 && (
                        <Button variant="default" size="sm" className="bg-success hover:bg-success/90">
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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <UserCheck className="h-4 w-4 mr-2" />
                إجمالي الموظفين
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{staff.length}</div>
              <p className="text-xs text-muted-foreground">موظف نشط</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                إجمالي الأجور اليومية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{staff.reduce((sum, emp) => sum + emp.dailyWage, 0)} ج.م</div>
              <p className="text-xs text-muted-foreground">اليوم</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Wallet className="h-4 w-4 mr-2" />
                إجمالي السحوبات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{staff.reduce((sum, emp) => sum + emp.todayWithdrawals, 0)} ج.م</div>
              <p className="text-xs text-muted-foreground">اليوم</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                إجمالي المستحقات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{staff.reduce((sum, emp) => sum + emp.currentBalance, 0)} ج.م</div>
              <p className="text-xs text-muted-foreground">الرصيد الحالي</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>إجراءات سريعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="p-4 h-auto flex-col">
                <Clock className="h-6 w-6 mb-2" />
                <span className="text-sm">تسجيل حضور</span>
              </Button>
              <Button variant="outline" className="p-4 h-auto flex-col">
                <DollarSign className="h-6 w-6 mb-2" />
                <span className="text-sm">حساب مرتب</span>
              </Button>
              <Button variant="outline" className="p-4 h-auto flex-col">
                <AlertCircle className="h-6 w-6 mb-2" />
                <span className="text-sm">إضافة خصم</span>
              </Button>
              <Button variant="outline" className="p-4 h-auto flex-col">
                <Calendar className="h-6 w-6 mb-2" />
                <span className="text-sm">تقرير الحضور</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Staff;