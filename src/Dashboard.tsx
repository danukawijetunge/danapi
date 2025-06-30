import React, { useState, useEffect } from 'react';
import {
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  AppBar,
  Typography,
  IconButton,
  Button,
  Card,
  CardContent,
  Divider,
  Avatar,
  InputAdornment,
  TextField,
  Tooltip,
  ListItemButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Snackbar,
  Alert
} from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import DescriptionIcon from '@mui/icons-material/Description';
import PaymentIcon from '@mui/icons-material/Payment';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import Brightness2Icon from '@mui/icons-material/Brightness2';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import { createItem, getItems, updateItem, deleteItem } from './api/apiKeys';
import type { ApiKey, ApiKeyForm } from './types/apiKey';
import { generateRandomKey } from './utils/generateRandomKey';


const drawerWidth = 240;

const Sidebar = () => (
  <Drawer
    variant="permanent"
    sx={{
      width: drawerWidth,
      flexShrink: 0,
      [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', background: '#f8fafc' },
    }}
  >
    <Toolbar />
    <Box sx={{ overflow: 'auto' }}>
      <List>
        <ListItem disablePadding>
          <ListItemButton selected>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary="Overview" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon><DescriptionIcon /></ListItemIcon>
            <ListItemText primary="API Playground" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon><DescriptionIcon /></ListItemIcon>
            <ListItemText primary="Use Cases" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon><PaymentIcon /></ListItemIcon>
            <ListItemText primary="Billing" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon><DescriptionIcon /></ListItemIcon>
            <ListItemText primary="Documentation" />
          </ListItemButton>
        </ListItem>
      </List>
      <Box sx={{ position: 'absolute', bottom: 16, left: 0, width: '100%', px: 2 }}>
        <Divider />
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <Avatar sx={{ width: 32, height: 32, mr: 1 }} src="https://randomuser.me/api/portraits/men/32.jpg" />
          <Typography variant="body2">Danuka Geeanage Wijetunge</Typography>
        </Box>
      </Box>
    </Box>
  </Drawer>
);

const TopBar = () => {
  const navigate = useNavigate();
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: '#fff', color: '#222', boxShadow: 'none', borderBottom: '1px solid #eee' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/') }>
          <img src="/vite.svg" alt="Logo" style={{ width: 32, marginRight: 8 }} />
          <Typography variant="h6" noWrap component="div" sx={{ color: '#222' }}>
            danAI
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, background: '#f3f6fa', px: 2, py: 0.5, borderRadius: 2 }}>
            <CheckCircleIcon color="success" fontSize="small" />
            <Typography variant="body2" color="text.secondary">Operational</Typography>
          </Box>
          <IconButton><GitHubIcon /></IconButton>
          <IconButton><EmailIcon /></IconButton>
          <IconButton><Brightness2Icon /></IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

