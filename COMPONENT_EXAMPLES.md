# Component Usage Examples

Quick reference for using SIREN UI components.

## Button

```jsx
import Button from '../components/Button';
import { Save } from 'lucide-react';

// Basic usage
<Button onClick={handleClick}>Click Me</Button>

// With variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Danger</Button>
<Button variant="outline">Outline</Button>

// With icon
<Button icon={Save}>Save</Button>

// Loading state
<Button loading={true}>Saving...</Button>

// Full width
<Button fullWidth>Full Width Button</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

## Input

```jsx
import Input from "../components/Input";
import { Mail } from "lucide-react";

<Input
  label="Email Address"
  name="email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="your@email.com"
  icon={Mail}
  error={errors.email}
  helperText="We'll never share your email"
  required
/>;
```

## Card

```jsx
import Card from '../components/Card';

// Basic card
<Card>
  <p>Card content</p>
</Card>

// With title
<Card title="Card Title" subtitle="Optional subtitle">
  <p>Content here</p>
</Card>

// With footer
<Card
  title="User Profile"
  footer={
    <Button>Save Changes</Button>
  }
>
  <p>Profile content</p>
</Card>

// Hover effect
<Card hover>
  <p>Clickable card</p>
</Card>
```

## Modal

```jsx
import Modal from "../components/Modal";
import Button from "../components/Button";

const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  size="md"
  footer={
    <>
      <Button variant="secondary" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button onClick={handleSubmit}>Confirm</Button>
    </>
  }
>
  <p>Modal content goes here</p>
</Modal>;
```

## Badge

```jsx
import Badge from '../components/Badge';

<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>
<Badge variant="info">Info</Badge>

// Sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>
```

## Alert

```jsx
import Alert from '../components/Alert';

<Alert
  type="success"
  title="Success!"
  message="Your request was submitted successfully"
  dismissible
  onClose={() => console.log('closed')}
/>

// Types: success, error, warning, info
<Alert type="error" message="Something went wrong" />
<Alert type="warning" title="Warning" message="Please check your input" />
<Alert type="info" message="Information message" />
```

## Table

```jsx
import Table from "../components/Table";
import Badge from "../components/Badge";

const columns = [
  {
    header: "Name",
    accessor: "name",
  },
  {
    header: "Status",
    accessor: "status",
    render: (row) => (
      <Badge variant={row.status === "active" ? "success" : "danger"}>
        {row.status}
      </Badge>
    ),
  },
  {
    header: "Actions",
    accessor: "actions",
    render: (row) => (
      <Button size="sm" onClick={() => handleView(row.id)}>
        View
      </Button>
    ),
  },
];

const data = [
  { id: 1, name: "John", status: "active" },
  { id: 2, name: "Jane", status: "inactive" },
];

<Table
  columns={columns}
  data={data}
  loading={false}
  emptyMessage="No data available"
/>;
```

## Select

```jsx
import Select from '../components/Select';

<Select
  label="Select Option"
  name="option"
  value={selectedOption}
  onChange={(e) => setSelectedOption(e.target.value)}
  options={[
    'Option 1',
    'Option 2',
    'Option 3'
  ]}
  required
/>

// With object options
<Select
  options={[
    { value: 'val1', label: 'Label 1' },
    { value: 'val2', label: 'Label 2' }
  ]}
/>
```

## Textarea

```jsx
import Textarea from "../components/Textarea";

<Textarea
  label="Description"
  name="description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  placeholder="Enter description..."
  rows={4}
  error={errors.description}
  helperText="Maximum 500 characters"
  required
/>;
```

## Loader

```jsx
import Loader from '../components/Loader';

// Spinner
<Loader type="spinner" size="md" />

// Full screen
<Loader fullScreen text="Loading..." />

// Skeleton
<Loader type="skeleton" />
```

## StatsCard

```jsx
import StatsCard from "../components/StatsCard";
import { Users } from "lucide-react";

<StatsCard
  title="Total Users"
  value="1,234"
  icon={Users}
  color="primary"
  trend="12% from last month"
  trendUp={true}
/>;

// Colors: primary, success, warning, danger, info
```

## Using with Auth Context

```jsx
import { useAuth } from "../context/AuthContext";

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <p>Please login</p>;
  }

  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <Button onClick={logout}>Logout</Button>
    </div>
  );
}
```

## Protected Routes

```jsx
import { ProtectedRoute } from "../components/RouteGuards";

<Route
  path="/admin"
  element={
    <ProtectedRoute allowedRoles={["official"]}>
      <AdminPanel />
    </ProtectedRoute>
  }
/>;
```

## Using Services

```jsx
import { getAllRequests } from "../services/requestService";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

function MyComponent() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const response = await getAllRequests();
      setRequests(response.requests);
    } catch (error) {
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  // Rest of component...
}
```

## Helper Functions

```jsx
import {
  formatDate,
  formatPhone,
  getStatusColor,
  getSeverityColor,
  truncate
} from '../utils/helpers';

// Format dates
formatDate('2024-12-05T10:30:00Z') // "Dec 5, 2024, 10:30 AM"

// Format phone
formatPhone('01712345678') // "+880 1712-345678"

// Get badge colors
<Badge variant={getStatusColor('pending')}>Pending</Badge>
<Badge variant={getSeverityColor('critical')}>Critical</Badge>

// Truncate text
truncate('Very long text...', 20) // "Very long text..."
```

## Custom Hooks

```jsx
import { useDebounce, useLocalStorage } from "../hooks/useCustomHooks";

// Debounce
const [searchTerm, setSearchTerm] = useState("");
const debouncedSearch = useDebounce(searchTerm, 500);

useEffect(() => {
  // API call with debouncedSearch
}, [debouncedSearch]);

// Local storage
const [theme, setTheme] = useLocalStorage("theme", "light");
```

## Toast Notifications

```jsx
import toast from "react-hot-toast";

// Success
toast.success("Request submitted successfully!");

// Error
toast.error("Something went wrong");

// Loading
const toastId = toast.loading("Submitting...");
// Later
toast.success("Done!", { id: toastId });

// Custom
toast("Custom message", {
  icon: "👏",
  duration: 4000,
});
```

## Map Integration

```jsx
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

<MapContainer
  center={[23.8103, 90.4125]}
  zoom={12}
  style={{ height: "400px", width: "100%" }}
>
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

  <Marker position={[23.8103, 90.4125]}>
    <Popup>Location details</Popup>
  </Marker>
</MapContainer>;
```

## Form Validation Example

```jsx
const [formData, setFormData] = useState({
  name: "",
  email: "",
});
const [errors, setErrors] = useState({});

const validate = () => {
  const newErrors = {};

  if (!formData.name) {
    newErrors.name = "Name is required";
  }

  if (!formData.email) {
    newErrors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = "Invalid email";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = (e) => {
  e.preventDefault();
  if (validate()) {
    // Submit form
  }
};
```

---

For more examples, check the actual page implementations in `src/pages/`.
