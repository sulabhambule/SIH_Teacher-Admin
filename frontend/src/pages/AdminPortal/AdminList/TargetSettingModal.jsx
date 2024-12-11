import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

const targetCategories = [
  { id: 'publications', name: 'Publications', defaultTarget: 10, maxTarget: 20 },
  { id: 'events', name: 'Events', defaultTarget: 3, maxTarget: 10 },
  { id: 'research', name: 'Research Grants', defaultTarget: 2, maxTarget: 5 },
  { id: 'students', name: 'Student Mentorship', defaultTarget: 15, maxTarget: 30 },
  { id: 'collaborations', name: 'Industry Collaborations', defaultTarget: 2, maxTarget: 5 },
]

export function TargetSettingModal({ isOpen, onClose, department, hodName, onSaveTargets }) {
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [targets, setTargets] = useState(
    targetCategories.map(category => ({
      category: category.id,
      name: category.name,
      target: category.defaultTarget,
      description: '',
      progress: 0
    }))
  )

  const handleTargetChange = (index, field, value) => {
    const newTargets = [...targets]
    newTargets[index][field] = value
    setTargets(newTargets)
  }

  const handleProgressChange = (index, value) => {
    const newTargets = [...targets]
    newTargets[index].progress = Math.min(100, Math.max(0, value))
    setTargets(newTargets)
  }

  const handleSave = () => {
    onSaveTargets(targets, selectedYear)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-600">Set Department Targets</DialogTitle>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto pr-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-blue-500">{department} Department - HOD: {hodName}</h3>
            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {[currentYear, currentYear + 1, currentYear + 2].map((year) => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Tabs defaultValue={targetCategories[0].id} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              {targetCategories.map(category => (
                <TabsTrigger key={category.id} value={category.id}>{category.name}</TabsTrigger>
              ))}
            </TabsList>
            {targetCategories.map((category, index) => (
              <TabsContent key={category.id} value={category.id} className="mt-4 space-y-4">
                <div className="flex items-center space-x-4">
                  <Label htmlFor={`target-${category.id}`} className="w-24">Target:</Label>
                  <Input
                    id={`target-${category.id}`}
                    type="number"
                    value={targets[index].target}
                    onChange={(e) => handleTargetChange(index, 'target', parseInt(e.target.value))}
                    min="0"
                    max={category.maxTarget}
                    className="w-20"
                  />
                  <span className="text-sm text-gray-500">Max: {category.maxTarget}</span>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`description-${category.id}`}>Description:</Label>
                  <Input
                    id={`description-${category.id}`}
                    value={targets[index].description}
                    onChange={(e) => handleTargetChange(index, 'description', e.target.value)}
                    placeholder={`Describe the ${category.name.toLowerCase()} target...`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`progress-${category.id}`}>Progress:</Label>
                  <div className="flex items-center space-x-4">
                    <Input
                      id={`progress-${category.id}`}
                      type="number"
                      value={targets[index].progress}
                      onChange={(e) => handleProgressChange(index, parseInt(e.target.value))}
                      min="0"
                      max="100"
                      className="w-20"
                    />
                    <Progress value={targets[index].progress} className="flex-grow" />
                    <span>{targets[index].progress}%</span>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
        <DialogFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Save Targets</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Target Settings</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to save these targets for the {department} Department for the year {selectedYear}?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Summary of Targets:</h4>
                <ul className="list-disc pl-5">
                  {targets.map((target) => (
                    <li key={target.category}>
                      {target.name}: {target.target} (Progress: {target.progress}%)
                    </li>
                  ))}
                </ul>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSave}>Confirm</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

