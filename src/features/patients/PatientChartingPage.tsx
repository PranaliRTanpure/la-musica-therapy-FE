import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SearchIcon from '@mui/icons-material/Search';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { AppTabs } from '@/components/common/AppTabs';
import { PatientHeader } from './components/PatientHeader';
import { ChartSideNav } from './components/ChartSideNav';
import { DocumentList } from './components/DocumentList';
import { FormDetail } from './components/FormDetail';
import { SAMPLE_PATIENT } from './data';

const NAV_ITEMS = [
  {
    id: 'documents',
    label: 'Documents',
    icon: <DescriptionOutlinedIcon fontSize="small" />,
  },
  {
    id: 'notes',
    label: 'Notes',
    icon: <EditNoteOutlinedIcon fontSize="small" />,
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: <PersonOutlineIcon fontSize="small" />,
  },
];

const DOC_TABS = [{ label: 'Documents' }, { label: 'Forms' }];

function EmptyPanel({ text }: { text: string }) {
  return (
    <Box sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="body2" color="text.secondary">
        {text}
      </Typography>
    </Box>
  );
}

/**
 * Patient charting page, reached by clicking a name in the Prospects / Waiting
 * List / Clients lists (`/clients/patients/:id`). Static: renders the sample
 * chart; once the API is wired, look the patient up by the route `:id`.
 */
export function PatientChartingPage() {
  const navigate = useNavigate();
  const patient = SAMPLE_PATIENT;
  const [nav, setNav] = useState('documents');
  const [docTab, setDocTab] = useState(1); // "Forms" active, per the design
  const [selectedDoc, setSelectedDoc] = useState(
    patient.documents[0]?.id ?? ''
  );

  return (
    <Box sx={{ p: { xs: 1, md: 1 }, height: '100%' }}>
      <Paper sx={{ borderRadius: 2, overflow: 'hidden', height: '100%' }}>
        <PatientHeader patient={patient} onBack={() => navigate(-1)} />
        <Divider />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            height: '100%',
          }}
        >
          <ChartSideNav
            items={NAV_ITEMS}
            active={nav}
            onChange={setNav}
            sx={{
              width: { md: 220 },
              flexShrink: 0,
              p: 1,
              borderRight: { xs: 0, md: 1 },
              borderBottom: { xs: 1, md: 0 },
              borderColor: 'divider',
            }}
          />

          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              bgcolor: 'background.default',
              p: { xs: 2, md: 3 },
              height: '100%',
            }}
          >
            {nav === 'documents' ? (
              <Stack spacing={2}>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  justifyContent="space-between"
                  alignItems={{ xs: 'stretch', sm: 'center' }}
                  spacing={2}
                >
                  <AppTabs
                    ariaLabel="Document type"
                    items={DOC_TABS}
                    value={docTab}
                    onChange={setDocTab}
                  />
                  <TextField
                    placeholder="Search..."
                    size="small"
                    sx={(theme) => ({
                      maxWidth: { sm: 260 },
                      bgcolor: 'background.paper',
                      '& .MuiInputBase-input': {
                        fontSize: theme.typography.body1.fontSize,
                      },
                    })}
                    slotProps={{
                      htmlInput: { 'aria-label': 'Search documents' },
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Stack>

                {docTab === 1 ? (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', md: 'row' },
                      gap: 2,
                      alignItems: 'flex-start',
                      height: '100%',
                    }}
                  >
                    <DocumentList
                      documents={patient.documents}
                      selectedId={selectedDoc}
                      onSelect={setSelectedDoc}
                      sx={{ width: { xs: '100%', md: 360 }, flexShrink: 0 }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
                      <FormDetail patient={patient} title="Consent Form" />
                    </Box>
                  </Box>
                ) : (
                  <EmptyPanel text="No documents uploaded yet." />
                )}

                <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
                  <Button variant="outlined" startIcon={<PrintOutlinedIcon />}>
                    Print
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<FileDownloadOutlinedIcon />}
                  >
                    Download
                  </Button>
                </Stack>
              </Stack>
            ) : (
              <EmptyPanel
                text={`${nav === 'notes' ? 'Notes' : 'Profile'} coming soon.`}
              />
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
