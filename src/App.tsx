/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit2, 
  ChevronRight,
  User as UserIcon,
  ArrowLeft,
  Search,
  CheckCircle2,
  XCircle,
  Menu,
  X,
  Camera,
  Download,
  Mail,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { User, Product, Sale, Stats } from './types';

// --- Components ---

const Login = ({ onLogin, onSwitchToRegister }: { onLogin: (user: User, remember: boolean) => void, onSwitchToRegister: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const user = await res.json();
        onLogin(user, rememberMe);
      } else {
        setError('Email ou senha inválidos');
      }
    } catch (err) {
      setError('Erro ao conectar ao servidor');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full card space-y-8"
      >
        <div className="text-center">
          <h1 className="text-4xl title-display mb-2">YD Vendas</h1>
          <p className="text-zinc-500">Faça login para gerenciar sua loja</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              className="input-field" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Senha</label>
            <input 
              type="password" 
              className="input-field" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="remember" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-300 text-black focus:ring-black"
            />
            <label htmlFor="remember" className="text-sm text-zinc-600 cursor-pointer">Lembrar-me</label>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="btn-primary w-full py-3">Entrar</button>
        </form>

        <div className="text-center">
          <button 
            onClick={onSwitchToRegister}
            className="text-sm text-zinc-600 hover:underline"
          >
            Não tem uma conta? Criar conta
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const Register = ({ onRegister, onSwitchToLogin }: { onRegister: (user: User, remember: boolean) => void, onSwitchToLogin: () => void }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      if (res.ok) {
        const user = await res.json();
        onRegister(user, false);
      } else {
        const data = await res.json();
        setError(data.error || 'Erro ao cadastrar');
      }
    } catch (err) {
      setError('Erro ao conectar ao servidor');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full card space-y-8"
      >
        <div className="text-center">
          <h1 className="text-4xl title-display mb-2">Criar Conta</h1>
          <p className="text-zinc-500 text-sm">Junte-se ao YD Vendas</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <input 
              type="text" 
              className="input-field" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              className="input-field" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Senha</label>
            <input 
              type="password" 
              className="input-field" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirmar Senha</label>
            <input 
              type="password" 
              className="input-field" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="btn-primary w-full py-3">Cadastrar</button>
        </form>

        <div className="text-center">
          <button 
            onClick={onSwitchToLogin}
            className="text-sm text-zinc-600 hover:underline"
          >
            Já tem uma conta? Fazer login
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const Dashboard = ({ stats, onNavigate }: { stats: Stats | null, onNavigate: (page: string) => void }) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl title-display">Dashboard</h2>
        <div className="text-sm text-zinc-500">Bem-vindo de volta!</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div whileHover={{ y: -4 }} className="card bg-black text-white border-none">
          <p className="text-zinc-400 text-sm uppercase tracking-wider font-semibold">Receita Hoje</p>
          <p className="text-4xl font-bold mt-2">R$ {stats?.today.toFixed(2) || '0.00'}</p>
        </motion.div>
        <motion.div whileHover={{ y: -4 }} className="card">
          <p className="text-zinc-500 text-sm uppercase tracking-wider font-semibold">Receita Semana</p>
          <p className="text-4xl font-bold mt-2">R$ {stats?.week.toFixed(2) || '0.00'}</p>
        </motion.div>
        <motion.div whileHover={{ y: -4 }} className="card">
          <p className="text-zinc-500 text-sm uppercase tracking-wider font-semibold">Receita Mês</p>
          <p className="text-4xl font-bold mt-2">R$ {stats?.month.toFixed(2) || '0.00'}</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button 
          onClick={() => onNavigate('sales-new')}
          className="card flex items-center justify-between group hover:border-black transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-zinc-100 rounded-full group-hover:bg-black group-hover:text-white transition-all">
              <ShoppingCart size={24} />
            </div>
            <div className="text-left">
              <p className="font-bold text-lg">Registrar Venda</p>
              <p className="text-sm text-zinc-500">Lance uma nova venda agora</p>
            </div>
          </div>
          <ChevronRight className="text-zinc-300 group-hover:text-black" />
        </button>

        <button 
          onClick={() => onNavigate('products')}
          className="card flex items-center justify-between group hover:border-black transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-zinc-100 rounded-full group-hover:bg-black group-hover:text-white transition-all">
              <Package size={24} />
            </div>
            <div className="text-left">
              <p className="font-bold text-lg">Gerenciar Produtos</p>
              <p className="text-sm text-zinc-500">Adicione ou edite seu estoque</p>
            </div>
          </div>
          <ChevronRight className="text-zinc-300 group-hover:text-black" />
        </button>
      </div>
    </div>
  );
};

