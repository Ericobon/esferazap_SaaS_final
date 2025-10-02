import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { ShoppingCart, MapPin, Filter, DollarSign, Loader2 } from 'lucide-react'

export function CompraLeads() {
  const [filtros, setFiltros] = useState({
    estado: '',
    segmento: '',
    tempo_atividade: '',
    quantidade_leads: 100
  })
  
  const [preco, setPreco] = useState({
    preco_total: 0,
    preco_unitario: 0,
    moeda: 'BRL'
  })
  
  const [loading, setLoading] = useState(false)
  const [comprando, setComprando] = useState(false)

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ]

  const segmentos = [
    'Tecnologia',
    'Varejo',
    'Consultoria',
    'Saúde',
    'Educação',
    'Financeiro',
    'Imobiliário',
    'Alimentação',
    'Automotivo',
    'Outros'
  ]

  const temposAtividade = [
    { value: '30_dias', label: '30 dias' },
    { value: '60_dias', label: '60 dias' },
    { value: '90_dias', label: '90 dias' },
    { value: '6_meses', label: '6 meses' },
    { value: '1_ano', label: '1 ano' }
  ]

  const calcularPreco = async () => {
    if (!filtros.estado || !filtros.segmento || !filtros.tempo_atividade || !filtros.quantidade_leads) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/leads/calculate_price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filtros),
      })

      if (response.ok) {
        const data = await response.json()
        setPreco(data)
      } else {
        console.error('Erro ao calcular preço')
      }
    } catch (error) {
      console.error('Erro na requisição:', error)
    } finally {
      setLoading(false)
    }
  }

  const comprarLeads = async () => {
    if (!filtros.estado || !filtros.segmento || !filtros.tempo_atividade || !filtros.quantidade_leads || preco.preco_total === 0) {
      return
    }

    setComprando(true)
    try {
      const response = await fetch('/api/leads/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...filtros,
          preco_total: preco.preco_total,
          user_id: 'user-mock-id' // Em produção, seria obtido do contexto de autenticação
        }),
      })

      if (response.ok) {
        const data = await response.json()
        alert(`Compra realizada com sucesso! ID da transação: ${data.id_transacao}`)
        // Reset form
        setFiltros({
          estado: '',
          segmento: '',
          tempo_atividade: '',
          quantidade_leads: 100
        })
        setPreco({ preco_total: 0, preco_unitario: 0, moeda: 'BRL' })
      } else {
        const errorData = await response.json()
        alert(`Erro na compra: ${errorData.erro}`)
      }
    } catch (error) {
      console.error('Erro na compra:', error)
      alert('Erro na compra. Tente novamente.')
    } finally {
      setComprando(false)
    }
  }

  // Recalcular preço quando os filtros mudarem
  const handleFiltroChange = (campo, valor) => {
    const novosFiltros = { ...filtros, [campo]: valor }
    setFiltros(novosFiltros)
    
    // Se todos os campos estão preenchidos, calcular preço automaticamente
    if (novosFiltros.estado && novosFiltros.segmento && novosFiltros.tempo_atividade && novosFiltros.quantidade_leads) {
      setTimeout(() => calcularPreco(), 500) // Debounce
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <ShoppingCart className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compra de Leads</h1>
          <p className="text-gray-600">Compre leads qualificados e segmentados para sua empresa</p>
        </div>
        <div className="ml-auto">
          <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Base Atualizada
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customização dos Leads */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Customização dos Leads</span>
              </CardTitle>
              <CardDescription>
                Configure os filtros para obter leads mais relevantes para seu negócio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado (UF)</Label>
                  <Select value={filtros.estado} onValueChange={(value) => handleFiltroChange('estado', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {estados.map((estado) => (
                        <SelectItem key={estado} value={estado}>
                          {estado}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="segmento">Segmento</Label>
                  <Select value={filtros.segmento} onValueChange={(value) => handleFiltroChange('segmento', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o segmento" />
                    </SelectTrigger>
                    <SelectContent>
                      {segmentos.map((segmento) => (
                        <SelectItem key={segmento} value={segmento}>
                          {segmento}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tempo_atividade">Tempo de Atividade</Label>
                  <Select value={filtros.tempo_atividade} onValueChange={(value) => handleFiltroChange('tempo_atividade', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tempo de atividade" />
                    </SelectTrigger>
                    <SelectContent>
                      {temposAtividade.map((tempo) => (
                        <SelectItem key={tempo.value} value={tempo.value}>
                          {tempo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantidade">Quantidade de Leads</Label>
                  <Input
                    id="quantidade"
                    type="number"
                    min="1"
                    max="50000"
                    value={filtros.quantidade_leads}
                    onChange={(e) => handleFiltroChange('quantidade_leads', parseInt(e.target.value) || 0)}
                    placeholder="100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Localização dos Leads */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Localização dos Leads</span>
              </CardTitle>
              <CardDescription>
                Visualize a distribuição geográfica dos leads selecionados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-lg font-medium">Mapa Interativo</p>
                  <p className="text-sm">Os pontos dos leads aparecerão aqui após a compra</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preços */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Preços</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Até 300 leads:</span>
                  <span className="font-medium">R$ 0,60</span>
                </div>
                <div className="flex justify-between">
                  <span>500+ leads:</span>
                  <span className="font-medium">R$ 0,50</span>
                </div>
                <div className="flex justify-between">
                  <span>1.000+ leads:</span>
                  <span className="font-medium">R$ 0,39</span>
                </div>
                <div className="flex justify-between">
                  <span>10.000+ leads:</span>
                  <span className="font-medium">R$ 0,29</span>
                </div>
                <div className="flex justify-between">
                  <span>50.000+ leads:</span>
                  <span className="font-medium text-blue-600">Consultar</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-blue-600">
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      `R$ ${preco.preco_total.toFixed(2)}`
                    )}
                  </span>
                </div>
                {preco.preco_unitario > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    R$ {preco.preco_unitario.toFixed(2)} por lead
                  </p>
                )}
              </div>

              <Button 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                onClick={comprarLeads}
                disabled={comprando || preco.preco_total === 0 || !filtros.estado || !filtros.segmento || !filtros.tempo_atividade}
              >
                {comprando ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Comprar Leads
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
