import type { Category } from '../../types/api';

export type CategoryPillsProps = {
  categories: Category[];
  activeId?: number | null;
  onSelect: (categoryId: number | null) => void;
};

const CategoryPills = ({ categories, activeId, onSelect }: CategoryPillsProps) => (
  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
    <button
      type="button"
      onClick={() => onSelect(null)}
      style={{
        padding: '10px 16px',
        borderRadius: '999px',
        border: '1px solid rgba(15, 23, 42, 0.1)',
        background: activeId == null ? '#0f172a' : '#fff',
        color: activeId == null ? '#fff' : '#0f172a',
        cursor: 'pointer',
        fontWeight: 600
      }}
    >
      Todas
    </button>
    {categories.map((category) => (
      <button
        key={category.id}
        type="button"
        onClick={() => onSelect(category.id)}
        style={{
          padding: '10px 16px',
          borderRadius: '999px',
          border: '1px solid rgba(15, 23, 42, 0.1)',
          background: category.id === activeId ? category.color ?? '#00b4d8' : '#fff',
          color: category.id === activeId ? '#0f172a' : '#0f172a',
          cursor: 'pointer',
          fontWeight: 600
        }}
      >
        {category.name}
      </button>
    ))}
  </div>
);

export default CategoryPills;
