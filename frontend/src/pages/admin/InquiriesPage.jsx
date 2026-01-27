import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Search,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  UserCheck,
  Send,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';
import api from '@/lib/api';

const statusOptions = [
  { value: 'new', label: 'New', color: 'bg-warning/10 text-warning' },
  { value: 'assigned', label: 'Assigned', color: 'bg-primary/10 text-primary' },
  { value: 'talked', label: 'Talked', color: 'bg-accent/10 text-accent-foreground' },
  { value: 'visit_scheduled', label: 'Visit Scheduled', color: 'bg-success/10 text-success' },
  { value: 'visit_completed', label: 'Visit Completed', color: 'bg-chart-3/10 text-chart-3' },
  { value: 'closed', label: 'Closed', color: 'bg-muted text-muted-foreground' },
];

const InquiriesPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInquiries();
    fetchAgents();
  }, []);

  /* ================= FETCH INQUIRIES (FIXED) ================= */
  const fetchInquiries = async () => {
    try {
      const { data } = await api.get('/inquiries/');

      // BACKEND uses "stage", UI uses "status"
      const normalized = data.map((i) => ({
        ...i,
        status: i.stage?.toLowerCase(),
      }));

      setInquiries(normalized);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH AGENTS ================= */
  const fetchAgents = async () => {
    try {
      const { data } = await api.get('/agents/', {
        params: { status: 'active' },
      });
      setAgents(data);
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  /* ================= ASSIGN AGENT ================= */
  const assignAgent = async (inquiryId, agentId) => {
    try {
      await api.put(`/inquiries/${inquiryId}/assign`, null, {
        params: { agent_id: agentId },
      });

      toast.success('Inquiry assigned successfully');
      fetchInquiries();
    } catch (error) {
      console.error('Error assigning inquiry:', error);
      toast.error('Failed to assign inquiry');
    }
  };

  /* ================= OPEN DETAIL ================= */
  const openInquiryDetail = async (inquiry) => {
    try {
      const { data } = await api.get(`/inquiries/${inquiry.id}`);
      setSelectedInquiry({
        ...data,
        status: data.stage?.toLowerCase(),
      });
      setIsDetailOpen(true);
    } catch (error) {
      console.error('Error fetching inquiry detail:', error);
    }
  };

  /* ================= ADD LOG ================= */
  const addConversationLog = async () => {
    if (!newMessage.trim() || !selectedInquiry) return;

    setSubmitting(true);
    try {
      await api.post(`/inquiries/${selectedInquiry.id}/notes`, null, {
        params: { note: newMessage },
      });

      toast.success('Log added');
      setNewMessage('');
      fetchInquiries();
    } catch (error) {
      console.error(error);
      toast.error('Failed to add log');
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= FILTER ================= */
  const filteredInquiries = inquiries.filter((i) => {
    const matchesSearch =
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.phone.includes(searchQuery) ||
      (i.email && i.email.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || i.status === statusFilter;
    const matchesType = typeFilter === 'all' || i.inquiry_type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status) =>
    statusOptions.find((o) => o.value === status)?.color ||
    'bg-muted text-muted-foreground';

  const getStatusIcon = (status) => {
    switch (status) {
      case 'new': return Clock;
      case 'assigned': return UserCheck;
      case 'visit_scheduled': return Calendar;
      case 'closed': return XCircle;
      default: return MessageSquare;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Inquiries</h1>

      <Card>
        <CardContent className="p-4">
          <Input
            placeholder="Search inquiries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  <Loader2 className="animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : filteredInquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No inquiries found
                </TableCell>
              </TableRow>
            ) : (
              filteredInquiries.map((i) => {
                const StatusIcon = getStatusIcon(i.status);
                return (
                  <TableRow key={i.id}>
                    <TableCell>
                      <p className="font-medium">{i.name}</p>
                      <p className="text-sm text-muted-foreground">{i.phone}</p>
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        'px-2 py-1 rounded-full text-xs flex items-center gap-1',
                        getStatusColor(i.status)
                      )}>
                        <StatusIcon className="w-3 h-3" />
                        {i.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {format(new Date(i.created_at), 'dd MMM yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" onClick={() => openInquiryDetail(i)}>
                        <Eye className="w-4 h-4 mr-1" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inquiry Details</DialogTitle>
          </DialogHeader>

          {selectedInquiry && (
            <>
              <p><b>Name:</b> {selectedInquiry.name}</p>
              <p><b>Phone:</b> {selectedInquiry.phone}</p>

              <Textarea
                placeholder="Add note"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />

              <Button onClick={addConversationLog} disabled={submitting}>
                {submitting ? <Loader2 className="animate-spin" /> : <Send />}
                Add Log
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InquiriesPage;
