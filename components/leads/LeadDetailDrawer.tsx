"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCRMStore } from "@/lib/store";
import type { Lead } from "@/types";

export default function LeadDetailDrawer({
  lead,
  open,
  onClose,
  onEdit,
}: {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
  onEdit: (lead: Lead) => void;
}) {
  const deleteLead = useCRMStore((s) => s.deleteLead);

  if (!lead) return null;

  const stages = ['Cold', 'Warm', 'Hot', 'Won'];
  const currentIndex = stages.indexOf(lead.lead_status);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      deleteLead(lead.id);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {lead.title}
            <Badge variant="outline">{lead.lead_status}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Pipeline Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                {stages.map((stage, index) => (
                  <div key={stage} className="flex items-center">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        index <= currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                    {index < stages.length - 1 && (
                      <div
                        className={`h-0.5 w-12 ${
                          index < currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                {stages.map((stage) => (
                  <span key={stage}>{stage}</span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Full Lead Information */}
          <Card>
            <CardHeader>
              <CardTitle>Lead Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div><strong>Title:</strong> {lead.title}</div>
              <div><strong>Amount:</strong> {lead.amount ? `₹${Number(lead.amount).toLocaleString()}` : '-'}</div>
              <div><strong>Forecast:</strong> <Badge>{lead.forecast}</Badge></div>
              <div><strong>TAT:</strong> {lead.tat || '-'}</div>
              <div><strong>Open Date:</strong> {new Date(lead.open_date).toLocaleDateString()}</div>
              <div><strong>Close Date:</strong> {lead.close_date ? new Date(lead.close_date).toLocaleDateString() : '-'}</div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">{lead.description || 'No description'}</div>
            </CardContent>
          </Card>

          {/* Remarks */}
          <Card>
            <CardHeader>
              <CardTitle>Remarks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">{lead.remarks || 'No remarks'}</div>
            </CardContent>
          </Card>

          {/* Company Details */}
          <Card>
            <CardHeader>
              <CardTitle>Company Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div><strong>Name:</strong> {lead.company?.name || '-'}</div>
              <div><strong>Website:</strong> {lead.company?.website ? <a href={lead.company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600">{lead.company.website}</a> : '-'}</div>
              <div><strong>Email:</strong> {lead.company?.email || '-'}</div>
              <div><strong>Phone:</strong> {lead.company?.phone || '-'}</div>
              <div><strong>Sector:</strong> {lead.company?.sector || '-'}</div>
            </CardContent>
          </Card>

          {/* POC Details */}
          <Card>
            <CardHeader>
              <CardTitle>POC Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div><strong>Name:</strong> {lead.company?.poc?.name || '-'}</div>
              <div><strong>Email:</strong> {lead.company?.poc?.email || '-'}</div>
              <div><strong>Phone:</strong> {lead.company?.poc?.phone || '-'}</div>
              <div><strong>Importance:</strong> {lead.company?.poc?.importance || '-'}</div>
            </CardContent>
          </Card>

          {/* Competitors Table */}
          <Card>
            <CardHeader>
              <CardTitle>Competitors</CardTitle>
            </CardHeader>
            <CardContent>
              {lead.competitors && lead.competitors.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Strength</TableHead>
                      <TableHead>Weakness</TableHead>
                      <TableHead>Position vs You</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lead.competitors.map((comp, index) => (
                      <TableRow key={index}>
                        <TableCell>{comp.name}</TableCell>
                        <TableCell>{comp.strength}</TableCell>
                        <TableCell>{comp.weakness}</TableCell>
                        <TableCell>{comp.positionVsYou}</TableCell>
                        <TableCell><Badge>{comp.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-sm text-muted-foreground">No competitors</div>
              )}
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Lead Created</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(lead.created_at).toLocaleDateString()} at {new Date(lead.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                {lead.updated_at !== lead.created_at && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Lead Updated</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(lead.updated_at).toLocaleDateString()} at {new Date(lead.updated_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                )}
                {lead.close_date && (
                  <div className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${lead.lead_status === 'Won' ? 'bg-green-600' : 'bg-red-600'}`}></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Lead {lead.lead_status}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(lead.close_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onEdit(lead)}>Edit</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
