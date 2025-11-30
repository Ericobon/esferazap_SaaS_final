import { useState } from 'react';
import {
  Users, DollarSign, Target, TrendingUp, Filter, Download,
  Search, ShoppingCart, Star, MapPin, Briefcase, Calendar
} from 'lucide-react';

export function CompraLeads() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [cart, setCart] = useState([]);

  const categories = [
    { id: 'all', name: 'Todos', icon: Users },
    { id: 'tech', name: 'Tecnologia', icon: Target },
    { id: 'retail', name: 'Varejo', icon: ShoppingCart },
    { id: 'services', name: 'Serviços', icon: Briefcase },
    { id: 'premium', name: 'Premium', icon: Star },
  ];

  const leadPackages = [
    {
      id: 1,
      category: 'tech',
      title: 'Leads Tecnologia SP',
      description: 'Empresas de tecnologia interessadas em automação',
      quantity: 500,
      price: 997,
      quality: 'Alta',
      region: 'São Paulo',
      tags: ['B2B', 'Tech', 'Qualificados'],
      features: [
        'Contatos verificados',
        'Interesse em IA',
        'Budget confirmado',
        'Decisores incluídos'
      ]
    },
    {
      id: 2,
      category: 'retail',
      title: 'Leads Varejo Nacional',
      description: 'Lojistas interessados em vendas online',
      quantity: 1000,
      price: 1497,
      quality: 'Média-Alta',
      region: 'Nacional',
      tags: ['B2C', 'E-commerce', 'Hot'],
      features: [
        'Múltiplas regiões',
        'Interesse confirmado',
        'Dados atualizados',
        'Suporte incluso'
      ]
    },
    {
      id: 3,
      category: 'services',
      title: 'Leads Serviços RJ',
      description: 'Empresas de serviços buscando automação',
      quantity: 300,
      price: 697,
      quality: 'Alta',
      region: 'Rio de Janeiro',
      tags: ['B2B', 'Serviços', 'Qualificados'],
      features: [
        'Segmento premium',
        'Validados recentemente',
        'Alto potencial',
        'Garantia de qualidade'
      ]
    },
    {
      id: 4,
      category: 'premium',
      title: 'Leads  Premium Multi-segmento',
      description: 'Mix de leads de alta qualidade, multi-segmento',
      quantity: 2000,
      price: 2997,
      quality: 'Premium',
      region: 'Nacional',
      tags: ['Mix', 'Premium', 'Exclusivo'],
      features: [
        'Todos os segmentos',
        'Máxima qualidade',
        'Suporte personalizado',
        'ROI garantido'
      ]
    },
  ];

  const stats = [
    {
      label: 'Leads Comprados',
      value: '2.450',
      icon: Users,
      change: '+18%',
      color: 'primary'
    },
    {
      label: 'Investimento Total',
      value: 'R$ 4.850',
      icon: DollarSign,
      change: '+12%',
      color: 'success'
    },
    {
      label: 'Taxa de Conversão',
      value: '23.4%',
      icon: Target,
      change: '+3.2%',
      color: 'secondary'
    },
    {
      label: 'ROI Médio',
      value: '340%',
      icon: TrendingUp,
      change: '+45%',
      color: 'accent'
    },
  ];

  const addToCart = (pack) => {
    setCart([...cart, pack]);
  };

  const removeFromCart = (packId) => {
    setCart(cart.filter(item => item.id !== packId));
  };

  const getTotalCart = () => {
    return cart.reduce((sum, item) => sum + item.price, 0);
  };

  const filteredPackages = leadPackages.filter(pack =>
    selectedCategory === 'all' || pack.category === selectedCategory
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">Compra de Leads</span>
          </h1>
          <p className="text-[rgb(var(--text-muted))]">
            Adquira leads qualificados para impulsionar suas vendas
          </p>
        </div>

        {/* Cart */}
        <div className="glass-card p-4 min-w-[250px]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[rgb(var(--primary))]" />
              <span className="font-semibold">Carrinho</span>
            </div>
            {cart.length > 0 && (
              <span className="px-2 py-1 rounded-full bg-[rgb(var(--primary))]/10 text-[rgb(var(--primary))] text-xs font-semibold">
                {cart.length}
              </span>
            )}
          </div>

          {cart.length === 0 ? (
            <p className="text-sm text-[rgb(var(--text-muted))] text-center py-4">
              Nenhum pacote adicionado
            </p>
          ) : (
            <>
              <div className="space-y-2 mb-4">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="truncate flex-1">{item.title}</span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-300 ml-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-[rgb(var(--border))] pt-3 space-y-2">
                <div className="flex items-center justify-between font-semibold">
                  <span>Total:</span>
                  <span className="gradient-text text-lg">
                    R$ {getTotalCart().toLocaleString('pt-BR')}
                  </span>
                </div>
                <button className="btn-gradient w-full text-sm">
                  Finalizar Compra
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="glass-card-hover p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-[rgb(var(--${stat.color}))]/10 flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-[rgb(var(--${stat.color}))]`} />
                </div>
                <span className="text-[rgb(var(--success))] text-sm font-semibold">
                  {stat.change}
                </span>
              </div>
              <p className="text-[rgb(var(--text-muted))] text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[rgb(var(--text-muted))]" />
            <span className="font-semibold">Filtros:</span>
          </div>

          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${selectedCategory === cat.id
                    ? 'gradient-bg-primary text-white'
                    : 'bg-[rgb(var(--bg-tertiary))]/50 hover:bg-[rgb(var(--bg-tertiary))]'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lead Packages Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPackages.map((pack) => {
          const isInCart = cart.some(item => item.id === pack.id);

          return (
            <div key={pack.id} className="glass-card-hover p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold">{pack.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${pack.quality === 'Premium' ? 'bg-yellow-500/10 text-yellow-400' :
                        pack.quality === 'Alta' ? 'bg-[rgb(var(--success))]/10 text-[rgb(var(--success))]' :
                          'bg-blue-500/10 text-blue-400'
                      }`}>
                      {pack.quality}
                    </span>
                  </div>
                  <p className="text-sm text-[rgb(var(--text-muted))] mb-3">
                    {pack.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[rgb(var(--primary))]" />
                  <div>
                    <p className="text-xs text-[rgb(var(--text-muted))]">Quantidade</p>
                    <p className="font-semibold">{pack.quantity} leads</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[rgb(var(--secondary))]" />
                  <div>
                    <p className="text-xs text-[rgb(var(--text-muted))]">Região</p>
                    <p className="font-semibold">{pack.region}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-[rgb(var(--text-muted))] mb-2">Tags:</p>
                <div className="flex flex-wrap gap-2">
                  {pack.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs rounded-full bg-[rgb(var(--primary))]/10 text-[rgb(var(--primary))]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-[rgb(var(--text-muted))] mb-2">Inclui:</p>
                <ul className="space-y-1">
                  {pack.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-1 h-1 rounded-full bg-[rgb(var(--primary))]"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[rgb(var(--border))]">
                <div>
                  <p className="text-sm text-[rgb(var(--text-muted))]">Preço</p>
                  <p className="text-2xl font-bold gradient-text">
                    R$ {pack.price.toLocaleString('pt-BR')}
                  </p>
                  <p className="text-xs text-[rgb(var(--text-muted))]">
                    R$ {(pack.price / pack.quantity).toFixed(2)} por lead
                  </p>
                </div>

                {isInCart ? (
                  <button
                    onClick={() => removeFromCart(pack.id)}
                    className="btn-outline flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Remover
                  </button>
                ) : (
                  <button
                    onClick={() => addToCart(pack)}
                    className="btn-gradient flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Adicionar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Info */}
      <div className="glass-card p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-[rgb(var(--primary))]/10 flex items-center justify-center flex-shrink-0">
            <Star className="w-6 h-6 text-[rgb(var(--primary))]" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold mb-2">Garantia de Qualidade</h3>
            <p className="text-sm text-[rgb(var(--text-muted))] mb-3">
              Todos os nossos leads passam por verificação rigorosa. Se mais de 10% dos contatos
              forem inválidos, devolvemos o valor proporcional.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[rgb(var(--success))]" />
                <span>Dados atualizados semanalmente</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-[rgb(var(--success))]" />
                <span>Download imediato</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
