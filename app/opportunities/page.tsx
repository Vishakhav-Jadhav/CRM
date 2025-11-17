'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { OpportunityDialog } from '@/components/opportunities/opportunity-dialog';
import { Opportunity } from '@/types';
import { Pencil, Trash2 } from 'lucide-react';
import { useOpportunities } from '@/hooks/use-opportunities';
import { Loader2 } from 'lucide-react';

export default function OpportunitiesPage() {
  const { opportunities, loading, error, addOpportunity, updateOpportunity, deleteOpportunity } = useOpportunities();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);

  const handleAddOpportunity = async (data: Omit<Opportunity, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await addOpportunity(data);
      setDialogOpen(false);
    } catch (err) {
      console.error('Failed to add opportunity:', err);
    }
  };

  const handleUpdateOpportunity = async (id: string, data: Omit<Opportunity, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await updateOpportunity(id, data);
      setDialogOpen(false);
      setEditingOpportunity(null);
    } catch (err) {
      console.error('Failed to update opportunity:', err);
    }
  };

  const handleDeleteOpportunity = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this opportunity?')) {
      try {
        await deleteOpportunity(id);
      } catch (err) {
        console.error('Failed to delete opportunity:', err);
      }
    }
  };

  const openAddDialog = () => {
    setEditingOpportunity(null);
    setDialogOpen(true);
  };

  const openEditDialog = (opportunity: Opportunity) => {
    setEditingOpportunity(opportunity);
    setDialogOpen(true);
  };

  const handleDialogSubmit = (data: Omit<Opportunity, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingOpportunity) {
      handleUpdateOpportunity(editingOpportunity.id, data);
    } else {
      handleAddOpportunity(data);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading opportunities...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-red-600">
          <p>Error loading opportunities: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Opportunities</CardTitle>
          <Button onClick={openAddDialog}>Add Opportunity</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Opportunity Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Close Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {opportunities.map(opportunity => (
                <TableRow key={opportunity.id}>
                  <TableCell>{opportunity.title}</TableCell>
                  <TableCell>₹{Number(opportunity.amount).toLocaleString()}</TableCell>
                  <TableCell>{opportunity.status}</TableCell>
                  <TableCell>{opportunity.priority}</TableCell>
                  <TableCell>{opportunity.close_date || '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(opportunity)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteOpportunity(opportunity.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {opportunities.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No opportunities found. Add your first opportunity.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <OpportunityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleDialogSubmit}
        opportunity={editingOpportunity}
      />
    </div>
  );
}