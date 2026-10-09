import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Search, Menu, X, Instagram, MessageCircle, 
  Truck, ShieldCheck, RefreshCw, ChevronRight, Star, Plus, 
  Minus, Trash2, ArrowLeft, Filter, CheckCircle2, Lock, User, 
  Settings, Package, CreditCard, AlertCircle, Copy, ExternalLink
} from 'lucide-react';

// Componente del Logo Oficial de ORIGEN KA'A
const LogoOrigenKaa = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 500 500" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="250" cy="250" r="235" stroke="#493528" strokeWidth="18" />
    <path d="M165 200 C 130 160, 160 100, 205 130 C 220 170, 185 210, 165 200 Z" stroke="#493528" strokeWidth="14" fill="none" />
    <path d="M125 270 C 90 230, 120 170, 165 200 C 180 240, 145 280, 125 270 Z" stroke="#493528" strokeWidth="14" fill="none" />
    <line x1="360" y1="110" x2="310" y2="290" stroke="#493528" strokeWidth="22" strokeLinecap="round" />
    <path d="M360 110 L 335 125" stroke="#493528" strokeWidth="20" strokeLinecap="round" />
    <path d="M230 180 A 50 50 0 0 1 290 215" stroke="#493528" strokeWidth="14" strokeLinecap="round" fill="none" />
    <line x1="230" y1="160" x2="230" y2="180" stroke="#493528" strokeWidth="12" strokeLinecap="round" />
    <line x1="260" y1="155" x2="260" y2="178" stroke="#493528" strokeWidth="12" strokeLinecap="round" />
    <line x1="288" y1="168" x2="280" y2="188" stroke="#493528" strokeWidth="12" strokeLinecap="round" />
    <path d="M115 325 C 180 260, 290 320, 345 270" stroke="#493528" strokeWidth="16" strokeLinecap="round" fill="none" />
    <path d="M130 355 C 195 290, 305 350, 355 290" stroke="#493528" strokeWidth="16" strokeLinecap="round" fill="none" />
    <path d="M185 320 C 190 400, 270 415, 305 350" stroke="#493528" strokeWidth="16" strokeLinecap="round" fill="none" />
    <path d="M265 310 C 230 410, 350 410, 355 300 Z" stroke="#493528" strokeWidth="14" fill="none" />
  </svg>
);

const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Mate Imperial Premium',
    category: 'Mates',
    price: 38500,
    promoPrice: 34900,
    description: 'Mate de calabaza brasileña seleccionada, forrado en cuero vacuno con virola y fleje de alpaca cincelada a mano.',
    featured: true,
    active: true,
    images: ['https://images.unsplash.com/photo-1594910085817-497672e8cb30?q=80&w=800&auto=format&fit=crop'],
    variants: [{ id: 'v1-1', name: 'Alpaca Labrada - Cuero Negro', sku: 'MIMP-ALP-NG', stock: 5 }]
  },
  {
    id: 'prod-2',
    name: 'Termo Acero Inox 1.2L Patagónico',
    category: 'Termos',
    price: 62000,
    promoPrice: null,
    description: 'Termo de doble capa de acero inoxidable con aislamiento al vacío. Mantiene el agua caliente por más de 24 horas.',
    featured: true,
    active: true,
    images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop'],
    variants: [{ id: 'v2-1', name: 'Verde Yerba Matte', sku: 'TRM-12L-VD', stock: 12 }]
  }
];

