import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Label } from '@/components/ui/label.jsx'
import { useAuth } from '@/hooks/useAuth.js'
import { Mail, User, Building, Phone, MapPin, Users } from 'lucide-react'

const SECTORS = [
  'Tecnologia',
  'Saúde',
  'Educação',
  'Varejo',
  'Serviços Financeiros',
  'Manufatura',
  'Imobiliário',
  'Alimentação e Bebidas',
  'Turismo e Hospitalidade',
  'Consultoria',
  'Marketing e Publicidade',
  'Logística e Transporte',
  'Energia',
  'Agricultura',
  'Construção Civil',
  'Outros'
]

const COMPANY_SIZES = [
  'Freelancer/Autônomo',
  'Micro (1-9 funcionários)',
  'Pequena (10-49 funcionários)',
  'Média (50-249 funcionários)',
  'Grande (250+ funcionários)'
]

export function RegisterForm({ onBack }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    company: '',
    sector: '',
    companySize: '',
    city: '',
    state: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const { signUpWithEmail } = useAuth()

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'Nome é obrigatório'
    if (!formData.lastName.trim()) newErrors.lastName = 'Sobrenome é obrigatório'
    if (!formData.email.trim()) newErrors.email = 'E-mail é obrigatório'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'E-mail inválido'
    
    if (!formData.password) newErrors.password = 'Senha é obrigatória'
    else if (formData.password.length < 6) newErrors.password = 'Senha deve ter pelo menos 6 caracteres'
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem'
    }
    
    if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório'
    if (!formData.company.trim()) newErrors.company = 'Nome da empresa é obrigatório'
    if (!formData.sector) newErrors.sector = 'Setor é obrigatório'
    if (!formData.companySize) newErrors.companySize = 'Tamanho da empresa é obrigatório'
    if (!formData.city.trim()) newErrors.city = 'Cidade é obrigatória'
    if (!formData.state.trim()) newErrors.state = 'Estado é obrigatório'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    try {
      await signUpWithEmail(formData.email, formData.password, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        company: formData.company,
        sector: formData.sector,
        companySize: formData.companySize,
        city: formData.city,
        state: formData.state
      })
      
      // Success - user will be automatically logged in
      alert('Conta criada com sucesso!')
    } catch (error) {
      console.error('Registration error:', error)
      alert('Erro ao criar conta. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl shadow-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Criar Conta</CardTitle>
        <CardDescription className="text-center">
          Preencha os dados abaixo para criar sua conta no EsferaZap
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Informações Pessoais
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nome *</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={errors.firstName ? 'border-red-500' : ''}
                  placeholder="Seu nome"
                />
                {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Sobrenome *</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={errors.lastName ? 'border-red-500' : ''}
                  placeholder="Seu sobrenome"
                />
                {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="seu@email.com"
                />
              </div>
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Senha *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={errors.password ? 'border-red-500' : ''}
                  placeholder="Mínimo 6 caracteres"
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                  placeholder="Confirme sua senha"
                />
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                  placeholder="(11) 99999-9999"
                />
              </div>
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>
          </div>

          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Informações da Empresa
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="company">Nome da Empresa *</Label>
              <Input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className={errors.company ? 'border-red-500' : ''}
                placeholder="Nome da sua empresa"
              />
              {errors.company && <p className="text-sm text-red-500">{errors.company}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sector">Setor *</Label>
                <Select value={formData.sector} onValueChange={(value) => handleInputChange('sector', value)}>
                  <SelectTrigger className={errors.sector ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecione o setor" />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTORS.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.sector && <p className="text-sm text-red-500">{errors.sector}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="companySize">Tamanho da Empresa *</Label>
                <Select value={formData.companySize} onValueChange={(value) => handleInputChange('companySize', value)}>
                  <SelectTrigger className={errors.companySize ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecione o tamanho" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPANY_SIZES.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.companySize && <p className="text-sm text-red-500">{errors.companySize}</p>}
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Localização
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade *</Label>
                <Input
                  id="city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={errors.city ? 'border-red-500' : ''}
                  placeholder="Sua cidade"
                />
                {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">Estado *</Label>
                <Input
                  id="state"
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className={errors.state ? 'border-red-500' : ''}
                  placeholder="Seu estado"
                />
                {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBack}
              className="flex-1"
            >
              Voltar
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Criando conta...' : 'Criar Conta'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
