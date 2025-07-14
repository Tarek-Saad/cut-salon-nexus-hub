import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Plus, 
  Calendar,
  Receipt,
  AlertTriangle,
  TrendingDown
} from "lucide-react";

const expenses = [
  { id: 1, date: "2024-01-15", description: "شامبو وبلسم", category: "مستلزمات", amount: 150, vendor: "شركة التوريدات" },
  { id: 2, date: "2024-01-15", description: "فاتورة الكهرباء", category: "فواتير", amount: 450, vendor: "شركة الكهرباء" },
  { id: 3, date: "2024-01-14", description: "معدات حلاقة", category: "أدوات", amount: 320, vendor: "متجر الأدوات" },
  { id: 4, date: "2024-01-14", description: "تنظيف الصالون", category: "صيانة", amount: 200, vendor: "شركة التنظيف" },
  { id: 5, date: "2024-01-13", description: "صبغات شعر", category: "مستلزمات", amount: 280, vendor: "شركة التوريدات" },
];

const categories = [
  { name: "مستلزمات", amount: 1250, percentage: 35, color: "bg-blue-500" },
  { name: "فواتير", amount: 980, percentage: 28, color: "bg-red-500" },
  { name: "أدوات", amount: 750, percentage: 21, color: "bg-green-500" },
  { name: "صيانة", amount: 560, percentage: 16, color: "bg-yellow-500" },
];

const Expenses = () => {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">إدارة المصروفات</h1>
            <p className="text-muted-foreground">مصروفات شراء البضائع ومصروفات الصالون</p>
          </div>
          <Button className="bg-warning hover:bg-warning/90 text-warning-foreground">
            <Plus className="h-4 w-4 mr-2" />
            مصروف جديد
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <ShoppingCart className="h-4 w-4 mr-2 text-warning" />
                مصروفات اليوم
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">₪600</div>
              <p className="text-xs text-warning/80">4 مصروفات</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Receipt className="h-4 w-4 mr-2 text-destructive" />
                مصروفات الشهر
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">₪8,450</div>
              <p className="text-xs text-destructive/80">-5% عن الشهر الماضي</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
                أعلى فئة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">مستلزمات</div>
              <p className="text-xs text-orange-500/80">35% من المصروفات</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <TrendingDown className="h-4 w-4 mr-2 text-green-500" />
                التوفير
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">₪420</div>
              <p className="text-xs text-green-500/80">مقارنة بالشهر الماضي</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Expenses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                المصروفات الأخيرة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {expenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className="p-2 rounded-full bg-warning/10">
                        <Receipt className="h-4 w-4 text-warning" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{expense.description}</p>
                        <p className="text-xs text-muted-foreground">{expense.vendor}</p>
                      </div>
                    </div>
                    <div className="text-left rtl:text-right">
                      <p className="font-semibold text-destructive">₪{expense.amount}</p>
                      <Badge variant="outline" className="text-xs">
                        {expense.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Expense Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                المصروفات حسب الفئة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{category.name}</span>
                      <div className="text-left rtl:text-right">
                        <span className="font-bold text-destructive">₪{category.amount}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {category.percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${category.color}`}
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Expense Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>تفصيل المصروفات الشهرية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-blue-900">مستلزمات الصالون</h4>
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-700">₪2,950</div>
                <p className="text-sm text-blue-600">شامبو، صبغات، كريمات</p>
              </div>
              
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-red-900">الفواتير</h4>
                  <Receipt className="h-5 w-5 text-red-600" />
                </div>
                <div className="text-2xl font-bold text-red-700">₪2,350</div>
                <p className="text-sm text-red-600">كهرباء، ماء، إنترنت</p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-green-900">الأدوات</h4>
                  <AlertTriangle className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-700">₪1,780</div>
                <p className="text-sm text-green-600">مقصات، ماكينات، مناشف</p>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-yellow-900">الصيانة</h4>
                  <Calendar className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="text-2xl font-bold text-yellow-700">₪1,370</div>
                <p className="text-sm text-yellow-600">تنظيف، إصلاحات، صيانة</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Expenses;