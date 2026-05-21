// ============================================================
// IMPORTS
// ============================================================
import { useState, useEffect, useCallback } from 'react';
import type { Vacation } from '../../../entities/vacaciones/model/types';
import { vacacionesService } from '../../../entities/vacaciones/api/vacaciones-service';

export function useManageVacations() {
  const [requests, setRequests] = useState<Vacation[]>([]);
  const [loading, setLoading] = useState(false);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      const allVacations = await vacacionesService.getAll();
      setRequests(allVacations);
    } catch (e) {
      console.error('Failed to load vacation requests', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const updateRequestStatus = async (id: string, newStatus: 'Approved' | 'Rejected') => {
    try {
      await vacacionesService.update(id, { field_estado: newStatus });
      setRequests(current =>
        current.map(req => (req.id === id ? { ...req, field_estado: newStatus } : req))
      );
      
      if (newStatus === 'Approved') {
        const req = requests.find(r => r.id === id);
        if (req) {
          console.log(`[Capacity Process] Assignments recalculated for employee ${req.field_solicitante}`);
        }
      }
    } catch (e) {
      console.error('Failed to update vacation status', e);
    }
  };

  return {
    requests,
    updateRequestStatus,
    refresh: loadRequests,
    loading
  };
}
