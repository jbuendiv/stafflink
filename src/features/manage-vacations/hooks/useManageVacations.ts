// ============================================================
// IMPORTS
// ============================================================
import { useState, useEffect, useCallback } from 'react';
import type { VacationRequest } from '../../../types';

// ============================================================
// HOOK
// ============================================================
export function useManageVacations() {
  const [requests, setRequests] = useState<VacationRequest[]>([]);

  // Load from local storage
  const loadRequests = useCallback(() => {
    const saved = localStorage.getItem('vacationRequests');
    if (saved) {
      try {
        setRequests(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse vacation requests', e);
      }
    } else {
      // Mock some data if nothing exists
      const initial: VacationRequest[] = [
        {
          id: 'vreq-1',
          employeeId: 'emp-2',
          startDate: '2026-07-01',
          endDate: '2026-07-15',
          status: 'Pending'
        },
        {
          id: 'vreq-2',
          employeeId: 'emp-3',
          startDate: '2026-08-10',
          endDate: '2026-08-20',
          status: 'Pending'
        }
      ];
      localStorage.setItem('vacationRequests', JSON.stringify(initial));
      setRequests(initial);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const updateRequestStatus = (id: string, newStatus: 'Approved' | 'Rejected') => {
    const updatedRequests = requests.map(req => 
      req.id === id ? { ...req, status: newStatus } : req
    );
    setRequests(updatedRequests);
    localStorage.setItem('vacationRequests', JSON.stringify(updatedRequests));
    
    // Simulate complex business logic
    if (newStatus === 'Approved') {
      console.log(`[Capacity Process] Assignments recalculated for employee ${requests.find(r => r.id === id)?.employeeId}`);
    }
  };

  return {
    requests,
    updateRequestStatus,
    refresh: loadRequests
  };
}
