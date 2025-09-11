import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Plus, Search, Edit, Trash2, Settings, Calendar, Wrench, Eye } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface Equipment {
  id: string;
  name: string;
  description: string;
  model?: string;
  serial_number?: string;
  manufacturer?: string;
  installation_date?: string;
  location: string;
  status: 'operational' | 'maintenance' | 'breakdown' | 'decommissioned';
  last_maintenance?: string;
  next_maintenance?: string;
  total_interventions: number;
}

const mockEquipments: Equipment[] = [];

const getStatusBadge = (status: string) => {
  const statusConfig = {
    'operational': { label: 'Opérationnel', className: 'bg-green-500' },
    'maintenance': { label: 'En maintenance', className: 'bg-yellow-500' },
    'breakdown': { label: 'En panne', className: 'bg-red-500' },
    'decommissioned': { label: 'Hors service', className: 'bg-gray-500' },
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || { label: status, className: 'bg-gray-500' };
  return <Badge className={config.className}>{config.label}</Badge>;
};

export function EquipmentPage() {
  const [equipments, setEquipments] = useState<Equipment[]>(mockEquipments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formFreq, setFormFreq] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const list = await api.listEquipments();
        const mapped: Equipment[] = (list as any[]).map((e) => ({
          id: String(e.id),
          name: e.nom,
          description: e.type,
          model: undefined,
          serial_number: undefined,
          manufacturer: undefined,
          installation_date: '',
          location: e.localisation,
          status: 'operational',
          last_maintenance: undefined,
          next_maintenance: undefined,
          total_interventions: 0,
        }));
        setEquipments(mapped);
      } catch {
        // keep mock
      }
    };
    load();
  }, []);

  const filteredEquipments = equipments.filter(equipment => {
    const matchesSearch = equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || equipment.status === statusFilter;
    const matchesLocation = locationFilter === 'all' || equipment.location.includes(locationFilter);
    
    return matchesSearch && matchesStatus && matchesLocation;
  });

  const EquipmentForm = ({ equipment }: { equipment?: Equipment }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Nom de l'équipement</Label>
          <Input placeholder="Nom de l'équipement" value={formName} onChange={(e) => setFormName(e.target.value)} />
        </div>
        <div>
          <Label>Modèle</Label>
          <Input placeholder="Modèle" defaultValue={equipment?.model} />
        </div>
      </div>
      
      <div>
        <Label>Description</Label>
        <Textarea placeholder="Type (catégorie)" value={formType} onChange={(e) => setFormType(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Fabricant</Label>
          <Input placeholder="Fabricant" defaultValue={equipment?.manufacturer} />
        </div>
        <div>
          <Label>Numéro de série</Label>
          <Input placeholder="Numéro de série" defaultValue={equipment?.serial_number} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Emplacement</Label>
          <Input placeholder="Emplacement" value={formLocation} onChange={(e) => setFormLocation(e.target.value)} />
        </div>
        <div>
          <Label>Statut</Label>
          <Select defaultValue={equipment?.status}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="operational">Opérationnel</SelectItem>
              <SelectItem value="maintenance">En maintenance</SelectItem>
              <SelectItem value="breakdown">En panne</SelectItem>
              <SelectItem value="decommissioned">Hors service</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Fréquence d'entretien (optionnel)</Label>
        <Input placeholder="mensuel / trimestriel ..." value={formFreq} onChange={(e) => setFormFreq(e.target.value)} />
      </div>
    </div>
  );

  const EquipmentDetails = ({ equipment }: { equipment: Equipment }) => (
    <div className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {equipment.name}
            {getStatusBadge(equipment.status)}
          </CardTitle>
          <CardDescription>{equipment.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Modèle</Label>
              <p>{equipment.model || 'Non spécifié'}</p>
            </div>
            <div>
              <Label>Fabricant</Label>
              <p>{equipment.manufacturer || 'Non spécifié'}</p>
            </div>
            <div>
              <Label>Numéro de série</Label>
              <p>{equipment.serial_number || 'Non spécifié'}</p>
            </div>
            <div>
              <Label>Emplacement</Label>
              <p>{equipment.location}</p>
            </div>
            <div>
              <Label>Date d'installation</Label>
              <p>{equipment.installation_date ? new Date(equipment.installation_date).toLocaleDateString('fr-FR') : 'Non spécifiée'}</p>
            </div>
            <div>
              <Label>Total interventions</Label>
              <p>{equipment.total_interventions}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Informations de maintenance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Dernière maintenance</Label>
              <p>{equipment.last_maintenance ? new Date(equipment.last_maintenance).toLocaleDateString('fr-FR') : 'Aucune'}</p>
            </div>
            <div>
              <Label>Prochaine maintenance</Label>
              <p>{equipment.next_maintenance ? new Date(equipment.next_maintenance).toLocaleDateString('fr-FR') : 'Non programmée'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Interventions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Interventions récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="p-3 border rounded">
              <div className="flex items-center justify-between">
                <span className="font-medium">Maintenance préventive</span>
                <Badge variant="outline">INT-001</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">01/08/2025 - Révision complète</p>
            </div>
            <div className="p-3 border rounded">
              <div className="flex items-center justify-between">
                <span className="font-medium">Réparation urgente</span>
                <Badge variant="outline">INT-015</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">15/07/2025 - Remplacement pièce défectueuse</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Gestion des équipements</h1>
          <p className="text-muted-foreground">
            Gérer les équipements et leurs informations de maintenance
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouvel équipement
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total équipements</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{equipments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Opérationnels</CardTitle>
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {equipments.filter(e => e.status === 'operational').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En maintenance</CardTitle>
            <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {equipments.filter(e => e.status === 'maintenance').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En panne</CardTitle>
            <div className="h-2 w-2 bg-red-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {equipments.filter(e => e.status === 'breakdown').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label>Recherche</Label>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nom, description, ID..."
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
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="operational">Opérationnel</SelectItem>
                  <SelectItem value="maintenance">En maintenance</SelectItem>
                  <SelectItem value="breakdown">En panne</SelectItem>
                  <SelectItem value="decommissioned">Hors service</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Emplacement</Label>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les emplacements</SelectItem>
                  <SelectItem value="Atelier A">Atelier A</SelectItem>
                  <SelectItem value="Atelier B">Atelier B</SelectItem>
                  <SelectItem value="Atelier C">Atelier C</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setLocationFilter('all');
                }}
              >
                Réinitialiser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Equipment List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des équipements</CardTitle>
          <CardDescription>
            {filteredEquipments.length} équipement(s) trouvé(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Modèle</TableHead>
                <TableHead>Emplacement</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Prochaine maintenance</TableHead>
                <TableHead>Interventions</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEquipments.map((equipment) => (
                <TableRow key={equipment.id}>
                  <TableCell className="font-mono">{equipment.id}</TableCell>
                  <TableCell className="font-medium">{equipment.name}</TableCell>
                  <TableCell>{equipment.model || '-'}</TableCell>
                  <TableCell>{equipment.location}</TableCell>
                  <TableCell>{getStatusBadge(equipment.status)}</TableCell>
                  <TableCell>
                    {equipment.next_maintenance 
                      ? new Date(equipment.next_maintenance).toLocaleDateString('fr-FR')
                      : 'Non programmée'
                    }
                  </TableCell>
                  <TableCell>{equipment.total_interventions}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedEquipment(equipment);
                          setShowDetailsDialog(true);
                        }}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedEquipment(equipment);
                          setShowCreateDialog(true);
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          try {
                            await api.deleteEquipment(equipment.id);
                            setEquipments(equipments.filter(e => e.id !== equipment.id));
                            toast.success('Équipement supprimé');
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

      {/* Create/Edit Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedEquipment ? 'Modifier l\'équipement' : 'Nouvel équipement'}
            </DialogTitle>
            <DialogDescription>
              {selectedEquipment ? 'Modifier les informations de l\'équipement' : 'Ajouter un nouvel équipement au système'}
            </DialogDescription>
          </DialogHeader>
          <EquipmentForm equipment={selectedEquipment || undefined} />
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowCreateDialog(false);
              setSelectedEquipment(null);
            }}>
              Annuler
            </Button>
            <Button onClick={async () => {
              if (selectedEquipment) {
                toast.info('Modification non disponible via l\'API');
                setShowCreateDialog(false);
                setSelectedEquipment(null);
                return;
              }
              if (!formName || !formType || !formLocation) {
                toast.error('Nom, type et localisation sont requis');
                return;
              }
              try {
                await api.createEquipment({
                  nom: formName,
                  type: formType,
                  localisation: formLocation,
                  frequence_entretien: formFreq || undefined,
                });
                toast.success('Équipement créé avec succès');
                setFormName('');
                setFormType('');
                setFormLocation('');
                setFormFreq('');
                setShowCreateDialog(false);
                // refresh list
                const list = await api.listEquipments();
                const mapped: Equipment[] = (list as any[]).map((e) => ({
                  id: String(e.id),
                  name: e.nom,
                  description: e.type,
                  model: undefined,
                  serial_number: undefined,
                  manufacturer: undefined,
                  installation_date: '',
                  location: e.localisation,
                  status: 'operational',
                  last_maintenance: undefined,
                  next_maintenance: undefined,
                  total_interventions: 0,
                }));
                setEquipments(mapped);
              } catch {
                toast.error('Échec de création');
              }
            }}>
              {selectedEquipment ? 'Sauvegarder' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Equipment Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Détails de l'équipement</DialogTitle>
            <DialogDescription>
              {selectedEquipment?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedEquipment && <EquipmentDetails equipment={selectedEquipment} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}