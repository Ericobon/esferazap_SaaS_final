import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { useAuth } from '@/hooks/useAuth.js'
import { LogOut, User, Building, MapPin, Phone, Mail } from 'lucide-react'

export function Dashboard({ mockUser }) {
  const { user: authUser, logout } = useAuth()
  const user = mockUser || authUser

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (!user) {
    return <div>Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">EsferaZap</h1>
              <p className="text-sm text-gray-600">Dashboard</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </Button>
        </div>

        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo, {user.displayName || `${user.firstName} ${user.lastName}` || 'Usuário'}!
          </h2>
          <p className="text-lg text-gray-600">
            Gerencie suas automações do WhatsApp Business com IA avançada.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Perfil do Usuário</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="Profile" 
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-blue-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {user.displayName || `${user.firstName} ${user.lastName}` || 'Usuário'}
                  </h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>

              {user.phone && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{user.phone}</span>
                </div>
              )}

              {user.company && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Building className="w-4 h-4" />
                  <span>{user.company}</span>
                </div>
              )}

              {(user.city || user.state) && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{[user.city, user.state].filter(Boolean).join(', ')}</span>
                </div>
              )}

              {user.sector && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Setor:</span>
                  <Badge variant="secondary">{user.sector}</Badge>
                </div>
              )}

              {user.companySize && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Tamanho:</span>
                  <Badge variant="outline">{user.companySize}</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>
                Comece a automatizar seu WhatsApp Business
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="h-20 flex flex-col items-center justify-center space-y-2">
                  <span className="text-lg">🤖</span>
                  <span>Criar Chatbot</span>
                </Button>
                
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <span className="text-lg">📊</span>
                  <span>Ver Analytics</span>
                </Button>
                
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <span className="text-lg">⚙️</span>
                  <span>Configurações</span>
                </Button>
                
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <span className="text-lg">📱</span>
                  <span>Conectar WhatsApp</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recursos Disponíveis</CardTitle>
              <CardDescription>
                Explore todas as funcionalidades do EsferaZap
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <h3 className="font-semibold">Chatbots Inteligentes</h3>
                  <p className="text-sm text-gray-600">
                    Crie chatbots com IA para automatizar atendimento
                  </p>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="font-semibold">Analytics em Tempo Real</h3>
                  <p className="text-sm text-gray-600">
                    Monitore conversas e performance em tempo real
                  </p>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="font-semibold">Automação Avançada</h3>
                  <p className="text-sm text-gray-600">
                    Configure fluxos automatizados para seu negócio
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
