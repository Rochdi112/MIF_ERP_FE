import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Calendar, Clock, AlertCircle, CheckCircle, Users, Wrench, Settings, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { dashboardApi } from '@/lib/api';
import { toast } from 'sonner';

const interventionData = [
  { month: 'Jan', corrective: 12, preventive: 8 },
  { month: 'Fév', corrective: 15, preventive: 10 },
  { month: 'Mar', corrective: 8, preventive: 12 },
  { month: 'Avr', corrective: 10, preventive: 15 },
  { month: 'Mai', corrective: 14, preventive: 9 },
  { month: 'Jun', corrective: 11, preventive: 13 },
];

const statusData = [
  { name: 'Ouvertes', value: 12, color: '#6B7280' },
  { name: 'En cours', value: 8, color: '#2563EB' },
  { name: 'En attente', value: 5, color: '#F59E0B' },
  { name: 'Terminées', value: 25, color: '#10B981' },
];

const recentInterventions = [
  {
    id: 'INT-001',
    title: 'Maintenance compresseur A1',
    status: 'en_cours',
    priority: 'high',
    technician: 'Mohammed Alami',
    equipment: 'Compresseur A1',
    date: '2025-08-28'
  },
  {
    id: 'INT-002',
    title: 'Révision générale machine B3',
    status: 'affectee',
    priority: 'medium',
    technician: 'Fatima Bennani',
    equipment: 'Machine B3',
    date: '2025-08-29'
  },
  {
    id: 'INT-003',
    title: 'Réparation urgente ligne C',
    status: 'ouverte',
    priority: 'high',
    technician: 'Non assigné',
    equipment: 'Ligne C',
    date: '2025-08-30'
  },
];

const getStatusBadge = (status: string) => {
  const statusConfig = {
    'ouverte': { label: 'Ouverte', className: 'bg-gray-500' },
    'affectee': { label: 'Affectée', className: 'bg-indigo-500' },
    'en_cours': { label: 'En cours', className: 'bg-blue-500' },
    'en_attente': { label: 'En attente', className: 'bg-yellow-500' },
    'cloturee': { label: 'Terminée', className: 'bg-green-500' },
    'annulee': { label: 'Annulée', className: 'bg-red-500' },
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || { label: status, className: 'bg-gray-500' };
  return <Badge className={config.className}>{config.label}</Badge>;
};

const getPriorityBadge = (priority: string) => {
  const priorityConfig = {
    'low': { label: 'Faible', className: 'bg-green-100 text-green-800' },
    'medium': { label: 'Moyenne', className: 'bg-yellow-100 text-yellow-800' },
    'high': { label: 'Élevée', className: 'bg-red-100 text-red-800' },
  };
  
  const config = priorityConfig[priority as keyof typeof priorityConfig] || { label: priority, className: 'bg-gray-100 text-gray-800' };
  return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
};

export function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await dashboardApi.getStats();
        setStats(data);
        toast.success('Données chargées avec succès');
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
        setError('Impossible de charger les statistiques. Vérifiez la connexion au serveur.');
        toast.error('Erreur lors du chargement des statistiques', {
          description: 'Vérifiez que le serveur backend est en cours d\'exécution.'
        });
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  // Use real data if available, otherwise show error
  const currentStats = stats || {
    interventions: {
      ouverte: 0,
      en_cours: 0,
      en_attente: 0,
      terminees: 0,
      total_mensuel: 0,
      terminees_mensuel: 0
    },
    taux_resolution: 0,
    evolution_mensuelle: [],
    priorites: { urgente: 0, haute: 0, normale: 0, basse: 0 },
    equipements: { total: 0, operationnel: 0, maintenance: 0 },
    utilisateurs: { total: 0, actifs: 0 }
  };

  const realStatusData = [
    { name: 'Ouvertes', value: currentStats.interventions.ouverte, color: '#6B7280' },
    { name: 'En cours', value: currentStats.interventions.en_cours, color: '#2563EB' },
    { name: 'En attente', value: currentStats.interventions.en_attente, color: '#F59E0B' },
    { name: 'Terminées', value: currentStats.interventions.terminees, color: '#10B981' },
  ];

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1>Tableau de bord</h1>
          <p className="text-muted-foreground">
            Vue d'ensemble des interventions et de l'activité de maintenance
          </p>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <div>
                <h3 className="text-lg font-semibold text-red-800">Connexion au serveur impossible</h3>
                <p className="text-red-600 mt-1">{error}</p>
                <p className="text-sm text-red-500 mt-2">
                  Assurez-vous que le serveur backend est en cours d'exécution sur http://localhost:8000
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1>Tableau de bord</h1>
        <p className="text-muted-foreground">
          Vue d'ensemble des interventions et de l'activité de maintenance
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Interventions ouvertes
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStats.interventions.ouverte}</div>
            <p className="text-xs text-muted-foreground">
              +2 depuis hier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              En cours
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStats.interventions.en_cours}</div>
            <p className="text-xs text-muted-foreground">
              -1 depuis hier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Terminées ce mois
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStats.interventions.terminees_mensuel}</div>
            <p className="text-xs text-muted-foreground">
              +15% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taux de résolution
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStats.taux_resolution}%</div>
            <Progress value={currentStats.taux_resolution} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Additional KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Équipements totaux
            </CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStats.equipements.total}</div>
            <p className="text-xs text-muted-foreground">
              {currentStats.equipements.operationnel} opérationnels
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Équipements en maintenance
            </CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStats.equipements.maintenance}</div>
            <p className="text-xs text-muted-foreground">
              {((currentStats.equipements.maintenance / currentStats.equipements.total) * 100).toFixed(1)}% du total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Utilisateurs actifs
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStats.utilisateurs.actifs}</div>
            <p className="text-xs text-muted-foreground">
              sur {currentStats.utilisateurs.total} utilisateurs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Priorités urgentes
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStats.priorites.urgente}</div>
            <p className="text-xs text-muted-foreground">
              interventions prioritaires
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Interventions Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Interventions par mois</CardTitle>
            <CardDescription>
              Évolution des interventions correctives et préventives
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={currentStats.evolution_mensuelle}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#3B82F6" name="Total interventions" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition par statut</CardTitle>
            <CardDescription>
              Distribution des interventions par statut
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={realStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {realStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Interventions */}
      <Card>
        <CardHeader>
          <CardTitle>Interventions récentes</CardTitle>
          <CardDescription>
            Dernières interventions créées ou modifiées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentInterventions.map((intervention) => (
              <div key={intervention.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{intervention.title}</span>
                    <Badge variant="outline">{intervention.id}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {intervention.technician}
                    </span>
                    <span className="flex items-center gap-1">
                      <Settings className="h-3 w-3" />
                      {intervention.equipment}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {intervention.date}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getPriorityBadge(intervention.priority)}
                  {getStatusBadge(intervention.status)}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Button variant="outline" className="w-full">
              Voir toutes les interventions
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Nouvelle intervention
            </CardTitle>
            <CardDescription>
              Créer une nouvelle intervention de maintenance
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Planifier maintenance
            </CardTitle>
            <CardDescription>
              Programmer une maintenance préventive
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Gérer équipements
            </CardTitle>
            <CardDescription>
              Ajouter ou modifier un équipement
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}