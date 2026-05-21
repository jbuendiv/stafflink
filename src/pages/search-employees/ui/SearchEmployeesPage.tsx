import { Container, Typography } from '@mui/material';
import { useEmployeeSearch, SearchEmployeesForm, SearchResultsList } from '@/features/search-employees';

export const SearchEmployeesPage = () => {
  const {
    results,
    criteria,
    updateCriteria,
    resetCriteria,
    triggerSearch,
    isLoading,
    startDate,
    endDate,
    setDateRange,
  } = useEmployeeSearch();

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h1" gutterBottom>
        Buscar Empleados
      </Typography>
      <SearchEmployeesForm
        criteria={criteria}
        onCriteriaChange={updateCriteria}
        onReset={resetCriteria}
        onSearch={triggerSearch}
        startDate={startDate}
        endDate={endDate}
        onDateRangeChange={setDateRange}
      />
      <SearchResultsList results={results} isLoading={isLoading} />
    </Container>
  );
};
