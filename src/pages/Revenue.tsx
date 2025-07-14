import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  Plus, 
  TrendingUp,
  CreditCard,
  Banknote,
  Calendar,
  Filter
} from "lucide-react";

const dailyRevenue = [
  { date: "2024-01-15", cash: 1450, card: 900, total: 2350, transactions: 18 },
  { date: "2024-01-14", cash: 1200, card: 1100, total: 2300, transactions: 16 },
  { date: "2024-01-13", cash: 980, card: 850, total: 1830, transactions: 14 },
  { date: "2024-01-12", cash: 1350, card: 750, total: 2100, transactions: 15 },
  { date: "2024-01-11", cash: 1600, card: 1200, total: 2800, transactions: 22 },
];

const recentTransactions = [
  { id: 1, time: "14:30", customer: "أحمد محمد", service: "قص + حلاقة", amount: 120, method: "cash" },
  { id: 2, time: "14:15", customer: "محمد علي", service: "صبغة شعر", amount: 200, method: "card" },
  { id: 3, time: "14:00", customer: "يوسف أحمد", service: "تشذيب", amount: 80, method: "cash" },
  { id: 4, time: "13:45", customer: "كريم سعد", service: "حلاقة", amount: 50, method: "card" },
  { id: 5, time: "13:30", customer: "محمود حسن", service: "قص شعر", amount: 90, method: "cash" },
];

const Revenue = () => {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">إدارة الإيرادات</h1>
            <p className="text-muted-foreground">تتبع المبيعات والإيرادات اليومية</p>
          </div>
          <Button className="bg-success hover:bg-success/90 text-success-foreground">
            <Plus className="h-4 w-4 mr-2" />
            معاملة جديدة
          </Button>
        </div>

        {/* Today's Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Banknote className="h-4 w-4 mr-2 text-success" />
                نقدي اليوم
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">₪1,450</div>
              <p className="text-xs text-success/80">61.7% من الإجمالي</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <CreditCard className="h-4 w-4 mr-2 text-primary" />
                فيزا اليوم
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">₪900</div>
              <p className="text-xs text-primary/80">38.3% من الإجمالي</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-accent" />
                إجمالي اليوم
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">₪2,350</div>
              <p className="text-xs text-accent/80">18 معاملة</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-orange-500" />
                النمو
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">+18%</div>
              <p className="text-xs text-orange-500/80">مقارنة بالأمس</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                المعاملات الأخيرة
              </CardTitle>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                فلترة
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className={`p-2 rounded-full ${transaction.method === 'cash' ? 'bg-success/10' : 'bg-primary/10'}`}>
                        {transaction.method === 'cash' ? (
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

          {/* Daily Revenue History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                الإيرادات الأسبوعية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dailyRevenue.map((day, index) => (
                  <div key={day.date} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">
                        {new Date(day.date).toLocaleDateString('ar-EG', { 
                          weekday: 'long', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">{day.transactions} معاملة</p>
                    </div>
                    
                    <div className="flex items-center space-x-6 rtl:space-x-reverse">
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">نقدي</div>
                        <div className="font-semibold text-success">₪{day.cash}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">فيزا</div>
                        <div className="font-semibold text-primary">₪{day.card}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">الإجمالي</div>
                        <div className="font-bold text-accent">₪{day.total}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Summary */}
        <Card>
          <CardHeader>
            <CardTitle>ملخص الشهر</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-success/10 rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">إجمالي النقدي</div>
                <div className="text-2xl font-bold text-success">₪18,500</div>
                <div className="text-xs text-success/80">65% من الإجمالي</div>
              </div>
              
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">إجمالي الفيزا</div>
                <div className="text-2xl font-bold text-primary">₪12,200</div>
                <div className="text-xs text-primary/80">35% من الإجمالي</div>
              </div>
              
              <div className="text-center p-4 bg-accent/10 rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">الإجمالي الكلي</div>
                <div className="text-2xl font-bold text-accent">₪30,700</div>
                <div className="text-xs text-accent/80">+22% عن الشهر الماضي</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Revenue;