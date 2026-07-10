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
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { AppTabs } from '@/components/common/AppTabs';
import { UploadFileModal } from '@/components/common/UploadFileModal';
import { PatientHeader } from './components/PatientHeader';
import { ChartSideNav } from './components/ChartSideNav';
import { DocumentList } from './components/DocumentList';
import { DocumentViewer } from './components/DocumentViewer';
import { FormList } from './components/FormList';
import { FormViewer } from './components/FormViewer';
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
const TAB_DOCUMENTS = 0;

/** Documents and Forms share one split layout: selection list + detail panel. */
const SPLIT_SX = {
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  gap: 2,
  flex: 1,
  minHeight: 0,
} as const;

const LIST_SX = {
  width: { xs: '100%', md: 'clamp(17.5rem, 28%, 22.5rem)' },
  flexShrink: 0,
  alignSelf: 'flex-start',
} as const;

const VIEWER_SX = {
  flex: 1,
  minWidth: 0,
  minHeight: { xs: '60svh', md: 0 },
} as const;

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
  const [docTab, setDocTab] = useState(TAB_DOCUMENTS);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(
    patient.documents[0]?.id ?? ''
  );
  const [selectedForm, setSelectedForm] = useState(patient.forms[0]?.id ?? '');

  const isDocumentsTab = docTab === TAB_DOCUMENTS;
  const openDoc =
    patient.documents.find((doc) => doc.id === selectedDoc) ??
    patient.documents[0];
  const openForm =
    patient.forms.find((form) => form.id === selectedForm) ?? patient.forms[0];

  return (
    <Box
      sx={{ p: 1, height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      {/* Column flex so the header sizes naturally and only the content pane
          scrolls — otherwise the viewer's footer is clipped by overflow. */}
      <Paper
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <PatientHeader patient={patient} onBack={() => navigate(-1)} />
        <Divider />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            flex: 1,
            minHeight: 0,
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
              minHeight: 0,
              overflow: 'auto',
              WebkitOverflowScrolling: 'touch',
              bgcolor: 'background.default',
              p: { xs: 2, md: 3 },
            }}
          >
            {nav === 'documents' ? (
              <Stack spacing={2} sx={{ height: '100%', minHeight: 0 }}>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  justifyContent="space-between"
                  alignItems={{ xs: 'stretch', sm: 'center' }}
                  spacing={2}
                  sx={{ flexShrink: 0 }}
                >
                  <AppTabs
                    ariaLabel="Document type"
                    items={DOC_TABS}
                    value={docTab}
                    onChange={setDocTab}
                  />
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1.5}
                    alignItems={{ sm: 'center' }}
                  >
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
                        htmlInput: {
                          'aria-label': isDocumentsTab
                            ? 'Search documents'
                            : 'Search forms',
                        },
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                    {/* Forms are sent to the patient, not uploaded here. */}
                    {isDocumentsTab ? (
                      <Button
                        variant="contained"
                        startIcon={<FileUploadOutlinedIcon />}
                        onClick={() => setUploadOpen(true)}
                        sx={{ flexShrink: 0 }}
                      >
                        Upload
                      </Button>
                    ) : null}
                  </Stack>
                </Stack>

                {isDocumentsTab ? (
                  openDoc ? (
                    <Box sx={SPLIT_SX}>
                      <DocumentList
                        documents={patient.documents}
                        selectedId={selectedDoc}
                        onSelect={setSelectedDoc}
                        sx={LIST_SX}
                      />
                      <DocumentViewer doc={openDoc} sx={VIEWER_SX} />
                    </Box>
                  ) : (
                    <EmptyPanel text="No documents uploaded yet." />
                  )
                ) : openForm ? (
                  <Box sx={SPLIT_SX}>
                    <FormList
                      forms={patient.forms}
                      selectedId={selectedForm}
                      onSelect={setSelectedForm}
                      sx={LIST_SX}
                    />
                    <FormViewer
                      form={openForm}
                      patient={patient}
                      sx={VIEWER_SX}
                    />
                  </Box>
                ) : (
                  <EmptyPanel text="No forms sent yet." />
                )}
              </Stack>
            ) : (
              <EmptyPanel
                text={`${nav === 'notes' ? 'Notes' : 'Profile'} coming soon.`}
              />
            )}
          </Box>
        </Box>
      </Paper>

      {/* Static phase: the upload is accepted and discarded until the API lands. */}
      <UploadFileModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={() => undefined}
      />
    </Box>
  );
}