const ProductList = ({ products, onRefresh, onNavigate }: { products: Product[], onRefresh: () => void, onNavigate: (page: string) => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', sale_price: '', cost_price: '', category: '', stock: '', image: '' });

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProduct,
          sale_price: parseFloat(newProduct.sale_price),
          cost_price: parseFloat(newProduct.cost_price) || 0,
          stock: parseInt(newProduct.stock) || 0
        })
      });
      if (res.ok) {
        setIsAdding(false);
        setNewProduct({ name: '', sale_price: '', cost_price: '', category: '', stock: '', image: '' });
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl title-display">Produtos</h2>
        <button onClick={() => setIsAdding(true)} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Adicionar
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
        <input 
          type="text" 
          placeholder="Buscar produtos..." 
          className="input-field pl-10" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredProducts.map(product => (
          <div key={product.id} className="card flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg border border-zinc-200" />
              ) : (
                <div className="w-16 h-16 bg-zinc-100 rounded-lg flex items-center justify-center text-zinc-400 border border-zinc-200">
                  <Package size={24} />
                </div>
              )}
              <div>
                <p className="font-bold text-lg">{product.name}</p>
                <p className="text-sm text-zinc-500">{product.category || 'Sem categoria'} • Estoque: {product.stock}</p>
                <p className="text-xs text-zinc-400">Custo: R$ {product.cost_price?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-bold text-xl">R$ {product.sale_price.toFixed(2)}</p>
              <div className="flex gap-2">
                <button onClick={() => handleDelete(product.id)} className="p-2 text-zinc-400 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-zinc-500">Nenhum produto encontrado.</div>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card max-w-md w-full space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-2xl title-display">Novo Produto</h3>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-32 h-32 bg-zinc-100 rounded-xl border-2 border-dashed border-zinc-300 flex items-center justify-center overflow-hidden relative group">
                    {newProduct.image ? (
                      <img src={newProduct.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="text-zinc-400" size={32} />
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  <p className="text-xs text-zinc-500">Toque para adicionar foto</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Nome do Produto</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={newProduct.name} 
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})} 
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Preço de Venda (R$)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      className="input-field" 
                      value={newProduct.sale_price} 
                      onChange={e => setNewProduct({...newProduct, sale_price: e.target.value})} 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Preço de Custo (R$)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      className="input-field" 
                      value={newProduct.cost_price} 
                      onChange={e => setNewProduct({...newProduct, cost_price: e.target.value})} 
                      required 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Estoque</label>
                    <input 
                      type="number" 
                      className="input-field" 
                      value={newProduct.stock} 
                      onChange={e => setNewProduct({...newProduct, stock: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Categoria</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      value={newProduct.category} 
                      onChange={e => setNewProduct({...newProduct, category: e.target.value})} 
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsAdding(false)} className="btn-secondary flex-1">Cancelar</button>
                  <button type="submit" className="btn-primary flex-1">Salvar</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NewSale = ({ products, onRefresh, onNavigate }: { products: Product[], onRefresh: () => void, onNavigate: (page: string) => void }) => {
  const [selectedProductId, setSelectedProductId] = useState<number | ''>('');
  const [quantity, setQuantity] = useState(1);
  const [success, setSuccess] = useState(false);

  const selectedProduct = products.find(p => p.id === selectedProductId);
  const totalPrice = selectedProduct ? selectedProduct.sale_price * quantity : 0;

  const handleSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;

    try {
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: selectedProductId, quantity })
      });
      if (res.ok) {
        setSuccess(true);
        onRefresh();
        setTimeout(() => {
          setSuccess(false);
          onNavigate('dashboard');
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-500">
          <CheckCircle2 size={80} />
        </motion.div>
        <h2 className="text-2xl title-display">Venda Realizada!</h2>
        <p className="text-zinc-500">Redirecionando para o dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={() => onNavigate('dashboard')} className="p-2 hover:bg-zinc-100 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-3xl title-display">Registrar Venda</h2>
      </div>

      <form onSubmit={handleSale} className="card space-y-6">
        <div>
          <label className="block text-sm font-medium mb-4">Selecionar Produto</label>
          <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto pr-2">
            {products.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedProductId(p.id)}
                className={`flex items-center gap-4 p-3 rounded-xl border-2 transition-all text-left ${selectedProductId === p.id ? 'border-black bg-zinc-50' : 'border-zinc-100 hover:border-zinc-200'}`}
              >
                {p.image ? (
                  <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-lg" />
                ) : (
                  <div className="w-12 h-12 bg-zinc-100 rounded-lg flex items-center justify-center text-zinc-400">
                    <Package size={20} />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-bold">{p.name}</p>
                  <p className="text-sm text-zinc-500">R$ {p.sale_price.toFixed(2)}</p>
                </div>
                {selectedProductId === p.id && <CheckCircle2 className="text-black" size={20} />}
              </button>
            ))}
          </div>
        </div>

        {selectedProduct && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Quantidade</label>
              <div className="flex items-center gap-4">
                <button 
                  type="button" 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-zinc-200 rounded-lg hover:bg-zinc-50"
                >
                  -
                </button>
                <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                <button 
                  type="button" 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 border border-zinc-200 rounded-lg hover:bg-zinc-50"
                >
                  +
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-100">
              <div className="flex justify-between items-center mb-6">
                <span className="text-zinc-500">Total da Venda</span>
                <span className="text-3xl font-bold">R$ {totalPrice.toFixed(2)}</span>
              </div>
              <button type="submit" className="btn-primary w-full py-4 text-lg">
                Confirmar Venda
              </button>
            </div>
          </motion.div>
        )}
      </form>
    </div>
  );
};

const Reports = ({ sales, user }: { sales: Sale[], user: User }) => {
  const [filter, setFilter] = useState<'week' | 'month'>('week');
  const [selectedSaleIds, setSelectedSaleIds] = useState<Set<number>>(new Set());

  const filteredSales = sales.filter(sale => {
    const saleDate = new Date(sale.date);
    const now = new Date();
    if (filter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return saleDate >= weekAgo;
    } else {
      return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
    }
  });

  // Initialize selection when filteredSales changes or component mounts
  useEffect(() => {
    setSelectedSaleIds(new Set(filteredSales.map(s => s.id)));
  }, [filter, sales.length]);

  const selectedSales = filteredSales.filter(sale => selectedSaleIds.has(sale.id));

  const totalRevenue = selectedSales.reduce((acc, sale) => acc + sale.total_price, 0);
  const totalCost = selectedSales.reduce((acc, sale) => acc + (sale.cost_price * sale.quantity), 0);
  const totalProfit = totalRevenue - totalCost;

  const toggleSaleSelection = (id: number) => {
    const newSelection = new Set(selectedSaleIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedSaleIds(newSelection);
  };

  const selectAll = () => {
    setSelectedSaleIds(new Set(filteredSales.map(s => s.id)));
  };

  const deselectAll = () => {
    setSelectedSaleIds(new Set());
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const periodText = filter === 'week' ? 'Semanal' : 'Mensal';
    
    doc.setFontSize(20);
    doc.text('Relatório de Vendas - YD Vendas', 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Usuário: ${user.name}`, 14, 32);
    doc.text(`Período: ${periodText}`, 14, 38);
    doc.text(`Data de Geração: ${new Date().toLocaleDateString('pt-BR')}`, 14, 44);

    const tableData = selectedSales.map(sale => [
      sale.product_name,
      sale.quantity,
      `R$ ${sale.sale_price.toFixed(2)}`,
      `R$ ${sale.total_price.toFixed(2)}`,
      new Date(sale.date).toLocaleDateString('pt-BR')
    ]);

    (doc as any).autoTable({
      startY: 50,
      head: [['Produto', 'Qtd', 'Vlr Unit', 'Vlr Total', 'Data']],
      body: tableData,
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    doc.setFontSize(14);
    doc.text(`Resumo Financeiro`, 14, finalY);
    doc.setFontSize(11);
    doc.text(`Receita Bruta: R$ ${totalRevenue.toFixed(2)}`, 14, finalY + 8);
    doc.text(`Custo Total: R$ ${totalCost.toFixed(2)}`, 14, finalY + 14);
    doc.text(`Lucro Líquido: R$ ${totalProfit.toFixed(2)}`, 14, finalY + 20);

    doc.save(`relatorio_${filter}_${new Date().getTime()}.pdf`);
  };

  const shareByEmail = () => {
    const subject = encodeURIComponent(`Relatório de Vendas YD - ${filter === 'week' ? 'Semanal' : 'Mensal'}`);
    const body = encodeURIComponent(`Olá,\n\nSegue resumo das vendas selecionadas:\nReceita: R$ ${totalRevenue.toFixed(2)}\nCusto: R$ ${totalCost.toFixed(2)}\nLucro: R$ ${totalProfit.toFixed(2)}\n\nGerado via YD Vendas.`);
    window.location.href = `mailto:${user.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl title-display">Relatórios</h2>
        <div className="flex bg-zinc-100 p-1 rounded-lg">
          <button 
            onClick={() => setFilter('week')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'week' ? 'bg-white shadow-sm' : 'text-zinc-500'}`}
          >
            Semana
          </button>
          <button 
            onClick={() => setFilter('month')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'month' ? 'bg-white shadow-sm' : 'text-zinc-500'}`}
          >
            Mês
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-black text-white border-none">
          <p className="text-zinc-400 text-sm uppercase tracking-wider font-semibold">Receita Bruta</p>
          <p className="text-4xl font-bold mt-2">R$ {totalRevenue.toFixed(2)}</p>
        </div>
        <div className="card">
          <p className="text-zinc-500 text-sm uppercase tracking-wider font-semibold">Custo Total</p>
          <p className="text-4xl font-bold mt-2">R$ {totalCost.toFixed(2)}</p>
        </div>
        <div className="card">
          <p className="text-zinc-500 text-sm uppercase tracking-wider font-semibold">Lucro Líquido</p>
          <p className="text-4xl font-bold mt-2 text-emerald-600">R$ {totalProfit.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <button onClick={generatePDF} className="btn-secondary flex items-center gap-2" disabled={selectedSales.length === 0}>
          <Download size={18} /> Baixar PDF
        </button>
        <button onClick={shareByEmail} className="btn-primary flex items-center gap-2" disabled={selectedSales.length === 0}>
          <Mail size={18} /> Compartilhar por Email
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg">Histórico de Vendas</h3>
          <div className="flex gap-2">
            <button onClick={selectAll} className="text-xs font-medium text-zinc-600 hover:underline">Selecionar Tudo</button>
            <span className="text-zinc-300">|</span>
            <button onClick={deselectAll} className="text-xs font-medium text-zinc-600 hover:underline">Desmarcar Tudo</button>
          </div>
        </div>
        
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-zinc-50 border-bottom border-zinc-200">
                <tr>
                  <th className="px-4 py-4 w-10"></th>
                  <th className="px-6 py-4 text-sm font-semibold text-zinc-500">Produto</th>
                  <th className="px-6 py-4 text-sm font-semibold text-zinc-500">Qtd</th>
                  <th className="px-6 py-4 text-sm font-semibold text-zinc-500">Receita</th>
                  <th className="px-6 py-4 text-sm font-semibold text-zinc-500">Lucro</th>
                  <th className="px-6 py-4 text-sm font-semibold text-zinc-500">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredSales.map(sale => {
                  const profit = sale.total_price - (sale.cost_price * sale.quantity);
                  const isSelected = selectedSaleIds.has(sale.id);
                  return (
                    <tr 
                      key={sale.id} 
                      className={`hover:bg-zinc-50 transition-colors cursor-pointer ${!isSelected ? 'opacity-50' : ''}`}
                      onClick={() => toggleSaleSelection(sale.id)}
                    >
                      <td className="px-4 py-4">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => {}} // Handled by tr onClick
                          className="w-4 h-4 rounded border-zinc-300 text-black focus:ring-black"
                        />
                      </td>
                      <td className="px-6 py-4 font-medium">{sale.product_name}</td>
                      <td className="px-6 py-4">{sale.quantity}</td>
                      <td className="px-6 py-4 font-bold">R$ {sale.total_price.toFixed(2)}</td>
                      <td className={`px-6 py-4 font-medium ${profit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        R$ {profit.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-zinc-500 text-sm">
                        {new Date(sale.date).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  );
                })}
                {filteredSales.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">Nenhuma venda registrada neste período.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('login'); // login, register, dashboard, products, sales-new, reports
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fetchData = async () => {
    if (!user) return;
    try {
      const [pRes, sRes, stRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/sales'),
        fetch('/api/stats')
      ]);
      setProducts(await pRes.json());
      setSales(await sRes.json());
      setStats(await stRes.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('yd_vendas_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setCurrentPage('dashboard');
      } catch (e) {
        localStorage.removeItem('yd_vendas_user');
      }
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleLogin = (userData: User, remember: boolean) => {
    setUser(userData);
    if (remember) {
      localStorage.setItem('yd_vendas_user', JSON.stringify(userData));
    }
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('yd_vendas_user');
    setCurrentPage('login');
    setIsMenuOpen(false);
  };

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
  };

  if (!user) {
    return currentPage === 'register' ? (
      <Register onRegister={handleLogin} onSwitchToLogin={() => setCurrentPage('login')} />
    ) : (
      <Login onLogin={handleLogin} onSwitchToRegister={() => setCurrentPage('register')} />
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white font-bold text-lg">Y</div>
          <h1 className="text-xl title-display">YD Vendas</h1>
        </div>
        
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
          aria-label="Menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile/Desktop Overlay Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            <motion.nav 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-72 bg-white shadow-2xl z-50 p-6 flex flex-col gap-8"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white font-bold">Y</div>
                  <span className="font-bold">Menu</span>
                </div>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <button 
                  onClick={() => navigateTo('dashboard')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${currentPage === 'dashboard' ? 'bg-black text-white' : 'text-zinc-500 hover:bg-zinc-100'}`}
                >
                  <LayoutDashboard size={20} /> Dashboard
                </button>
                <button 
                  onClick={() => navigateTo('products')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${currentPage === 'products' ? 'bg-black text-white' : 'text-zinc-500 hover:bg-zinc-100'}`}
                >
                  <Package size={20} /> Produtos
                </button>
                <button 
                  onClick={() => navigateTo('sales-new')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${currentPage === 'sales-new' ? 'bg-black text-white' : 'text-zinc-500 hover:bg-zinc-100'}`}
                >
                  <ShoppingCart size={20} /> Nova Venda
                </button>
                <button 
                  onClick={() => navigateTo('reports')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${currentPage === 'reports' ? 'bg-black text-white' : 'text-zinc-500 hover:bg-zinc-100'}`}
                >
                  <BarChart3 size={20} /> Relatórios
                </button>
              </div>

              <div className="pt-6 border-t border-zinc-100">
                <div className="flex items-center gap-3 mb-4 px-2">
                  <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center">
                    <UserIcon size={16} className="text-zinc-500" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold truncate">{user.name}</p>
                    <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-500 hover:bg-red-50 transition-all w-full"
                >
                  <LogOut size={20} /> Sair
                </button>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {currentPage === 'dashboard' && <Dashboard stats={stats} onNavigate={navigateTo} />}
              {currentPage === 'products' && <ProductList products={products} onRefresh={fetchData} onNavigate={navigateTo} />}
              {currentPage === 'sales-new' && <NewSale products={products} onRefresh={fetchData} onNavigate={navigateTo} />}
              {currentPage === 'reports' && <Reports sales={sales} user={user} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
