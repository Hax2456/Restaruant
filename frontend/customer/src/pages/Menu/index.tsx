import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomerCategories } from '../../api/category';
import { getCustomerDishes, getDishesByCategory } from '../../api/dish';
import { useCart } from '../../context/CartContext';
import type { Category, Dish } from '../../types';

const PLACEHOLDER = 'https://via.placeholder.com/80x80/FF6B35/ffffff?text=🍜';

const DishCard: React.FC<{ dish: Dish }> = ({ dish }) => {
  const { addItem, removeItem, getItemQuantity } = useCart();
  const qty = getItemQuantity(dish.id);
  const [imgError, setImgError] = useState(false);

  return (
    <div style={{
      display: 'flex',
      gap: '12px',
      padding: '14px 16px',
      background: '#fff',
      borderBottom: '1px solid #f5ede8',
      animation: 'fadeIn 0.3s ease',
    }}>
      {/* Image */}
      <div style={{
        width: '88px',
        height: '88px',
        borderRadius: '10px',
        overflow: 'hidden',
        flexShrink: 0,
        background: '#FFF0E8',
      }}>
        <img
          src={(!imgError && (dish.images || dish.image)) ? (dish.images || dish.image) : PLACEHOLDER}
          alt={dish.name}
          onError={() => setImgError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Info */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>
            {dish.name}
          </div>
          {dish.description && (
            <div style={{
              fontSize: '12px',
              color: '#999',
              lineHeight: '1.4',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}>
              {dish.description}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
          <span style={{ fontSize: '17px', fontWeight: '700', color: '#FF6B35' }}>
            ¥{Number(dish.price).toFixed(2)}
          </span>

          {/* Quantity control */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {qty > 0 && (
              <>
                <button
                  onClick={() => removeItem(dish.id)}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: '2px solid #FF6B35',
                    background: '#fff',
                    color: '#FF6B35',
                    fontSize: '18px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1,
                    transition: 'all 0.15s',
                  }}
                >
                  −
                </button>
                <span style={{ fontSize: '15px', fontWeight: '600', minWidth: '18px', textAlign: 'center' }}>
                  {qty}
                </span>
              </>
            )}
            <button
              onClick={() => addItem(dish)}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: 'none',
                background: 'linear-gradient(135deg, #FF6B35, #FF8C5A)',
                color: '#fff',
                fontSize: '20px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1,
                boxShadow: '0 2px 8px rgba(255,107,53,0.4)',
                transition: 'all 0.15s',
              }}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MenuPage: React.FC = () => {
  const navigate = useNavigate();
  const { totalItems, totalAmount } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const catRes = await getCustomerCategories();
        const cats = catRes.data.filter((c) => c.status === 1);
        setCategories(cats);

        if (cats.length > 0) {
          setActiveCategory(cats[0].id);
          const dishRes = await getDishesByCategory(cats[0].id);
          setDishes(dishRes.data.filter((d) => d.status === 1));
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : '加载失败');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleCategoryClick = async (catId: number) => {
    setActiveCategory(catId);
    try {
      const res = await getDishesByCategory(catId);
      setDishes(res.data.filter((d) => d.status === 1));
    } catch {
      setDishes([]);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '12px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #f0e8e0',
          borderTop: '3px solid #FF6B35',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <span style={{ color: '#999', fontSize: '14px' }}>加载中...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>😕</div>
        <div style={{ fontSize: '16px', marginBottom: '8px', color: '#666' }}>加载失败</div>
        <div style={{ fontSize: '13px', marginBottom: '20px' }}>{error}</div>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 24px',
            background: 'linear-gradient(135deg, #FF6B35, #FF8C5A)',
            color: '#fff',
            border: 'none',
            borderRadius: '20px',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          重新加载
        </button>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: totalItems > 0 ? '80px' : '0' }}>
      {/* Category Tabs */}
      <div
        ref={tabsRef}
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '8px',
          padding: '12px 16px',
          background: '#fff',
          borderBottom: '1px solid #f5ede8',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          position: 'sticky',
          top: '64px',
          zIndex: 40,
        }}
      >
        <style>{`.category-tabs::-webkit-scrollbar { display: none; }`}</style>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id)}
            style={{
              flexShrink: 0,
              padding: '7px 16px',
              borderRadius: '20px',
              border: activeCategory === cat.id ? 'none' : '1.5px solid #f0e8e0',
              background: activeCategory === cat.id
                ? 'linear-gradient(135deg, #FF6B35, #FF8C5A)'
                : '#fff',
              color: activeCategory === cat.id ? '#fff' : '#666',
              fontSize: '13px',
              fontWeight: activeCategory === cat.id ? '600' : '400',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: activeCategory === cat.id ? '0 2px 8px rgba(255,107,53,0.35)' : 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Dish List */}
      <div>
        {dishes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#ccc' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🍽️</div>
            <div style={{ fontSize: '15px', color: '#999' }}>暂无菜品</div>
          </div>
        ) : (
          dishes.map((dish) => <DishCard key={dish.id} dish={dish} />)
        )}
      </div>

      {/* Floating Cart Bar */}
      {totalItems > 0 && (
        <div
          onClick={() => navigate('/cart')}
          style={{
            position: 'fixed',
            bottom: '68px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 32px)',
            maxWidth: '448px',
            background: 'linear-gradient(135deg, #FF6B35, #E5501A)',
            borderRadius: '28px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(255,107,53,0.45)',
            animation: 'slideUp 0.3s ease',
            zIndex: 90,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'rgba(255,255,255,0.25)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
            }}>
              🛒
            </div>
            <div style={{
              background: '#fff',
              color: '#FF6B35',
              borderRadius: '12px',
              padding: '2px 8px',
              fontSize: '12px',
              fontWeight: '700',
              minWidth: '22px',
              textAlign: 'center',
            }}>
              {totalItems}
            </div>
          </div>
          <div style={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}>
            去结算
          </div>
          <div style={{ color: '#fff', fontSize: '16px', fontWeight: '700' }}>
            ¥{totalAmount.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
