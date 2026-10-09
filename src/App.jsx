import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Search, Menu, X, Instagram, MessageCircle, 
  Truck, ShieldCheck, RefreshCw, ChevronRight, Star, Plus, 
  Minus, Trash2, ArrowLeft, Filter, CheckCircle2, Lock, User, 
  Settings, Package, CreditCard, AlertCircle, Copy, ExternalLink, Image as ImageIcon
} from 'lucide-react';

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
    images: [
      'https://images.unsplash.com/photo-1594910085817-497672e8cb30?q=80&w=800&auto=format&fit=crop'
    ],
    variants: [
      { id: 'v1-1', name: 'Alpaca Labrada - Cuero Negro', sku: 'MIMP-ALP-NG', stock: 5 },
      { id: 'v1-2', name: 'Alpaca Lisa - Cuero Marrón', sku: 'MIMP-ALP-MR', stock: 8 }
    ]
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
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop'
    ],
    variants: [
      { id: 'v2-1', name: 'Verde Yerba Matte', sku: 'TRM-12L-VD', stock: 12 },
      { id: 'v2-2', name: 'Negro Azabache', sku: 'TRM-12L-NG', stock: 4 }
    ]
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

  const [currentView, setCurrentView] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  
  // Login y Estado Admin
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminTab, setAdminTab] = useState('products'); // products, orders

  // Formulario para Crear / Editar Producto en Admin
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Mates',
    price: '',
    promoPrice: '',
    description: '',
    image: '',
    variantName: 'Estándar',
    sku: '',
    stock: 10
  });

  // Datos Checkout
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'transfer'
  });
  const [lastOrder, setLastOrder] = useState(null);

  useEffect(() => {
    localStorage.setItem('kaa_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('kaa_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, variant, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id && item.variantId === variant.id);
      if (existing) {
        return prev.map(item => 
          item.productId === product.id && item.variantId === variant.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, {
        productId: product.id,
        variantId: variant.id,
        name: product.name,
        variantName: variant.name,
        price: product.promoPrice || product.price,
        image: product.images[0],
        quantity,
        maxStock: variant.stock
      }];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (productId, variantId) => {
    setCart(prev => prev.filter(item => !(item.productId === productId && item.variantId === variantId)));
  };

  const updateQuantity = (productId, variantId, newQty) => {
    if (newQty <= 0) return removeFromCart(productId, variantId);
    setCart(prev => prev.map(item => 
      item.productId === productId && item.variantId === variantId ? { ...item, quantity: newQty } : item
    ));
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
      alert('Credenciales incorrectas. Verificá mail y contraseña.');
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
      variants: [
        {
          id: `v-${Date.now()}`,
          name: newProduct.variantName,
          sku: newProduct.sku || `SKU-${Date.now().toString().slice(-4)}`,
          stock: Number(newProduct.stock)
        }
      ]
    };

    setProducts([created, ...products]);
    alert('¡Producto cargado con éxito en el catálogo!');
    setNewProduct({
      name: '',
      category: 'Mates',
      price: '',
      promoPrice: '',
      description: '',
      image: '',
      variantName: 'Estándar',
      sku: '',
      stock: 10
    });
  };

  const handleDeleteProduct = (id) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2C221E] font-sans">
      <div className="bg-[#2C221E] text-[#FAF7F2] text-xs py-2 px-4 text-center tracking-wider uppercase font-medium">
        Envíos gratis a todo el país en compras superiores a $75.000 | Ushuaia, Tierra del Fuego
      </div>

      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E2D9]">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-[#2C221E]">
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          <div onClick={() => { setCurrentView('home'); setSelectedCategory('Todas'); setIsMenuOpen(false); }} className="cursor-pointer text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-serif tracking-widest text-[#2C221E] font-bold">
              ORIGEN KA’A
            </h1>
            <p className="text-[10px] tracking-widest text-[#8C7A6B] uppercase font-medium">
              El origen de cada encuentro
            </p>
          </div>

          <nav className="hidden md:flex space-x-8 text-sm tracking-widest uppercase font-medium text-[#5C4D42]">
            <button onClick={() => { setCurrentView('home'); setSelectedCategory('Todas'); }} className="hover:text-[#2C221E]">Inicio</button>
            <button onClick={() => { setCurrentView('catalog'); setSelectedCategory('Todas'); }} className="hover:text-[#2C221E]">Catálogo</button>
            <button onClick={() => { setCurrentView('catalog'); setSelectedCategory('Mates'); }} className="hover:text-[#2C221E]">Mates</button>
            <button onClick={() => { setCurrentView('catalog'); setSelectedCategory('Termos'); }} className="hover:text-[#2C221E]">Termos</button>
          </nav>

          <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-[#2C221E]">
            <ShoppingBag size={24} />
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 bg-[#4E5844] text-[#FAF7F2] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>

        {/* Menú Desplegable Móvil */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#FAF7F2] border-b border-[#E8E2D9] px-4 py-6 space-y-4 text-center tracking-widest uppercase text-sm font-medium">
            <button onClick={() => { setCurrentView('home'); setSelectedCategory('Todas'); setIsMenuOpen(false); }} className="block w-full py-2 hover:bg-white">Inicio</button>
            <button onClick={() => { setCurrentView('catalog'); setSelectedCategory('Todas'); setIsMenuOpen(false); }} className="block w-full py-2 hover:bg-white">Catálogo Completo</button>
            <button onClick={() => { setCurrentView('catalog'); setSelectedCategory('Mates'); setIsMenuOpen(false); }} className="block w-full py-2 hover:bg-white">Mates</button>
            <button onClick={() => { setCurrentView('catalog'); setSelectedCategory('Termos'); setIsMenuOpen(false); }} className="block w-full py-2 hover:bg-white">Termos</button>
            <button onClick={() => { setCurrentView('admin'); setIsMenuOpen(false); }} className="block w-full py-2 text-[#4E5844] font-bold border-t border-[#E8E2D9]">Acceso Panel Admin</button>
          </div>
        )}
      </header>

      <main className="flex-1">
        {currentView === 'home' && (
          <div>
            <section className="relative h-[65vh] bg-cover bg-center flex items-center justify-center text-center px-4" style={{ backgroundImage: `linear-gradient(rgba(44, 34, 30, 0.45), rgba(44, 34, 30, 0.45)), url('https://images.unsplash.com/photo-1594910085817-497672e8cb30?q=80&w=1600&auto=format&fit=crop')` }}>
              <div className="max-w-3xl text-[#FAF7F2] space-y-6">
                <span className="text-xs uppercase tracking-widest bg-[#4E5844]/80 px-4 py-1.5 rounded-full">
                  Ushuaia • Tierra del Fuego
                </span>
                <h2 className="text-4xl md:text-6xl font-serif">Tu ritual, tu esencia</h2>
                <p className="text-base md:text-lg font-light text-[#E8E2D9]">
                  Mates artesanales, termos de alta conservación y accesorios materos.
                </p>
                <button 
                  onClick={() => { setCurrentView('catalog'); setSelectedCategory('Todas'); }}
                  className="bg-[#FAF7F2] text-[#2C221E] px-8 py-3 uppercase tracking-widest text-xs font-bold"
                >
                  Ver Catálogo
                </button>
              </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 py-16">
              <h3 className="text-2xl font-serif text-center mb-8">Productos Destacados</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {products.filter(p => p.featured).map(product => (
                  <div key={product.id} className="bg-white border border-[#E8E2D9] p-4 flex flex-col justify-between">
                    <div>
                      <img src={product.images[0]} alt={product.name} className="w-full aspect-square object-cover mb-4" />
                      <span className="text-[10px] uppercase text-[#8C7A6B]">{product.category}</span>
                      <h4 className="text-lg font-serif text-[#2C221E] mt-1">{product.name}</h4>
                      <p className="text-sm font-bold mt-2">${(product.promoPrice || product.price).toLocaleString('es-AR')}</p>
                    </div>
                    <button 
                      onClick={() => { setSelectedProduct(product); setCurrentView('product'); }}
                      className="w-full mt-4 bg-[#2C221E] text-[#FAF7F2] py-3 text-xs uppercase tracking-widest"
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
            <h2 className="text-3xl font-serif text-[#2C221E] mb-6">Catálogo Completo</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products
                .filter(p => selectedCategory === 'Todas' || p.category === selectedCategory)
                .map(product => (
                  <div key={product.id} className="bg-white border border-[#E8E2D9] p-4 flex flex-col justify-between">
                    <div>
                      <img src={product.images[0]} alt={product.name} className="w-full aspect-square object-cover mb-4" />
                      <span className="text-[10px] uppercase text-[#8C7A6B]">{product.category}</span>
                      <h3 className="text-lg font-serif text-[#2C221E] mt-1">{product.name}</h3>
                      <p className="text-sm font-bold mt-2">${(product.promoPrice || product.price).toLocaleString('es-AR')}</p>
                    </div>
                    <button 
                      onClick={() => { setSelectedProduct(product); setCurrentView('product'); }}
                      className="w-full mt-4 bg-[#2C221E] text-[#FAF7F2] py-3 text-xs uppercase tracking-widest"
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
            <button onClick={() => setCurrentView('catalog')} className="flex items-center text-xs uppercase text-[#8C7A6B] mb-6">
              <ArrowLeft size={16} className="mr-2" /> Volver
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="w-full aspect-square object-cover border" />
              <div>
                <span className="text-xs uppercase text-[#8C7A6B]">{selectedProduct.category}</span>
                <h1 className="text-3xl font-serif text-[#2C221E] mt-1">{selectedProduct.name}</h1>
                <p className="text-2xl font-bold mt-2">${(selectedProduct.promoPrice || selectedProduct.price).toLocaleString('es-AR')}</p>
                <p className="text-sm text-[#5C4D42] my-4">{selectedProduct.description}</p>
                
                <div className="space-y-3 mt-6">
                  <p className="text-xs uppercase font-bold text-[#2C221E]">Seleccionar Variante:</p>
                  {selectedProduct.variants.map(variant => (
                    <button
                      key={variant.id}
                      onClick={() => addToCart(selectedProduct, variant)}
                      className="w-full p-3 border text-left flex justify-between text-sm bg-white hover:border-[#2C221E]"
                    >
                      <span>{variant.name}</span>
                      <span className="text-xs text-[#8C7A6B]">{variant.stock} en stock</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VISTA DEL PANEL DE ADMINISTRACIÓN */}
        {currentView === 'admin' && (
          <div className="max-w-4xl mx-auto px-4 py-12">
            {!isAdminLoggedIn ? (
              <div className="max-w-md mx-auto bg-white p-8 border border-[#E8E2D9]">
                <div className="text-center mb-6">
                  <Lock size={32} className="mx-auto text-[#4E5844] mb-2" />
                  <h2 className="text-2xl font-serif text-[#2C221E]">Panel de Administración</h2>
                  <p className="text-xs text-[#8C7A6B] uppercase tracking-widest mt-1">ORIGEN KA’A</p>
                </div>

                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase font-bold text-[#2C221E] mb-1">Email Admin</label>
                    <input 
                      type="email" required placeholder="admin@origenkaa.com.ar"
                      value={adminEmail} onChange={e => setAdminEmail(e.target.value)}
                      className="w-full p-3 border text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-bold text-[#2C221E] mb-1">Contraseña</label>
                    <input 
                      type="password" required placeholder="••••••••"
                      value={adminPassword} onChange={e => setAdminPassword(e.target.value)}
                      className="w-full p-3 border text-sm"
                    />
                  </div>

                  <button type="submit" className="w-full bg-[#2C221E] text-[#FAF7F2] py-3 text-xs uppercase tracking-widest font-bold">
                    Ingresar al Panel
                  </button>
                </form>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-8 pb-4 border-b">
                  <div>
                    <h2 className="text-3xl font-serif text-[#2C221E]">Panel de Control Admin</h2>
                    <p className="text-xs text-[#8C7A6B]">Gestión de catálogo e inventario</p>
                  </div>
                  <button onClick={() => setIsAdminLoggedIn(false)} className="text-xs text-red-600 uppercase font-bold">
                    Cerrar Sesión
                  </button>
                </div>

                {/* Formulario Cargar Producto */}
                <div className="bg-white p-6 border border-[#E8E2D9] mb-12">
                  <h3 className="text-lg font-serif text-[#2C221E] mb-4">Cargar Nuevo Producto</h3>
                  <form onSubmit={handleAddProduct} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase font-bold mb-1">Nombre del Producto</label>
                        <input 
                          type="text" required placeholder="Ej: Mate Torpedo de Calabaza"
                          value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                          className="w-full p-2 border text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase font-bold mb-1">Categoría</label>
                        <select 
                          value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                          className="w-full p-2 border text-sm bg-white"
                        >
                          <option value="Mates">Mates</option>
                          <option value="Termos">Termos</option>
                          <option value="Bombillas">Bombillas</option>
                          <option value="Accesorios">Accesorios</option>
                          <option value="Combos">Combos</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase font-bold mb-1">Precio Normal ($)</label>
                        <input 
                          type="number" required placeholder="42000"
                          value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                          className="w-full p-2 border text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase font-bold mb-1">Precio Promocional ($ opcional)</label>
                        <input 
                          type="number" placeholder="38000"
                          value={newProduct.promoPrice} onChange={e => setNewProduct({...newProduct, promoPrice: e.target.value})}
                          className="w-full p-2 border text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-bold mb-1">URL de la Foto</label>
                      <input 
                        type="url" placeholder="https://..."
                        value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                        className="w-full p-2 border text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-bold mb-1">Descripción</label>
                      <textarea 
                        rows="3" placeholder="Detalle del producto..."
                        value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                        className="w-full p-2 border text-sm"
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-3 gap-4 bg-[#FAF7F2] p-3 border">
                      <div>
                        <label className="block text-xs uppercase font-bold mb-1">Variante / Opción</label>
                        <input 
                          type="text" placeholder="Ej: Alpaca / Negro"
                          value={newProduct.variantName} onChange={e => setNewProduct({...newProduct, variantName: e.target.value})}
                          className="w-full p-2 border text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase font-bold mb-1">SKU</label>
                        <input 
                          type="text" placeholder="MAT-TOR-01"
                          value={newProduct.sku} onChange={e => setNewProduct({...newProduct, sku: e.target.value})}
                          className="w-full p-2 border text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase font-bold mb-1">Stock Inicial</label>
                        <input 
                          type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                          className="w-full p-2 border text-sm"
                        />
                      </div>
                    </div>

                    <button type="submit" className="w-full bg-[#4E5844] text-[#FAF7F2] py-3 text-xs uppercase tracking-widest font-bold">
                      Guardar y Publicar en la Tienda
                    </button>
                  </form>
                </div>

                {/* Listado de Productos Existentes */}
                <h3 className="text-lg font-serif text-[#2C221E] mb-4">Catálogo Activo ({products.length} productos)</h3>
                <div className="space-y-4">
                  {products.map(p => (
                    <div key={p.id} className="bg-white p-4 border flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img src={p.images[0]} alt={p.name} className="w-12 h-12 object-cover border" />
                        <div>
                          <p className="font-bold text-sm">{p.name}</p>
                          <p className="text-xs text-[#8C7A6B]">{p.category} • ${(p.promoPrice || p.price).toLocaleString('es-AR')}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteProduct(p.id)} className="text-red-600 p-2">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
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
            <div className="w-screen max-w-md bg-[#FAF7F2] p-6 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex justify-between items-center pb-4 border-b border-[#E8E2D9]">
                  <h3 className="text-lg font-serif text-[#2C221E]">Tu Carrito</h3>
                  <button onClick={() => setIsCartOpen(false)}><X size={20} /></button>
                </div>

                {cart.length === 0 ? (
                  <p className="text-center text-sm text-[#8C7A6B] py-12">El carrito está vacío.</p>
                ) : (
                  <div className="divide-y divide-[#E8E2D9] my-4 max-h-[60vh] overflow-y-auto">
                    {cart.map(item => (
                      <div key={`${item.productId}-${item.variantId}`} className="py-4 flex items-center space-x-4">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover border" />
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-[#2C221E]">{item.name}</h4>
                          <p className="text-xs text-[#8C7A6B]">{item.variantName}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <button onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)} className="p-1 border"><Minus size={12} /></button>
                            <span className="text-xs font-bold">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)} className="p-1 border"><Plus size={12} /></button>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold">${(item.price * item.quantity).toLocaleString('es-AR')}</span>
                          <button onClick={() => removeFromCart(item.productId, item.variantId)} className="block text-red-600 mt-2 ml-auto"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t border-[#E8E2D9] pt-4 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span className="font-bold">${cartSubtotal.toLocaleString('es-AR')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Envío:</span>
                    <span>{shippingCost === 0 ? '¡GRATIS!' : `$${shippingCost.toLocaleString('es-AR')}`}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#2C221E]">
                    <span>Total:</span>
                    <span>${cartTotal.toLocaleString('es-AR')}</span>
                  </div>
                  <button 
                    onClick={() => { setIsCartOpen(false); setCurrentView('checkout'); }}
                    className="w-full bg-[#2C221E] text-[#FAF7F2] py-4 text-xs uppercase tracking-widest font-bold hover:bg-[#4E5844] transition"
                  >
                    FINALIZAR COMPRA
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="bg-[#2C221E] text-[#FAF7F2] py-12 px-4 border-t border-[#4E5844]">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <h4 className="text-xl font-serif tracking-widest">ORIGEN KA’A</h4>
          <p className="text-xs text-[#E8E2D9]">El origen de cada encuentro • Ushuaia, Tierra del Fuego</p>
          
          {/* Botón Acceso Admin en el pie de página */}
          <button 
            onClick={() => setCurrentView('admin')}
            className="inline-flex items-center text-xs text-[#8C7A6B] hover:text-[#FAF7F2] tracking-widest uppercase pt-4"
          >
            <Lock size={12} className="mr-1" /> Acceso Administración
          </button>
        </div>
      </footer>
    </div>
  );
}
