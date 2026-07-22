import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import type { SxProps, Theme } from '@mui/material/styles';
import { AppButton } from '@/components/common/AppButton';
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
          <AppButton variant="outlined" startIcon={<PrintOutlinedIcon />}>
            Print
          </AppButton>
          <AppButton
            variant="outlined"
            startIcon={<FileDownloadOutlinedIcon />}
          >
            Download
          </AppButton>
        </>
      }
    >
      <FormDetail patient={patient} />
    </ViewerPanel>
  );
}
