import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import * as xlsx from 'xlsx';
import type { CreateEmployeeDTO, Employee } from '../../../types';

interface EmployeeImportDialogProps {
  open: boolean;
  onClose: () => void;
  onImportComplete: (results: { success: number; errors: string[] }) => void;
  createEmployee: (data: CreateEmployeeDTO) => Employee;
  updateEmployee: (id: string, data: Partial<CreateEmployeeDTO>) => void;
  existingEmployees: Employee[];
}

export const EmployeeImportDialog: React.FC<EmployeeImportDialogProps> = ({
  open,
  onClose,
  onImportComplete,
  createEmployee,
  updateEmployee,
  existingEmployees,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setLogs([]);
    }
  };

  const processFile = async () => {
    if (!file) return;

    setLoading(true);
    setLogs((prev) => [...prev, `Lectura de archivo ${file.name}...`]);

    try {
      const data = await file.arrayBuffer();
      const workbook = xlsx.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = xlsx.utils.sheet_to_json<any>(worksheet);

      setLogs((prev) => [...prev, `${jsonData.length} filas encontradas.`]);

      let successCount = 0;
      let errorList: string[] = [];

      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i];
        try {
          const email = row.email || row.Email || row.Correo;
          if (!email) {
            errorList.push(`Fila ${i + 2}: Falta el email.`);
            continue;
          }

          const name = row.nombre || row.Nombre || row.name || '';
          const surname = row.apellidos || row.Apellidos || row.surname || '';
          
          if (!name || !surname) {
            errorList.push(`Fila ${i + 2} (${email}): Falta nombre o apellidos.`);
            continue;
          }

          const existingEmp = existingEmployees.find((e) => e.email.toLowerCase() === email.toLowerCase());

          const dto: Partial<CreateEmployeeDTO> = {
            name,
            surname,
            email,
            field_estado_empleado: row.estado || row.Estado || 'activo',
            field_oficina: row.oficina || row.Oficina || '',
            field_area: row.area || row.Area || row['Área'] || '',
            field_department: row.department || row.Department || row.Departamento || '',
            field_division: row.division || row.Division || row['División'] || '',
            field_bu: row.bu || row.BU || '',
            field_categoria: row.categoria || row.Categoria || row['Categoría'] || '',
            field_tipo_carrera: row.tipo_carrera || row['Tipo de Carrera'] || '',
          };

          if (existingEmp) {
            updateEmployee(existingEmp.id, dto);
            successCount++;
          } else {
            createEmployee({
              ...dto,
              name: dto.name!,
              surname: dto.surname!,
              email: dto.email!,
              field_estado_empleado: dto.field_estado_empleado || 'activo',
              roles: ['USUARIO_AUTENTICADO'],
              field_oficina: dto.field_oficina || '',
              field_area: dto.field_area || '',
              field_department: dto.field_department || '',
              field_division: dto.field_division || '',
              field_bu: dto.field_bu || '',
              field_categoria: dto.field_categoria || '',
              field_tipo_carrera: dto.field_tipo_carrera || '',
              skills: [],
              idiomas: [],
              field_responsables: [],
            });
            successCount++;
          }
        } catch (err: any) {
          errorList.push(`Fila ${i + 2}: Error inesperado - ${err.message}`);
        }
      }

      onImportComplete({ success: successCount, errors: errorList });
      onClose();
    } catch (error: any) {
      setLogs((prev) => [...prev, `Error procesando archivo: ${error.message}`]);
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Importar Empleados</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Selecciona un archivo Excel (.xlsx, .xls) o CSV para importar o actualizar empleados masivamente. El archivo debe contener al menos las columnas <b>Email</b>, <b>Nombre</b> y <b>Apellidos</b>. También pueden incluirse columnas para la estructura organizativa (Oficina, Área, Departamento, División, BU, Categoría).
        </Typography>

        <Box
          sx={{
            border: '2px dashed #ccc',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            mb: 2,
            bgcolor: 'background.default',
          }}
        >
          <input
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            style={{ display: 'none' }}
            id="raised-button-file"
            type="file"
            onChange={handleFileChange}
            disabled={loading}
          />
          <label htmlFor="raised-button-file">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
              disabled={loading}
            >
              Seleccionar archivo
            </Button>
          </label>
          {file && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              Archivo seleccionado: {file.name}
            </Typography>
          )}
        </Box>

        {loading && <LinearProgress sx={{ my: 2 }} />}

        {logs.length > 0 && (
          <Box sx={{ mt: 2, maxHeight: 150, overflow: 'auto', bgcolor: 'grey.100', p: 1, borderRadius: 1 }}>
            <Typography variant="subtitle2">Registro:</Typography>
            <List dense>
              {logs.map((log, index) => (
                <ListItem key={index} sx={{ py: 0 }}>
                  <ListItemText primary={<Typography variant="caption">{log}</Typography>} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={processFile} variant="contained" disabled={!file || loading}>
          Importar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
