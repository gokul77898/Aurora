'use client';

import * as React from 'react';
import {
  ShieldCheck,
  Wrench,
  Hourglass,
  Sparkles,
  HelpCircle,
  MoreVertical,
  ChevronDown,
  FileText,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { getExplanation } from '@/lib/actions';
import type { Trainset, TrainStatus } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';

interface TrainTableProps {
  trains: Trainset[];
  onUpdateTrain: (train: Partial<Trainset> & { id: string }) => void;
}

const statusIcons: Record<TrainStatus, React.ReactNode> = {
  service: <ShieldCheck className="mr-2 h-4 w-4 text-green-500" />,
  standby: <Hourglass className="mr-2 h-4 w-4 text-yellow-500" />,
  maintenance: <Wrench className="mr-2 h-4 w-4 text-red-500" />,
  cleaning: <Sparkles className="mr-2 h-4 w-4 text-blue-500" />,
};

const statusColors: Record<TrainStatus, string> = {
  service: 'bg-green-500/10 text-green-500 border-green-500/20',
  standby: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  maintenance: 'bg-red-500/10 text-red-500 border-red-500/20',
  cleaning: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
};

const jobCardColors: Record<Trainset['jobCardStatus'], string> = {
  Open: 'bg-red-500/10 text-red-500 border-red-500/20',
  'In Progress': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  Closed: 'bg-green-500/10 text-green-500 border-green-500/20',
};


function ExplanationDialog({
  train,
  open,
  onOpenChange,
}: {
  train: Trainset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [explanation, setExplanation] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (open && train) {
      setLoading(true);
      setExplanation('');
      getExplanation({
        trainsetId: train.id,
        status: train.status,
        fitnessStatus: train.fitnessStatus,
        jobCardStatus: train.jobCardStatus,
        mileage: train.mileage,
        slaPriority: train.slaPriority,
      })
        .then(setExplanation)
        .finally(() => setLoading(false));
    }
  }, [open, train]);

  if (!train) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assignment Explanation for {train.id}</DialogTitle>
          <DialogDescription>
            AI-generated reasoning for the train's current assignment.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{explanation}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MaintenanceDialog({
  train,
  open,
  onOpenChange,
  onUpdate,
}: {
  train: Trainset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (update: Partial<Trainset>) => void;
}) {
  const [notes, setNotes] = React.useState('');
  const [status, setStatus] = React.useState<Trainset['jobCardStatus']>('Closed');

  React.useEffect(() => {
    if (train) {
      setNotes(train.maintenanceNotes || '');
      setStatus(train.jobCardStatus);
    }
  }, [train]);

  const handleSave = () => {
    if(train) {
      onUpdate({ maintenanceNotes: notes, jobCardStatus: status });
      onOpenChange(false);
    }
  }

  if (!train) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Maintenance Job Card for {train.id}</DialogTitle>
          <DialogDescription>
            View and update maintenance logs for this trainset.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="status">Job Card Status</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-start font-normal">
                    {status}
                    <ChevronDown className="ml-auto h-4 w-4 opacity-50"/>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[--radix-dropdown-menu-trigger-width]">
                   <DropdownMenuRadioGroup
                      value={status}
                      onValueChange={(value) => setStatus(value as Trainset['jobCardStatus'])}
                    >
                      <DropdownMenuRadioItem value="Open">Open</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="In Progress">In Progress</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Closed">Closed</DropdownMenuRadioItem>
                   </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Maintenance Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter maintenance notes here..."
              className="min-h-[120px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function TrainTable({ trains, onUpdateTrain }: TrainTableProps) {
  const [selectedTrain, setSelectedTrain] = React.useState<Trainset | null>(null);
  const [isExplanationOpen, setExplanationOpen] = React.useState(false);
  const [isMaintenanceOpen, setMaintenanceOpen] = React.useState(false);
  const { toast } = useToast();

  const handleStatusChange = (train: Trainset, status: TrainStatus) => {
    onUpdateTrain({ id: train.id, status });
    toast({
      title: `Assignment Updated for ${train.id}`,
      description: `Status changed to "${status}".`,
    });
  };

  const handleMaintenanceUpdate = (train: Trainset, update: Partial<Trainset>) => {
    onUpdateTrain({ id: train.id, ...update });
     toast({
      title: `Maintenance Updated for ${train.id}`,
      description: `Job card details have been saved.`,
    });
  }

  const openExplanation = (train: Trainset) => {
    setSelectedTrain(train);
    setExplanationOpen(true);
  };

  const openMaintenance = (train: Trainset) => {
    setSelectedTrain(train);
    setMaintenanceOpen(true);
  }
  
  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Trainset Overview</CardTitle>
          <CardDescription>
            Live status of all trainsets in the induction plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trainset</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Fitness</TableHead>
                <TableHead>Job Card</TableHead>
                <TableHead className="text-right">Mileage</TableHead>
                <TableHead>SLA Priority</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trains.map((train) => (
                <TableRow key={train.id}>
                  <TableCell className="font-medium">{train.id}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className={`h-auto p-1 text-left font-normal ${statusColors[train.status]}`}>
                          <div className="flex items-center">
                            {statusIcons[train.status]}
                            <span className="capitalize">{train.status}</span>
                            <ChevronDown className="ml-2 h-4 w-4 opacity-50"/>
                          </div>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuRadioGroup
                          value={train.status}
                          onValueChange={(value) => handleStatusChange(train, value as TrainStatus)}
                        >
                          <DropdownMenuRadioItem value="service">{statusIcons.service} Service</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="standby">{statusIcons.standby} Standby</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="maintenance">{statusIcons.maintenance} Maintenance</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="cleaning">{statusIcons.cleaning} Cleaning</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell>{train.fitnessStatus}</TableCell>
                  <TableCell>
                    <Button variant="ghost" className={`h-auto p-1 text-left font-normal ${jobCardColors[train.jobCardStatus]}`} onClick={() => openMaintenance(train)}>
                      <FileText className="mr-2 h-4 w-4" />
                      {train.jobCardStatus}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    {train.mileage.toLocaleString()} km
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        train.slaPriority === 'High'
                          ? 'destructive'
                          : train.slaPriority === 'Medium'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {train.slaPriority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                       <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openExplanation(train)}
                        >
                          <HelpCircle className="mr-2 h-4 w-4" />
                          Why?
                        </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openMaintenance(train)}>Maintenance Log</DropdownMenuItem>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Check History</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <ExplanationDialog
        train={selectedTrain}
        open={isExplanationOpen}
        onOpenChange={setExplanationOpen}
      />
      <MaintenanceDialog
        train={selectedTrain}
        open={isMaintenanceOpen}
        onOpenChange={setMaintenanceOpen}
        onUpdate={(update) => selectedTrain && handleMaintenanceUpdate(selectedTrain, update)}
      />
    </>
  );
}
