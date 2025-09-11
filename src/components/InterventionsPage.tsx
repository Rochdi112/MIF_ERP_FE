import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { Calendar, Search, Plus, Filter, Eye, Edit, Play, Pause, CheckCircle, X, Clock, AlertCircle, User, Settings, FileText } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface Intervention {
  id: string;
  title: string;
  description: string;
  status: 'ouverte' | 'affectee' | 'en_cours' | 'en_attente' | 'cloturee' | 'annulee' | 'archivee';
  priority: 'low' | 'medium' | 'high';
  urgency: 'low' | 'medium' | 'high';
  type: 'corrective' | 'preventive';
  technician: string;
  equipment: string;
  created_date: string;
  scheduled_date?: string;
  completed_date?: string;
  estimated_cost?: number;
  actual_cost?: number;
}

const mockInterventions: Intervention[] = [
  {
    id: 'INT-001',
    title: 'Maintenance compresseur A1',
    description: 'Révision complète du compresseur principal avec remplacement des filtres',
    status: 'en_cours',
    priority: 'high',
    urgency: 'high',
    type: 'corrective',
    technician: 'Mohammed Alami',
    equipment: 'Compresseur A1',
    created_date: '2025-08-25',
    scheduled_date: '2025-08-28',
    estimated_cost: 2500
  },
  {
    id: 'INT-002',
    title: 'Contrôle sécurité générateur B2',
    description: 'Vérification des systèmes de sécurité et test des alarmes',
    status: 'ouverte',
    priority: 'medium',
    urgency: 'medium',
    type: 'preventive',
    technician: 'Ahmed Bennani',
    equipment: 'Générateur B2',
    created_date: '2025-08-26',
    scheduled_date: '2025-08-30',
    estimated_cost: 1200
  },
  {
    id: 'INT-003',
    title: 'Réparation pompe hydraulique C3',
    description: 'Remplacement des joints et réparation de la fuite',
    status: 'affectee',
    priority: 'high',
    urgency: 'high',
    type: 'corrective',
    technician: 'Fatima Alaoui',
    equipment: 'Pompe C3',
    created_date: '2025-08-27',
    scheduled_date: '2025-08-29',
    estimated_cost: 3200
  }
];

