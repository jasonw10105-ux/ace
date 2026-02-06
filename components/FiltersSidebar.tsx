
import React from 'react';
import { Card } from './design-system/Card';
import { Typography } from './design-system/Typography';
import { Input } from './design-system/Input';
import { tokens } from './design-system/tokens';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterSection {
  title: string;
  options: FilterOption[];
  type: 'checkbox' | 'radio' | 'range' | 'search';
}

export interface FiltersSidebarProps {
  sections?: FilterSection[];
  values?: Record<string, any>;
  onChange?: (key: string, value: any) => void;
  onClear?: () => void;
  className?: string;
}

export const FiltersSidebar: React.FC<FiltersSidebarProps> = ({
  sections = [],
  values = {},
  onChange,
  onClear,
  className = '',
}) => {
  const renderOption = (section: FilterSection, option: FilterOption) => {
    const val = values[section.title];
    const isChecked = Array.isArray(val) ? val.includes(option.value) : val === option.value;

    const handleChange = () => {
      if (section.type === 'checkbox') {
        const current = Array.isArray(val) ? val : [];
        const next = isChecked ? current.filter(v => v !== option.value) : [...current, option.value];
        onChange?.(section.title, next);
      } else {
        onChange?.(section.title, option.value);
      }
    };

    return (
      <label key={option.value} className="flex items-center gap-3 py-2 cursor-pointer group">
        <input
          type={section.type === 'radio' ? 'radio' : 'checkbox'}
          checked={isChecked}
          onChange={handleChange}
          className="w-4 h-4 accent-black"
        />
        <Typography variant="bodySmall" style={{ flex: 1 }} color={isChecked ? 'primary' : 'secondary'}>
          {option.label}
        </Typography>
        {option.count && <Typography variant="caption" color="tertiary">{option.count}</Typography>}
      </label>
    );
  };

  return (
    <Card variant="outlined" padding="lg" className={className}>
      <div className="flex justify-between items-center mb-8">
        <Typography variant="h6">Refine Signals</Typography>
        <button onClick={onClear} className="text-xs font-bold uppercase tracking-widest text-blue-500 hover:text-black transition-colors">Clear All</button>
      </div>
      
      {sections.map(section => (
        <div key={section.title} className="mb-10">
          <Typography variant="label" style={{ marginBottom: tokens.spacing.md }}>{section.title}</Typography>
          {section.type === 'search' ? (
            <Input 
              placeholder={`Search ${section.title}...`} 
              value={values[section.title] || ''} 
              onChange={e => onChange?.(section.title, e.target.value)} 
            />
          ) : (
            <div className="flex flex-col gap-1">
              {section.options.map(opt => renderOption(section, opt))}
            </div>
          )}
        </div>
      ))}
    </Card>
  );
};

export default FiltersSidebar;
