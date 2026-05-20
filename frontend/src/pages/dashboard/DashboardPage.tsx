import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { CardSkeleton } from "@/components/common/Skeleton";
import { useDashboardStats } from "@/hooks/useLeads";
import { Users, TrendingUp, CheckCircle, XCircle, Globe, Instagram, UserPlus } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { formatDate } from "@/utils";

const statusColors = ["#3b82f6", "#eab308", "#22c55e", "#ef4444"];
const sourceColors = ["#8b5cf6", "#ec4899", "#6366f1"];

const statusIcons: Record<string, typeof Users> = {
  New: Users,
  Contacted: TrendingUp,
  Qualified: CheckCircle,
  Lost: XCircle,
};

const sourceIcons: Record<string, typeof Globe> = {
  Website: Globe,
  Instagram: Instagram,
  Referral: UserPlus,
};

export function DashboardPage() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  const stats = data?.data;

  const statusData = stats?.leadsByStatus.map((s) => ({
    name: s._id,
    value: s.count,
  })) || [];

  const sourceData = stats?.leadsBySource.map((s) => ({
    name: s._id,
    value: s.count,
  })) || [];

  const statusCounts: Record<string, number> = {};
  stats?.leadsByStatus.forEach((s) => {
    statusCounts[s._id] = s.count;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your leads and analytics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalLeads || 0}</div>
          </CardContent>
        </Card>

        {["New", "Contacted", "Qualified", "Lost"].map((status) => {
          const Icon = statusIcons[status];
          const count = statusCounts[status] || 0;
          const colorMap: Record<string, string> = {
            New: "text-blue-600",
            Contacted: "text-yellow-600",
            Qualified: "text-green-600",
            Lost: "text-red-600",
          };

          return (
            <Card key={status}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{status}</CardTitle>
                <Icon className={`h-4 w-4 ${colorMap[status]}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Leads by Status</CardTitle>
          </CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-sm" />
                  <YAxis className="text-sm" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))",
                    }}
                    itemStyle={{ color: "hsl(var(--foreground))" }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leads by Source</CardTitle>
          </CardHeader>
          <CardContent>
            {sourceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sourceData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={sourceColors[index % sourceColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))",
                    }}
                    itemStyle={{ color: "hsl(var(--foreground))" }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-muted-foreground">No data available</div>
            )}
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {sourceData.map((source, index) => {
                const Icon = sourceIcons[source.name];
                return (
                  <div key={source.name} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: sourceColors[index % sourceColors.length] }} />
                    {Icon && <Icon className="h-4 w-4" />}
                    <span className="text-sm">{source.name}</span>
                    <span className="text-sm font-medium">{source.value}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Leads */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Leads</CardTitle>
        </CardHeader>
        <CardContent>
          {stats?.recentLeads && stats.recentLeads.length > 0 ? (
            <div className="space-y-4">
              {stats.recentLeads.map((lead) => (
                <div key={lead._id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">{lead.email}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      lead.status === "New" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" :
                      lead.status === "Contacted" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" :
                      lead.status === "Qualified" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}>
                      {lead.status}
                    </span>
                    <p className="mt-1 text-xs text-muted-foreground">{formatDate(lead.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">No leads yet</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