export default function App() {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('kaa_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('kaa_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentView, setCurrentView] = useState(() => localStorage.getItem('kaa_current_view') || 'home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => localStorage.getItem('kaa_admin_logged') === 'true');
  const [selectedProduct, setSelectedProduct] = useState(() => {
    const saved = localStorage.getItem('kaa_selected_product');
    return saved ? JSON.parse(saved) : null;
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const [newProduct, setNewProduct] = useState({
    name: '', category: 'Mates', price: '', promoPrice: '', description: '', image: '', variantName: 'Estándar', sku: '', stock: 10
  });

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', address: '', paymentMethod: 'transfer'
  });
  const [lastOrder, setLastOrder] = useState(null);

  useEffect(() => { localStorage.setItem('kaa_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('kaa_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('kaa_current_view', currentView); }, [currentView]);
  useEffect(() => { localStorage.setItem('kaa_admin_logged', isAdminLoggedIn ? 'true' : 'false'); }, [isAdminLoggedIn]);

  const changeView = (viewName) => {
    setCurrentView(viewName);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (product, variant, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id && item.variantId === variant.id);
      if (existing) {
        return prev.map(item => item.productId === product.id && item.variantId === variant.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, {
        productId: product.id, variantId: variant.id, name: product.name, variantName: variant.name,
        price: product.promoPrice || product.price, image: product.images[0], quantity, maxStock: variant.stock
      }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId, variantId) => {
    setCart(prev => prev.filter(item => !(item.productId === productId && item.variantId === variantId)));
  };

  const updateQuantity = (productId, variantId, newQty) => {
    if (newQty <= 0) return removeFromCart(productId, variantId);
    setCart(prev => prev.map(item => item.productId === productId && item.variantId === variantId ? { ...item, quantity: newQty } : item));
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const freeShippingMin = 75000;
  const shippingCost = cartSubtotal >= freeShippingMin || cartSubtotal === 0 ? 0 : 6500;
  const cartTotal = cartSubtotal + shippingCost;

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminEmail === 'admin@origenkaa.com.ar' && adminPassword === 'origen2026') {
      setIsAdminLoggedIn(true);
    } else {
      alert('Credenciales incorrectas.');
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const created = {
      id: `prod-${Date.now()}`,
      name: newProduct.name,
      category: newProduct.category,
      price: Number(newProduct.price),
      promoPrice: newProduct.promoPrice ? Number(newProduct.promoPrice) : null,
      description: newProduct.description,
      featured: true,
      active: true,
      images: [newProduct.image || 'https://images.unsplash.com/photo-1594910085817-497672e8cb30?q=80&w=800&auto=format&fit=crop'],
      variants: [{ id: `v-${Date.now()}`, name: newProduct.variantName, sku: newProduct.sku || `SKU-${Date.now().toString().slice(-4)}`, stock: Number(newProduct.stock) }]
    };
    setProducts([created, ...products]);
    alert('¡Producto publicado!');
    setNewProduct({ name: '', category: 'Mates', price: '', promoPrice: '', description: '', image: '', variantName: 'Estándar', sku: '', stock: 10 });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F3EBDD] text-[#292724] font-sans">
      {/* Banner Superior con Verde Salvia */}
      <div className="bg-[#493528] text-[#F3EBDD] text-xs py-2 px-4 text-center tracking-wider uppercase font-medium border-b border-[#71806A]">
        Envíos gratis a todo el país en compras superiores a $75.000 | Ushuaia, Tierra del Fuego
      </div>

      {/* Header con Paleta Personalizada */}
      <header className="sticky top-0 z-40 bg-[#F3EBDD]/95 backdrop-blur-md border-b border-[#C4A989]">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-[#292724]">
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          <div onClick={() => { setSelectedCategory('Todas'); changeView('home'); }} className="cursor-pointer flex items-center space-x-3">
            <LogoOrigenKaa className="w-10 h-10 md:w-12 md:h-12" />
            <div>
              <h1 className="text-xl md:text-2xl font-serif tracking-widest text-[#292724] font-bold leading-none">
                ORIGEN KA’A
              </h1>
              <p className="text-[9px] tracking-widest text-[#493528] uppercase font-bold mt-1">
                El origen de cada encuentro
              </p>
            </div>
          </div>

          <nav className="hidden md:flex space-x-8 text-sm tracking-widest uppercase font-medium text-[#493528]">
            <button onClick={() => { setSelectedCategory('Todas'); changeView('home'); }} className="hover:text-[#292724]">Inicio</button>
            <button onClick={() => { setSelectedCategory('Todas'); changeView('catalog'); }} className="hover:text-[#292724]">Catálogo</button>
            <button onClick={() => { setSelectedCategory('Mates'); changeView('catalog'); }} className="hover:text-[#292724]">Mates</button>
            <button onClick={() => { setSelectedCategory('Termos'); changeView('catalog'); }} className="hover:text-[#292724]">Termos</button>
          </nav>

          <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-[#292724]">
            <ShoppingBag size={24} />
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 bg-[#71806A] text-[#F3EBDD] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-[#F3EBDD] border-b border-[#C4A989] px-4 py-6 space-y-4 text-center tracking-widest uppercase text-sm font-medium">
            <button onClick={() => { setSelectedCategory('Todas'); changeView('home'); }} className="block w-full py-2 hover:bg-[#C4A989]/20">Inicio</button>
            <button onClick={() => { setSelectedCategory('Todas'); changeView('catalog'); }} className="block w-full py-2 hover:bg-[#C4A989]/20">Catálogo Completo</button>
            <button onClick={() => { setSelectedCategory('Mates'); changeView('catalog'); }} className="block w-full py-2 hover:bg-[#C4A989]/20">Mates</button>
            <button onClick={() => { setSelectedCategory('Termos'); changeView('catalog'); }} className="block w-full py-2 hover:bg-[#C4A989]/20">Termos</button>
            <button onClick={() => changeView('admin')} className="block w-full py-2 text-[#71806A] font-bold border-t border-[#C4A989]">Acceso Panel Admin</button>
          </div>
        )}
      </header>

      <main className="flex-1">
        {currentView === 'home' && (
          <div>
            <section className="relative h-[65vh] bg-cover bg-center flex items-center justify-center text-center px-4" style={{ backgroundImage: `linear-gradient(rgba(41, 39, 36, 0.55), rgba(41, 39, 36, 0.55)), url('https://images.unsplash.com/photo-1594910085817-497672e8cb30?q=80&w=1600&auto=format&fit=crop')` }}>
              <div className="max-w-3xl text-[#F3EBDD] space-y-6">
                <span className="text-xs uppercase tracking-widest bg-[#71806A] text-[#F3EBDD] px-4 py-1.5 rounded-full font-bold">
                  Ushuaia • Tierra del Fuego
                </span>
                <h2 className="text-4xl md:text-6xl font-serif">Tu ritual, tu esencia</h2>
                <p className="text-base md:text-lg font-light text-[#F3EBDD]/90">
                  Mates artesanales, termos de alta conservación y accesorios materos.
                </p>
                <button 
                  onClick={() => { setSelectedCategory('Todas'); changeView('catalog'); }}
                  className="bg-[#C4A989] text-[#292724] px-8 py-3 uppercase tracking-widest text-xs font-bold hover:bg-[#F3EBDD] transition"
                >
                  Ver Catálogo
                </button>
              </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 py-16">
              <h3 className="text-2xl font-serif text-center mb-8 text-[#292724]">Productos Destacados</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {products.filter(p => p.featured).map(product => (
                  <div key={product.id} className="bg-[#F3EBDD] border border-[#C4A989] p-4 flex flex-col justify-between shadow-sm">
                    <div>
                      <img src={product.images[0]} alt={product.name} className="w-full aspect-square object-cover mb-4 border border-[#C4A989]/50" />
                      <span className="text-[10px] uppercase text-[#71806A] font-bold">{product.category}</span>
                      <h4 className="text-lg font-serif text-[#292724] mt-1">{product.name}</h4>
                      <p className="text-sm font-bold mt-2 text-[#493528]">${(product.promoPrice || product.price).toLocaleString('es-AR')}</p>
                    </div>
                    <button 
                      onClick={() => { setSelectedProduct(product); changeView('product'); }}
                      className="w-full mt-4 bg-[#292724] text-[#F3EBDD] py-3 text-xs uppercase tracking-widest hover:bg-[#493528] transition"
                    >
                      Ver Opciones
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {currentView === 'catalog' && (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-3xl font-serif text-[#292724] mb-6">Catálogo Completo</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products
                .filter(p => selectedCategory === 'Todas' || p.category === selectedCategory)
                .map(product => (
                  <div key={product.id} className="bg-[#F3EBDD] border border-[#C4A989] p-4 flex flex-col justify-between shadow-sm">
                    <div>
                      <img src={product.images[0]} alt={product.name} className="w-full aspect-square object-cover mb-4 border border-[#C4A989]/50" />
                      <span className="text-[10px] uppercase text-[#71806A] font-bold">{product.category}</span>
                      <h3 className="text-lg font-serif text-[#292724] mt-1">{product.name}</h3>
                      <p className="text-sm font-bold mt-2 text-[#493528]">${(product.promoPrice || product.price).toLocaleString('es-AR')}</p>
                    </div>
                    <button 
                      onClick={() => { setSelectedProduct(product); changeView('product'); }}
                      className="w-full mt-4 bg-[#292724] text-[#F3EBDD] py-3 text-xs uppercase tracking-widest hover:bg-[#493528] transition"
                    >
                      Ver Opciones
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {currentView === 'product' && selectedProduct && (
          <div className="max-w-5xl mx-auto px-4 py-12">
            <button onClick={() => changeView('catalog')} className="flex items-center text-xs uppercase text-[#493528] font-bold mb-6">
              <ArrowLeft size={16} className="mr-2" /> Volver
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="w-full aspect-square object-cover border border-[#C4A989]" />
              <div>
                <span className="text-xs uppercase text-[#71806A] font-bold">{selectedProduct.category}</span>
                <h1 className="text-3xl font-serif text-[#292724] mt-1">{selectedProduct.name}</h1>
                <p className="text-2xl font-bold mt-2 text-[#493528]">${(selectedProduct.promoPrice || selectedProduct.price).toLocaleString('es-AR')}</p>
                <p className="text-sm text-[#493528] my-4 leading-relaxed">{selectedProduct.description}</p>
                
                <div className="space-y-3 mt-6">
                  <p className="text-xs uppercase font-bold text-[#292724]">Seleccionar Variante:</p>
                  {selectedProduct.variants.map(variant => (
                    <button
                      key={variant.id}
                      onClick={() => addToCart(selectedProduct, variant)}
                      className="w-full p-3 border border-[#C4A989] text-left flex justify-between text-sm bg-white hover:border-[#292724]"
                    >
                      <span>{variant.name}</span>
                      <span className="text-xs text-[#71806A] font-bold">{variant.stock} en stock</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ADMIN PANEL */}
        {currentView === 'admin' && (
          <div className="max-w-4xl mx-auto px-4 py-12">
            {!isAdminLoggedIn ? (
              <div className="max-w-md mx-auto bg-[#F3EBDD] p-8 border border-[#C4A989]">
                <div className="text-center mb-6">
                  <Lock size={32} className="mx-auto text-[#71806A] mb-2" />
                  <h2 className="text-2xl font-serif text-[#292724]">Panel de Administración</h2>
                  <p className="text-xs text-[#493528] uppercase tracking-widest mt-1">ORIGEN KA’A</p>
                </div>

                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase font-bold text-[#292724] mb-1">Email Admin</label>
                    <input 
                      type="email" required placeholder="admin@origenkaa.com.ar"
                      value={adminEmail} onChange={e => setAdminEmail(e.target.value)}
                      className="w-full p-3 border border-[#C4A989] text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-bold text-[#292724] mb-1">Contraseña</label>
                    <input 
                      type="password" required placeholder="••••••••"
                      value={adminPassword} onChange={e => setAdminPassword(e.target.value)}
                      className="w-full p-3 border border-[#C4A989] text-sm bg-white"
                    />
                  </div>

                  <button type="submit" className="w-full bg-[#292724] text-[#F3EBDD] py-3 text-xs uppercase tracking-widest font-bold hover:bg-[#493528]">
                    Ingresar al Panel
                  </button>
                </form>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#C4A989]">
                  <div>
                    <h2 className="text-3xl font-serif text-[#292724]">Panel de Control Admin</h2>
                    <p className="text-xs text-[#71806A] font-bold">Sesión activa • Gestión de catálogo</p>
                  </div>
                  <button onClick={() => { setIsAdminLoggedIn(false); localStorage.removeItem('kaa_admin_logged'); }} className="text-xs text-red-700 font-bold border border-red-300 px-3 py-1 bg-red-50">
                    Cerrar Sesión
                  </button>
                </div>

                <div className="bg-white p-6 border border-[#C4A989] mb-12">
                  <h3 className="text-lg font-serif text-[#292724] mb-4">Cargar Nuevo Producto</h3>
                  <form onSubmit={handleAddProduct} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase font-bold mb-1">Nombre</label>
                        <input 
                          type="text" required placeholder="Ej: Mate Torpedo Calabaza"
                          value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                          className="w-full p-2 border border-[#C4A989] text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase font-bold mb-1">Categoría</label>
                        <select 
                          value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                          className="w-full p-2 border border-[#C4A989] text-sm bg-white"
                        >
                          <option value="Mates">Mates</option>
                          <option value="Termos">Termos</option>
                          <option value="Bombillas">Bombillas</option>
                          <option value="Accesorios">Accesorios</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase font-bold mb-1">Precio ($)</label>
                        <input 
                          type="number" required placeholder="42000"
                          value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                          className="w-full p-2 border border-[#C4A989] text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase font-bold mb-1">URL de la Foto</label>
                        <input 
                          type="url" placeholder="https://..."
                          value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                          className="w-full p-2 border border-[#C4A989] text-sm"
                        />
                      </div>
                    </div>

                    <button type="submit" className="w-full bg-[#71806A] text-[#F3EBDD] py-3 text-xs uppercase tracking-widest font-bold hover:bg-[#493528]">
                      Guardar y Publicar
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Drawer Carrito */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[#F3EBDD] p-6 flex flex-col justify-between shadow-xl border-l border-[#C4A989]">
              <div>
                <div className="flex justify-between items-center pb-4 border-b border-[#C4A989]">
                  <h3 className="text-lg font-serif text-[#292724]">Tu Carrito</h3>
                  <button onClick={() => setIsCartOpen(false)}><X size={20} /></button>
                </div>

                {cart.length === 0 ? (
                  <p className="text-center text-sm text-[#493528] py-12">El carrito está vacío.</p>
                ) : (