const Dashboard = () => {
  // Modal state
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ApiKeyForm>({ keyName: '', keyType: 'development', limitUsage: false, usageLimit: '', usage: '', key: '' });
  const [items, setItems] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<ApiKeyForm & { id: number | null }>({ id: null, keyName: '', keyType: 'development', limitUsage: false, usageLimit: '', usage: '', key: '' });
  const [deleteId, setDeleteId] = useState<number | null>(null);
  // Add state for key visibility
  const [visibleKeys, setVisibleKeys] = useState<{ [id: number]: boolean }>({});
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const data = await getItems();
        console.log('Fetched items:', data);
        setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching items:', error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setForm({ keyName: '', keyType: 'development', limitUsage: false, usageLimit: '', usage: '', key: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const generatedKey = generateRandomKey();
      await createItem({
        name: form.keyName,
        type: form.keyType,
        usage: form.usage,
        key: generatedKey,
        usage_limit: form.limitUsage ? Number(form.usageLimit) : null
      });
      // Refresh the list
      const data = await getItems();
      setItems(data);
      handleClose();
      setNotificationType('success');
      setNotificationMessage('Copied API Key to clipboard');
      setNotificationOpen(true);
    } catch (error) {
      console.error('Error creating API key:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this API key?')) return;
    try {
      await deleteItem(id);
      setItems(items.filter(item => item.id !== id));
      setNotificationType('error');
      setNotificationMessage('API Key deleted');
      setNotificationOpen(true);
    } catch (error) {
      console.error('Error deleting API key:', error);
    }
  };

  const handleEditOpen = (item: any) => {
    setEditForm({
      id: item.id,
      keyName: item.name,
      keyType: item.type,
      limitUsage: !!item.usage_limit,
      usageLimit: item.usage_limit ? String(item.usage_limit) : '',
      usage: item.usage || '',
      key: item.key
    });
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditForm({ id: null, keyName: '', keyType: 'development', limitUsage: false, usageLimit: '', usage: '', key: '' });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof editForm.id !== 'number') return;
    try {
      await updateItem(editForm.id, {
        name: editForm.keyName,
        type: editForm.keyType,
        usage: editForm.usage,
        usage_limit: editForm.limitUsage ? Number(editForm.usageLimit) : null
      });
      // Refresh the list
      const data = await getItems();
      setItems(data);
      handleEditClose();
    } catch (error) {
      console.error('Error updating API key:', error);
    }
  };

  // Toggle key visibility
  const handleToggleKeyVisibility = (id: number) => {
    setVisibleKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Box sx={{ display: 'flex', gap: 0 }}>
      <CssBaseline />
      <TopBar />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f8fafc', p: 0, minHeight: '100vh', ml: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: 1000, mx: 'auto' }}>
          {/* Plan Card */}
          <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 0, background: 'linear-gradient(90deg, #e0c3fc 0%, #8ec5fc 100%)', color: '#fff' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="overline" sx={{ opacity: 0.8 }}>CURRENT PLAN</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>Researcher</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2" sx={{ mr: 2 }}>API Usage</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>Plan</Typography>
                  </Box>
                  <Box sx={{ width: 300, height: 8, background: 'rgba(255,255,255,0.3)', borderRadius: 4, mt: 1 }}>
                    <Box sx={{ width: '0%', height: '100%', background: '#fff', borderRadius: 4 }} />
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1 }}>0/1,000 Credits</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2">Pay as you go</Typography>
                  </Box>
                </Box>
                <Button variant="contained" sx={{ background: '#fff', color: '#6a11cb', fontWeight: 700, boxShadow: 'none' }}>Manage Plan</Button>
              </Box>
            </CardContent>
          </Card>
          {/* API Keys Card */}
          <Card sx={{ borderRadius: 3, boxShadow: 0, mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">API Keys</Typography>
                <Button variant="outlined" startIcon={<AddIcon />} onClick={handleOpen}>Add</Button>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                The key is used to authenticate your requests to the Research API. To learn more, see the documentation page.
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 700, mb: 1 }}>
                <Typography sx={{ width: 120 }}>NAME</Typography>
                <Typography sx={{ width: 80 }}>TYPE</Typography>
                <Typography sx={{ width: 80 }}>USAGE</Typography>
                <Typography sx={{ width: 320 }}>KEY</Typography>
                <Typography sx={{ width: 180 }}>OPTIONS</Typography>
              </Box>
              <Divider sx={{ mb: 1 }} />
              {items.map((item) => (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} key={item.id}>
                  <Typography sx={{ width: 120 }}>{item.name}</Typography>
                  <Typography sx={{ width: 80 }}>{item.type}</Typography>
                  <Typography sx={{ width: 80 }}>{item.usage}</Typography>
                  <TextField
                    value={visibleKeys[item.id] ? item.key : '•'.repeat(item.key.length)}
                    size="small"
                    sx={{ width: 320 }}
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="Copy">
                            <IconButton size="small"><ContentCopyIcon fontSize="small" /></IconButton>
                          </Tooltip>
                        </InputAdornment>
                      )
                    }}
                  />
                  <Box sx={{ width: 180, display: 'flex', gap: 1 }}>
                    <Tooltip title={visibleKeys[item.id] ? 'Hide' : 'Show'}>
                      <IconButton size="small" onClick={() => handleToggleKeyVisibility(item.id)}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit"><IconButton size="small" onClick={() => handleEditOpen(item)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton size="small" onClick={() => handleDelete(item.id)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
          {/* Modal for Add API Key */}
          <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle>Create a new API key</DialogTitle>
            <form onSubmit={handleSubmit}>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Key Name"
                  name="keyName"
                  fullWidth
                  value={form.keyName}
                  onChange={handleChange}
                  required
                />
                <Typography sx={{ mt: 2, mb: 1 }}>Key Type – Choose the environment for this key</Typography>
                <RadioGroup
                  row
                  name="keyType"
                  value={form.keyType}
                  onChange={handleChange}
                >
                  <FormControlLabel value="production" control={<Radio />} label="Production" />
                  <FormControlLabel value="development" control={<Radio />} label="Development" />
                </RadioGroup>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <Checkbox
                    name="limitUsage"
                    checked={form.limitUsage}
                    onChange={handleChange}
                  />
                  <Typography>Limit monthly usage</Typography>
                  <TextField
                    name="usageLimit"
                    type="number"
                    size="small"
                    sx={{ width: 100, ml: 2 }}
                    value={form.usageLimit}
                    onChange={handleChange}
                    disabled={!form.limitUsage}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  * If the combined usage of all your keys exceeds your plan's limit, all requests will be rejected.
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit" variant="contained">Create</Button>
              </DialogActions>
            </form>
          </Dialog>
          {/* Edit API Key Dialog */}
          <Dialog open={editOpen} onClose={handleEditClose} maxWidth="xs" fullWidth>
            <DialogTitle>Edit API key</DialogTitle>
            <form onSubmit={handleEditSubmit}>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Key Name"
                  name="keyName"
                  fullWidth
                  value={editForm.keyName}
                  onChange={handleEditChange}
                  required
                />
                <Typography sx={{ mt: 2, mb: 1 }}>Key Type – Choose the environment for this key</Typography>
                <RadioGroup
                  row
                  name="keyType"
                  value={editForm.keyType}
                  onChange={handleEditChange}
                >
                  <FormControlLabel value="production" control={<Radio />} label="Production" />
                  <FormControlLabel value="development" control={<Radio />} label="Development" />
                </RadioGroup>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <Checkbox
                    name="limitUsage"
                    checked={editForm.limitUsage}
                    onChange={handleEditChange}
                  />
                  <Typography>Limit monthly usage</Typography>
                  <TextField
                    name="usageLimit"
                    type="number"
                    size="small"
                    sx={{ width: 100, ml: 2 }}
                    value={editForm.usageLimit}
                    onChange={handleEditChange}
                    disabled={!editForm.limitUsage}
                  />
                </Box>
                <TextField
                  margin="dense"
                  label="Usage"
                  name="usage"
                  fullWidth
                  value={editForm.usage}
                  onChange={handleEditChange}
                />
                <TextField
                  margin="dense"
                  label="Key"
                  name="key"
                  fullWidth
                  value={editForm.key}
                  InputProps={{ readOnly: true }}
                />
                <Typography variant="caption" color="text.secondary">
                  * If the combined usage of all your keys exceeds your plan's limit, all requests will be rejected.
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleEditClose}>Cancel</Button>
                <Button type="submit" variant="contained">Save</Button>
              </DialogActions>
            </form>
          </Dialog>
          {/* Tavily Expert Card */}
          <Card sx={{ borderRadius: 3, boxShadow: 0 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>Tavily Expert</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Your expert is a specialized agent, always up to date with Tavily's latest documentation and best practices. To be used in AI-native IDEs to accurately implement and test Tavily tools within your application.
              </Typography>
              <Button variant="contained" sx={{ background: '#6a11cb', color: '#fff', fontWeight: 700 }}>GET YOUR TAVILY EXPERT</Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
      {/* Snackbar Notification */}
      <Snackbar
        open={notificationOpen}
        autoHideDuration={4000}
        onClose={() => setNotificationOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setNotificationOpen(false)} severity={notificationType} sx={{ width: '100%' }}>
          {notificationMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard; 