import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Search, Menu, X, Instagram, MessageCircle, 
  Truck, ShieldCheck, RefreshCw, ChevronRight, Star, Plus, 
  Minus, Trash2, ArrowLeft, Filter, CheckCircle2, Lock, User, 
  Settings, Package, CreditCard, AlertCircle, Copy, ExternalLink 
} from 'lucide-react';

// Productos de demostración
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
      'https://images.unsplash.com/photo-1594910085817-497672e8cb30?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop'
    ],
    variants: [
      { id: 'v1-1', name: 'Alpaca Labrada - Cuero Negro', sku: 'MIMP-ALP-NG', stock: 5 },
      { id: 'v1-2', name: 'Alpaca Lisa - Cuero Marrón', sku: 'MIMP-ALP-MR', stock: 8 }
    ],
    features: ['Calabaza gruesa de alta resistencia', 'Virola de alpaca alemana', 'Base reforzada con 4 patas']
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
    ],
    features: ['Capacidad: 1.2 Litros', 'Pico cebador de alta precisión', 'Libre de BPA']
  },
  {
    id: 'prod-3',
    name: 'Bombilla de Alpaca Fina Cincelada',
    category: 'Bombillas',
    price: 14500,
    promoPrice: 12900,
    description: 'Bombilla de alpaca purificada con filtro de cuchara desmontable fácil de limpiar. Diseño ergonómico.',
    featured: false,
    active: true,
    images: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800&auto=format&fit=crop'
    ],
    variants: [
      { id: 'v3-1', name: 'Boquilla Plana - Cincelada', sku: 'BMB-ALP-PL', stock: 15 }
    ],
    features: ['Material: Alpaca 100%', 'Filtro desmontable', 'Largo: 19 cm']
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

  const [currentView, setCurrentView] = useState('home'); // home, catalog, product, checkout, confirmation, tracking, admin
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastCreatedOrder, setLastCreatedOrder] = useState(null);
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('kaa_admin_token'));

  // Persistencia
  useEffect(() => {
    localStorage.setItem('kaa_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('kaa_cart', JSON.stringify(cart));
  }, [cart]);

  // Funciones del Carrito
  const addToCart = (product, variant, quantity = 1) => {
    if (variant.stock < quantity) {
      alert('No hay suficiente stock disponible de esta variante.');
      return;
    }

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(
        item => item.productId === product.id && item.variantId === variant.id
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + quantity;
        if (newQty > variant.stock) {
          alert(`Límite de stock alcanzado (${variant.stock} unidades).`);
          return prevCart;
        }
        updated[existingIndex].quantity = newQty;
        return updated;
      }

      return [...prevCart, {
        productId: product.id,
        variantId: variant.id,
        name: product.name,
        variantName: variant.name,
        price: product.promoPrice || product.price,
        image: product.images[0],
        quantity,
        sku: variant.sku,
        maxStock: variant.stock
      }];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (productId, variantId) => {
    setCart(prev => prev.filter(item => !(item.productId === productId && item.variantId === variantId)));
  };

  const updateQuantity = (productId, variantId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.productId === productId && item.variantId === variantId) {
        if (newQty > item.maxStock) {
          alert(`Máximo stock disponible: ${item.maxStock}`);
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const freeShippingMin = 75000;
  const shippingCost = cartSubtotal >= freeShippingMin || cartSubtotal === 0 ? 0 : 6500;
  const cartTotal = cartSubtotal + shippingCost;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2C221E] font-sans">
      {/* Banner Superior */}
      <div className="bg-[#2C221E] text-[#FAF7F2] text-xs py-2 px-4 text-center tracking-wider uppercase font-medium">
        Envíos gratis a todo el país en compras superiores a $75.000 | Ushuaia, Tierra del Fuego
      </div>

      {/* Navegación Principal */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8E2D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="md:hidden p-2 text-[#2C221E] hover:text-[#4E5844]"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div 
            onClick={() => { setCurrentView('home'); setSelectedCategory('Todas'); }}
            className="cursor-pointer text-center md:text-left"
          >
            <h1 className="text-2xl md:text-3xl font-serif tracking-widest text-[#2C221E] font-bold">
              ORIGEN KA’A
            </h1>
            <p className="text-[10px] tracking-widest text-[#8C7A6B] uppercase font-medium">
              El origen de cada encuentro
            </p>
          </div>

          <nav className="hidden md:flex space-x-8 text-sm tracking-widest uppercase font-medium text-[#5C4D42]">
            <button onClick={() => { setCurrentView('home'); setSelectedCategory('Todas'); }} className="hover:text-[#2C221E] transition">Inicio</button>
            <button onClick={() => { setCurrentView('catalog'); setSelectedCategory('Todas'); }} className="hover:text-[#2C221E] transition">Catálogo</button>
            <button onClick={() => { setCurrentView('catalog'); setSelectedCategory('Mates'); }} className="hover:text-[#2C221E] transition">Mates</button>
            <button onClick={() => { setCurrentView('catalog'); setSelectedCategory('Termos'); }} className="hover:text-[#2C221E] transition">Termos</button>
            <button onClick={() => { setCurrentView('tracking'); }} className="hover:text-[#2C221E] transition">Mi Pedido</button>
          </nav>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#2C221E] hover:text-[#4E5844] transition"
            >
              <ShoppingBag size={24} />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-[#4E5844] text-[#FAF7F2] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Contenido Dinámico */}
      <main className="flex-1">
        {currentView === 'home' && (
          <div>
            {/* Hero Section */}
            <section className="relative h-[80vh] bg-cover bg-center flex items-center justify-center text-center px-4" style={{ backgroundImage: `linear-gradient(rgba(44, 34, 30, 0.45), rgba(44, 34, 30, 0.45)), url('https://images.unsplash.com/photo-1594910085817-497672e8cb30?q=80&w=1600&auto=format&fit=crop')` }}>
              <div className="max-w-3xl text-[#FAF7F2] space-y-6">
                <span className="text-xs uppercase tracking-widest bg-[#4E5844]/80 px-4 py-1.5 rounded-full">
                  Ushuaia • Tierra del Fuego
                </span>
                <h2 className="text-4xl md:text-6xl font-serif tracking-wide leading-tight">
                  Tu ritual, tu esencia
                </h2>
                <p className="text-lg md:text-xl font-light text-[#E8E2D9] max-w-xl mx-auto">
                  Mates artesanales, termos de alta conservación y accesorios diseñados para acompañar tus momentos únicos.
                </p>
                <button 
                  onClick={() => { setCurrentView('catalog'); setSelectedCategory('Todas'); }}
                  className="inline-block bg-[#FAF7F2] text-[#2C221E] hover:bg-[#E8E2D9] px-8 py-4 uppercase tracking-widest text-xs font-bold transition rounded-none"
                >
                  Comprar ahora
                </button>
              </div>
            </section>

            {/* Productos Destacados */}
            <section className="max-w-7xl mx-auto px-4 py-20">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-serif tracking-wide text-[#2C221E]">Productos Destacados</h3>
                <div className="w-16 h-0.5 bg-[#4E5844] mx-auto mt-4"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {products.filter(p => p.featured && p.active).map(product => (
                  <div key={product.id} className="group bg-white border border-[#E8E2D9] p-4 flex flex-col justify-between">
                    <div>
                      <div className="relative overflow-hidden aspect-square mb-4 bg-[#FAF7F2]">
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                        />
                      </div>
                      <span className="text-[10px] tracking-widest uppercase text-[#8C7A6B]">{product.category}</span>
                      <h4 className="text-lg font-serif text-[#2C221E] mt-1">{product.name}</h4>
                      <div className="mt-2 flex items-baseline space-x-2">
                        {product.promoPrice ? (
                          <>
                            <span className="text-base font-bold text-[#2C221E]">${product.promoPrice.toLocaleString('es-AR')}</span>
                            <span className="text-xs text-[#8C7A6B] line-through">${product.price.toLocaleString('es-AR')}</span>
                          </>
                        ) : (
                          <span className="text-base font-bold text-[#2C221E]">${product.price.toLocaleString('es-AR')}</span>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => { setSelectedProduct(product); setCurrentView('product'); }}
                      className="w-full mt-6 bg-[#2C221E] text-[#FAF7F2] hover:bg-[#4E5844] py-3 text-xs uppercase tracking-widest transition"
                    >
                      Ver Detalle
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Vista de Catálogo */}
        {currentView === 'catalog' && (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-serif text-[#2C221E]">Catálogo de Productos</h2>
                <p className="text-sm text-[#8C7A6B]">Artesanías patagónicas con envíos a todo el país.</p>
              </div>

              {/* Categorías */}
              <div className="flex flex-wrap gap-2">
                {['Todas', 'Mates', 'Termos', 'Bombillas', 'Accesorios', 'Combos'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 text-xs uppercase tracking-wider transition ${
                      selectedCategory === cat 
                        ? 'bg-[#2C221E] text-[#FAF7F2]' 
                        : 'bg-white border border-[#E8E2D9] text-[#2C221E] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products
                .filter(p => p.active)
                .filter(p => selectedCategory === 'Todas' || p.category === selectedCategory)
                .map(product => (
                  <div key={product.id} className="bg-white border border-[#E8E2D9] p-4 flex flex-col justify-between">
                    <div>
                      <img src={product.images[0]} alt={product.name} className="w-full aspect-square object-cover mb-4" />
                      <span className="text-[10px] tracking-widest uppercase text-[#8C7A6B]">{product.category}</span>
                      <h3 className="text-lg font-serif text-[#2C221E] mt-1">{product.name}</h3>
                      <p className="text-sm text-[#5C4D42] mt-2 line-clamp-2">{product.description}</p>
                      <div className="mt-4 font-bold text-[#2C221E]">
                        ${(product.promoPrice || product.price).toLocaleString('es-AR')}
                      </div>
                    </div>
                    <button 
                      onClick={() => { setSelectedProduct(product); setCurrentView('product'); }}
                      className="w-full mt-6 bg-[#2C221E] text-[#FAF7F2] hover:bg-[#4E5844] py-3 text-xs uppercase tracking-widest transition"
                    >
                      Ver Opciones
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Vista de Detalle de Producto */}
        {currentView === 'product' && selectedProduct && (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <button 
              onClick={() => setCurrentView('catalog')}
              className="flex items-center text-xs uppercase tracking-widest text-[#8C7A6B] hover:text-[#2C221E] mb-8"
            >
              <ArrowLeft size={16} className="mr-2" /> Volver al catálogo
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="w-full aspect-square object-cover border border-[#E8E2D9]" />
              </div>

              <div className="space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#8C7A6B]">{selectedProduct.category}</span>
                  <h1 className="text-3xl font-serif text-[#2C221E] mt-1">{selectedProduct.name}</h1>
                  <div className="text-2xl font-bold text-[#2C221E] mt-2">
                    ${(selectedProduct.promoPrice || selectedProduct.price).toLocaleString('es-AR')}
                  </div>
                </div>

                <p className="text-sm text-[#5C4D42] leading-relaxed">{selectedProduct.description}</p>

                {/* Seleccionar Variantes */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#2C221E] font-bold mb-2">
                    Seleccionar Opción / Variante:
                  </label>
                  <div className="space-y-2">
                    {selectedProduct.variants.map(variant => (
                      <button
                        key={variant.id}
                        onClick={() => addToCart(selectedProduct, variant)}
                        disabled={variant.stock === 0}
                        className="w-full p-3 border border-[#E8E2D9] bg-white hover:border-[#2C221E] text-left flex justify-between items-center text-sm disabled:opacity-50"
                      >
                        <span>{variant.name} (SKU: {variant.sku})</span>
                        <span className="text-xs text-[#8C7A6B]">
                          {variant.stock > 0 ? `${variant.stock} disponibles` : 'Sin Stock'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vista de Consulta de Pedidos */}
        {currentView === 'tracking' && (
          <div className="max-w-md mx-auto px-4 py-16 text-center">
            <h2 className="text-2xl font-serif text-[#2C221E] mb-4">Consultar Estado de Pedido</h2>
            <p className="text-sm text-[#5C4D42] mb-6">Ingresá el número de tu orden para ver el estado del pago y despacho desde Ushuaia.</p>
            <input 
              type="text" 
              placeholder="Ej: ORD-20261009-8492" 
              className="w-full p-3 border border-[#E8E2D9] text-center mb-4 uppercase"
            />
            <button className="w-full bg-[#2C221E] text-[#FAF7F2] py-3 text-xs uppercase tracking-widest font-bold">
              Buscar Pedido
            </button>
          </div>
        )}
      </main>

      {/* Carrito Lateral (Drawer) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm">
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
                    onClick={() => { setIsCartOpen(false); alert('Iniciando proceso de checkout simulado...'); }}
                    className="w-full bg-[#2C221E] text-[#FAF7F2] py-4 text-xs uppercase tracking-widest font-bold hover:bg-[#4E5844] transition"
                  >
                    Finalizar Compra
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pie de Página */}
      <footer className="bg-[#2C221E] text-[#FAF7F2] py-12 px-4 border-t border-[#4E5844]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h4 className="text-xl font-serif tracking-widest mb-2">ORIGEN KA’A</h4>
            <p className="text-xs text-[#E8E2D9] tracking-wider">El origen de cada encuentro</p>
            <p className="text-xs text-[#8C7A6B] mt-4">Ushuaia, Tierra del Fuego, Argentina.</p>
          </div>

          <div className="space-y-2 text-xs uppercase tracking-widest text-[#E8E2D9]">
            <p className="font-bold text-[#FAF7F2]">Contacto & Redes</p>
            <p>Instagram: @origenkaa</p>
            <p>WhatsApp: +54 2901 15-XXXXXX</p>
            <p>Envíos a todo el país por Correo Argentino / Andreani</p>
          </div>

          <div className="text-xs text-[#8C7A6B] space-y-2">
            <p>© 2026 ORIGEN KA’A. Todos los derechos reservados.</p>
            <p>Ushuaia • Patagonia Argentina</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
