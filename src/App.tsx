import React, { useState, useEffect, createContext, useContext } from 'react';
import api, { setToken, getToken } from '@/lib/api';
import { Bell, Sun, Moon, User, LogOut, Home, Users, Wrench, Calendar, HardHat, FileText, Settings, HelpCircle } from 'lucide-react';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Avatar, AvatarFallback } from './components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './components/ui/dropdown-menu';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import { AuthPage } from './components/AuthPage';
import { DashboardPage } from './components/DashboardPage';
import { UsersPage } from './components/UsersPage';
import { InterventionsPage } from './components/InterventionsPage';
import { PlanningPage } from './components/PlanningPage';
import { EquipmentPage } from './components/EquipmentPage';
import { TechniciansPage } from './components/TechniciansPage';
import { DocumentsPage } from './components/DocumentsPage';
import { ProfilePage } from './components/ProfilePage';
import { HelpPage } from './components/HelpPage';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

// Types
export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: 'admin' | 'responsible' | 'technician' | 'client';
}

export interface Notification {
  id: string;
  type: string;
  message: string;
  date: string;
  intervention_id?: string;
  read: boolean;
}

// Auth Context
const AuthContext = createContext<{
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}>({
  user: null,
  login: async () => false,
  logout: () => {},
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

// Theme Context
const ThemeContext = createContext<{
  isDark: boolean;
  toggleTheme: () => void;
}>({
  isDark: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

// App Layout Component
function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'assignment',
      message: 'Nouvelle intervention assignée',
      date: '2025-08-28T10:30:00Z',
      intervention_id: 'INT-001',
      read: false
    },
    {
      id: '2',
      type: 'completion',
      message: 'Intervention INT-002 terminée',
      date: '2025-08-28T09:15:00Z',
      intervention_id: 'INT-002',
      read: false
    }
  ]);
  
  const [currentPage, setCurrentPage] = useState('dashboard');
  const unreadCount = notifications.filter(n => !n.read).length;

  const sidebarItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home, roles: ['admin', 'responsible', 'technician', 'client'] },
    { id: 'interventions', label: 'Interventions', icon: Wrench, roles: ['admin', 'responsible', 'technician'] },
    { id: 'planning', label: 'Planification', icon: Calendar, roles: ['admin', 'responsible'] },
    { id: 'equipment', label: 'Équipements', icon: Settings, roles: ['admin', 'responsible', 'technician'] },
    { id: 'technicians', label: 'Techniciens', icon: HardHat, roles: ['admin', 'responsible'] },
    { id: 'users', label: 'Utilisateurs', icon: Users, roles: ['admin'] },
    { id: 'documents', label: 'Documents', icon: FileText, roles: ['admin', 'responsible', 'technician'] },
    { id: 'help', label: 'Aide', icon: HelpCircle, roles: ['admin', 'responsible', 'technician', 'client'] },
  ];

  const visibleItems = sidebarItems.filter(item => item.roles.includes(user?.role || ''));

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'users':
        return <UsersPage />;
      case 'interventions':
        return <InterventionsPage />;
      case 'planning':
        return <PlanningPage />;
      case 'equipment':
        return <EquipmentPage />;
      case 'technicians':
        return <TechniciansPage />;
      case 'documents':
        return <DocumentsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'help':
        return <HelpPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <Sidebar>
          <SidebarContent>
            <div className="p-4">
              <h2 className="font-bold text-lg">ERP MIF Maroc</h2>
              <div className="mt-2">
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  📋 Template Demo
                </Badge>
              </div>
            </div>
            
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {visibleItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setCurrentPage(item.id)}
                        isActive={currentPage === item.id}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div className="hidden md:flex items-center gap-2">
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    ✅ Connecté au serveur backend
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative">
                      <Bell className="h-4 w-4" />
                      {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <div className="p-2">
                      <h3 className="font-medium mb-2">Notifications</h3>
                      {notifications.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Aucune notification</p>
                      ) : (
                        <div className="space-y-2">
                          {notifications.slice(0, 5).map((notification) => (
                            <div key={notification.id} className="p-2 text-sm border rounded">
                              <p className={!notification.read ? 'font-medium' : ''}>{notification.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(notification.date).toLocaleString('fr-FR')}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Theme Toggle */}
                <Button variant="ghost" size="sm" onClick={toggleTheme}>
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {user?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden md:inline">{user?.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setCurrentPage('profile')}>
                      <User className="h-4 w-4 mr-2" />
                      Profil
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto p-6">
            {renderPage()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  // Try restore from backend token, else stay logged out
  useEffect(() => {
    const init = async () => {
      try {
        const token = getToken();
        if (token) {
          const me: any = await api.me();
          // Backend roles are fr: admin, responsable, technicien, client
          const roleMap: Record<string, User['role']> = {
            admin: 'admin',
            responsable: 'responsible',
            technicien: 'technician',
            client: 'client',
          };
          const mapped: User = {
            id: String(me.id ?? me.user_id ?? '0'),
            username: me.username ?? me.email,
            email: me.email,
            name: me.full_name ?? me.username ?? me.email ?? 'Utilisateur',
            role: roleMap[me.role] ?? 'client',
          };
          setUser(mapped);
          localStorage.setItem('user', JSON.stringify(mapped));
        }
      } catch (error) {
        console.error('Failed to restore user session:', error);
        // Clear invalid token
        setToken(null);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const token = await api.loginWithUsername(username, password);
      setToken(token.access_token);

      // Small delay to ensure token is properly stored
      await new Promise(resolve => setTimeout(resolve, 100));

      const me: any = await api.me();
      const roleMap: Record<string, User['role']> = {
        admin: 'admin',
        responsable: 'responsible',
        technicien: 'technician',
        client: 'client',
      };
      const mapped: User = {
        id: String(me.id ?? me.user_id ?? '0'),
        username: me.username ?? me.email,
        email: me.email,
        name: me.full_name ?? me.username ?? me.email ?? 'Utilisateur',
        role: roleMap[me.role] ?? 'client',
      };
      setUser(mapped);
      localStorage.setItem('user', JSON.stringify(mapped));
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Échec de la connexion', {
        description: 'Vérifiez vos identifiants et assurez-vous que le serveur backend est en cours d\'exécution.'
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  setToken(null);
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      <ThemeContext.Provider value={{ isDark, toggleTheme }}>
        <div className={isDark ? 'dark' : ''}>
          {user && !isLoading ? <AppLayout>{null}</AppLayout> : <AuthPage />}
          <Toaster />
        </div>
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}