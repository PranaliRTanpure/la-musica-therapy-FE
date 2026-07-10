import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import type { SxProps, Theme } from '@mui/material/styles';
import type { PatientDocument } from '../types';

export interface DocumentViewerProps {
  doc: PatientDocument;
  /** Brand name printed at the top of the rendered sheet. */
  practiceName?: string;
  sx?: SxProps<Theme>;
}

/**
 * The open document, shown beside the list: a title bar, a scrollable canvas
 * holding the rendered sheet, and a footer of actions pinned to the panel.
 */
export function DocumentViewer({
  doc,
  practiceName = 'LA Musica Therapy',
  sx,
}: DocumentViewerProps) {
  return (
    <Box
      sx={[
        {
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          borderRadius: 2,
          border: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          overflow: 'hidden',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Typography
        variant="subtitle1"
        component="h2"
        sx={(theme) => ({
          flexShrink: 0,
          p: 2,
          fontWeight: theme.typography.fontWeightSemiBold,
        })}
      >
        {doc.title}
      </Typography>
      <Divider />

      {/* Scrollable canvas — the sheet floats on the page background. */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          bgcolor: 'background.default',
          p: { xs: 2, md: 4 },
        }}
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
      </Box>

      <Divider />
      <Stack
        direction="row"
        justifyContent="flex-end"
        spacing={1.5}
        flexWrap="wrap"
        useFlexGap
        sx={{ flexShrink: 0, p: 2 }}
      >
        <Button variant="outlined" startIcon={<PrintOutlinedIcon />}>
          Print
        </Button>
        <Button variant="outlined" startIcon={<FileDownloadOutlinedIcon />}>
          Download
        </Button>
        <Button variant="outlined" startIcon={<ShareOutlinedIcon />}>
          Share With Patient
        </Button>
      </Stack>
    </Box>
  );
}