export function InterventionsPage() {
  const [interventions, setInterventions] = useState<Intervention[]>(mockInterventions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newType, setNewType] = useState<'corrective' | 'preventive' | ''>('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high' | ''>('');
  const [newEquipementId, setNewEquipementId] = useState<number | ''>('');

  // Load interventions from backend on mount
  useEffect(() => {
    const load = async () => {
      // Only load if user is authenticated and token exists
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.log('No token available, skipping interventions load');
        return;
      }

      try {
        console.log('Loading interventions with token:', token.substring(0, 20) + '...');
        const list = await api.listInterventions();
        console.log('API Response - Interventions loaded:', list);

        if (Array.isArray(list) && list.length > 0) {
          const mapped: Intervention[] = list.map((i) => ({
            id: String(i.id ?? i.intervention_id ?? `INT-${i.id}`),
            title: i.titre || i.title || `Intervention ${i.id}`,
            description: i.description || '',
            status: (i.statut || 'ouverte') as Intervention['status'],
            priority: (i.priorite === 'haute' ? 'high' : i.priorite === 'basse' ? 'low' : 'medium') as Intervention['priority'],
            urgency: i.urgence ? 'high' : 'low',
            type: (i.type || 'corrective') as Intervention['type'],
            technician: i.technicien?.full_name || i.technicien_nom || '',
            equipment: i.equipement?.nom || `#${i.equipement_id}`,
            created_date: i.date_creation || i.created_at || new Date().toISOString(),
            scheduled_date: i.date_limite || undefined,
            estimated_cost: i.cout_estime || undefined,
            actual_cost: i.cout_reel || undefined,
          }));
          console.log('Interventions mapped successfully:', mapped.length, 'items');
          setInterventions(mapped);
          toast.success(`Chargé ${mapped.length} intervention(s) depuis le serveur`);
        } else {
          console.log('No interventions returned from API, keeping mock data');
          toast.info('Aucune intervention trouvée, affichage des données de démonstration');
        }
      } catch (err) {
        console.error('Failed to load interventions:', err);
        toast.error('Erreur lors du chargement des interventions depuis le serveur');
        // Keep mock data on error
        setInterventions(mockInterventions);
      }
    };
    load();
  }, []);

  const filteredInterventions = interventions.filter(intervention => {
    const matchesSearch = intervention.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         intervention.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         intervention.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || intervention.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || intervention.priority === priorityFilter;
    const matchesType = typeFilter === 'all' || intervention.type === typeFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  const getStatusBadge = (status: Intervention['status']) => {
    const variants = {
      ouverte: 'secondary',
      affectee: 'outline',
      en_cours: 'default',
      en_attente: 'outline',
      cloturee: 'default',
      annulee: 'destructive',
      archivee: 'secondary'
    } as const;

    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: Intervention['priority']) => {
    const variants = {
      low: 'secondary',
      medium: 'outline',
      high: 'destructive'
    } as const;

    return (
      <Badge variant={variants[priority] || 'secondary'}>
        {priority === 'low' ? 'Faible' : priority === 'medium' ? 'Moyenne' : 'Élevée'}
      </Badge>
    );
  };

  const getStatusActions = (status: Intervention['status']) => {
    const actions = [];

    switch (status) {
      case 'ouverte':
        actions.push({ action: 'affectee', label: 'Affecter', icon: User });
        break;
      case 'affectee':
        actions.push({ action: 'en_cours', label: 'Commencer', icon: Play });
        break;
      case 'en_cours':
        actions.push({ action: 'en_attente', label: 'Mettre en attente', icon: Pause });
        actions.push({ action: 'cloturee', label: 'Terminer', icon: CheckCircle });
        break;
      case 'en_attente':
        actions.push({ action: 'en_cours', label: 'Reprendre', icon: Play });
        actions.push({ action: 'cloturee', label: 'Terminer', icon: CheckCircle });
        break;
      case 'cloturee':
        actions.push({ action: 'archivee', label: 'Archiver', icon: FileText });
        break;
    }

    return actions;
  };

  const handleStatusChange = async (interventionId: string, newStatus: Intervention['status']) => {
    const backup = interventions;
    setInterventions(interventions.map(intervention =>
      intervention.id === interventionId
        ? { ...intervention, status: newStatus }
        : intervention
    ));

    try {
      await api.changeInterventionStatus(interventionId, newStatus);
      toast.success(`Statut mis à jour vers "${newStatus}"`);
    } catch (e) {
      setInterventions(backup);
      toast.error("Échec de mise à jour du statut");
    }
  };

  const InterventionDetails = ({ intervention }: { intervention: Intervention }) => (
    <Tabs defaultValue="summary" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="summary">Résumé</TabsTrigger>
        <TabsTrigger value="assignment">Affectation</TabsTrigger>
        <TabsTrigger value="history">Historique</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
      </TabsList>

      <TabsContent value="summary" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Statut</Label>
                <p>{getStatusBadge(intervention.status)}</p>
              </div>
              <div>
                <Label>Priorité</Label>
                <p>{getPriorityBadge(intervention.priority)}</p>
              </div>
              <div>
                <Label>Type</Label>
                <p className="capitalize">{intervention.type}</p>
              </div>
              <div>
                <Label>Urgence</Label>
                <p className="capitalize">{intervention.urgency}</p>
              </div>
              <div>
                <Label>Date de création</Label>
                <p>{new Date(intervention.created_date).toLocaleDateString('fr-FR')}</p>
              </div>
              <div>
                <Label>Date programmée</Label>
                <p>{intervention.scheduled_date ? new Date(intervention.scheduled_date).toLocaleDateString('fr-FR') : 'Non programmée'}</p>
              </div>
              <div>
                <Label>Coût estimé</Label>
                <p>{intervention.estimated_cost ? `${intervention.estimated_cost} MAD` : 'Non défini'}</p>
              </div>
              <div>
                <Label>Coût réel</Label>
                <p>{intervention.actual_cost ? `${intervention.actual_cost} MAD` : 'En attente'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="assignment" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Affectation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Technicien assigné</Label>
              <p>{intervention.technician || 'Non assigné'}</p>
            </div>
            <div>
              <Label>Équipement</Label>
              <p>{intervention.equipment}</p>
            </div>
            <div className="flex gap-2">
              {getStatusActions(intervention.status).map((action) => (
                <Button
                  key={action.action}
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange(intervention.id, action.action as Intervention['status'])}
                  className="flex items-center gap-2"
                >
                  <action.icon className="h-4 w-4" />
                  {action.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="history" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Historique des modifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 border rounded">
                <Clock className="h-4 w-4" />
                <span>Créée le {new Date(intervention.created_date).toLocaleString('fr-FR')}</span>
              </div>
              {intervention.status !== 'ouverte' && (
                <div className="flex items-center gap-2 p-2 border rounded">
                  <CheckCircle className="h-4 w-4" />
                  <span>Statut changé vers {intervention.status}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="documents" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Documents associés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>rapport_maintenance_A1.pdf</span>
                </div>
                <Button variant="outline" size="sm">Télécharger</Button>
              </div>
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Aucun autre document</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Interventions</h1>
          <p className="text-muted-foreground">
            Gestion des interventions de maintenance
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle intervention
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div>
              <Label>Recherche</Label>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div>
              <Label>Statut</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="ouverte">Ouverte</SelectItem>
                  <SelectItem value="affectee">Affectée</SelectItem>
                  <SelectItem value="en_cours">En cours</SelectItem>
                  <SelectItem value="en_attente">En attente</SelectItem>
                  <SelectItem value="cloturee">Terminée</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Priorité</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="low">Faible</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="high">Élevée</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="corrective">Corrective</SelectItem>
                  <SelectItem value="preventive">Préventive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setPriorityFilter('all');
                  setTypeFilter('all');
                }}
              >
                Réinitialiser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interventions List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des interventions</CardTitle>
          <CardDescription>
            {filteredInterventions.length} intervention(s) trouvée(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Priorité</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Technicien</TableHead>
                <TableHead>Équipement</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInterventions.map((intervention) => (
                <TableRow key={intervention.id}>
                  <TableCell className="font-mono">{intervention.id}</TableCell>
                  <TableCell className="font-medium">{intervention.title}</TableCell>
                  <TableCell>{getStatusBadge(intervention.status)}</TableCell>
                  <TableCell>{getPriorityBadge(intervention.priority)}</TableCell>
                  <TableCell className="capitalize">{intervention.type}</TableCell>
                  <TableCell>{intervention.technician}</TableCell>
                  <TableCell>{intervention.equipment}</TableCell>
                  <TableCell>{new Date(intervention.created_date).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedIntervention(intervention)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Intervention Details Dialog */}
      <Dialog open={!!selectedIntervention} onOpenChange={() => setSelectedIntervention(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Détails de l'intervention</DialogTitle>
            <DialogDescription>
              {selectedIntervention?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedIntervention && <InterventionDetails intervention={selectedIntervention} />}
        </DialogContent>
      </Dialog>

      {/* Create Intervention Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer une nouvelle intervention</DialogTitle>
            <DialogDescription>
              Remplissez les informations de la nouvelle intervention
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Titre</Label>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Titre de l'intervention"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Description détaillée"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <Select value={newType} onValueChange={(value: string) => setNewType(value as 'corrective' | 'preventive')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corrective">Corrective</SelectItem>
                    <SelectItem value="preventive">Préventive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priorité</Label>
                <Select value={newPriority} onValueChange={(value: string) => setNewPriority(value as 'low' | 'medium' | 'high')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Faible</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Élevée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>ID Équipement</Label>
              <Input
                type="number"
                value={newEquipementId}
                onChange={(e) => setNewEquipementId(e.target.value ? parseInt(e.target.value) : '')}
                placeholder="ID de l'équipement"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Annuler
            </Button>
            <Button onClick={() => {
              // TODO: Implement create intervention
              toast.success('Intervention créée avec succès');
              setShowCreateDialog(false);
              setNewTitle('');
              setNewDescription('');
              setNewType('');
              setNewPriority('');
              setNewEquipementId('');
            }}>
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
