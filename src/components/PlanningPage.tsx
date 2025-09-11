import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Calendar as CalendarIcon, Plus, Settings, Clock, Edit, Trash2, Filter } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { toast } from 'sonner';
import api from '@/lib/api';
// Note: date-fns would need to be installed in a real project
const format = (date: Date, formatStr: string, options?: any) => {
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

interface PreventiveMaintenance {
  id: string;
  equipment_id: string;
  equipment_name: string;
  title: string;
  description: string;
  frequency_type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  frequency_value: number;
  next_date: string;
  last_executed?: string;
  estimated_duration: number; // in hours
  technician: string;
  active: boolean;
}

const mockPlanning: PreventiveMaintenance[] = [];

const getFrequencyLabel = (type: string, value: number) => {
  const labels = {
    'daily': `Tous les ${value} jour(s)`,
    'weekly': `Toutes les ${value} semaine(s)`,
    'monthly': `Tous les ${value} mois`,
    'quarterly': `Tous les ${value} trimestre(s)`,
    'yearly': `Tous les ${value} an(s)`
  };
  return labels[type as keyof typeof labels] || `${type} - ${value}`;
};

const getStatusBadge = (nextDate: string, active: boolean) => {
  if (!active) {
    return <Badge variant="outline" className="bg-gray-100 text-gray-800">Inactif</Badge>;
  }
  
  const today = new Date();
  const next = new Date(nextDate);
  const diffDays = Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return <Badge className="bg-red-500">En retard</Badge>;
  } else if (diffDays <= 7) {
    return <Badge className="bg-yellow-500">Proche</Badge>;
  } else {
    return <Badge className="bg-green-500">Programmé</Badge>;
  }
};

