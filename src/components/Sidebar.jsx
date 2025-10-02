import { useState } from 'react'
import { 
  BarChart3, 
  Bot, 
  Calendar, 
  MessageSquare, 
  Users, 
  Settings, 
  HelpCircle,
  Upload,
  Target,
  ShoppingCart,
  Zap,
  ChevronDown,
  ChevronRight
} from 'lucide-react'

export function Sidebar({ activeSection, onSectionChange, user }) {
  const [expandedSections, setExpandedSections] = useState({
    ia: true,
    campanhas: true
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      type: 'single'
    },
    {
      id: 'ia',
      label: 'IA',
      icon: Bot,
      type: 'expandable',
      badge: '3',
      children: [
        { id: 'bots-ia', label: 'Bots de IA', icon: Bot },
        { id: 'upload-documentos', label: 'Upload de documentos', icon: Upload }
      ]
    },
    {
      id: 'campanhas',
      label: 'Campanhas',
      icon: Target,
      type: 'expandable',
      children: [
        { id: 'leads-organicos', label: 'Leads Orgânicos', icon: Target },
        { id: 'compra-leads', label: 'Compra de Leads', icon: ShoppingCart }
      ]
    },
    {
      id: 'conversas',
      label: 'Conversas',
      icon: MessageSquare,
      type: 'single',
      badge: '12'
    },
    {
      id: 'contatos',
      label: 'Contatos',
      icon: Users,
      type: 'single',
      badge: '48'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      type: 'single'
    },
    {
      id: 'agenda',
      label: 'Agenda',
      icon: Calendar,
      type: 'single'
    },
    {
      id: 'configuracoes',
      label: 'Configurações',
      icon: Settings,
      type: 'single'
    },
    {
      id: 'evolution-api',
      label: 'Evolution API',
      icon: Zap,
      type: 'single'
    },
    {
      id: 'suporte',
      label: 'Suporte',
      icon: HelpCircle,
      type: 'single'
    }
  ]

  const renderMenuItem = (item) => {
    const isActive = activeSection === item.id
    const isExpanded = expandedSections[item.id]

    if (item.type === 'expandable') {
      return (
        <div key={item.id} className="space-y-1">
          <button
            onClick={() => toggleSection(item.id)}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              isActive 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-3">
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          
          {isExpanded && item.children && (
            <div className="ml-6 space-y-1">
              {item.children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => onSectionChange(child.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                    activeSection === child.id
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <child.icon className="w-4 h-4" />
                  <span>{child.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )
    }

    return (
      <button
        key={item.id}
        onClick={() => onSectionChange(item.id)}
        className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
          isActive 
            ? 'bg-blue-100 text-blue-700' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <div className="flex items-center space-x-3">
          <item.icon className="w-5 h-5" />
          <span>{item.label}</span>
        </div>
        {item.badge && (
          <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
            {item.badge}
          </span>
        )}
      </button>
    )
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">EsferaZap</h1>
            <p className="text-xs text-gray-600">by InsightEsfera</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map(renderMenuItem)}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {user?.displayName?.charAt(0) || user?.firstName?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.displayName || `${user?.firstName} ${user?.lastName}` || 'Usuário'}
            </p>
            <p className="text-xs text-gray-600 truncate">
              {user?.email || 'usuario@exemplo.com'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
