import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { format } from 'date-fns';
import { GripVertical } from 'lucide-react';

export function TaskCard({ task, onEdit, onDelete, onAddLog, dragHandleProps }) {
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);
  const [logMessage, setLogMessage] = useState('');

  const handleAddLog = () => {
    if (logMessage.trim()) {
      onAddLog(logMessage);
      setLogMessage('');
      setIsLogDialogOpen(false);
    }
  };

  return (
    <Card className="mb-4" data-id={task._id}>
      <CardHeader className="flex flex-row items-center">
        <div {...dragHandleProps} className="cursor-move mr-2">
          <GripVertical size={20} />
        </div>
        <CardTitle className="flex-grow flex justify-between items-center">
          <span>{task.title}</span>
          <Badge variant={task.status === 'todo' ? 'default' : task.status === 'in-progress' ? 'secondary' : 'success'}>
            {task.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-2">{task.description}</p>
        <p className="text-sm text-gray-500 mb-4">Due: {format(new Date(task.dueDate), 'yyyy-MM-dd')}</p>
        <div className="space-x-2">
          <Button onClick={onEdit} variant="outline" size="sm">Edit</Button>
          <Button onClick={onDelete} variant="destructive" size="sm">Delete</Button>
          <Dialog open={isLogDialogOpen} onOpenChange={setIsLogDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">Add Log</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Log</DialogTitle>
              </DialogHeader>
              <Input
                value={logMessage}
                onChange={(e) => setLogMessage(e.target.value)}
                placeholder="Enter log message"
                onKeyDown={(e) => e.key === 'Enter' && handleAddLog()}
              />
              <Button onClick={handleAddLog}>Add Log</Button>
            </DialogContent>
          </Dialog>
        </div>
        {task.logs && task.logs.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Logs:</h4>
            {task.logs.map((log, index) => (
              <p key={index} className="text-sm">
                {format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm')}: {log.message}
              </p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}