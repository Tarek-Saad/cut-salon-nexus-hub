import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Calendar,
  DollarSign,
  Eye
} from "lucide-react";

const customers = [
  {
    id: 1,
    name: "أحمد محمد علي",
    phone: "05x-xxx-xxxx",
    lastVisit: "2024-01-15",
    totalSpent: 1250,
    visits: 8,
    status: "vip"
  },
  {
    id: 2,
    name: "محمد حسن أحمد",
    phone: "05x-xxx-xxxx",
    lastVisit: "2024-01-14",
    totalSpent: 890,
    visits: 5,
    status: "regular"
  },
  {
    id: 3,
    name: "يوسف عبدالله",
    phone: "05x-xxx-xxxx",
    lastVisit: "2024-01-13",
    totalSpent: 2100,
    visits: 12,
    status: "vip"
  },
  {
    id: 4,
    name: "كريم سعد",
    phone: "05x-xxx-xxxx",
    lastVisit: "2024-01-12",
    totalSpent: 340,
    visits: 2,
    status: "new"
  }
];

const Customers = () => {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">إدارة العملاء</h1>
            <p className="text-muted-foreground">قائمة جميع عملاء الصالون ومعلوماتهم</p>
          </div>
          <Button className="bg-primary hover:bg-primary-glow text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" />
            عميل جديد
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث عن عميل..."
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  جميع العملاء
                </Button>
                <Button variant="outline" size="sm">
                  VIP
                </Button>
                <Button variant="outline" size="sm">
                  جدد
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customers List */}
        <div className="grid gap-4">
          {customers.map((customer) => (
            <Card key={customer.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{customer.name}</h3>
                      <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {customer.phone}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          آخر زيارة: {customer.lastVisit}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">إجمالي المصروف</div>
                      <div className="font-bold text-success">₪{customer.totalSpent}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">عدد الزيارات</div>
                      <div className="font-bold">{customer.visits}</div>
                    </div>
                    <Badge 
                      variant={customer.status === 'vip' ? 'default' : customer.status === 'new' ? 'secondary' : 'outline'}
                      className={
                        customer.status === 'vip' 
                          ? 'bg-accent text-accent-foreground' 
                          : customer.status === 'new' 
                          ? 'bg-success text-success-foreground'
                          : ''
                      }
                    >
                      {customer.status === 'vip' ? 'VIP' : customer.status === 'new' ? 'جديد' : 'عادي'}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      تفاصيل
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي العملاء</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-success">+12 هذا الشهر</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">عملاء VIP</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-accent">15.4% من العملاء</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">متوسط الإنفاق</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₪185</div>
              <p className="text-xs text-muted-foreground">لكل زيارة</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Customers;