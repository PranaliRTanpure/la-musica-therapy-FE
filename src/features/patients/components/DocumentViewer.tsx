import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import type { SxProps, Theme } from '@mui/material/styles';
import { ViewerPanel } from '@/components/common/ViewerPanel';
import type { PatientDocument } from '../types';

export interface DocumentViewerProps {
  doc: PatientDocument;
  /** Brand name printed at the top of the rendered sheet. */
  practiceName?: string;
  sx?: SxProps<Theme>;
}

/** The open document, rendered as a printable sheet on the viewer canvas. */
export function DocumentViewer({
  doc,
  practiceName = 'LA Musica Therapy',
  sx,
}: DocumentViewerProps) {
  return (
    <ViewerPanel
      title={doc.title}
      sx={sx}
      actions={
        <>
          <Button variant="outlined" startIcon={<PrintOutlinedIcon />}>
            Print
          </Button>
          <Button variant="outlined" startIcon={<FileDownloadOutlinedIcon />}>
            Download
          </Button>
          <Button variant="outlined" startIcon={<ShareOutlinedIcon />}>
            Share With Patient
          </Button>
        </>
      }
    >
      <Paper sx={{ maxWidth: 'md', mx: 'auto', p: { xs: 3, md: 5 } }}>
        <Typography variant="h6" component="p" sx={{ mb: { xs: 3, md: 5 } }}>
          {practiceName}
        </Typography>

        <Typography
          variant="h4"
          component="h3"
          color="primary.main"
          sx={{ textTransform: 'uppercase', mb: 3 }}
        >
          {doc.title}
        </Typography>

        <Typography variant="body1" sx={{ mb: 3 }}>
          {doc.summary}
        </Typography>

        <Typography
          variant="body2"
          sx={(theme) => ({
            fontWeight: theme.typography.fontWeightSemiBold,
            mb: 1.5,
          })}
        >
          {doc.title} details:
        </Typography>

        <Stack spacing={1.5}>
          {doc.details.map((detail) => (
            <Box
              key={detail.label}
              sx={{
                bgcolor: 'background.default',
                borderRadius: 1,
                px: 2,
                py: 1.5,
              }}
            >
              <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>
                {detail.label}: {detail.value}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Paper>
    </ViewerPanel>
  );
}
