import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Search, Menu, X, Instagram, MessageCircle, 
  Truck, ShieldCheck, RefreshCw, ChevronRight, Star, Plus, 
  Minus, Trash2, ArrowLeft, Filter, CheckCircle2, Lock, User, 
  Settings, Package, CreditCard, AlertCircle, Copy, ExternalLink 
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
  },
  {
    id: 'prod-3',
    name: 'Bombilla de Alpaca Fina Cincelada',
    category: 'Bombillas',
    price: 14500,
    promoPrice: 12900,
    description: 'Bombilla de alpaca purificada con filtro de cuchara desmontable fácil de limpiar.',
    featured: false,
    active: true,
    images: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800&auto=format&fit=crop'
    ],
    variants: [
      { id: 'v3-1', name: 'Boquilla Plana - Cincelada', sku: 'BMB-ALP-PL', stock: 15 }
    ]
  }
];

export default function App() {
  const [products] = useState(() => {
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
  
  // Datos de Checkout
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    province: 'Tierra del Fuego',
    city: 'Ushuaia',
    paymentMethod: 'transfer'
  });
  const [lastOrder, setLastOrder] = useState(null);

  useEffect(() => {
    localStorage.setItem('kaa_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, variant, quantity = 1) => {
    if (variant.stock < quantity) {
      alert('Sin stock disponible');
      return;
    }

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

  const handleCreateOrder = (e) => {
    e.preventDefault();
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const newOrder = {
      id: orderId,
      customer: formData,
      items: cart,
      subtotal: cartSubtotal,
      shipping: shippingCost,
      total: cartTotal,
      status: 'Pendiente de verificación',
      date: new Date().toLocaleDateString('es-AR')
    };

    setLastOrder(newOrder);
    setCart([]);
    setIsCartOpen(false);
    setCurrentView('confirmation');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2C221E] font-sans">
      <div className="bg-[#2C221E] text-[#FAF7F2] text-xs py-2 px-4 text-center tracking-wider uppercase font-medium">
        Envíos gratis a todo el país en compras superiores a $75.000 | Ushuaia, Tierra del Fuego
      </div>

      <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8E2D9]">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-[#2C221E]">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div onClick={() => { setCurrentView('home'); setSelectedCategory('Todas'); }} className="cursor-pointer text-center md:text-left">
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
              {products.map(product => (
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

        {/* Vista de Checkout */}
        {currentView === 'checkout' && (
          <div className="max-w-2xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-serif text-[#2C221E] mb-6">Finalizar Compra</h2>
            <form onSubmit={handleCreateOrder} className="space-y-4 bg-white p-6 border border-[#E8E2D9]">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#2C221E]">1. Datos de Envío</h3>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" required placeholder="Nombre" 
                  value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})}
                  className="p-3 border text-sm w-full" 
                />
                <input 
                  type="text" required placeholder="Apellido" 
                  value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})}
                  className="p-3 border text-sm w-full" 
                />
              </div>
              <input 
                type="email" required placeholder="Email" 
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                className="p-3 border text-sm w-full" 
              />
              <input 
                type="tel" required placeholder="Teléfono / WhatsApp" 
                value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                className="p-3 border text-sm w-full" 
              />
              <input 
                type="text" required placeholder="Dirección de Entrega" 
                value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                className="p-3 border text-sm w-full" 
              />

              <h3 className="text-sm font-bold uppercase tracking-wider text-[#2C221E] pt-4">2. Método de Pago</h3>
              <div className="space-y-2">
                <label className="flex items-center p-3 border cursor-pointer hover:bg-[#FAF7F2]">
                  <input 
                    type="radio" name="payment" value="transfer" 
                    checked={formData.paymentMethod === 'transfer'} 
                    onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
                    className="mr-3" 
                  />
                  <div>
                    <p className="text-sm font-bold">Transferencia Bancaria Directa</p>
                    <p className="text-xs text-[#8C7A6B]">Datos para transferir al confirmar el pedido</p>
                  </div>
                </label>

                <label className="flex items-center p-3 border cursor-pointer hover:bg-[#FAF7F2]">
                  <input 
                    type="radio" name="payment" value="mercadopago" 
                    checked={formData.paymentMethod === 'mercadopago'} 
                    onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
                    className="mr-3" 
                  />
                  <div>
                    <p className="text-sm font-bold">Mercado Pago / Tarjetas</p>
                    <p className="text-xs text-[#8C7A6B]">Págalo online con dinero en cuenta o tarjetas</p>
                  </div>
                </label>
              </div>

              <div className="pt-4 border-t my-4">
                <div className="flex justify-between text-base font-bold text-[#2C221E] mb-4">
                  <span>Total a Pagar:</span>
                  <span>${cartTotal.toLocaleString('es-AR')}</span>
                </div>
                <button type="submit" className="w-full bg-[#2C221E] text-[#FAF7F2] py-4 text-xs uppercase tracking-widest font-bold">
                  Confirmar Pedido
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Vista de Confirmación de Pedido */}
        {currentView === 'confirmation' && lastOrder && (
          <div className="max-w-lg mx-auto px-4 py-16 text-center">
            <CheckCircle2 size={48} className="mx-auto text-[#4E5844] mb-4" />
            <h2 className="text-2xl font-serif text-[#2C221E] mb-2">¡Pedido Confirmado!</h2>
            <p className="text-xs text-[#8C7A6B] uppercase tracking-widest mb-6">Número de Orden: {lastOrder.id}</p>

            <div className="bg-white p-6 border text-left space-y-3 text-sm mb-6">
              <p className="font-bold text-[#2C221E]">Datos para Transferencia Bancaria:</p>
              <p><strong>Banco:</strong> Banco Nación</p>
              <p><strong>Alias:</strong> ORIGEN.KAA.USH</p>
              <p><strong>CBU:</strong> 0110000000000000000000</p>
              <p><strong>Titular:</strong> ORIGEN KA'A S.A.S.</p>
              <p className="text-xs text-[#8C7A6B] pt-2 border-t">Monto total: <strong>${lastOrder.total.toLocaleString('es-AR')}</strong></p>
            </div>

            <a 
              href={`https://wa.me/54290115000000?text=Hola%20ORIGEN%20KA’A,%20realicé%20el%20pedido%20${lastOrder.id}%20por%20$${lastOrder.total}`}
              target="_blank" rel="noreferrer"
              className="inline-flex items-center justify-center w-full bg-[#4E5844] text-[#FAF7F2] py-3 text-xs uppercase tracking-widest font-bold mb-3"
            >
              <MessageCircle size={16} className="mr-2" /> Enviar Comprobante por WhatsApp
            </a>

            <button onClick={() => setCurrentView('home')} className="text-xs text-[#8C7A6B] uppercase tracking-widest underline">
              Volver a la tienda
            </button>
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
        </div>
      </footer>
    </div>
  );
}
