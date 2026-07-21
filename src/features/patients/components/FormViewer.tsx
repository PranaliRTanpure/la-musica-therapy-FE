import Button from '@mui/material/Button';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import type { SxProps, Theme } from '@mui/material/styles';
import { ViewerPanel } from '@/components/common/ViewerPanel';
import { FormDetail } from './FormDetail';
import type { PatientChart, PatientForm } from '../types';

export interface FormViewerProps {
  form: PatientForm;
  patient: PatientChart;
  sx?: SxProps<Theme>;
}

/** The selected form's submitted answers, shown beside the form list. */
export function FormViewer({ form, patient, sx }: FormViewerProps) {
  return (
    <ViewerPanel
      title={form.title}
      sx={sx}
      actions={
        <>
          <Button variant="outlined" startIcon={<PrintOutlinedIcon />}>
            Print
          </Button>
          <Button variant="outlined" startIcon={<FileDownloadOutlinedIcon />}>
            Download
          </Button>
        </>
      }
    >
      <FormDetail patient={patient} />
    </ViewerPanel>
  );
}
