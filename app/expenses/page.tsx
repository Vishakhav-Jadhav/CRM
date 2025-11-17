'use client';

import { useCRMStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, DollarSign, TrendingUp } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

export default function ExpensesPage() {
  const expenses = useCRMStore((state) => state.expenses);

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const monthlyData = expenses.reduce((acc, expense) => {
    const month = format(new Date(expense.date), 'MMM yyyy');
    const existing = acc.find((item) => item.month === month);
    if (existing) {
      existing.amount += Number(expense.amount);
    } else {
      acc.push({ month, amount: Number(expense.amount) });
    }
    return acc;
  }, [] as { month: string; amount: number }[]);

  const thisMonthExpenses = expenses.filter((e) => 
    format(new Date(e.date), 'MMM yyyy') === format(new Date(), 'MMM yyyy')
  ).reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Expenses</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Track your business expenses</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">₹{totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{expenses.length} transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Expense</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              ₹{expenses.length > 0 ? (totalExpenses / expenses.length).toFixed(2) : 0}
            </div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              ₹{thisMonthExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Current period</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Expenses Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Monthly Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="amount" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Expenses */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Opportunity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No expenses recorded
                    </TableCell>
                  </TableRow>
                ) : (
                  expenses.slice(0, 10).map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">{expense.title}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>${Number(expense.amount).toLocaleString()}</TableCell>
                      <TableCell>{format(new Date(expense.date), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{expense.opportunity?.title || '-'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {expenses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No expenses recorded
              </div>
            ) : (
              expenses.slice(0, 10).map((expense) => (
                <div key={expense.id} className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">{expense.title}</h3>
                    <span className="font-bold text-sm">${Number(expense.amount).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{expense.category}</span>
                    <span>{format(new Date(expense.date), 'MMM dd, yyyy')}</span>
                  </div>
                  {expense.opportunity?.title && (
                    <div className="text-xs text-muted-foreground">
                      Opportunity: {expense.opportunity.title}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
