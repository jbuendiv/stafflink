import { Container, Typography } from '@mui/material';
import { useEmployeeSearch, SearchEmployeesForm, SearchResultsList } from '@/features/search-employees';

export const SearchEmployeesPage = () => {
  const {
    results,
    criteria,
    updateCriteria,
    resetCriteria,
    isLoading,
    startDate,
    endDate,
    setDateRange,
  } = useEmployeeSearch();

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h1" gutterBottom sx={{ fontWeight: 700, color: '#111827', fontSize: '2.5rem' }}>
        Buscar Empleados
      </Typography>
      <SearchEmployeesForm
        criteria={criteria}
        onCriteriaChange={updateCriteria}
        onReset={resetCriteria}
        startDate={startDate}
        endDate={endDate}
        onDateRangeChange={setDateRange}
      />
      <SearchResultsList results={results} isLoading={isLoading} />
    </Container>
  );
};