export function PlanningPage() {
  const [planning, setPlanning] = useState<PreventiveMaintenance[]>(mockPlanning);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [equipmentFilter, setEquipmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PreventiveMaintenance | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formEquipmentId, setFormEquipmentId] = useState('');
  const [formFrequency, setFormFrequency] = useState('monthly');
  const [formNextDate, setFormNextDate] = useState<string>('');
  const [equipments, setEquipments] = useState<{ id: number; nom: string }[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [plans, eqs] = await Promise.all([
          api.listPlannings(),
          api.listEquipments(),
        ]);
        const mapped: PreventiveMaintenance[] = (plans as any[]).map((p) => ({
          id: String(p.id),
          equipment_id: String(p.equipement_id),
          equipment_name: `#${p.equipement_id}`,
          title: `Planning ${p.id}`,
          description: '',
          frequency_type: 'monthly',
          frequency_value: 1,
          next_date: p.prochaine_date || '',
          last_executed: p.derniere_date || '',
          estimated_duration: 0,
          technician: '',
          active: true,
        }));
        setPlanning(mapped);
        setEquipments((eqs as any[]).map((e) => ({ id: e.id, nom: e.nom })));
      } catch {
        // keep mock
      }
    };
    load();
  }, []);

  const filteredPlanning = planning.filter(plan => {
    const matchesEquipment = equipmentFilter === 'all' || plan.equipment_id === equipmentFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && plan.active) ||
                         (statusFilter === 'inactive' && !plan.active) ||
                         (statusFilter === 'overdue' && new Date(plan.next_date) < new Date() && plan.active) ||
                         (statusFilter === 'upcoming' && new Date(plan.next_date) >= new Date() && plan.active);
    
    return matchesEquipment && matchesStatus;
  });

  // Get events for calendar view
  const calendarEvents = planning.filter(plan => plan.active).map(plan => ({
    id: plan.id,
    title: plan.title,
    date: new Date(plan.next_date),
    equipment: plan.equipment_name,
    technician: plan.technician,
    duration: plan.estimated_duration
  }));

  const CalendarView = () => {
    const eventsForSelectedDate = calendarEvents.filter(event => 
      event.date.toDateString() === selectedDate?.toDateString()
    );

    return (
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Calendrier</CardTitle>
            <CardDescription>
              Sélectionnez une date pour voir les maintenances programmées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={{
                scheduled: calendarEvents.map(e => e.date)
              }}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              Maintenances prévues
              {selectedDate && (
                <span className="text-muted-foreground text-base font-normal ml-2">
                  le {format(selectedDate, 'PPPP')}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {eventsForSelectedDate.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Aucune maintenance programmée pour cette date</p>
              </div>
            ) : (
              <div className="space-y-4">
                {eventsForSelectedDate.map(event => (
                  <div key={event.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{event.title}</h4>
                      <Badge variant="outline">{event.id}</Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Settings className="h-3 w-3" />
                        <span>{event.equipment}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>Durée estimée: {event.duration}h</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>👤</span>
                        <span>{event.technician}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const PlanForm = ({ plan }: { plan?: PreventiveMaintenance }) => (
    <div className="space-y-4">
      <div>
        <Label>Titre</Label>
        <Input placeholder="Titre de la maintenance" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
      </div>
      
      <div>
        <Label>Description</Label>
        <Input placeholder="Description détaillée" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Équipement</Label>
          <Select value={formEquipmentId} onValueChange={setFormEquipmentId}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              {equipments.map((e) => (
                <SelectItem key={e.id} value={String(e.id)}>{e.nom}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Technicien</Label>
          <Select defaultValue={plan?.technician}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mohammed Alami">Mohammed Alami</SelectItem>
              <SelectItem value="Fatima Bennani">Fatima Bennani</SelectItem>
              <SelectItem value="Youssef Khalil">Youssef Khalil</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Fréquence</Label>
          <Select value={formFrequency} onValueChange={setFormFrequency}>
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Hebdomadaire</SelectItem>
              <SelectItem value="monthly">Mensuelle</SelectItem>
              <SelectItem value="quarterly">Trimestrielle</SelectItem>
              <SelectItem value="yearly">Annuelle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Valeur</Label>
          <Input 
            type="number" 
            placeholder="1" 
            defaultValue={plan?.frequency_value} 
          />
        </div>

        <div>
          <Label>Durée (heures)</Label>
          <Input 
            type="number" 
            placeholder="4" 
            defaultValue={plan?.estimated_duration} 
          />
        </div>
      </div>

      <div>
        <Label>Prochaine exécution</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {plan?.next_date ? format(new Date(plan.next_date), 'PPP') : 'Sélectionner une date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formNextDate ? new Date(formNextDate) : undefined}
              onSelect={(d: Date | undefined) => setFormNextDate(d ? d.toISOString() : '')}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Planification</h1>
          <p className="text-muted-foreground">
            Gestion des maintenances préventives
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode('list')}
          >
            Liste
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
            onClick={() => setViewMode('calendar')}
          >
            Calendrier
          </Button>
          <Button onClick={() => setShowCreateDialog(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouveau planning
          </Button>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <CalendarView />
      ) : (
        <>
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtres
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>Équipement</Label>
                  <Select value={equipmentFilter} onValueChange={setEquipmentFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les équipements</SelectItem>
                      <SelectItem value="EQ-001">Compresseur A1</SelectItem>
                      <SelectItem value="EQ-002">Machine B3</SelectItem>
                      <SelectItem value="EQ-003">Ligne C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Statut</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="active">Actifs</SelectItem>
                      <SelectItem value="inactive">Inactifs</SelectItem>
                      <SelectItem value="overdue">En retard</SelectItem>
                      <SelectItem value="upcoming">À venir</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setEquipmentFilter('all');
                      setStatusFilter('all');
                    }}
                  >
                    Réinitialiser
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Planning List */}
          <Card>
            <CardHeader>
              <CardTitle>Planning des maintenances</CardTitle>
              <CardDescription>
                {filteredPlanning.length} maintenance(s) programmée(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Équipement</TableHead>
                    <TableHead>Fréquence</TableHead>
                    <TableHead>Prochaine exécution</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlanning.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-mono">{plan.id}</TableCell>
                      <TableCell className="font-medium">{plan.title}</TableCell>
                      <TableCell>{plan.equipment_name}</TableCell>
                      <TableCell>{getFrequencyLabel(plan.frequency_type, plan.frequency_value)}</TableCell>
                      <TableCell>{new Date(plan.next_date).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>{plan.estimated_duration}h</TableCell>
                      <TableCell>{getStatusBadge(plan.next_date, plan.active)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedPlan(plan);
                              // prefill form
                              setFormTitle(plan.title || '');
                              setFormDescription(plan.description || '');
                              setFormEquipmentId(plan.equipment_id);
                              setFormFrequency(plan.frequency_type);
                              setFormNextDate(plan.next_date || '');
                              setShowCreateDialog(true);
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              // quick replanify: push to today
                              try {
                                const iso = new Date().toISOString();
                                await api.updatePlanningNextDate(plan.id, iso);
                                toast.success('Prochaine date mise à jour');
                                const plans = await api.listPlannings();
                                const mapped: PreventiveMaintenance[] = (plans as any[]).map((p) => ({
                                  id: String(p.id),
                                  equipment_id: String(p.equipement_id),
                                  equipment_name: `#${p.equipement_id}`,
                                  title: `Planning ${p.id}`,
                                  description: '',
                                  frequency_type: 'monthly',
                                  frequency_value: 1,
                                  next_date: p.prochaine_date || '',
                                  last_executed: p.derniere_date || '',
                                  estimated_duration: 0,
                                  technician: '',
                                  active: true,
                                }));
                                setPlanning(mapped);
                              } catch {
                                toast.error('Échec de replanification');
                              }
                            }}
                          >
                            Replanifier
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              try {
                                await api.deletePlanning(plan.id);
                                setPlanning(planning.filter(p => p.id !== plan.id));
                                toast.success('Planning supprimé');
                              } catch {
                                toast.error('Échec de suppression');
                              }
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedPlan ? 'Modifier le planning' : 'Nouveau planning'}
            </DialogTitle>
            <DialogDescription>
              {selectedPlan ? 'Modifier les paramètres de maintenance préventive' : 'Créer un nouveau planning de maintenance préventive'}
            </DialogDescription>
          </DialogHeader>
          <PlanForm plan={selectedPlan || undefined} />
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowCreateDialog(false);
              setSelectedPlan(null);
            }}>
              Annuler
            </Button>
            <Button onClick={async () => {
              if (!formEquipmentId || !formFrequency) {
                toast.error('Équipement et fréquence sont requis');
                return;
              }
              try {
                if (selectedPlan) {
                  await api.updatePlanning(selectedPlan.id, {
                    equipement_id: Number(formEquipmentId),
                    frequence: formFrequency,
                    prochaine_date: formNextDate || undefined,
                    derniere_date: selectedPlan.last_executed || undefined,
                  });
                  toast.success('Planning mis à jour');
                } else {
                  await api.createPlanning({
                    equipement_id: Number(formEquipmentId),
                    frequence: formFrequency,
                    prochaine_date: formNextDate || undefined,
                  });
                  toast.success('Planning créé avec succès');
                }
                setFormTitle('');
                setFormDescription('');
                setFormEquipmentId('');
                setFormFrequency('monthly');
                setFormNextDate('');
                setShowCreateDialog(false);
                setSelectedPlan(null);
                // refresh
                const plans = await api.listPlannings();
                const mapped: PreventiveMaintenance[] = (plans as any[]).map((p) => ({
                  id: String(p.id),
                  equipment_id: String(p.equipement_id),
                  equipment_name: `#${p.equipement_id}`,
                  title: `Planning ${p.id}`,
                  description: '',
                  frequency_type: 'monthly',
                  frequency_value: 1,
                  next_date: p.prochaine_date || '',
                  last_executed: p.derniere_date || '',
                  estimated_duration: 0,
                  technician: '',
                  active: true,
                }));
                setPlanning(mapped);
              } catch {
                toast.error(selectedPlan ? 'Échec de mise à jour' : 'Échec de création');
              }
            }}>
              {selectedPlan ? 'Sauvegarder' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}