import type { Opportunity, CreateOpportunityDTO, UpdateOpportunityDTO } from '../types';

const STORAGE_KEY = 'stafflink_opportunities';

function loadOpportunities(): Opportunity[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Opportunity[]) : [];
  } catch {
    return [];
  }
}

function saveOpportunities(items: Opportunity[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function generateId(): string {
  return `opp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export const opportunityService = {
  getAll(): Opportunity[] {
    return loadOpportunities();
  },

  getById(id: string): Opportunity | undefined {
    return loadOpportunities().find((o) => o.id === id);
  },

  create(dto: CreateOpportunityDTO): Opportunity {
    const newItem: Opportunity = { ...dto, id: generateId() };
    const items = loadOpportunities();
    items.push(newItem);
    saveOpportunities(items);
    return newItem;
  },

  update(id: string, dto: UpdateOpportunityDTO): Opportunity | null {
    const items = loadOpportunities();
    const idx = items.findIndex((o) => o.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...dto };
    saveOpportunities(items);
    return items[idx];
  },

  delete(id: string): boolean {
    const items = loadOpportunities();
    const filtered = items.filter((o) => o.id !== id);
    if (filtered.length === items.length) return false;
    saveOpportunities(filtered);
    return true;
  },
};
