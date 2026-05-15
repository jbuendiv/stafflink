import React, { useState, useMemo, useEffect } from 'react';
import { VacationRequestModal } from './VacationRequestModal';
import { VacationRequest } from '../../../types';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';

export function MyVacationsView() {
  const [requests, setRequests] = useState<VacationRequest[]>(() => {
    const saved = localStorage.getItem('vacationRequests');
    return saved ? JSON.parse(saved) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentUser = 'emp-1';

  // Save to local storage whenever requests change
  useEffect(() => {
    localStorage.setItem('vacationRequests', JSON.stringify(requests));
  }, [requests]);

  // Sorting
  const sortedRequests = useMemo(() => {
    return [...requests].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }, [requests]);

  const handleSave = (request: VacationRequest) => {
    setRequests(prev => [...prev, request]);
  };

  return (
    <Box sx={{ maxWidth: '600px', mx: 'auto', mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h1" sx={{ fontWeight: 700, color: '#111827', fontSize: '2.5rem' }}>
          Mis Vacaciones
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => setIsModalOpen(true)}
          sx={{ 
            bgcolor: '#6366f1', 
            borderRadius: '24px', 
            px: 4, 
            py: 1, 
            textTransform: 'none', 
            fontWeight: 'bold', 
            fontSize: '1rem',
            boxShadow: 'none',
            '&:hover': { bgcolor: '#4f46e5', boxShadow: 'none' } 
          }}
        >
          Request
        </Button>
      </Box>

      <Box sx={{ border: '1px solid #e5e7eb', borderRadius: 3, overflow: 'hidden', bgcolor: 'white' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 1fr) minmax(120px, 1fr) minmax(120px, 1fr)', p: 3, pb: 2 }}>
          <Typography sx={{ fontWeight: 'bold', color: '#1f2937' }}>Start Date</Typography>
          <Typography sx={{ fontWeight: 'bold', color: '#1f2937' }}>End Date</Typography>
          <Typography sx={{ fontWeight: 'bold', color: '#1f2937' }}>Status</Typography>
        </Box>
        
        {sortedRequests.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center', color: '#6b7280' }}>
            No vacation requests yet.
          </Box>
        ) : (
          sortedRequests.map((req, index) => (
            <Box key={req.id}>
              <Box 
                sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'minmax(120px, 1fr) minmax(120px, 1fr) minmax(120px, 1fr)', 
                  p: 3, 
                  py: 2.5,
                  alignItems: 'center',
                }}
              >
                <Typography sx={{ color: '#1f2937', fontSize: '1.1rem' }}>{req.startDate}</Typography>
                <Typography sx={{ color: '#1f2937', fontSize: '1.1rem' }}>{req.endDate}</Typography>
                <Box>
                  {req.status === 'Approved' ? (
                    <Typography sx={{ fontWeight: 500, color: '#111827', pl: 1, fontSize: '1.1rem' }}>
                      Approved
                    </Typography>
                  ) : (
                    <Chip 
                      label={req.status} 
                      sx={{ 
                        bgcolor: '#f3f4f6', 
                        color: '#1f2937', 
                        fontWeight: 500,
                        fontSize: '1rem',
                        borderRadius: 4,
                        px: 2,
                        py: 2.5,
                        height: 'auto'
                      }} 
                    />
                  )}
                </Box>
              </Box>
              {index < sortedRequests.length - 1 && (
                <Box sx={{ height: '1px', bgcolor: '#e5e7eb', mx: 3 }} />
              )}
            </Box>
          ))
        )}

        <Box sx={{ p: 3, textAlign: 'center', borderTop: '1px solid #e5e7eb', mt: 1 }}>
          <Link component={RouterLink} to="/projects" sx={{ color: '#6b7280', textDecoration: 'none', '&:hover': { color: '#374151' } }}>
            See my projects
          </Link>
        </Box>
      </Box>

      <VacationRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        existingRequests={requests}
        onSave={handleSave}
        employeeId={currentUser}
      />
    </Box>
  );
}
