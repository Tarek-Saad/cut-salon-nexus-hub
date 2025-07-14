import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  UserCheck, 
  DollarSign, 
  ShoppingCart,
  TrendingUp,
  Calendar,
  CreditCard,
  Banknote
} from "lucide-react";

const stats = [
  {
    title: "العملاء الجدد",
    value: "156",
    change: "+12%",
    icon: Users,
    color: "text-blue-600"
  },
  {
    title: "الموظفين النشطين",
    value: "8",
    change: "100%",
    icon: UserCheck,
    color: "text-green-600"
  },
  {
    title: "إيرادات اليوم",
    value: "₪2,350",
    change: "+18%",
    icon: DollarSign,
    color: "text-success"
  },
  {
    title: "مصروفات الشهر",
    value: "₪8,450",
    change: "-5%",
    icon: ShoppingCart,
    color: "text-warning"
  }
];

const recentTransactions = [
  { id: 1, customer: "أحمد محمد", service: "قص شعر + حلاقة", amount: 120, type: "cash", time: "10:30 صباحاً" },
  { id: 2, customer: "محمد علي", service: "صبغة شعر", amount: 200, type: "card", time: "11:15 صباحاً" },
  { id: 3, customer: "يوسف أحمد", service: "قص + تشذيب", amount: 80, type: "cash", time: "12:00 ظهراً" },
  { id: 4, customer: "كريم سعد", service: "حلاقة فقط", amount: 50, type: "card", time: "12:45 ظهراً" },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">لوحة التحكم</h1>
        <p className="text-muted-foreground">نظرة شاملة على أداء الصالون اليوم</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.change.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                {stat.change} من الأسبوع الماضي
              </p>
            </CardContent>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <DollarSign className="h-5 w-5" />
              <span>المعاملات الأخيرة</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className={`p-2 rounded-full ${transaction.type === 'cash' ? 'bg-success/10' : 'bg-primary/10'}`}>
                      {transaction.type === 'cash' ? (
                        <Banknote className="h-4 w-4 text-success" />
                      ) : (
                        <CreditCard className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{transaction.customer}</p>
                      <p className="text-xs text-muted-foreground">{transaction.service}</p>
                    </div>
                  </div>
                  <div className="text-left rtl:text-right">
                    <p className="font-semibold text-success">₪{transaction.amount}</p>
                    <p className="text-xs text-muted-foreground">{transaction.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Summary */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <TrendingUp className="h-5 w-5" />
              <span>ملخص اليوم</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Banknote className="h-4 w-4 text-success" />
                  <span className="font-medium">نقدي</span>
                </div>
                <span className="font-bold text-success">₪1,450</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <span className="font-medium">فيزا</span>
                </div>
                <span className="font-bold text-primary">₪900</span>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">إجمالي الإيرادات</span>
                  <span className="text-xl font-bold text-foreground">₪2,350</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-warning/10 rounded-lg">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <ShoppingCart className="h-4 w-4 text-warning" />
                  <span className="font-medium">مصروفات اليوم</span>
                </div>
                <span className="font-bold text-warning">₪320</span>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-success">صافي الربح</span>
                  <span className="text-xl font-bold text-success">₪2,030</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
            <Calendar className="h-5 w-5" />
            <span>إجراءات سريعة</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
              <span className="text-sm font-medium">عميل جديد</span>
            </button>
            <button className="p-4 bg-success/10 hover:bg-success/20 rounded-lg transition-colors text-center">
              <DollarSign className="h-6 w-6 mx-auto mb-2 text-success" />
              <span className="text-sm font-medium">معاملة جديدة</span>
            </button>
            <button className="p-4 bg-warning/10 hover:bg-warning/20 rounded-lg transition-colors text-center">
              <ShoppingCart className="h-6 w-6 mx-auto mb-2 text-warning" />
              <span className="text-sm font-medium">مصروف جديد</span>
            </button>
            <button className="p-4 bg-accent/10 hover:bg-accent/20 rounded-lg transition-colors text-center">
              <UserCheck className="h-6 w-6 mx-auto mb-2 text-accent" />
              <span className="text-sm font-medium">تسجيل حضور</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}