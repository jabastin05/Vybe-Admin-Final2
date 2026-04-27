import { AdminLayout } from '../components/AdminLayout';
import { useNavigate } from 'react-router';
import { Building2, Shield, Layers, ArrowRight, UserCog } from 'lucide-react';

export function MasterDataManagement() {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'Property Onboarding Configuration',
      description: 'Configure building types, property types, custom fields, and document types',
      icon: Building2,
      color: 'bg-blue-500/10 text-blue-500',
      path: '/admin/master-data/property-onboarding',
    },
    {
      title: 'Service Provider Category',
      description: 'Define and manage service provider category types',
      icon: Shield,
      color: 'bg-purple-500/10 text-purple-500',
      path: '/admin/master-data/partner-roles',
    },
    {
      title: 'Service Categories',
      description: 'Organize services into hierarchical categories',
      icon: Layers,
      color: 'bg-primary-700/10 text-primary-700',
      path: '/admin/master-data/service-categories',
    },
    {
      title: 'User Types',
      description: 'Define user access types and configure permissions',
      icon: UserCog,
      color: 'bg-indigo-500/10 text-indigo-500',
      path: '/admin/master-data/user-types',
    },
  ];

  return (
    <AdminLayout>
      <div className="vybe-page-header">
        <h1 className="vybe-page-title">
          Master Data Management
        </h1>
        <p className="vybe-page-subtitle">
          Configure and manage system-wide master data settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;

          return (
            <button
              key={section.path}
              onClick={() => navigate(section.path)}
              className={`vybe-card-padded text-left transition-all ${section.color}`}
            >
              <div className={`inline-flex p-3 ${section.color} rounded-[var(--radius)] mb-4`}>
                <Icon className={`w-6 h-6 ${section.color.split(' ')[1]}`} />
              </div>
              <h3 className="text-small font-medium text-foreground mb-2">
                {section.title}
              </h3>
              <p className="text-caption text-muted-foreground">
                {section.description}
              </p>
            </button>
          );
        })}
      </div>
    </AdminLayout>
  );
}