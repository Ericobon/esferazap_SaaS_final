import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Sidebar } from '@/components/Sidebar.jsx'
import { CompraLeads } from '@/components/CompraLeads.jsx'
import { useAuth } from '@/hooks/useAuth.js'
import { LogOut, User, Building, MapPin, Phone, Mail, BarChart3 } from 'lucide-react'

export function Dashboard() {
  const { user, logout } = useAuth()
  const [activeSection, setActiveSection] = useState('dashboard')

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

  const renderContent = () => {
    switch (activeSection) {
      case 'compra-leads':
        return <CompraLeads />
      
      case 'dashboard':
      default:
        return (
          <div className="space-y-6">
            {/* Analytics Overview */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Analytics overview</h1>
                  <p className="text-gray-600">Explore more</p>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Today</span>
                  <span>30 Oct - 31 Oct</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-green-600 text-sm font-medium">+12%</div>
                    <div className="text-2xl font-bold">25</div>
                    <div className="text-sm text-gray-600">Active chats</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-green-600 text-sm font-medium">+30%</div>
                    <div className="text-2xl font-bold">13</div>
                    <div className="text-sm text-gray-600">Chats pendentes</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-red-600 text-sm font-medium">-3%</div>
                    <div className="text-2xl font-bold">23</div>
                    <div className="text-sm text-gray-600">Chats atribuídos</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-green-600 text-sm font-medium">+10%</div>
                    <div className="text-2xl font-bold">14</div>
                    <div className="text-sm text-gray-600">Chats resolvidos</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-green-600 text-sm font-medium">+18%</div>
                    <div className="text-2xl font-bold">11 dias</div>
                    <div className="text-sm text-gray-600">Tempo de resolução</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-green-600 text-sm font-medium">+7%</div>
                    <div className="text-2xl font-bold">alguns segundos</div>
                    <div className="text-sm text-gray-600">Tempo de primeira resposta</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* WhatsApp Numbers */}
            <Card>
              <CardHeader>
                <CardTitle>WhatsApp numbers</CardTitle>
                <Button size="sm" className="ml-auto">Add number</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <div className="font-medium">Sales</div>
                        <div className="text-sm text-gray-600">+5511234567890</div>
                        <div className="text-xs text-green-600">Connected</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">183</div>
                      <div className="text-sm text-gray-600">Active</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team */}
            <Card>
              <CardHeader>
                <CardTitle>Team</CardTitle>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">All devices</span>
                  <Button size="sm">Add member</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        D
                      </div>
                      <div>
                        <div className="font-medium">David</div>
                        <div className="text-sm text-gray-600">david@company.com</div>
                      </div>
                      <Badge variant="secondary">Administrator</Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Last activity</div>
                      <div className="text-sm">3 minutes ago</div>
                      <Badge className="bg-green-100 text-green-800">Available</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        user={user}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1"></div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
