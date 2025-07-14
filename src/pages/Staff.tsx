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
  AlertCircle
} from "lucide-react";

const staff = [
  {
    id: 1,
    name: "أحمد الحلاق",
    position: "كبير الحلاقين",
    phone: "05x-xxx-xxxx",
    salary: 3500,
    deductions: 200,
    netSalary: 3300,
    attendance: 22,
    status: "present"
  },
  {
    id: 2,
    name: "محمد الأسطى",
    position: "حلاق أول",
    phone: "05x-xxx-xxxx",
    salary: 3000,
    deductions: 0,
    netSalary: 3000,
    attendance: 24,
    status: "present"
  },
  {
    id: 3,
    name: "يوسف المساعد",
    position: "مساعد حلاق",
    phone: "05x-xxx-xxxx",
    salary: 2200,
    deductions: 100,
    netSalary: 2100,
    attendance: 20,
    status: "absent"
  },
  {
    id: 4,
    name: "كريم الكاشير",
    position: "موظف استقبال",
    phone: "05x-xxx-xxxx",
    salary: 2500,
    deductions: 0,
    netSalary: 2500,
    attendance: 23,
    status: "present"
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

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full lg:w-auto">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">المرتب الأساسي</div>
                      <div className="font-bold">₪{employee.salary}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">الخصومات</div>
                      <div className="font-bold text-destructive">
                        {employee.deductions > 0 ? `-₪${employee.deductions}` : '₪0'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">صافي المرتب</div>
                      <div className="font-bold text-success">₪{employee.netSalary}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">أيام الحضور</div>
                      <div className="font-bold">{employee.attendance}/24</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
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
                    <Button variant="outline" size="sm">
                      تفاصيل
                    </Button>
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
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">موظف نشط</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                إجمالي المرتبات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₪20,800</div>
              <p className="text-xs text-muted-foreground">هذا الشهر</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                الخصومات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">₪300</div>
              <p className="text-xs text-muted-foreground">هذا الشهر</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                متوسط الحضور
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">92%</div>
              <p className="text-xs text-muted-foreground">هذا الشهر</p>
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