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
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { getExplanation } from '@/lib/actions';
import type { Trainset, TrainStatus } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface TrainTableProps {
  trains: Trainset[];
  onUpdateTrain: (train: Trainset) => void;
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

export default function TrainTable({ trains, onUpdateTrain }: TrainTableProps) {
  const [selectedTrain, setSelectedTrain] = React.useState<Trainset | null>(null);
  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const { toast } = useToast();

  const handleStatusChange = (train: Trainset, status: TrainStatus) => {
    onUpdateTrain({ ...train, status });
    toast({
      title: `Assignment Updated for ${train.id}`,
      description: `Status changed to "${status}". Metrics are re-simulating.`,
    });
  };

  const openExplanation = (train: Trainset) => {
    setSelectedTrain(train);
    setDialogOpen(true);
  };
  
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
                  <TableCell>{train.jobCardStatus}</TableCell>
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
        open={isDialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
